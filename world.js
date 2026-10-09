// ---------- world.js : scene content (rewrite per film) + emitter lighting system (keep) ----------
// The placeholder is a plain office corridor with ceiling fixtures, a dark side opening and a room at the end.
// Lighting: every light source is an emitter (or a cluster of small sources treated as one), max 512.
// Emitter texture 512x3 RGBA32F (row 0 position + intensity, row 1 colour + softening eps, row 2 downlight
// amount), re-uploaded every frame. A 2.5 m spatial grid keeps the 16 strongest emitters per cell, so each
// fragment loops over 16 lights only. Falloff I/(d^2+eps) * exp(-d*k) keeps overlapping lights from
// flattening everything; fog colour follows local light so dark areas stay dark.
const World = (() => {
  const { mulberry, hash, TUNE, clamp, seg } = Util;
  // ================= CONTENT =================
  const H = 2.7, WT = .16;
  const M = { wall: 0, floor: 1, ceil: 2, fixture: 3, prop: 4, decal: 5, metal: 6 };
  const BOXES = [];
  const box = (x0, y0, z0, x1, y1, z1, m) => BOXES.push([Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1), Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1), m]);
  const wz = (x, z0, z1) => box(x - WT / 2, 0, z0, x + WT / 2, H, z1, M.wall);   // wall along z at constant x
  const wx = (z, x0, x1) => box(x0, 0, z - WT / 2, x1, H, z + WT / 2, M.wall);   // wall along x at constant z
  wz(-1.2, 3.1, -26.2); wz(1.2, 3.1, -8.0); wz(1.2, -9.2, -21.0); wz(1.2, -25.0, -26.2);
  wx(3.1, -1.2, 1.2); wx(-26.2, -1.2, 1.2);
  wx(-8.0, 1.2, 3.4); wx(-9.2, 1.2, 3.4); wz(3.4, -8.0, -9.2);          // dark closet (no fixture = a deliberate dark gap)
  wx(-21.0, 1.2, 7.0); wx(-25.0, 1.2, 7.0); wz(7.0, -21.0, -25.0);       // room at the end
  box(-3, -.05, -28, 9, 0, 4, M.floor); box(-3, H, -28, 9, H + .05, 4, M.ceil);
  box(4.2, 0, -24.8, 4.9, .55, -24.2, M.prop); box(4.3, .55, -24.75, 4.85, 1.0, -24.3, M.prop); box(5.9, 0, -21.9, 6.6, .48, -21.3, M.prop);
  box(-1.12, .9, -14.3, -.8, 1.0, -12.9, M.metal);                        // a wall shelf for scale
  // ceiling fixtures -> emitters. kind: ok | flicker (buzzing tube) | dead
  const FIXTURES = [];
  for (let k = 0; k < 11; k++) FIXTURES.push({ x: 0, z: .6 - 2.4 * k, kind: k === 8 ? 'flicker' : k === 6 ? 'dead' : 'ok' });
  FIXTURES.push({ x: 3.2, z: -23, kind: 'ok' }, { x: 5.6, z: -23, kind: 'ok' });
  const DECALS = [{ x: -1.2 + WT / 2 + .004, y: 1.45, z: -3.6, w: .34, h: .46, face: 'x+' }];   // a paper notice on the west wall
  const noticeCanvas = () => Tex.notice({ header: 'BUILDING SERVICES', title: ['NOTICE'], items: ['This floor closes at midnight.', 'Lights are on a timer.', 'Report anything unusual to the front desk.'], footer: ['Thank you.'] });
  // dark zones: the lighting has no shadows, so light reaches through walls. A zone [x0, z0, x1, z1, k]
  // multiplies all light inside it by k (soft 0.35 m edge): use it for rooms that must stay dark. Max 8.
  const ZONES = [[1.28, -9.12, 3.32, -8.08, .05]];
  // optional per-film hook: extra(i, t) multiplies emitter i at time t (e.g. a light that dies after the tear)
  const extra = null;

  // ================= LIGHTING SYSTEM =================
  const MAXE = 512, EM = [];   // {p:[x,y,z], base, col, eps, down, kind, ph}
  { const R = mulberry(99); for (const f of FIXTURES) { const w = (R() - .5) * .14, g = R() * .06; EM.push({ p: [f.x, H - .08, f.z], base: f.kind === 'dead' ? 0 : .9 + R() * .25, col: [1 + w, 1 + g, .86 - w * .6], eps: .35, down: .7, kind: f.kind, ph: R() * 100 }); } }
  if (EM.length > MAXE) throw new Error('too many emitters');
  const emData = new Float32Array(MAXE * 3 * 4), I = new Float32Array(EM.length);
  // global light level: the scripted flickers (shared formula with audio.js)
  let FL = null;
  function globalLight(t) {
    const F = FL || (FL = (Story.T.flick || []).map(Story.unwarp)); let g = 1;
    F.forEach((f, i) => {
      if (t > f - .03 && t < f + .1 + i * .02) g = .025;
      else if (t >= f + .1 + i * .02 && t < f + .2) g = Math.min(g, .55 + .45 * seg(t, f + .1, f + .2));
    });
    if (F.length) { const f = F[F.length - 1]; if (t > f + .2 && t < f + .9) g *= .9 + .1 * seg(t, f + .2, f + .9); }
    return g;
  }
  function intensities(t) {
    const g = globalLight(t);
    EM.forEach((e, i) => {
      let k = e.base;
      if (e.kind === 'flicker') { const s = Math.floor(t * 24 + e.ph), h1 = hash(s * 1.7 + e.ph), h2 = hash(Math.floor(t * 1.3 + e.ph)); k *= h2 < .35 ? (h1 < .5 ? .15 : .9) : 1; }
      if (extra) k *= extra(i, t);
      I[i] = k * g;
    });
    return I;
  }
  // spatial grid: 16 strongest emitters per 2.5 m cell, ranked by I / (d^2 + 1.5)
  let gx0 = 0, gz0 = 0, GN = [1, 1]; const CELL = 2.5;
  function buildGrid() {
    let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
    for (const b of BOXES) { x0 = Math.min(x0, b[0]); z0 = Math.min(z0, b[2]); x1 = Math.max(x1, b[3]); z1 = Math.max(z1, b[5]); }
    gx0 = x0; gz0 = z0; GN = [Math.ceil((x1 - x0) / CELL), Math.ceil((z1 - z0) / CELL)];
    const d = new Float32Array(GN[0] * 4 * GN[1] * 4).fill(-1);
    for (let j = 0; j < GN[1]; j++) for (let i = 0; i < GN[0]; i++) {
      const cx = x0 + (i + .5) * CELL, cz = z0 + (j + .5) * CELL;
      const r = EM.map((e, k) => [k, (e.base + .05) / ((e.p[0] - cx) ** 2 + (e.p[2] - cz) ** 2 + 1.5)]).sort((a, b) => b[1] - a[1]).slice(0, 16);
      r.forEach(([k], n) => { d[((j * GN[0] + i) * 4 + (n >> 2)) * 4 + (n & 3)] = k; });
    }
    return d;
  }
  // what the lens sees (for auto exposure): emitters in the view cone + local light
  function lensLuma(p, t) {
    const Iv = intensities(t), fw = [-Math.sin(p.yaw) * Math.cos(p.pitch), Math.sin(p.pitch), -Math.cos(p.yaw) * Math.cos(p.pitch)];
    const ch = Math.cos(p.fov * Math.PI / 180 * .5); let s = .02;
    EM.forEach((e, i) => {
      const d = [e.p[0] - p.pos[0], e.p[1] - p.pos[1], e.p[2] - p.pos[2]], L = Math.hypot(...d), c = (d[0] * fw[0] + d[1] * fw[1] + d[2] * fw[2]) / L;
      const fall = Iv[i] / (L * L + 1) * Math.exp(-L * TUNE.falloffK);
      s += fall * (.35 + 1.4 * clamp((c - ch * .8) / (1 - ch * .8)));
    });
    return s;
  }

  // ================= GL =================
  const VS = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNrm; layout(location=2) in vec2 aUv; layout(location=3) in vec2 aMat;
