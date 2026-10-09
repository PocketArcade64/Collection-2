// ---------- util.js : math, seeded RNG, noise, keyframe tracks, eases, mat4, GL helpers, TUNE (reusable as is) ----------
const Util = (() => {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ss = x => x * x * (3 - 2 * x);
  // 1 inside [a, b], ramping in over fi and out over fo
  const env = (t, a, b, fi, fo) => clamp(Math.min((t - a) / fi, (b - t) / fo));
  const fract = x => x - Math.floor(x);
  const hash = n => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u); };
  // multi-octave noise in [-0.5, 0.5]
  const fbm1 = (x, oct = 3) => { let s = 0, a = .5, n = 0; for (let k = 0; k < oct; k++) { s += a * (vnoise(x + k * 37.7) - .5); n += a; x *= 2.07; a *= .5; } return s / n * .5 / .5; };
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------- keyframe tracks ----------
  // track([[t, value, ease], ...]): the ease applies to the segment ENDING at that key. Values: numbers or arrays.
  const walkE = (x, a = .2) => { const v = 1 / (1 - a); if (x < a) return .5 * v * x * x / a; if (x > 1 - a) return 1 - .5 * v * (1 - x) ** 2 / a; return v * (x - a / 2); };
  const EASE = {
    lin: x => x, smooth: ss, out: x => 1 - (1 - x) ** 3, in: x => x * x * x, hold: x => (x < 1 ? 0 : 1),
    walk: walkE,                                                     // trapezoid velocity (no 1.5x lurch)
    whip: x => { const s = 1.4; x -= 1; return x * x * ((s + 1) * x + s) + 1; },   // mild overshoot
  };
  function track(keys) {
    const f = t => {
      if (t <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) {
        const [t1, v1, e = 'smooth'] = keys[i];
        if (t <= t1) {
          const [t0, v0] = keys[i - 1], u = EASE[e]((t - t0) / Math.max(1e-6, t1 - t0));
          return Array.isArray(v0) ? v0.map((a, k) => lerp(a, v1[k], u)) : lerp(v0, v1, u);
        }
      }
      return keys[keys.length - 1][1];
    };
    f.keys = keys; return f;
  }
  // Precompute a stateful simulation into a 120 Hz table so playback/scrub/export are pure functions of t
  function table(dur, step) {
    const R = 120, n = Math.ceil(dur * R) + 2, a = new Float32Array(n); let st = null;
    for (let i = 0; i < n; i++) { const r = step(i / R, 1 / R, st); st = r.state; a[i] = r.v; }
    return t => { const f = clamp(t * R, 0, n - 1.001), i = Math.floor(f); return lerp(a[i], a[i + 1], f - i); };
  }


  // ---------- path: Catmull-Rom through hand-placed [x, z] points, arc-length parametrised (metres) ----------
  // yaw convention: yaw 0 looks down -z; forward = (-sin yaw, -cos yaw); right = (cos yaw, -sin yaw)
  function path(pts, n = 24) {
    const P = [pts[0], ...pts, pts[pts.length - 1]], D = [];
    const cr = (a, b, c, d, t) => { const t2 = t * t, t3 = t2 * t; return [0, 1].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t3)); };
    for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < n; k++) D.push(cr(P[i - 1], P[i], P[i + 1], P[i + 2], k / n));
    D.push(pts[pts.length - 1]);
    const L = [0]; for (let i = 1; i < D.length; i++) L.push(L[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]));
    const len = L[L.length - 1];
    function at(s) {
      s = clamp(s, 0, len); let lo = 0, hi = L.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= s) lo = m; else hi = m; }
      const f = (s - L[lo]) / Math.max(1e-9, L[hi] - L[lo]), a = D[lo], b = D[hi];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      return { x: lerp(a[0], b[0], f), z: lerp(a[1], b[1], f), yaw: Math.atan2(-dx, -dz) };
    }
    // heading looking a little ahead (smoother than the raw tangent)
    const heading = (s, ahead = .9) => { const a = at(s), b = at(s + ahead); return (b.x === a.x && b.z === a.z) ? a.yaw : Math.atan2(-(b.x - a.x), -(b.z - a.z)); };
    const place = (s, lat = 0, fwd = 0) => { const a = at(s), y = heading(s); return [a.x + Math.cos(y) * lat - Math.sin(y) * fwd, a.z - Math.sin(y) * lat - Math.cos(y) * fwd]; };
    const yawTo = (s, p) => { const a = at(s); return Math.atan2(-(p[0] - a.x), -(p[1] - a.z)); };
    return { at, heading, place, yawTo, len };
  }
  // unwrap angle b to within pi of a
  const unwrap = (a, b) => b + Math.round((a - b) / (2 * Math.PI)) * 2 * Math.PI;

  // ---------- mat4 (column-major) ----------
  function perspective(fovy, aspect, n, f) {
    const t = 1 / Math.tan(fovy / 2), m = new Float32Array(16);
    m[0] = t / aspect; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f); return m;
  }
  // Camera rotation like three.js order 'YXZ': R = Ry(yaw) * Rx(pitch) * Rz(roll); camera looks down -Z
  function camBasis(yaw, pitch, roll) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch), cz = Math.cos(roll), sz = Math.sin(roll);
    const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rx = [[1, 0, 0], [0, cx, -sx], [0, sx, cx]], Rz = [[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]];
    const mul = (A, B) => A.map((r, i) => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
    return mul(mul(Ry, Rx), Rz);   // columns: right, up, back
  }
  function viewMatrix(p, R) {
    const m = new Float32Array(16);
    for (let r = 0; r < 3; r++) { for (let c = 0; c < 3; c++) m[c * 4 + r] = R[c][r]; m[12 + r] = -(R[0][r] * p[0] + R[1][r] * p[1] + R[2][r] * p[2]); }
    m[15] = 1; return m;
  }
  function mulMat(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }
  function project(m, p) { const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], z = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14], w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]; return [x / w, y / w, z / w, w]; }

  // ---------- GL helpers ----------
  function shader(gl, type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const log = gl.getShaderInfoLog(s); console.error(src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n')); throw new Error('shader: ' + log); }
    return s;
  }
  const FSQ_VS = `#version 300 es
in vec2 aP; out vec2 vUv; void main(){ vUv = aP * .5 + .5; gl_Position = vec4(aP, 0., 1.); }`;
  function program(gl, vs, fs) {
    const p = gl.createProgram(); gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aP'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    const U = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i), name = info.name.replace(/\[0\]$/, ''); U[name] = gl.getUniformLocation(p, info.name); }
    return { p, U };
  }
  function texture(gl, w, h, { internal, format, type, filter, data = null, wrap }) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap || gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap || gl.CLAMP_TO_EDGE);
    return t;
  }
  // Render target: RGBA16F (or RGBA8) colour, optional depth texture
  function target(gl, w, h, { float = true, depth = false } = {}) {
    const color = texture(gl, w, h, float ? { internal: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT, filter: gl.LINEAR } : { internal: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE, filter: gl.LINEAR });
    const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color, 0);
    let dt = null;
    if (depth) { dt = texture(gl, w, h, { internal: gl.DEPTH_COMPONENT24, format: gl.DEPTH_COMPONENT, type: gl.UNSIGNED_INT, filter: gl.NEAREST }); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, dt, 0); }
    const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER); if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error('framebuffer incomplete ' + st);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fb, color, depth: dt, w, h };
  }
  let quadVAO = null;
  function quad(gl) {
    if (!quadVAO) { quadVAO = gl.createVertexArray(); gl.bindVertexArray(quadVAO); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); }
    gl.bindVertexArray(quadVAO); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // ---------- TUNE: look knobs, change live from the console or the test harness ----------
  const TUNE = {
    light: 2.0,      // emitter strength on surfaces
    amb: .18,        // local ambient / bounce
    falloffK: .28,   // exponential falloff per metre (keeps overlapping lights from flattening the scene)
    fogD: .045, fogAvg: .35, fogCol: [.16, .15, .12],
    emis: 1.6,       // fixture brightness as seen by the lens
    expo: .9, key: .42, maxExp: 2.2,
    bloom: .55, bloomThr: .95,
    aoAmt: .45, maxCoc: 9,
    // VHS
    jitter: .3, sharp: .9, lumaW: 1.25, chromaW: 5.0, chromaShift: 1.6, sat: 1.0, barrel: .07, vig: .42,
    black: .045, smear: .35, dropout: 1.0, scan: 0.0,   // scan: optional faint tape-line structure (0 = off, per the playbook)
  };

  return { path, unwrap, clamp, lerp, seg, ss, env, fract, hash, vnoise, fbm1, mulberry, EASE, track, table, perspective, camBasis, viewMatrix, mulMat, project, program, texture, target, quad, FSQ_VS, TUNE };
})();
