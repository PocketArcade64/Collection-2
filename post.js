// ---------- post.js : camera optics (reusable as is, retune with TUNE) ----------
// Scene (linear HDR) -> bloom (bright pass, 4 downsamples, 3 upsamples) -> camera pass:
// depth-of-field from the focus spring, motion blur on fast pans, cheap SSAO, bloom add, exposure,
// soft shoulder, gamma. Output is display-referred, ready for the VHS pass.
const Post = (() => {
  const { program, target, quad, FSQ_VS, TUNE } = Util;
  const H = `#version 300 es
precision highp float; in vec2 vUv; out vec4 o;`;
  const BRIGHT = H + `
uniform sampler2D uSrc; uniform float uExpo, uThr; uniform vec2 uTx;
void main(){ vec3 c = vec3(0.); for (int i = 0; i < 4; i++) { vec2 d = vec2(i & 1, i >> 1) - .5; c += texture(uSrc, vUv + d * uTx).rgb; }
  c = c * .25 * uExpo; o = vec4(max(c - uThr, 0.), 1.); }`;
  const DOWN = H + `
uniform sampler2D uSrc; uniform vec2 uTx;
void main(){ vec3 c = texture(uSrc, vUv).rgb * .5;
  c += (texture(uSrc, vUv + uTx * vec2(-1, -1)).rgb + texture(uSrc, vUv + uTx * vec2(1, -1)).rgb + texture(uSrc, vUv + uTx * vec2(-1, 1)).rgb + texture(uSrc, vUv + uTx * vec2(1, 1)).rgb) * .125;
  o = vec4(c, 1.); }`;
  const UP = H + `
uniform sampler2D uSrc, uAdd; uniform vec2 uTx;
void main(){ vec3 c = vec3(0.); float w = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { float k = (x == 0 ? 2. : 1.) * (y == 0 ? 2. : 1.); c += texture(uSrc, vUv + vec2(x, y) * uTx).rgb * k; w += k; }
  o = vec4(c / w + texture(uAdd, vUv).rgb, 1.); }`;
  const CAMERA = H + `
uniform sampler2D uScene, uDepth, uBloom; uniform vec2 uRes;
uniform float uExpo, uFocus, uCocK, uMaxCoc, uNear, uFar, uMB, uAo, uBloomAmt;
float lin(float z){ float zn = z * 2. - 1.; return 2. * uNear * uFar / (uFar + uNear - zn * (uFar - uNear)); }
float coc(float d){ return clamp(abs(1. / d - 1. / uFocus) * uCocK, 0., uMaxCoc); }
void main(){
  float d = lin(texture(uDepth, vUv).r), cc = coc(d);
  vec3 acc = vec3(0.); float ws = 0.;
  for (int i = 0; i < 16; i++) {
    float fi = float(i), r = sqrt((fi + .5) / 16.), a = fi * 2.39996;
    vec2 off = vec2(cos(a), sin(a)) * r * max(cc, .001) / uRes;
    off.x += uMB * ((fi + .5) / 16. - .5);
    vec2 q = vUv + off; float d2 = lin(texture(uDepth, q).r), c2 = coc(d2);
    float w = d2 < d - .05 ? clamp(c2 - r * cc + 1., 0., 1.) : 1.;   // sharp foreground doesn't smear into blurry background
    acc += texture(uScene, q).rgb * w; ws += w;
  }
  vec3 c = acc / max(ws, 1e-3);
  float occ = 0.;
  for (int k = 0; k < 8; k++) { float a = float(k) * .785 + .4, rr = (3. + float(k) * 1.7) * clamp(2.2 / d, .4, 3.);
    float ds = lin(texture(uDepth, vUv + vec2(cos(a), sin(a)) * rr / uRes).r), dz = d - ds;
    occ += smoothstep(.03, .25, dz) * (1. - smoothstep(.35, .9, dz)); }
  c *= 1. - uAo * occ / 8.;
  c = c * uExpo + texture(uBloom, vUv).rgb * uBloomAmt;
  c = mix(c, .72 + .28 * (1. - exp(-(c - .72) / .28)), step(.72, c));   // soft shoulder
  o = vec4(pow(max(c, 0.), vec3(1. / 2.2)), 1.);
}`;
  let P = null; const sets = {};
  function init(gl) { P = { bright: program(gl, FSQ_VS, BRIGHT), down: program(gl, FSQ_VS, DOWN), up: program(gl, FSQ_VS, UP), cam: program(gl, FSQ_VS, CAMERA) }; }
  // one set of targets per scene width (720 for 4:3, 1024 for the fill 16:9 view), built on first use
  function targets(gl, w, h) {
    const k = w + 'x' + h; if (sets[k]) return sets[k];
    const s = { scene: target(gl, w, h, { depth: true }), out: target(gl, w, h, { float: false }), down: [], up: [] };
    let bw = w >> 1, bh = h >> 1; s.bright = target(gl, bw, bh);
    for (let i = 0; i < 4; i++) { bw = Math.max(2, bw >> 1); bh = Math.max(2, bh >> 1); s.down.push(target(gl, bw, bh)); }
    for (let i = 0; i < 3; i++) s.up.push(target(gl, s.down[i].w, s.down[i].h));
    return (sets[k] = s);
  }
  function pass(gl, prg, dst, tex, uni) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb || null); gl.viewport(0, 0, dst.w, dst.h); gl.useProgram(prg.p);
    Object.entries(tex).forEach(([n, t], i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(prg.U[n], i); });
    for (const [n, v] of Object.entries(uni)) { if (prg.U[n] == null) continue; Array.isArray(v) ? gl['uniform' + v.length + 'f'](prg.U[n], ...v) : gl.uniform1f(prg.U[n], v); }
    quad(gl);
  }
  // run bloom + camera pass on s.scene, result in s.out
  function run(gl, s, o) {
    pass(gl, P.bright, s.bright, { uSrc: s.scene.color }, { uExpo: o.expo, uThr: TUNE.bloomThr, uTx: [1 / s.scene.w, 1 / s.scene.h] });
    let src = s.bright; for (const d of s.down) { pass(gl, P.down, d, { uSrc: src.color }, { uTx: [1 / src.w, 1 / src.h] }); src = d; }
    let u = s.down[3]; for (let i = 2; i >= 0; i--) { pass(gl, P.up, s.up[i], { uSrc: u.color, uAdd: s.down[i].color }, { uTx: [1 / u.w, 1 / u.h] }); u = s.up[i]; }
    const cocK = 5.5 * (50 / o.fov) ** 2 * o.aper * s.scene.h / 540;
    pass(gl, P.cam, s.out, { uScene: s.scene.color, uDepth: s.scene.depth, uBloom: s.up[0].color }, {
      uRes: [s.scene.w, s.scene.h], uExpo: o.expo, uFocus: o.focus, uCocK: cocK, uMaxCoc: TUNE.maxCoc, uNear: o.near, uFar: o.far,
      uMB: o.mb, uAo: TUNE.aoAmt, uBloomAmt: TUNE.bloom,
    });
  }
  return { init, targets, run, pass };
})();
