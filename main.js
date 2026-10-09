// ---------- main.js : render loop, playback, UI wiring (reusable as is) ----------
(async () => {
  const { clamp, seg, env, hash, lerp, ss, TUNE } = Util, $ = id => document.getElementById(id);
  const S = Story, U = S.unwarp, status = msg => { $('status').textContent = msg; };
  const cv = $('film'); cv.width = 1920; cv.height = 1080;
  const gl = cv.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, alpha: false });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) { status('This browser cannot run the film: it needs WebGL 2 with float render targets.'); return; }
  try { await Promise.race([Promise.all(["600 42px 'IBM Plex Mono'", "400 16px 'IBM Plex Sans'", "700 16px 'IBM Plex Sans'"].map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]); } catch (e) { }
  status('Building the scene');
  World.init(gl); Post.init(gl); VHS.init(gl); Rig.init(S); Rig.buildExposure(World);
  const overlayTex = () => Util.texture(gl, 2, 2, { internal: gl.RGBA8, format: gl.RGBA, type: gl.UNSIGNED_BYTE, filter: gl.LINEAR });
  const osdTex = overlayTex(), capTex = overlayTex();
  const upload = (tex, canvas) => { gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); };
  let lastCaps = null;
  const NEAR = .03, FAR = 160, recOff = U(S.T.recOff), rollIn = U(S.T.rollIn), tear = S.T.tear && S.T.tear.map(U);

  // ---------- one frame ----------
  // o.caps / o.osd / o.fill override the on-screen toggles (export and PNG use their own checkboxes)
  function renderAt(t, o = {}) {
    const caps = o.caps ?? ui.caps.checked, osd = o.osd ?? ui.osd.checked, fill = (o.fill ?? ui.fill.checked) && !F.busy && cv.width / cv.height > 1.5;
    const tv = Math.min(t, recOff + .02), p = Rig.pose(tv);   // picture freezes when REC stops
    const sw = fill ? 1024 : 720, sh = 540, s = Post.targets(gl, sw, sh);
    const vf = 2 * Math.atan(Math.tan(p.fov * Math.PI / 360) / (4 / 3));
    const VP = Util.mulMat(Util.perspective(vf, sw / sh, NEAR, FAR), Util.viewMatrix(p.pos, Util.camBasis(p.yaw, p.pitch, p.roll)));
    F.VP = VP; F.pose = p;
    gl.bindFramebuffer(gl.FRAMEBUFFER, s.scene.fb); gl.viewport(0, 0, sw, sh);
    const fc = TUNE.fogCol; gl.clearColor(fc[0] * .2, fc[1] * .2, fc[2] * .2, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); World.draw(gl, VP, p.pos, tv); gl.disable(gl.DEPTH_TEST);
    const hf = p.fov * Math.PI / 180, mb = clamp(Math.abs(p.yawRate) / 60 / hf - .004, 0, .03) * Math.sign(-p.yawRate);   // 1/60 s shutter
    Post.run(gl, s, { expo: TUNE.expo * Rig.exposure(tv), focus: p.focus, aper: p.aper, fov: p.fov, near: NEAR, far: FAR, mb });
    if (OSD.draw(t)) upload(osdTex, OSD.canvas);
    if (lastCaps !== caps) { Subs.reset(); lastCaps = caps; }
    if (Subs.draw(t, caps)) upload(capTex, Subs.canvas);
    // tape state
    const tp = S.tape(t); let track = 0, roll = 0;
    if (t < rollIn + .5) { const k = 1 - seg(t, rollIn, rollIn + .5); track = k; roll = k * k * .4; }
    if (tear) { track = Math.max(track, env(t, tear[0], tear[1], .08, .25)); if (t > tear[0] && t < tear[1]) roll = (hash(Math.floor(t * 30) * .7) - .5) * .12 * (1 - seg(t, tear[1] - .2, tear[1])); }
    if (t > recOff) track = Math.max(track, seg(t, recOff, recOff + .15));
    const awb = ss(seg(t, rollIn, rollIn + 1.8)), fear = p.fear;   // white balance settles after power-on
    const u = { res: [cv.width, cv.height], src: [720, 540], frame: Math.floor(t * 30),
      tint: [lerp(.78, 1, awb) * (1 + .02 * fear), lerp(.92, 1, awb) * (1 - .02 * fear), lerp(1.45, .97, awb) * (1 + .04 * Math.sin(t * .31))],
      gain: Rig.gain(tv) + (tp.rec ? 0 : .04), sharp: TUNE.sharp, lumaW: TUNE.lumaW, chromaW: TUNE.chromaW, chromaShift: TUNE.chromaShift, sat: TUNE.sat,
      jitter: TUNE.jitter * (1 + fear), track, roll, barrel: TUNE.barrel, vig: TUNE.vig, black: TUNE.black, smear: TUNE.smear,
      dropout: TUNE.dropout * (.35 + 1.4 * fear + (tear && t > tear[0] - 1 && t < tear[1] + 2 ? 2 : 0)), off: tp.off, snow: tp.snow ? 1 : 0,
      uPad: fill ? (1024 / 720 - 1) / 2 : 0, overscan: fill ? .04 : 0, osdOn: osd ? 1 : 0, capOn: 1, skew: clamp(p.yawRate * .0035, -.012, .012), scan: TUNE.scan };
    VHS.run(gl, { tScene: s.out.color, tOSD: osdTex, tCap: capTex }, u, { fb: null, w: cv.width, h: cv.height });
  }

  // ---------- UI ----------
  const ui = { caps: $('caps'), osd: $('osd'), fill: $('fill') };
  const F = window.__film = { canvas: cv, renderAt, TUNE, Story: S, World, Rig, Snd, Exporter, Mux, ready: false, busy: false, dirty: true, t: 0,
    project: p3 => { const r = Util.project(F.VP, p3); return { ndc: r, inFront: r[3] > 0 }; } };
  const scrub = $('scrub'), tc = $('tc'), play = $('play');
  scrub.max = S.DUR; scrub.step = 1 / 30;
  const fmt = t => { const m = Math.floor(t / 60), s = t - m * 60; return `${m}:${s.toFixed(2).padStart(5, '0')}`; };
  let ac = null, srcNode = null, playing = false, t0 = 0, buf = null;
  const setT = t => { F.t = clamp(t, 0, S.DUR); scrub.value = F.t; tc.textContent = `${fmt(F.t)} / ${fmt(S.DUR)}`; F.dirty = true; };
  function stopAudio() { if (srcNode) { try { srcNode.stop(); } catch (e) { } srcNode.disconnect(); srcNode = null; } }
  function makeBuffer() { const [L, Rr] = Snd.mixdown({ music: 1, fx: 1, voice: 1 }); ac = ac || new AudioContext({ sampleRate: 48000 }); buf = ac.createBuffer(2, L.length, 48000); buf.copyToChannel(L, 0); buf.copyToChannel(Rr, 1); }
  async function startAudio() { if (!buf) return; await ac.resume(); stopAudio(); srcNode = ac.createBufferSource(); srcNode.buffer = buf; srcNode.connect(ac.destination); srcNode.start(0, F.t); t0 = ac.currentTime - F.t; }
  async function toggle() {
    if (!F.ready || F.busy) return;
    playing = !playing; play.textContent = playing ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', playing);
    if (playing) { if (F.t >= S.DUR - .05) setT(0); await startAudio(); } else stopAudio();
  }
  play.onclick = toggle;
  scrub.oninput = () => { setT(+scrub.value); if (playing) startAudio(); };
  for (const k of ['caps', 'osd', 'fill']) ui[k].onchange = () => F.dirty = true;
  addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range' && e.target.type !== 'checkbox' && e.target.type !== 'radio') return;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { if (e.target === scrub) return; e.preventDefault(); setT(F.t + (e.code === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 5 : 1 / 30)); if (playing) startAudio(); }
  });
  function loop() {
    if (!F.busy) {
      if (playing && ac) { const t = ac.currentTime - t0; if (t >= S.DUR) { setT(S.DUR); playing = false; play.textContent = 'Play'; stopAudio(); } else setT(t); }
      if (F.dirty) { F.dirty = false; renderAt(F.t); }
    }
    requestAnimationFrame(loop);
  }
  // export panel
  const ex = () => ({ frame: document.querySelector('input[name=frame]:checked').value, stems: { music: $('st-music').checked, fx: $('st-fx').checked, voice: $('st-voice').checked },
    caps: $('ex-caps').checked, osd: $('ex-osd').checked, sound: $('ex-sound').value });
  const hint = async () => { $('ex-hint').textContent = await Exporter.describe(ex().frame, ex().sound) + ' Save frame (PNG) uses the captions and camera display boxes here.'; };
  document.querySelectorAll('#export input, #export select').forEach(el => el.addEventListener('change', hint));
  const bar = $('progress'), exStatus = $('ex-status');
  const busyUI = on => { ['export-mp4', 'save-wav', 'save-png', 'play'].forEach(id => $(id).disabled = on); };
  $('export-mp4').onclick = async () => {
    const o = ex(); if (!o.stems.music && !o.stems.fx && !o.stems.voice) { exStatus.textContent = 'Pick at least one sound stem, or the file will be silent.'; }
    if (playing) await toggle(); busyUI(true); bar.hidden = false; bar.value = 0;
    try { const r = await Exporter.exportMP4({ ...o, onProgress: (f, m) => { bar.value = f; exStatus.textContent = m; } }); exStatus.textContent = `Saved ${r.name} (${(r.size / 1048576).toFixed(1)} MB, ${r.video} video, ${r.sound} sound).`; }
    catch (e) { console.error(e); exStatus.textContent = 'Export stopped: ' + e.message; }
    finally { busyUI(false); bar.hidden = true; }
  };
  $('save-wav').onclick = async () => { const n = await Exporter.saveWav(ex().stems); exStatus.textContent = `Saved ${n}.`; };
  $('save-png').onclick = async () => { const o = ex(), n = await Exporter.savePNG(F.t, { caps: o.caps, osd: o.osd, fill: ui.fill.checked }); exStatus.textContent = `Saved ${n}.`; };
  // voice recordings + cue sheet
  function cueSheet() {
    $('cues').innerHTML = S.LINES.map(l => `<tr><td class="mono">${fmt(U(l.t))}</td><td>${l.who === 'PA' ? 'PA speaker' : 'Operator'}</td><td class="mono">${l.id}</td><td>${l.text}</td><td>${Snd.hasRecording(l.id) ? 'Recording' : 'Placeholder'} <span class="mono dim">${Snd.voiceDur(l.id).toFixed(1)} s</span></td></tr>`).join('');
  }
  $('voices').onchange = async e => {
    const files = [...e.target.files], ids = new Set(S.LINES.map(l => l.id)); let n = 0; const skipped = [];
    status('Loading recordings');
    for (const f of files) { const id = f.name.replace(/\.[^.]+$/, ''); if (!ids.has(id)) { skipped.push(f.name); continue; } try { await Snd.loadRecording(id, await f.arrayBuffer()); n++; } catch (err) { skipped.push(f.name); } }
    await rebuildSound(); cueSheet();
    status(`Loaded ${n} recording${n === 1 ? '' : 's'}.` + (skipped.length ? ` Skipped ${skipped.join(', ')}: name each file after its line id (for example ${S.LINES[0].id}.wav).` : ''));
  };
  async function rebuildSound() {
    const was = playing; if (playing) await toggle();
    status('Building the soundtrack'); await new Promise(r => setTimeout(r, 30));
    const st = Snd.render(); Subs.build(Snd.voiceDur); Subs.reset(); makeBuffer(); F.dirty = true;
    $('mixinfo').textContent = `Mix ${st.lufs} LUFS, peak ${st.peak} dBFS. Speech ${st.speechRms} dB against bed ${st.bedRmsUnderSpeech} dB.`;
    if (was) toggle();
    return st;
  }
  setT(0); renderAt(0); requestAnimationFrame(loop);
  await rebuildSound(); cueSheet(); hint();
  F.ready = true; play.disabled = false; status('Ready. Space plays and pauses; arrow keys step a frame, Shift for five seconds.');
})();