uniform mat4 uVP; out vec3 vW; out vec3 vN; out vec2 vUv; flat out float vMat; flat out float vEmi;
void main(){ vW = aPos; vN = aNrm; vUv = aUv; vMat = aMat.x; vEmi = aMat.y; gl_Position = uVP * vec4(aPos, 1.); }`;
  const FS = `#version 300 es
precision highp float; precision highp sampler2D;
uniform sampler2D uEm, uGrid, uDecal; uniform vec3 uCam, uFogCol; uniform vec4 uGridInfo; uniform vec2 uGridN;
uniform float uLight, uAmb, uFalloff, uFogD, uFogAvg, uEmis; uniform vec4 uZone[8]; uniform float uZoneK[8];
in vec3 vW; in vec3 vN; in vec2 vUv; flat in float vMat; flat in float vEmi; out vec4 o;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int k = 0; k < 4; k++){ s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
void lightAt(vec3 P, vec3 N, vec3 V, float shin, out vec3 dif, out vec3 spc, out vec3 amb){
  dif = vec3(0); spc = vec3(0); amb = vec3(0);
  ivec2 c = clamp(ivec2(floor((P.xz - uGridInfo.xy) / uGridInfo.z)), ivec2(0), ivec2(uGridN) - 1);
  for (int k = 0; k < 4; k++) { vec4 ids = texelFetch(uGrid, ivec2(c.x * 4 + k, c.y), 0);
    for (int j = 0; j < 4; j++) { float id = ids[j]; if (id < 0.) continue;
      vec4 e = texelFetch(uEm, ivec2(int(id), 0), 0); if (e.w <= 0.) continue;
      vec4 ec = texelFetch(uEm, ivec2(int(id), 1), 0); float dn = texelFetch(uEm, ivec2(int(id), 2), 0).x;
      vec3 d = e.xyz - P; float d2 = dot(d, d), dd = sqrt(d2); vec3 l = d / dd;
      float fall = e.w / (d2 + ec.w) * exp(-dd * uFalloff) * (1. - smoothstep(9., 12., dd));
      float shape = mix(1., .3 + .7 * max(l.y, 0.), dn);
      dif += ec.rgb * fall * shape * max(dot(N, l) * .62 + .38, 0.);
      if (shin > 0.) { vec3 hv = normalize(l + V); spc += ec.rgb * fall * shape * pow(max(dot(N, hv), 0.), shin); }
      amb += ec.rgb * e.w / (dot(d.xz, d.xz) + 3.);
    } }
  float zk = 1.;
  for (int z = 0; z < 8; z++) { vec4 Z = uZone[z]; if (uZoneK[z] >= 1.) continue;
    vec2 in2 = min(P.xz - Z.xy, Z.zw - P.xz); float inside = smoothstep(-.35, .0, min(in2.x, in2.y)); zk = min(zk, mix(1., uZoneK[z], inside)); }
  dif *= uLight * zk; spc *= uLight * zk; amb *= uAmb * zk;
}
vec3 fogA(vec3 c, vec3 P, vec3 a){ float d = length(P - uCam), f = 1. - exp(-d * uFogD);
  float k = clamp(dot(a, vec3(.333)) / uFogAvg, .08, 1.25); return mix(c, uFogCol * k, f); }
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N; vec3 V = normalize(uCam - vW);
  int m = int(vMat + .5); vec3 alb = vec3(.5); float shin = 0., wet = 0.;
  float u = abs(N.x) > .5 ? vW.z : vW.x;
  if (m == 0) {          // painted plaster: stains, grime near the floor, dark baseboard
    alb = vec3(.50, .49, .43) * (.92 + .12 * fbm(vec2(u * .7, vW.y * 1.2)));
    alb *= mix(vec3(1.), vec3(.82, .78, .66), smoothstep(.55, .75, fbm(vec2(u * .4, vW.y * .8) + 4.)) * .7);
    alb *= mix(.82, 1., smoothstep(.0, .5, vW.y));
    if (vW.y < .1) alb = vec3(.13, .12, .11);
  } else if (m == 1) {   // vinyl tile floor
    vec2 g = vW.xz / .305, f = fract(g); float ch = mod(floor(g.x) + floor(g.y), 2.);
    alb = mix(vec3(.30, .29, .26), vec3(.235, .23, .205), ch) * (.88 + .2 * fbm(vW.xz * 3.));
    alb *= 1. - .35 * (1. - smoothstep(.0, .02, min(min(f.x, 1. - f.x), min(f.y, 1. - f.y))));
    alb *= 1. - .25 * smoothstep(.6, .75, fbm(vW.xz * .6 + 9.));
    shin = 40.; wet = .12 + .2 * smoothstep(.5, .7, fbm(vW.xz * .5));
  } else if (m == 2) {   // acoustic ceiling tiles 0.6 x 1.2 m on a T-bar grid
    vec2 f = fract(vec2(vW.x / .6, vW.z / 1.2) + .5); float e = min(min(f.x, 1. - f.x) * .6, min(f.y, 1. - f.y) * 1.2);
    alb = vec3(.62, .6, .55) * (.9 + .15 * vn(vW.xz * 9.)) * (.95 + .08 * h21(floor(vec2(vW.x / .6, vW.z / 1.2) + .5)));
    alb = mix(vec3(.7, .69, .65), alb, smoothstep(.008, .014, e));
  } else if (m == 3) {   // fixture: emission from its own emitter
    vec4 e = texelFetch(uEm, ivec2(int(vEmi), 0), 0); vec3 ec = texelFetch(uEm, ivec2(int(vEmi), 1), 0).rgb;
    vec2 q = abs(vUv - .5) * 2.; float glow = 1. - smoothstep(.86, .92, max(q.x, q.y));
    float tubes = .82 + .18 * (smoothstep(.5, .0, abs(q.x - .45)));
    vec3 c = mix(vec3(.04) * (.2 + e.w), ec * e.w * uEmis * tubes, glow);
    vec3 d, s, a; lightAt(vW - vec3(0, .05, 0), N, V, 0., d, s, a);
    o = vec4(fogA(c, vW, a), 1.); return;
  } else if (m == 4) {   // cardboard
    alb = vec3(.36, .26, .15) * (.85 + .25 * fbm(vec2(u, vW.y) * 6.));
    if (abs(fract(vW.y * 2.) - .5) < .06 && abs(N.y) < .5) alb = vec3(.55, .5, .38);
  } else if (m == 5) {   // decal (paper notice)
    alb = texture(uDecal, vUv).rgb; alb = pow(alb, vec3(2.2)) * .85;
  } else if (m == 6) {   // painted metal
    alb = vec3(.30, .30, .28); shin = 30.; wet = .08;
  }
  vec3 d, s, a; lightAt(vW + N * .02, N, V, shin, d, s, a);
  vec3 c = alb * (d + a) + s * wet;
  o = vec4(fogA(c, vW, a), 1.);
}`;
  let prog, vao, nVerts, emTex, gridTex, decalTex;
  function geometry() {
    const v = [];
    const vert = (p, n, uv, m, e) => v.push(p[0], p[1], p[2], n[0], n[1], n[2], uv[0], uv[1], m, e);
    const quad = (a, b, c, d, n, m, e = -1) => { vert(a, n, [0, 0], m, e); vert(b, n, [1, 0], m, e); vert(c, n, [1, 1], m, e); vert(a, n, [0, 0], m, e); vert(c, n, [1, 1], m, e); vert(d, n, [0, 1], m, e); };
    for (const [x0, y0, z0, x1, y1, z1, m] of BOXES) {
      quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [1, 0, 0], m); quad([x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [-1, 0, 0], m);
      quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0], m); quad([x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0], [0, -1, 0], m);
      quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], m); quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], m);
    }
    EM.forEach((e, i) => { const [x, , z] = e.p, y = H - .004; quad([x - .3, y, z + .6], [x + .3, y, z + .6], [x + .3, y, z - .6], [x - .3, y, z - .6], [0, -1, 0], M.fixture, i); });
    for (const d of DECALS) { const x = d.x, w = d.w / 2, h = d.h / 2; if (d.face === 'x+') quad([x, d.y - h, d.z + w], [x, d.y - h, d.z - w], [x, d.y + h, d.z - w], [x, d.y + h, d.z + w], [1, 0, 0], M.decal); }
    return new Float32Array(v);
  }
  function init(gl) {
    prog = Util.program(gl, VS, FS);
    const data = geometry(); nVerts = data.length / 10;
    vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    [[0, 3, 0], [1, 3, 3], [2, 2, 6], [3, 2, 8]].forEach(([l, n, o]) => { gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 40, o * 4); });
    gl.bindVertexArray(null);
    emTex = Util.texture(gl, MAXE, 3, { internal: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT, filter: gl.NEAREST });
    const g = buildGrid();
    gridTex = Util.texture(gl, GN[0] * 4, GN[1], { internal: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT, filter: gl.NEAREST, data: g });
    decalTex = Tex.upload(gl, noticeCanvas());
  }
  function draw(gl, VP, cam, t) {
    const Iv = intensities(t);
    EM.forEach((e, i) => {
      const a = i * 4, b = (MAXE + i) * 4, c = (2 * MAXE + i) * 4;
      emData[a] = e.p[0]; emData[a + 1] = e.p[1]; emData[a + 2] = e.p[2]; emData[a + 3] = Iv[i];
      emData[b] = e.col[0]; emData[b + 1] = e.col[1]; emData[b + 2] = e.col[2]; emData[b + 3] = e.eps; emData[c] = e.down;
    });
    gl.bindTexture(gl.TEXTURE_2D, emTex); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, MAXE, 3, gl.RGBA, gl.FLOAT, emData);
    gl.useProgram(prog.p); const U = prog.U;
    gl.uniformMatrix4fv(U.uVP, false, VP); gl.uniform3fv(U.uCam, cam);
    gl.uniform4f(U.uGridInfo, gx0, gz0, CELL, 0); gl.uniform2f(U.uGridN, GN[0], GN[1]);
    gl.uniform1f(U.uLight, TUNE.light); gl.uniform1f(U.uAmb, TUNE.amb); gl.uniform1f(U.uFalloff, TUNE.falloffK);
    gl.uniform1f(U.uFogD, TUNE.fogD); gl.uniform1f(U.uFogAvg, TUNE.fogAvg); gl.uniform3fv(U.uFogCol, TUNE.fogCol); gl.uniform1f(U.uEmis, TUNE.emis);
    const zb = new Float32Array(32), zk = new Float32Array(8).fill(1); ZONES.slice(0, 8).forEach((z, i) => { zb.set(z.slice(0, 4), i * 4); zk[i] = z[4]; });
    gl.uniform4fv(U.uZone, zb); gl.uniform1fv(U.uZoneK, zk);
    [[emTex, 'uEm'], [gridTex, 'uGrid'], [decalTex, 'uDecal']].forEach(([tx, n], k) => { gl.activeTexture(gl.TEXTURE0 + k); gl.bindTexture(gl.TEXTURE_2D, tx); gl.uniform1i(U[n], k); });
    gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, nVerts); gl.bindVertexArray(null);
  }
  return { init, draw, intensities, globalLight, lensLuma, EM, H, BOXES };
})();
