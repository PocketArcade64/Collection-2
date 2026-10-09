// ---------- vhs.js : the camcorder tape pass (reusable as is, tune strength with TUNE) ----------
// Based on the Night Shift Orientation shader, ported to WebGL 2, with the playbook's additions:
// concealed dropouts, rolling-shutter skew on pans, start/end snow, the fill 16:9 view (uPad), and a
// caption layer composited untouched at the very end.
// Order: 4:3 frame -> per-line time-base jitter / head-switching band / tracking tear -> lens barrel
// (picture only; the OSD is an electronic overlay and skips the lens) -> luma bandwidth + edge-enhancement
// ringing -> chroma smeared wide and lagging right -> highlight comet tails -> white balance / AGC noise ->
// dropouts -> lifted blacks + soft clip -> vignette -> captions. No CRT raster by default: this is a
// recorded tape, not a tube (TUNE.scan adds a faint line structure if you want it).
const VHS = (() => {
  const FS = `#version 300 es
precision highp float;
uniform sampler2D tScene, tOSD, tCap; uniform vec2 res, src; uniform vec3 tint;
uniform float frame, gain, sharp, lumaW, chromaW, chromaShift, sat, jitter, track, roll, barrel, vig, black, dropout, off, snow, smear;
uniform float uPad, overscan, osdOn, capOn, skew, scan;
in vec2 vUv; out vec4 o;
float h1(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float vn1(float x){ float i = floor(x), f = fract(x); f = f*f*(3.-2.*f); return mix(h1(i), h1(i+1.), f); }
const mat3 toYIQ = mat3(.299, .596, .211, .587, -.274, -.523, .114, -.322, .312);
const mat3 toRGB = mat3(1., 1., 1., .956, -.272, -1.106, .621, -.647, 1.703);
vec2 lens(vec2 q){ vec2 p = q - .5; vec2 pa = p * vec2(1.333, 1.); float r2 = dot(pa, pa); p *= 1. + barrel * r2; p *= 1. - barrel * .3; return p + .5; }
// signal = picture (through the lens) + OSD (electronic, no lens, no vignette)
vec3 sig(vec2 q){
  vec2 ql = lens(q);
  vec3 c = texture(tScene, vec2((ql.x + uPad) / (1. + 2. * uPad), ql.y)).rgb;
  if (ql.x < -uPad || ql.x > 1. + uPad || ql.y < 0. || ql.y > 1.) c = vec3(0.);
  if (osdOn > 0. && q.x >= 0. && q.x <= 1.) {
    vec4 a = texture(tOSD, q), b = texture(tOSD, q - vec2(.5 / src.x, 0.));   // slight two-tap smear
    vec4 s = (a + b) * .5; c = mix(c, s.rgb / max(s.a, 1e-3), s.a);
  }
  return c;
}
void main(){
  vec2 fc = gl_FragCoord.xy; float bw = res.y * 4. / 3.;
  vec2 uv0 = vec2((fc.x - res.x * .5) / bw, (fc.y - res.y * .5) / res.y) / (1. + overscan) + .5;
  if (uv0.x < -uPad || uv0.x > 1. + uPad) { o = vec4(0., 0., 0., 1.); return; }
  vec2 uv = uv0;
  float F = floor(frame);
  uv.y = fract(uv.y + roll);                        // vertical roll (roll-in, tear)
  float line = floor((1. - uv.y) * src.y);          // tape line, top to bottom
  float dx = 1. / src.x;
  // time-base error: per-line horizontal jitter + slow wobble (period ~80 lines, never italicises text)
  float off1 = (h1(line * .37 + F * 1.13) - .5) * jitter * dx;
  off1 += (vn1(line * .012 + F * .7) - .5) * jitter * .8 * dx;
  off1 += skew * (line / src.y - .5);               // rolling shutter on fast pans
  // head switching: the bottom lines shear sideways with noise
  float hsw = smoothstep(src.y - 10., src.y - 3., line);
  off1 += hsw * (.012 + .025 * h1(line + F * 3.1));
  // tracking tear: a rolling noise band with big line offsets inside it
  float band = 0.;
  if (track > 0.) {
    float by = fract(h1(F * .31) * .6 + F * .037);
    band = smoothstep(.09 * track + .02, 0., abs(uv.y - by));
    off1 += (h1(line * .13 + F * 7.1) - .5) * .05 * track * (1. + band * 4.);
    off1 += band * track * .06 * sin(F * 2.3 + line * .02);
    uv.y += (h1(F * 1.9) - .5) * .02 * track;
  }
  vec2 q = vec2(uv.x + off1, uv.y);
  // dropouts: most are concealed by the deck (repeat a segment from 3 lines above, nudged sideways);
  // the rest are broken sparkles with a tail to the right. Each flake lives 2 frames.
  float spark = 0.;
  if (dropout > 0.) for (int k = 0; k < 6; k++) {
    float fk = float(k), ff = floor((F + fk) * .5);
    if (h1(ff * 3.7 + fk * 11.3) > .22 * dropout) continue;
    float dl = floor(h1(ff * 1.3 + fk * 5.1) * src.y), dxs = h1(ff * 2.9 + fk * 7.7) - .05, dlen = .015 + .09 * h1(ff * 4.1 + fk);
    bool conceal = h1(ff * 9.1 + fk * 3.3) < .72; float tall = conceal ? 1. : 1. + floor(h1(ff * 6.7 + fk) * 3.);
    if (line >= dl && line < dl + tall && uv.x > dxs && uv.x < dxs + dlen) {
      if (conceal) q += vec2((h1(ff + fk * 2.) - .5) * .01, 3. / src.y);
      else { float u = (uv.x - dxs) / dlen; spark = max(spark, exp(-u * 3.5) * (.5 + .5 * h2(vec2(floor(uv.x * src.x), line + F)))); }
    }
  }
  // luma: narrow + wide gaussian -> sharpening ring (the camcorder's edge-enhancement halo)
  float Y = 0., Yw = 0., ws = 0., wws = 0.;
  for (int i = -3; i <= 3; i++) { float fi = float(i); float w = exp(-fi * fi / (2. * lumaW * lumaW)); Y += dot(sig(q + vec2(fi * dx, 0.)), vec3(.299, .587, .114)) * w; ws += w; }
  for (int i = -4; i <= 4; i++) { float fi = float(i) * 1.8; float w = exp(-fi * fi / 24.); Yw += dot(sig(q + vec2(fi * dx, 0.)), vec3(.299, .587, .114)) * w; wws += w; }
  Y /= ws; Yw /= wws; Y = Y + sharp * (Y - Yw);
  // chroma: wide average, lagging to the right
  vec2 IQ = vec2(0.); float cw = 0.;
  for (int i = -5; i <= 5; i++) { float fi = float(i) * chromaW * .4; float w = exp(-float(i * i) / 12.); IQ += (toYIQ * sig(q + vec2((fi - chromaShift) * dx, 0.))).yz * w; cw += w; }
  IQ /= cw;
  // highlights trail to the right (comet tails on lamps)
  float tail = 0.;
  for (int i = 1; i <= 6; i++) { float yy = dot(sig(q - vec2(float(i) * 2.5 * dx, 0.)), vec3(.299, .587, .114)); tail += max(yy - .82, 0.) * (1. - float(i) / 7.); }
  Y += tail * smear;
  // AGC noise: horizontally stretched grain, strongest in the darks, seeded at tape rate
  float px = floor(uv.x * src.x / 1.5);
  float nY = (h2(vec2(px, line) + F * 7.3) - .5) + (h2(vec2(floor(px / 3.), line) + F * 3.1) - .5) * .6;
  Y += nY * gain * (1.3 - Y * .8);
  IQ += (vec2(vn1(uv.x * 38. + line * 3.1 + F * 17.), vn1(uv.x * 31. + line * 1.7 + F * 11.)) - .5) * gain * .5;
  IQ *= sat;
  vec3 c = toRGB * vec3(Y, IQ);
  if (track > 0.) { float sn = h2(vec2(floor(uv.x * 480.), line) + F * 31.); c = mix(c, vec3(sn), band * .8 * track); c = mix(c, vec3(dot(c, vec3(.33))), band * track); }
  if (hsw > 0.) c = mix(c, vec3(h2(vec2(px, line + F))), hsw * .35);
  c += spark * .85;
  // white balance / black lift / soft highlight clip
  c *= tint;
  c = c * (1. - black) + black;
  c = mix(c, (1. - exp(-c * 1.6)) / (1. - exp(-1.6)), smoothstep(.55, 1.2, c));
  if (scan > 0.) c *= 1. - scan * .5 * (.5 + .5 * cos(((1. - uv.y) * src.y) * 6.2832));
  vec2 dv = (uv - .5) * vec2(1.25, 1.); c *= 1. - vig * smoothstep(.2, .85, length(dv));
  // snow (no signal) and black
  if (snow > 0.) { float s = h2(vec2(floor(uv0.x * 360.), floor(uv0.y * 270.)) + F * 13.1) * .8 + .1 * vn1(uv0.y * 40. + F); c = mix(c, vec3(s), snow); }
  c = mix(c, vec3(0.), off);
  // captions / end card: composited untouched, inside the 4:3 frame
  if (uv0.x >= 0. && uv0.x <= 1. && uv0.y >= 0. && uv0.y <= 1.) { vec4 k = texture(tCap, uv0); c = mix(c, k.rgb / max(k.a, 1e-3), k.a * (capOn > 0. ? 1. : 0.)); }
  o = vec4(clamp(c, 0., 1.), 1.);
}`;
  let P = null;
  function init(gl) { P = Util.program(gl, Util.FSQ_VS, FS); }
  // u: uniform values; tex: {tScene, tOSD, tCap}; target: {fb, w, h} (fb null = canvas)
  function run(gl, tex, u, dst) { Post.pass(gl, P, dst, tex, u); }
  return { init, run };
})();
