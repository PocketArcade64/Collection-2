// ---------- rig.js : handheld camcorder operator (reusable as is) ----------
// Sums handheld layers on top of the story keyframes: gait, breathing, tremor, hand wander, stabiliser
// overcorrection, held breath. Stateful parts (breath phase, focus spring, auto exposure) are simulated
// once into 120 Hz tables, so playback, scrubbing and export are pure functions of t.
const Rig = (() => {
  const { clamp, lerp, env, vnoise, hash, table, mulberry } = Util;
  const STRIDE = .72, TAU = Math.PI * 2;
  let S, dist, breathPh, focusD, expo = () => 1, agcGain = () => .032, stabs = [];
  const nz = (t, f, s) => vnoise(t * f + s * 17.3) - .5;

  function holdK(t) { const T = S.T, u = S.warp(t); return T.hush ? 1 - env(u, T.hush[0] - .12, T.hush[1] + .3, .1, .35) : 1; }
  const speed = t => (dist(t + .12) - dist(t - .12)) / .24;

  function init(story) {
    S = story; const D = S.DUR;
    dist = t => S.WALK(S.warp(t));
    // breathing: ~0.27 Hz calm, faster with fear, frozen while holding breath (shared with audio)
    breathPh = table(D, (t, dt, st) => { const p = (st || 0) + dt * TAU * (.27 + .28 * S.FEAR(S.warp(t))) * (.15 + .85 * holdK(t)); return { v: p, state: p }; });
    // autofocus: 2nd-order spring in dioptres, zeta 0.42 for overshoot
    focusD = table(D, (t, dt, st) => {
      st = st || { x: 1 / S.FOCUS(0), v: 0 };
      const tgt = 1 / S.FOCUS(S.warp(t)), w = TAU * 1.7, z = .42;
      st.v += (w * w * (tgt - st.x) - 2 * z * w * st.v) * dt; st.x += st.v * dt; return { v: st.x, state: st };
    });
    // electronic stabiliser overcorrection: small impulses that decay in ~0.1 s
    const R = mulberry(7); stabs = []; for (let t = 1.5; t < D; t += 2.5 + R() * 3.5) stabs.push([t, (R() - .5) * 2, (R() - .5) * 2]);
  }
  const stab = (t, k) => { let s = 0; for (const e of stabs) { const d = t - e[0]; if (d > 0 && d < .5) s += e[k] * Math.exp(-d / .1); } return s; };

  function baseYaw(t) { const u = S.warp(t), s = dist(t); return S.P.heading(s) + S.YAWOFF(u); }

  function pose(t) {
    const u = S.warp(t), s = dist(t), a = S.P.at(s);
    let yaw = baseYaw(t), pitch = S.PITCH(u), roll = 0;
    const sp = speed(t), amp = clamp(sp / 1.25), ph = s / STRIDE * Math.PI, fear = S.FEAR(u), hold = holdK(t);
    const br = Math.sin(breathPh(t)), f2 = fear * fear;
    let y = 1.56 + S.CAMH(u);
    y += .032 * amp * (Math.abs(Math.sin(ph)) - .6);                 // bob at twice the step rate
    const sway = .018 * amp * Math.sin(ph);                            // sway at the step rate
    // tremor (~7 Hz, follows fear squared) + hand wander (~0.3 Hz) + breathing
    const trem = (k) => (nz(t, 7.1, k) + .5 * nz(t, 13.3, k + 9)) * f2;
    pitch += (nz(t, 1.1, 1) * .016 + nz(t, .31, 11) * .02 + nz(t, 3.7, 2) * .005 * (1 + 2 * fear) + trem(3) * .006 + br * .006 + stab(t, 1) * .004) * hold;
    yaw += (nz(t, .9, 4) * .018 + nz(t, .27, 12) * .022 + nz(t, 3.3, 5) * .005 * (1 + 2 * fear) + trem(5) * .006 + .011 * amp * Math.sin(ph) + stab(t, 2) * .004) * hold;
    roll = (nz(t, .6, 6) * .035 + .014 * amp * Math.sin(ph) + trem(7) * .004) * hold + .012;
    y += br * .006 * hold;
    // looking down: camera comes lower and the arm reaches forward
    const down = clamp(-pitch - .4, 0, 1), rx = Math.cos(yaw), rz = -Math.sin(yaw), fx = -Math.sin(yaw), fz = -Math.cos(yaw), reach = down * .22;
    const yawRate = (baseYaw(t + .03) - baseYaw(t - .03)) / .06;
    return {
      pos: [a.x + rx * sway * hold + fx * reach, y - down * .16, a.z + rz * sway * hold + fz * reach], yaw, pitch, roll,
      fov: S.FOV(u), focus: 1 / Math.max(.02, focusD(t)), aper: S.APER(u), fear, speed: sp, phase: ph, hold, yawRate, breath: breathPh(t),
    };
  }

  // ---------- auto exposure: estimate what the lens sees from the emitters, lagged spring, capped ----------
  function buildExposure(world) {
    const D = S.DUR, R = 30, n = Math.ceil(D * R) + 1, L = new Float32Array(n);
    for (let i = 0; i < n; i++) L[i] = world.lensLuma(pose(i / R), i / R);
    const sorted = Array.from(L).sort((a, b) => a - b), med = sorted[n >> 1] || 1;
    const Lat = t => { const f = clamp(t * R, 0, n - 1.001), i = Math.floor(f); return lerp(L[i], L[i + 1], f - i); };
    expo = table(D, (t, dt, st) => {
      const tgt = Math.log(clamp(Math.pow(med / Math.max(1e-4, Lat(t)), .7), .55, Util.TUNE.maxExp));
      st = st ?? tgt; const k = tgt > st ? .45 : .2;                  // brightens slowly, darkens faster
      st += (tgt - st) * (1 - Math.exp(-dt / k)); return { v: Math.exp(st), state: st };
    });
  }
  // AGC noise: pumps with exposure and fear
  const gain = t => .032 + .07 * Math.max(0, Math.log2(expo(t))) + .012 * S.FEAR(S.warp(t));

  return { init, pose, buildExposure, exposure: t => expo(t), gain, speed: t => speed(t), dist: t => dist(t), breath: t => breathPh(t), hold: holdK, STRIDE };
})();
