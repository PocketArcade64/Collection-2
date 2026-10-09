// ---------- audio.js : offline DSP soundtrack in three stems (keep the engine, rewrite the events) ----------
// Everything is "recorded on the tape": room tone (chosen by the story: fluorescent hum only when it belongs), tape hiss, footsteps, cloth, breath, camera mechanics,
// a PA ceiling speaker, the operator whispering, in-world music through a wall, a low drone, the tracking
// tear and the one second of digital silence. Timing comes from story.js and rig.js (the same breath
// table, walk and focus spring the camera uses), so picture and sound cannot drift.
// Stems: music (in-world music + drone), fx (bed + foley + camera), voice (PA + operator).
// Voice: load real recordings (<line id>.wav) to replace the placeholder murmur.
const Snd = (() => {
  const SR = 48000, { clamp, lerp, seg, ss, mulberry } = Util;
  // ======================= CONFIG (per film) =======================
  const CFG = {
    zoomGain: 1,            // 1 = the zoom servo at the level it had in Environmental Verification
    stepGain: .16,          // footsteps start low (the last film's were too loud): sit under the voice
    breathGain: .05, rustleGain: .07, humGain: 1.3, airGain: .06, hissGain: .006,
    music: true, musicGain: .14, droneGain: .09,
    paFar: .4, paGain: .62, meGain: .52,
    target: -14,            // LUFS of the full mix
  };
  // custom event generators: { type: (e, add) => {...} } for Story.SOUND.extra
  const CUSTOM = {};

  // ======================= DSP =======================
  let R = mulberry(41);
  const gauss = n => { const a = new Float32Array(n); for (let i = 0; i < n; i += 2) { const u = Math.max(1e-9, R()), v = R(), m = Math.sqrt(-2 * Math.log(u)); a[i] = m * Math.cos(6.2832 * v); if (i + 1 < n) a[i + 1] = m * Math.sin(6.2832 * v); } return a; };
  const sec = d => Math.round(d * SR);
  function biquad(x, type, f, Q = .7071, db = 0) {
    f = Math.min(f, SR * .45); const w = 2 * Math.PI * f / SR, c = Math.cos(w), s = Math.sin(w), al = s / (2 * Q), A = Math.pow(10, db / 40);
    let b0, b1, b2, a0, a1, a2;
    if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'bp') { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (type === 'peak') { b0 = 1 + al * A; b1 = -2 * c; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * c; a2 = 1 - al / A; }
    else if (type === 'lowshelf') { const sA = 2 * Math.sqrt(A) * al; b0 = A * ((A + 1) - (A - 1) * c + sA); b1 = 2 * A * ((A - 1) - (A + 1) * c); b2 = A * ((A + 1) - (A - 1) * c - sA); a0 = (A + 1) + (A - 1) * c + sA; a1 = -2 * ((A - 1) + (A + 1) * c); a2 = (A + 1) + (A - 1) * c - sA; }
    b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) { const v = x[i], o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2; x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o; }
    return y;
  }
  const lp = (x, f, o = 1) => { for (let k = 0; k < o; k++) x = biquad(x, 'lp', f); return x; };
  const hp = (x, f, o = 1) => { for (let k = 0; k < o; k++) x = biquad(x, 'hp', f); return x; };
  const bp = (x, f0, f1, o = 1) => { for (let k = 0; k < o; k++) { x = hp(x, f0); x = lp(x, f1); } return x; };
  const peakAbs = x => { let m = 0; for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i])); return m; };
  const norm = x => { const m = peakAbs(x) + 1e-9; return x.map(v => v / m); };
  const rms = x => { let s = 0; for (let i = 0; i < x.length; i++) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, x.length)); };
  function movAvg(x, w) { const y = new Float32Array(x.length); let s = 0; for (let i = 0; i < x.length; i++) { s += x[i]; if (i >= w) s -= x[i - w]; y[i] = s / Math.min(i + 1, w); } return y; }
  function envAR(n, a, r) { const x = new Float32Array(n).fill(1), na = Math.min(n, sec(a)), nr = Math.min(n, sec(r)); for (let i = 0; i < na; i++) x[i] = i / na; for (let i = 0; i < nr; i++) x[n - nr + i] *= Math.exp(-5 * i / nr); return x; }
  function fade(n, fi = .01, fo = .01) { const x = new Float32Array(n).fill(1), a = Math.min(n, sec(fi)), b = Math.min(n, sec(fo)); for (let i = 0; i < a; i++) x[i] = i / a; for (let i = 0; i < b; i++) x[n - b + i] *= 1 - i / b; return x; }
  function compress(x, thr, ratio) {
    const y = new Float32Array(x.length), at = Math.exp(-1 / (SR * .005)), rl = Math.exp(-1 / (SR * .08)); let e = 0;
    for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); e = a > e ? at * e + (1 - at) * a : rl * e + (1 - rl) * a; const g = e > thr ? Math.pow(e / thr, 1 / ratio - 1) : 1; y[i] = x[i] * g; }
    return y;
  }
  // Freeverb-style room; wet level matched to the dry RMS so 'mix' means what it says
  function room(L, Rr, size = .6, mix = .5, damp = .5) {
    const k = SR / 44100, CB = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], AP = [556, 441, 341, 225], fb = .7 + .28 * size;
    const run = (x, spread) => {
      const out = new Float32Array(x.length);
      for (const d0 of CB) { const d = Math.round((d0 + spread) * k), buf = new Float32Array(d); let p = 0, f = 0; for (let i = 0; i < x.length; i++) { const o = buf[p]; f = o * (1 - damp) + f * damp; buf[p] = x[i] * .015 + f * fb; out[i] += o; p = (p + 1) % d; } }
      let y = out; for (const d0 of AP) { const d = Math.round((d0 + spread) * k), buf = new Float32Array(d), z = new Float32Array(y.length); let p = 0; for (let i = 0; i < y.length; i++) { const b = buf[p]; z[i] = -y[i] + b; buf[p] = y[i] + b * .5; p = (p + 1) % d; } y = z; }
      return y;
    };
    const wl = run(L, 0), wr = run(Rr, 23), g = (rms(L) + rms(Rr)) / (rms(wl) + rms(wr) + 1e-9);
    return [L.map((v, i) => v * (1 - mix) + wl[i] * g * mix), Rr.map((v, i) => v * (1 - mix) + wr[i] * g * mix)];
  }
  function tapeSpeed(x, spd, start = 0) {   // variable-speed playback (spd: per-sample speed array or number)
    const y = new Float32Array(spd.length); let p = start;
    for (let i = 0; i < y.length; i++) { const j = Math.floor(p), f = p - j; y[i] = j + 1 < x.length ? x[j] * (1 - f) + x[j + 1] * f : 0; p += spd[i]; }
    return y;
  }
  // ---------- BS.1770 loudness: K-weighting, 400 ms blocks, 75% overlap, absolute + relative gates ----------
  function kw(x) {
    const f = (x, b, a) => { const y = new Float32Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < x.length; i++) { const v = x[i], o = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2; x2 = x1; x1 = v; y2 = y1; y1 = o; y[i] = o; } return y; };
    return f(f(x, [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, .73248077421585]), [1, -2, 1], [1, -1.99004745483398, .99007225036621]);
  }
  function lufs(L, Rr) {
    const a = kw(L), b = kw(Rr), B = sec(.4), H = sec(.1), z = [];
    for (let s = 0; s + B <= a.length; s += H) { let e = 0; for (let i = s; i < s + B; i++) e += a[i] * a[i] + b[i] * b[i]; z.push(e / B); }
    const Lk = e => -.691 + 10 * Math.log10(e + 1e-12);
    const g1 = z.filter(e => Lk(e) > -70); if (!g1.length) return -70;
    const m1 = g1.reduce((p, c) => p + c, 0) / g1.length, g2 = g1.filter(e => Lk(e) > Lk(m1) - 10);
    return Lk(g2.reduce((p, c) => p + c, 0) / g2.length);
  }
  // look-ahead peak limiter (gain never exceeds what the peak needs, smooth release)
  function limit(L, Rr, ceil = Math.pow(10, -1.2 / 20)) {
    const n = L.length, Lh = sec(.004), r = new Float32Array(n);
    for (let i = 0; i < n; i++) { const p = Math.max(Math.abs(L[i]), Math.abs(Rr[i])); r[i] = p > ceil ? ceil / p : 1; }
    const m = new Float32Array(n), dq = []; // sliding min over [i, i+Lh]
    for (let i = n - 1; i >= 0; i--) { while (dq.length && r[dq[dq.length - 1]] >= r[i]) dq.pop(); dq.push(i); while (dq[0] > i + Lh) dq.shift(); m[i] = r[dq[0]]; }
    const a = movAvg(m, Lh + 1), rel = 1 - Math.exp(-1 / (SR * .08)); let g = 1;
    for (let i = 0; i < n; i++) { g = Math.min(a[i], g + (1 - g) * rel); L[i] *= g; Rr[i] *= g; }
  }

  // ======================= buses =======================
  let N = 0;
  const bus = () => [new Float32Array(N), new Float32Array(N)];
  function put(b, x, t, g = 1, pan = 0) {   // mono into stereo bus, linear balance pan
    const i0 = sec(t), gl = g * Math.min(1, 1 - pan), gr = g * Math.min(1, 1 + pan);
    for (let i = 0; i < x.length; i++) { const j = i0 + i; if (j < 0) continue; if (j >= N) break; b[0][j] += x[i] * gl; b[1][j] += x[i] * gr; }
  }
  function put2(b, L, Rr, t, g = 1) { const i0 = sec(t); for (let i = 0; i < L.length; i++) { const j = i0 + i; if (j < 0) continue; if (j >= N) break; b[0][j] += L[i] * g; b[1][j] += Rr[i] * g; } }

  // ======================= voices =======================
  const REC = {};   // id -> Float32Array mono 48 kHz (loaded recordings)
  const VOW = [[730, 1090, 2440], [270, 2290, 3010], [530, 1840, 2480], [660, 1720, 2410], [570, 840, 2410], [440, 1020, 2240], [300, 870, 2240], [490, 1350, 1690]];
  // placeholder speech: syllables from the text, formant-filtered pulses (PA) or noise (whisper). Not intelligible.
  function murmurSynth(text, voiced, seed) {
    const r = mulberry(seed), segs = []; let t = .05;
    for (const w of text.split(/\s+/)) {
      const n = Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length);
      for (let k = 0; k < n; k++) { const d = .15 + .09 * r(); segs.push([t, d, VOW[Math.floor(r() * VOW.length)], r() < .5]); t += d + .015; }
      t += /[.?!]$/.test(w) ? .32 : /,$/.test(w) ? .18 : .05;
    }
    const total = sec(t + .1), y = new Float32Array(total), q = text.trim().endsWith('?');
    segs.forEach(([t0, d, F, cons], si) => {
      const n = sec(d + .06); let ex;
      if (voiced) {
        ex = new Float32Array(n); let ph = 0;
        for (let i = 0; i < n; i++) { const prog = (t0 + i / SR) / t, f0 = 205 * (1 - .14 * prog + (q && prog > .8 ? .25 * (prog - .8) * 5 : 0)) * (1 + .01 * Math.sin(i / SR * 31)); ph += f0 / SR; if (ph >= 1) ph -= 1; ex[i] = (ph < .4 ? Math.sin(ph / .4 * Math.PI) : 0) - .25; }
        const g = gauss(n); for (let i = 0; i < n; i++) ex[i] += g[i] * .04;
      } else ex = gauss(n);
      let s = new Float32Array(n);
      F.forEach((f, k) => { const b = biquad(ex, 'bp', f * (voiced ? 1.12 : 1.05), 6 - k, 0), w = [1, .7, .35][k]; for (let i = 0; i < n; i++) s[i] += b[i] * w; });
      const e = envAR(n, .03, .07); for (let i = 0; i < n; i++) s[i] *= e[i];
      if (cons) { const m = sec(.04), c = bp(gauss(m), 2500, 7000); const ce = envAR(m, .004, .03); for (let i = 0; i < m; i++) s[i] += c[i] * ce[i] * (voiced ? .25 : .6); }
      const i0 = sec(t0); for (let i = 0; i < n && i0 + i < total; i++) y[i0 + i] += s[i];
    });
    return norm(y);
  }
  const lineAudio = l => REC[l.id] || murmurSynth(l.text, l.who === 'PA', l.id.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const voiceDur = id => { const l = Story.LINES.find(l => l.id === id); return l ? lineAudio(l).length / SR : 2; };
  function tapewow(x, depth, rate = .55, flutter = .0015) { const spd = new Float32Array(x.length); for (let i = 0; i < x.length; i++) { const t = i / SR; spd[i] = 1 + depth * Math.sin(6.2832 * rate * t) + flutter * Math.sin(6.2832 * 7.3 * t); } return tapeSpeed(x, spd); }
  // ceiling speaker: band-limited, cone resonance, light distortion, big room (far = further and wetter)
  function speaker(x, far = .5, wow = 0) {
    let y = bp(x, 300 + 80 * far, 3900 - 1200 * far, 2); const r2 = bp(y, 1000, 1600, 2); y = y.map((v, i) => v + .5 * r2[i]);
    const m = peakAbs(y) + 1e-9; y = y.map(v => Math.tanh(2.2 * v / m) / Math.tanh(2.2));
    if (wow) y = tapewow(y, wow);
    const pad = new Float32Array(y.length + sec(2.5)); pad.set(y);
    const [wl, wr] = room(pad, pad.slice(), .55 + .3 * far, 1, .6);
    return [pad.map((v, i) => v * (1 - .4 * far) + wl[i] * (.18 + .5 * far)), pad.map((v, i) => v * (1 - .4 * far) + wr[i] * (.18 + .5 * far))];
  }
  // operator whispering close to the mic: low end, breath noise following the voice, compression
  function murmur(x) {
    x = norm(x); const envl = movAvg(x.map(Math.abs), sec(.03)), air = bp(gauss(x.length), 1400, 6000, 2), low = lp(x, 260);
    let y = x.map((v, i) => v * .8 + low[i] * .9 + air[i] * envl[i] * .9 * .35); y = hp(y, 70); y = compress(norm(y), .25, 3); return norm(y);
  }

  // ======================= small generators =======================
  const clack = (d = .08) => { const k = sec(d), n = hp(gauss(k), 1500), y = new Float32Array(k); for (let i = 0; i < k; i++) { const t = i / SR; y[i] = n[i] * Math.exp(-t / .006) + Math.sin(6.2832 * 180 * t) * Math.exp(-t / .02) * .8; } return y; };
  function motor(d, f0, f1) { const k = sec(d), e = envAR(k, .05, d * .6), nz = bp(gauss(k), 800, 3000), y = new Float32Array(k); let p = 0; for (let i = 0; i < k; i++) { p += 6.2832 * lerp(f0, f1, i / k) / SR; y[i] = (Math.sin(p) + .4 * Math.sin(2 * p) + .2 * Math.sin(3 * p)) * e[i] * .3 + nz[i] * .05 * e[i]; } return y; }
  function step(v) { const n = sec(.2), f = 62 + 22 * R(), nl = lp(gauss(n), 320), sq = bp(gauss(n), 900, 2600, 2), g = .25 + .2 * R(), y = new Float32Array(n); for (let i = 0; i < n; i++) { const t = i / SR; y[i] = ((Math.sin(6.2832 * f * t) * Math.exp(-t / .045) + nl[i] * Math.exp(-t / .05) * 1.4) * .8 + sq[i] * Math.exp(-Math.max(t - .025, 0) / .03) * (t > .02 ? g : 0)) * v; } return y; }
  function rustle() { const d = .35 + .25 * R(), n = sec(d), x = bp(gauss(n), 1500, 6500, 2), e = envAR(n, d * .3, d * .5), m = movAvg(gauss(n), 300); return x.map((v, i) => v * e[i] * (.5 + .5 * Math.abs(m[i]) * 8)); }
  function breath(dIn, dOut) {
    const n1 = sec(dIn), n2 = sec(dOut), a = bp(gauss(n1), 900, 2800, 2), b = bp(gauss(n2), 400, 1900, 2), y = new Float32Array(n1 + sec(.08) + n2);
    for (let i = 0; i < n1; i++) y[i] = a[i] * Math.pow(Math.sin(Math.PI * i / n1), 1.5);
    for (let i = 0; i < n2; i++) y[n1 + sec(.08) + i] = b[i] * Math.pow(Math.sin(Math.PI * i / n2), 2) * .7;
    return y;
  }
  const midi = m => 440 * Math.pow(2, (m - 69) / 12);
  // placeholder in-world music: soft electric piano + vibraphone loop, heard through a wall
  function holdMusic(dur) {
    const n = sec(dur), y = new Float32Array(n), B = 60 / 86, BAR = 4 * B;
    const CH = [[48, [64, 67, 71, 74]], [45, [64, 67, 69, 72]], [50, [65, 69, 72, 76]], [43, [65, 67, 71, 74]]];
    const MEL = [[76, 2], [74, 1], [72, 1], [69, 3], [null, 1], [77, 2], [76, 1], [74, 1], [71, 3], [null, 1]];
    const note = (t0, f, d, kind, g) => {   // incremental oscillators + multiplicative envelopes (fast)
      const i0 = sec(t0), k = Math.min(sec(d + .45), n - i0), w = 6.2832 * f / SR;
      const tau = kind === 'ep' ? .7 : kind === 'bass' ? .5 : 1.1, dk = Math.exp(-1 / (SR * tau)), dm = Math.exp(-1 / (SR * .3)), rk = Math.exp(-1 / (SR * .15)), nd = sec(d);
      let e = 1, em = 1, rel = 1;
      for (let i = 0; i < k; i++) { const p = w * i, t = i / SR;
        const v = kind === 'ep' ? Math.sin(p + .6 * Math.sin(2 * p) * em) : kind === 'bass' ? Math.sin(p) : (Math.sin(p) + .15 * Math.sin(4 * p)) * (1 + .25 * Math.sin(34.56 * t));
        y[i0 + i] += v * e * rel * g * (i < 240 ? i / 240 : 1); e *= dk; em *= dm; if (i > nd) rel *= rk; }
    };
    for (let bar = 0; bar * BAR < dur; bar++) {
      const [bass, ch] = CH[bar % 4], t0 = bar * BAR;
      note(t0, midi(bass - 12), B * 1.8, 'bass', .5); note(t0 + 2 * B, midi(bass - 5), B * 1.5, 'bass', .4);
      for (const beat of [1, 3]) ch.forEach((m, k) => note(t0 + beat * B + k * .012, midi(m), B * .6, 'ep', .14));
    }
    let t = 0, k = 0; while (t < dur) { const [m, d] = MEL[k % MEL.length]; if (m) note(t, midi(m), d * B * .9, 'vib', .22); t += d * B; k++; }
    return norm(y);
  }

  // ======================= the soundtrack =======================
  let STEMS = null, GAIN = 1, STATS = {};
  function render() {
    const t0p = performance.now(), S = Story, T = S.T, U = S.unwarp, DUR = S.DUR; R = mulberry(41);
    N = sec(DUR); const music = bus(), fx = bus(), voice = bus(), hiss = bus();
    const recOn = U(T.rollIn) - .25, recOff = U(T.recOff), endT = U(T.endCard[0]);
    const tear = T.tear && [U(T.tear[0]), U(T.tear[1])], hush = T.hush && [U(T.hush[0]), U(T.hush[1])];
    const alive = i => { const t = i / SR; return t > recOn + .25 && t < recOff; };
    // ---------- voices + PA chimes ----------
    const va = new Float32Array(Math.ceil(DUR * 100) + 1);   // voice activity at 100 Hz (ducking)
    const meWin = [];
    for (const l of S.LINES) {
      const t = U(l.t), x = lineAudio(l);
      if (l.who === 'PA') { const [a, b] = speaker(x, l.far ?? CFG.paFar, l.wow || 0), m = Math.max(peakAbs(a), peakAbs(b)) + 1e-9; put2(voice, a.map(v => v / m), b.map(v => v / m), t, CFG.paGain); }
      else { put(voice, murmur(x), t, CFG.meGain, -.05); meWin.push([t, t + x.length / SR]); }
      for (let k = Math.floor(t * 100); k < (t + x.length / SR) * 100 && k < va.length; k++) va[k] = 1;
      if (l.chime != null) {   // two-tone chime through the same speaker; goes flat after a tear
        const tc = U(l.chime), det = tear && tc > tear[0] ? -.55 : 0, c = new Float32Array(sec(2.2));
        [[76 + det, 0], [72 + det, .42]].forEach(([m, dt]) => { const f = midi(m), i0 = sec(dt); for (let i = 0; i + i0 < c.length; i++) { const tt = i / SR; c[i0 + i] += (Math.sin(6.2832 * f * tt) + .2 * Math.sin(6.2832 * f * 4 * tt)) * Math.exp(-tt / .9) * Math.min(1, tt / .003); } });
        const [a, b] = speaker(c, .5), m = Math.max(peakAbs(a), peakAbs(b)) + 1e-9; put2(voice, a.map(v => v / m), b.map(v => v / m), tc, .42);
        for (let k = Math.floor(tc * 100); k < (tc + 1.2) * 100 && k < va.length; k++) va[k] = Math.max(va[k], .6);
      }
    }
    // ducking curve: hold 0.3 s, smooth 0.25 s, about -8 dB
    const vh = new Float32Array(va.length); for (let i = 0; i < va.length; i++) { let m = 0; for (let j = Math.max(0, i - 15); j <= Math.min(va.length - 1, i + 15); j++) m = Math.max(m, va[j]); vh[i] = m; }
    const vs = movAvg(vh, 25), duck = i => 1 - .6 * clamp(vs[Math.min(vs.length - 1, Math.floor(i / SR * 100) + 12)]);
    // ---------- room tone: chosen by the story (Story.SOUND.roomTone) ----------
    // 'fluorescent' = 120 Hz hum + ballast buzz + whine + failing-tube crackle. It gets tiring fast, so use it
    // only when buzzing tubes are part of the story. 'air' = a quiet room: soft low noise, no pitch. null = none.
    const TONE = S.SOUND.roomTone === undefined ? 'air' : S.SOUND.roomTone, FLUO = TONE === 'fluorescent';
    const G = new Float32Array(N); for (let i = 0; i < N; i += 48) { const g = World.globalLight(i / SR); for (let j = i; j < Math.min(N, i + 48); j++) G[j] = g; }   // light level at 1 ms resolution
    if (TONE === 'air') {
      const a = lp(hp(gauss(N), 40), 900, 2), b = lp(hp(gauss(N), 40), 900, 2), sway = i => .8 + .2 * Math.sin(6.2832 * .05 * i / SR);
      for (let i = 0; i < N; i++) { const k = (alive(i) ? 1 : 0) * duck(i) * CFG.airGain * sway(i); fx[0][i] += a[i] * k; fx[1][i] += b[i] * k; }
    }
    if (FLUO) {
    { const hum = new Float32Array(N), sq = new Float32Array(N); let ph = 0;
      for (let i = 0; i < N; i++) { const t = i / SR; ph += 6.2832 * 120 * (1 + .004 * Math.sin(.8168 * t) + .002 * Math.sin(4.461 * t)) / SR;
        hum[i] = Math.sin(ph + 1.3) + .55 * Math.sin(2 * ph + 2.6) + .42 * Math.sin(3 * ph + 3.9) + .22 * Math.sin(4 * ph + 5.2) + .16 * Math.sin(5 * ph + 6.5) + .06 * Math.sin(7 * ph + 9.1);
        sq[i] = (Math.sin(ph) >= 0 ? .3 : -.3); }
      const nz = gauss(N); for (let i = 0; i < N; i++) sq[i] += nz[i] * .05;
      const buzz = bp(sq, 900, 3200, 2);
      for (let i = 0; i < N; i++) { const t = i / SR, k = G[i] * (alive(i) ? 1 : 0) * duck(i) * CFG.humGain, wh = Math.sin(57491 * t + .3 * Math.sin(1.2566 * t)) * .0125;
        fx[0][i] += (hum[i] * .1 + buzz[i] * .025 + wh) * k; const j = Math.max(0, i - 37); fx[1][i] += (hum[j] * .1 + buzz[j] * .025 + wh) * k; }
      for (let k = 0; k < 9; k++) {   // a few failing tubes crackling
        const t0 = 4 + R() * Math.max(1, recOff - 14), n = sec(.4 + R() * .8), z = bp(gauss(n), 1800, 4200, 2), e = envAR(n, .05, .2);
        let gate = 0; const c = z.map((v, i) => { if (i % 480 === 0) gate = R() > .5 ? 1 : 0; return v * gate * e[i]; }); put(fx, c, t0, .018 * CFG.humGain / 1.3, R() * .6 - .3);
      }
    }
    }
    // ---------- tape hiss (kept separately: it is all that remains after REC stops) ----------
    { const h = hp(gauss(N), 3500, 2), h2 = hp(gauss(N), 3500, 2);
      for (let i = 0; i < N; i++) { const t = i / SR, k = (alive(i) ? 1 : 0) + (t > recOff + .25 ? .45 * clamp(1 - (t - endT) / 3.2) : 0); hiss[0][i] = h[i] * CFG.hissGain * k; hiss[1][i] = h2[i] * CFG.hissGain * k; } }
    // ---------- footsteps from the walk (one per stride) ----------
    { let last = 0; for (let t = 0; t < recOff; t += 1 / 120) { const n = Math.floor(Rig.dist(t) / Rig.STRIDE); if (n > last) { last = n; put(fx, step(clamp(Rig.speed(t) / 1.3, .4, 1.1) * (.8 + .3 * R())), t, CFG.stepGain, R() * .3 - .15); } } }
    // ---------- cloth rustle from the camera's turn rate + scripted extras ----------
    { let prev = null, lastR = -9; for (let t = recOn; t < recOff; t += 1 / 30) { const p = Rig.pose(t); if (prev) { const w = Math.abs(p.yaw - prev.yaw) * 30 + Math.abs(p.pitch - prev.pitch) * 30; if (w > .45 && t - lastR > .7) { put(fx, rustle(), t, CFG.rustleGain * clamp(w / 1.2, .4, 1), R() * .6 - .3); lastR = t; } } prev = p; }
      for (const [t, v] of S.SOUND.rustle || []) put(fx, rustle(), U(t), CFG.rustleGain * v, R() * .6 - .3); }
    // ---------- camera mechanics: REC clack + tape motor, zoom servo, autofocus ticks ----------
    put(fx, clack(), recOn, .35); put(fx, motor(.9, 90, 230), recOn + .05, .12); put(fx, clack(), recOff, .45); put(fx, motor(.7, 230, 60), recOff + .03, .14);
    // zoom servo (the Environmental Verification sound): a 1180 Hz motor tone with its octave, chopped by a
    // 92 Hz gear buzz, plus a band of motor noise at 900 Hz; 80 ms smooth ramps in and out.
    // Windows come from Story.SOUND.zoom if given, otherwise from the FOV keyframes.
    { const wins = (S.SOUND.zoom || []).map(([a, b]) => [U(a), U(b)]);
      if (!wins.length) { let z0 = null; for (let t = 0; t <= recOff; t += 1 / 60) { const on = Math.abs(S.FOV(S.warp(t + 1 / 120)) - S.FOV(S.warp(t - 1 / 120))) * 60 > 1.5; if (on && z0 == null) z0 = t; if ((!on || t + 1 / 60 > recOff) && z0 != null) { if (t - z0 > .1) wins.push([z0, t]); z0 = null; } } }
      const k = CFG.zoomGain * 6.6;   // 6.6 maps the original film's levels onto this engine's mix
      for (const [a, b] of wins) {
        const i0 = sec(a), n = sec(b - a), bpf = biquad, nz = new Float32Array(n); for (let i = 0; i < n; i++) nz[i] = R() * 2 - 1;
        const band = bpf(nz, 'bp', 900, 2.5), y = new Float32Array(n); let ph = 0;
        for (let i = 0; i < n; i++) { const t = a + i / SR, z = Math.min(ss(seg(t, a, a + .08)), 1 - ss(seg(t, b - .08, b)));
          ph += 6.2832 * 1180 / SR; const buzz = .6 + .4 * Math.sign(Math.sin(6.2832 * 92 * t));
          y[i] = ((Math.sin(ph) + .35 * Math.sin(ph * 2)) * .0045 * buzz + band[i] * .006) * z * k; }
        for (let i = 0; i < n && i0 + i < N; i++) { fx[0][i0 + i] += y[i]; fx[1][i0 + i] += y[i] * .95; }
      } }
    { let last = -9, prevD = null; for (let t = 0; t < recOff; t += 1 / 60) { const D = 1 / Rig.pose(t).focus; if (prevD != null && Math.abs(D - prevD) * 60 > .35 && t - last > .12) { const k = sec(.012), c = hp(gauss(k), 3000).map((v, i) => v * Math.exp(-i / SR / .002)); for (let j = 0; j < 2 + Math.floor(R() * 3); j++) put(fx, c, t + j * (.04 + R() * .05), .08); last = t; } prevD = D; } }
    // ---------- flickers: ballast tink + arc buzz for tubes, a dry relay click for any other light ----------
    (T.flick || []).map(U).forEach((f, i) => [[f - .03, .5], [f + .1 + i * .02, .8]].forEach(([t0, gg]) => {
      if (!FLUO) { put(fx, clack(.03), t0, .06 * gg); return; }
      const k = sec(.12), z = new Float32Array(k), nz = gauss(k); for (let j = 0; j < k; j++) z[j] = Math.sign(Math.sin(6.2832 * 120 * j / SR)) + nz[j] * .3;
      const zz = bp(z, 1500, 4000), y = new Float32Array(k); for (let j = 0; j < k; j++) { const t = j / SR; y[j] = (Math.sin(6.2832 * 3150 * t) + .6 * Math.sin(6.2832 * 4720 * t)) * Math.exp(-t / .03) * .15 + zz[j] * Math.exp(-t / .04) * .3; }
      put(fx, y, t0, .22 * gg); }));
    // ---------- breath, from the same phase table as the camera ----------
    { let lastC = Math.floor(Rig.breath(0) / 6.2832);
      for (let t = 1; t < recOff - .5; t += 1 / 120) {
        const c = Math.floor(Rig.breath(t) / 6.2832); if (c === lastC) continue; lastC = c;
        if (Rig.hold(t) < .6 || meWin.some(([a, b]) => t > a - .6 && t < b)) continue;
        const per = 6.2832 / Math.max(.5, (Rig.breath(t + .05) - Rig.breath(t - .05)) / .1), g = CFG.breathGain * (.6 + .8 * S.FEAR(S.warp(t)));
        put(br(), breath(per * .3, per * .38), t, g);
      }
      if (hush) put(br(), breath(.15, 1.3), hush[1] + .35, CFG.breathGain * 1.3);   // the long exhale after holding it
      function br() { return fx; }
    }
    // ---------- in-world music through a wall: slows after the tear, stops at musicEnd ----------
    if (CFG.music) {
      const dry = holdMusic(DUR + 12), spd = new Float32Array(N), mEnd = S.SOUND.musicEnd != null ? U(S.SOUND.musicEnd) : DUR;
      for (let i = 0; i < N; i++) { const t = i / SR, base = tear ? lerp(1, .985, seg(t, 0, tear[0])) * lerp(1, .92, seg(t, tear[0], tear[1] + .7)) : 1, depth = tear ? lerp(.002, .013, seg(t, tear[0] - 6, tear[1] + .7)) : .002; spd[i] = base * (1 + depth * Math.sin(6.2832 * .47 * t)); }
      let m = bp(tapeSpeed(dry, spd, sec(8)), 350, 2400, 2);
      for (let i = 0; i < N; i++) { const t = i / SR; m[i] *= clamp(t / 1.2) * (t < mEnd ? 1 : 0) * (G[i] > .5 ? 1 : 0) * (alive(i) ? 1 : 0) * duck(i); }
      const [a, b] = room(m, m.slice(), .8, .75, .7); put2(music, a, b, 0, CFG.musicGain);
    }
    // ---------- low drone (dread bed) ----------
    if (S.SOUND.drone) {
      const [d0, d1] = S.SOUND.drone.map(U), g = gauss(N); let w = 0; const br = new Float32Array(N); for (let i = 0; i < N; i++) { w += g[i] * .01; w *= .9999; br[i] = w; }
      const low = norm(lp(hp(br, 18), 70));
      for (let i = 0; i < N; i++) { const t = i / SR, e = Math.pow(clamp((t - d0) / (d1 - d0)), 1.6) * (t < d1 ? 1 : 0), v = (low[i] * .6 + Math.sin(6.2832 * 41 * t) * .5 + Math.sin(6.2832 * 43.5 * t) * .4) * e * CFG.droneGain * duck(i); music[0][i] += v; music[1][i] += v; }
    }
    for (const e of S.SOUND.extra || []) if (CUSTOM[e.type]) CUSTOM[e.type]({ ...e, t: U(e.t) }, { fx, music, voice, put, put2, gauss, bp, lp, hp, envAR, fade, clack, sec, SR });
    // ---------- tracking tear: everything chopped + a noise burst ----------
    const stems = [music, fx, voice];
    if (tear) {
      const a = sec(tear[0]), b = Math.min(N, sec(tear[1])), gate = new Float32Array(b - a);
      for (let i = 0; i < gate.length; i += 960) { const v = R() > .45 ? 1 : 0; for (let j = i; j < Math.min(gate.length, i + 960); j++) gate[j] = v; }
      const gs = movAvg(gate, 48); for (const s of stems) for (let c = 0; c < 2; c++) for (let i = a; i < b; i++) s[c][i] *= gs[i - a];
      const n1 = bp(gauss(b - a), 300, 7000), n2 = bp(gauss(b - a), 60, 400);
      for (let i = a; i < b; i++) { const u = (i - a) / (b - a), v = n1[i - a] * .12 * Math.pow(Math.sin(Math.PI * u), .5) + n2[i - a] * .08; fx[0][i] += v; fx[1][i] += i - a >= 13 ? n1[i - a - 13] * .12 * Math.pow(Math.sin(Math.PI * u), .5) + n2[i - a] * .08 : v; }
    }
    // ---------- held breath: true digital silence, then every ballast restarting at once ----------
    if (hush) {
      const a = sec(hush[0]), b = sec(hush[1]), f = sec(.004);
      for (const s of [...stems, hiss]) for (let c = 0; c < 2; c++) { for (let i = 0; i < f; i++) s[c][a - f + i] *= 1 - i / f; for (let i = a; i < b; i++) s[c][i] = 0; }
      const k = sec(.5), nz = lp(gauss(k), 500), th = new Float32Array(k), sq = new Float32Array(k); for (let i = 0; i < k; i++) sq[i] = Math.sign(Math.sin(6.2832 * 120 * i / SR)); const sb = bp(sq, 1500, 4000);
      for (let i = 0; i < k; i++) { const t = i / SR; th[i] = Math.sin(6.2832 * 48 * t) * Math.exp(-t / .12) + nz[i] * Math.exp(-t / .05) * .6 + (FLUO ? sb[i] * Math.exp(-t / .08) * .15 : 0); }
      for (let i = 0; i < f * 6; i++) th[i] *= i / (f * 6);   // fade the bed back in without a click
      put(fx, th, hush[1], .34);
    }
    // blank tape after REC stops: only hiss
    { const a = sec(recOff + .25); for (const s of stems) for (let c = 0; c < 2; c++) s[c].fill(0, a); }
    for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) fx[c][i] += hiss[c][i];
    // ---------- loudness: normalise the full mix to target, limit, measure again, correct once ----------
    const sum = () => [0, 1].map(c => { const o = new Float32Array(N); for (const s of stems) for (let i = 0; i < N; i++) o[i] += s[c][i]; return o; });
    const [L0, R0] = sum(), l1 = lufs(L0, R0); let g = Math.pow(10, (CFG.target - l1) / 20);
    const L1 = L0.map(v => v * g), R1 = R0.map(v => v * g); limit(L1, R1); const l2 = lufs(L1, R1); g *= Math.pow(10, (CFG.target - l2) / 20);
    STEMS = { music, fx, voice }; GAIN = g;
    const fm = mixdown({ music: 1, fx: 1, voice: 1 });
    // balance report: speech RMS inside the voice windows vs. the bed
    const win = i => va[Math.min(va.length - 1, Math.floor(i / SR * 100))] >= 1; let sv = 0, nv = 0, sb2 = 0, nb = 0;
    for (let i = 0; i < N; i += 4) { const v = (voice[0][i] + voice[1][i]) * .5 * g, b = ((music[0][i] + fx[0][i]) + (music[1][i] + fx[1][i])) * .5 * g; if (win(i)) { sv += v * v; nv++; sb2 += b * b; nb++; } }
    const db = x => (20 * Math.log10(x + 1e-9)).toFixed(1);
    STATS = { lufs: +lufs(fm[0], fm[1]).toFixed(2), peak: +db(Math.max(peakAbs(fm[0]), peakAbs(fm[1]))), speechRms: +db(Math.sqrt(sv / Math.max(1, nv))), bedRmsUnderSpeech: +db(Math.sqrt(sb2 / Math.max(1, nb))),
      stems: Object.fromEntries(Object.entries(STEMS).map(([k, s]) => [k, +lufs(s[0].map(v => v * g), s[1].map(v => v * g)).toFixed(1)])), ms: Math.round(performance.now() - t0p) };
    console.log('[audio]', JSON.stringify(STATS));
    return STATS;
  }
  // selected stems at the shared gain, limited (sel = {music, fx, voice} truthy flags)
  function mixdown(sel) {
    const L = new Float32Array(N), Rr = new Float32Array(N);
    for (const k of ['music', 'fx', 'voice']) if (sel[k]) { const s = STEMS[k]; for (let i = 0; i < N; i++) { L[i] += s[0][i] * GAIN; Rr[i] += s[1][i] * GAIN; } }
    limit(L, Rr); return [L, Rr];
  }
  function wav(L, Rr) {   // 16-bit 48 kHz stereo
    const n = L.length, buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, clamp(L[i], -1, 1) * 32767, true); v.setInt16(46 + i * 4, clamp(Rr[i], -1, 1) * 32767, true); }
    return new Blob([buf], { type: 'audio/wav' });
  }
  async function loadRecording(id, arrayBuffer) {
    const ac = new OfflineAudioContext(1, 1, SR), b = await ac.decodeAudioData(arrayBuffer);
    const oc = new OfflineAudioContext(1, Math.ceil(b.duration * SR), SR), s = oc.createBufferSource(); s.buffer = b; s.connect(oc.destination); s.start();
    const r = await oc.startRendering(); REC[id] = new Float32Array(r.getChannelData(0)); return REC[id].length / SR;
  }
  return { SR, CFG, CUSTOM, render, mixdown, wav, loadRecording, voiceDur, hasRecording: id => !!REC[id], stats: () => STATS, n: () => N };
})();
