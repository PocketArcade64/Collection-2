// ---------- export.js : WebCodecs MP4 export, MediaRecorder fallback, WAV, PNG, save (reusable as is) ----------
const Exporter = (() => {
  const u8of = x => ArrayBuffer.isView(x) ? new Uint8Array(x.buffer, x.byteOffset, x.byteLength).slice() : new Uint8Array(x).slice();
  const VCODECS = ['avc1.640028', 'avc1.4d0028', 'avc1.42e028', 'vp09.00.40.08'];
  const isApple = /Mac|iPhone|iPad/.test(navigator.platform || '') || /Macintosh|iPhone|iPad/.test(navigator.userAgent);
  const vcfg = (codec, w, h) => ({ codec, width: w, height: h, bitrate: 14e6, framerate: 30, ...(codec.startsWith('avc') ? { avc: { format: 'avc' } } : {}) });
  async function pickVideo(w, h) {
    if (typeof VideoEncoder === 'undefined') return null;
    for (const c of VCODECS) { try { const r = await VideoEncoder.isConfigSupported(vcfg(c, w, h)); if (r.supported) return c; } catch (e) { } }
    return null;
  }
  async function aacOK() {
    if (typeof AudioEncoder === 'undefined') return false;
    try { return (await AudioEncoder.isConfigSupported({ codec: 'mp4a.40.2', sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 })).supported; } catch (e) { return false; }
  }
  async function resolveSound(pref) { if (pref === 'pcm') return 'pcm'; if (pref === 'aac') return (await aacOK()) ? 'aac' : 'pcm'; return isApple ? 'pcm' : (await aacOK()) ? 'aac' : 'pcm'; }
  const vName = c => c ? (c.startsWith('avc') ? 'H.264' : 'VP9') : 'none';
  const sName = s => s === 'aac' ? 'AAC' : 'uncompressed PCM';
  // what this browser will produce, before exporting
  async function describe(frame, soundPref) { const [w, h] = frame === '4x3' ? [1440, 1080] : [1920, 1080]; const v = await pickVideo(w, h), s = await resolveSound(soundPref); return v ? `This browser will make ${vName(v)} video with ${sName(s)} sound.` : 'This browser has no WebCodecs video encoder: export records in real time instead (MP4 or WebM, depending on the browser).'; }

  async function save(filename, blob) {
    if (window.__saveHook) return window.__saveHook(filename, blob);   // test harness
    try { if (window.claude && window.claude.use) { const d = await window.claude.use('downloads'); if (d && d.save) { await d.save({ filename, data: blob }); return; } } } catch (e) { console.warn('downloads capability unavailable, using a link', e); }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 5000);
  }
  function suffix(o) {
    return (o.frame === '4x3' ? '-4x3' : '') + (o.osd ? '' : '-noosd') + (o.caps ? '-captions' : '') + ['music', 'fx', 'voice'].filter(k => !o.stems[k]).map(k => '-no' + k).join('');
  }
  async function encodeAudio(L, Rr, sound) {
    const SR = 48000, n = L.length;
    if (sound === 'pcm') { const pcm = new Int16Array(n * 2); for (let i = 0; i < n; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, L[i])) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, Rr[i])) * 32767; } return { kind: 'audio', codec: 'pcm', sampleRate: SR, channels: 2, pcm }; }
    const out = []; let asc = null, err = null;
    const enc = new AudioEncoder({ output: (c, m) => { const d = new Uint8Array(c.byteLength); c.copyTo(d); const r = Mux.adts(d); if (!asc && m && m.decoderConfig && m.decoderConfig.description) asc = u8of(m.decoderConfig.description); asc = asc || r.asc; out.push({ data: r.payload, dur: 1024 }); }, error: e => err = e });
    enc.configure({ codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: 2, bitrate: 192000, aac: { format: 'aac' } });
    for (let s = 0; s < n; s += 4800) {
      const k = Math.min(4800, n - s), d = new Float32Array(k * 2); d.set(L.subarray(s, s + k), 0); d.set(Rr.subarray(s, s + k), k);
      enc.encode(new AudioData({ format: 'f32-planar', sampleRate: SR, numberOfFrames: k, numberOfChannels: 2, timestamp: Math.round(s / SR * 1e6), data: d }));
    }
    await enc.flush(); enc.close(); if (err) throw err;
    if (!asc) asc = new Uint8Array([0x11, 0x90]);
    if (out.length * 1024 < n - 2048) throw new Error(`the AAC encoder returned ${(out.length * 1024 / SR).toFixed(1)} s of ${(n / SR).toFixed(1)} s; try Sound format: uncompressed PCM`);
    return { kind: 'audio', codec: 'aac', sampleRate: SR, channels: 2, timescale: SR, asc, samples: out, bitrate: 192000 };
  }
  // o = { frame:'16x9'|'4x3', stems:{music,fx,voice}, caps, osd, sound:'auto'|'pcm'|'aac', frames?(test), onProgress }
  async function exportMP4(o) {
    const F = window.__film, cv = F.canvas, [w, h] = o.frame === '4x3' ? [1440, 1080] : [1920, 1080];
    const codec = await pickVideo(w, h); if (!codec) return realtime(o);
    const sound = await resolveSound(o.sound), fps = 30, total = Math.round(Story.DUR * fps), n = o.frames ? Math.min(o.frames, total) : total;
    const ow = cv.width, oh = cv.height; cv.width = w; cv.height = h; F.busy = true;
    try {
      const samples = []; let desc = null, err = null;
      const enc = new VideoEncoder({ output: (c, m) => { const d = new Uint8Array(c.byteLength); c.copyTo(d); if (!desc && m && m.decoderConfig && m.decoderConfig.description) desc = u8of(m.decoderConfig.description); samples.push({ data: d, dur: 1000, key: c.type === 'key' }); }, error: e => err = e });
      enc.configure(vcfg(codec, w, h));
      for (let i = 0; i < n; i++) {
        if (err) throw err;
        F.renderAt(i / fps, { caps: o.caps, osd: o.osd, fill: false });
        const fr = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
        enc.encode(fr, { keyFrame: i % 60 === 0 }); fr.close();
        while (enc.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 2));
        if (i % 10 === 0) { o.onProgress && o.onProgress(i / n, `Rendering frame ${i + 1} of ${n}`); await new Promise(r => setTimeout(r, 0)); }
      }
      await enc.flush(); enc.close(); if (err) throw err;
      o.onProgress && o.onProgress(1, 'Encoding sound');
      let [L, Rr] = Snd.mixdown(o.stems); const an = Math.round(n / fps * 48000); L = L.subarray(0, an); Rr = Rr.subarray(0, an);
      const audio = await encodeAudio(L, Rr, sound);
      const video = codec.startsWith('avc') ? { kind: 'video', codec: 'avc', width: w, height: h, timescale: 30000, description: desc, samples } : { kind: 'video', codec: 'vp9', width: w, height: h, timescale: 30000, samples };
      if (video.codec === 'avc' && !desc) throw new Error('the H.264 encoder gave no decoder configuration');
      const bytes = Mux.build([video, audio]), blob = new Blob([bytes], { type: 'video/mp4' });
      const name = `${Story.SLUG}${suffix(o)}.mp4`; await save(name, blob);
      return { name, size: blob.size, video: vName(codec), sound: sName(sound), frames: n };
    } finally { cv.width = ow; cv.height = oh; F.busy = false; F.dirty = true; }
  }
  // fallback: record the canvas and the soundtrack in real time
  async function realtime(o) {
    const F = window.__film, cv = F.canvas, ac = new AudioContext({ sampleRate: 48000 });
    const [L, Rr] = Snd.mixdown(o.stems), buf = ac.createBuffer(2, L.length, 48000); buf.copyToChannel(L, 0); buf.copyToChannel(Rr, 1);
    const src = ac.createBufferSource(); src.buffer = buf; const dst = ac.createMediaStreamDestination(); src.connect(dst);
    const stream = new MediaStream([...cv.captureStream(30).getVideoTracks(), ...dst.stream.getAudioTracks()]);
    const mime = ['video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || '';
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 14e6 }), parts = []; rec.ondataavailable = e => e.data.size && parts.push(e.data);
    await ac.resume();   // a suspended context records silence
    const done = new Promise(r => rec.onstop = r); rec.start(250); const t0 = ac.currentTime; src.start();
    F.busy = true;
    await new Promise(res => { const tick = () => { const t = ac.currentTime - t0; if (t >= Story.DUR) return res(); F.renderAt(t, { caps: o.caps, osd: o.osd, fill: false }); o.onProgress && o.onProgress(t / Story.DUR, 'Recording in real time'); requestAnimationFrame(tick); }; tick(); });
    rec.stop(); await done; F.busy = false; F.dirty = true; ac.close();
    const ext = mime.includes('mp4') ? 'mp4' : 'webm', blob = new Blob(parts, { type: mime || 'video/webm' }), name = `${Story.SLUG}${suffix(o)}-realtime.${ext}`;
    await save(name, blob); return { name, size: blob.size, video: 'browser recording', sound: 'browser recording' };
  }
  async function saveWav(stems) { const [L, Rr] = Snd.mixdown(stems); const name = `${Story.SLUG}-soundtrack${['music', 'fx', 'voice'].filter(k => !stems[k]).map(k => '-no' + k).join('')}.wav`; await save(name, Snd.wav(L, Rr)); return name; }
  async function savePNG(t, o) {
    const F = window.__film; F.renderAt(t, o);
    const blob = await new Promise(r => F.canvas.toBlob(r, 'image/png')); F.dirty = true;
    const m = Math.floor(t / 60), s = (t - m * 60).toFixed(2).padStart(5, '0');
    const name = `${Story.SLUG}-${m}m${s}s${o.fill ? '-fill16x9' : ''}${o.osd ? '' : '-noosd'}${o.caps ? '' : '-nocaps'}.png`;
    await save(name, blob); return name;
  }
  return { exportMP4, saveWav, savePNG, describe, save, pickVideo, resolveSound };
})();
