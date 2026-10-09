// ---------- mux.js : MP4 writer (reusable as is) ----------
// Video: avc1 (avcC from the encoder's decoderConfig.description) or vp09 (vpcC built by hand).
// Audio: AAC (mp4a + esds with the AudioSpecificConfig) or uncompressed PCM (QuickTime 'sowt',
// 16-bit little-endian, one 4-byte stereo frame per sample, 4800 frames per chunk).
// One sample per chunk (PCM: 4800 frames per chunk), chunks interleaved by time, moov written before
// mdat (built once to measure, then again with the real offsets). Brand 'qt  ' when the file carries PCM.
const Mux = (() => {
  const enc = new TextEncoder();
  function box(type, ...parts) {
    const body = parts.flat(Infinity).filter(p => p != null), size = 8 + body.reduce((s, p) => s + p.length, 0), out = new Uint8Array(size), v = new DataView(out.buffer);
    v.setUint32(0, size); out.set(enc.encode(type), 4); let o = 8; for (const p of body) { out.set(p, o); o += p.length; } return out;
  }
  const full = (type, ver, flags, ...parts) => box(type, u8(ver), u24(flags), ...parts);
  const u8 = n => new Uint8Array([n & 255]);
  const u16 = n => new Uint8Array([(n >> 8) & 255, n & 255]);
  const u24 = n => new Uint8Array([(n >> 16) & 255, (n >> 8) & 255, n & 255]);
  const u32 = n => { const a = new Uint8Array(4); new DataView(a.buffer).setUint32(0, n >>> 0); return a; };
  const str = s => enc.encode(s);
  const zeros = n => new Uint8Array(n);
  const MATRIX = [0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000].map(u32);

  // tracks: [{ kind:'video', codec:'avc'|'vp9', width, height, timescale, samples:[{data, dur, key}] , description },
  //          { kind:'audio', codec:'aac'|'pcm', sampleRate, channels, samples:[{data, dur}] (aac) | pcm: Int16Array interleaved, asc }]
  function build(tracks, { major } = {}) {
    // ---- chunk list ----
    const chunks = [];   // {track, data, time, samples:[sizes...], n}
    tracks.forEach((tr, ti) => {
      tr.id = ti + 1; tr.chunks = [];
      if (tr.codec === 'pcm') {
        const per = 4800, fr = tr.pcm.length / tr.channels;
        for (let s = 0; s < fr; s += per) { const n = Math.min(per, fr - s), d = new Uint8Array(tr.pcm.buffer, tr.pcm.byteOffset + s * tr.channels * 2, n * tr.channels * 2); const c = { tr, data: d, time: s / tr.sampleRate, n }; tr.chunks.push(c); chunks.push(c); }
        tr.duration = fr; tr.timescale = tr.sampleRate;
      } else {
        let t = 0; for (const s of tr.samples) { const c = { tr, data: s.data, time: t / tr.timescale, n: 1, s }; tr.chunks.push(c); chunks.push(c); t += s.dur; }
        tr.duration = t;
      }
    });
    chunks.sort((a, b) => a.time - b.time || a.tr.id - b.tr.id);
    const pcm = tracks.some(t => t.codec === 'pcm');
    const ftyp = pcm ? box('ftyp', str('qt  '), u32(0x200), str('qt  '), str('isom')) : box('ftyp', str(major || 'isom'), u32(0x200), str('isom'), str('iso2'), str('avc1'), str('mp41'));
    const mdatSize = 8 + chunks.reduce((s, c) => s + c.data.length, 0);
    const moovFor = base => { let o = base + 8; for (const c of chunks) { c.offset = o; o += c.data.length; } return moov(tracks); };
    let mv = moovFor(ftyp.length + 1e6);            // measure
    mv = moovFor(ftyp.length + mv.length);           // real offsets
    const out = new Uint8Array(ftyp.length + mv.length + mdatSize); let o = 0;
    out.set(ftyp, o); o += ftyp.length; out.set(mv, o); o += mv.length;
    new DataView(out.buffer).setUint32(o, mdatSize); out.set(str('mdat'), o + 4); o += 8;
    for (const c of chunks) { out.set(c.data, o); o += c.data.length; }
    return out;
  }
  function moov(tracks) {
    const MT = 1000, dur = Math.max(...tracks.map(t => Math.round(t.duration / t.timescale * MT)));
    const mvhd = full('mvhd', 0, 0, u32(0), u32(0), u32(MT), u32(dur), u32(0x10000), u16(0x100), zeros(10), MATRIX, zeros(24), u32(tracks.length + 1));
    return box('moov', mvhd, tracks.map(t => trak(t, MT)));
  }
  function trak(t, MT) {
    const vid = t.kind === 'video', d = Math.round(t.duration / t.timescale * MT);
    const tkhd = full('tkhd', 0, 3, u32(0), u32(0), u32(t.id), u32(0), u32(d), zeros(8), u16(0), u16(0), u16(vid ? 0 : 0x100), u16(0), MATRIX, u32((vid ? t.width : 0) << 16), u32((vid ? t.height : 0) << 16));
    const mdhd = full('mdhd', 0, 0, u32(0), u32(0), u32(t.timescale), u32(t.duration), u16(0x55c4), u16(0));
    const hdlr = full('hdlr', 0, 0, u32(0), str(vid ? 'vide' : 'soun'), zeros(12), str(vid ? 'VideoHandler' : 'SoundHandler'), zeros(1));
    const mhd = vid ? full('vmhd', 0, 1, zeros(8)) : full('smhd', 0, 0, zeros(4));
    const dinf = box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1)));
    return box('trak', tkhd, box('mdia', mdhd, hdlr, box('minf', mhd, dinf, stbl(t))));
  }
  function stbl(t) {
    const vid = t.kind === 'video';
    let entry;
    if (vid) {
      const vis = [zeros(6), u16(1), zeros(16), u16(t.width), u16(t.height), u32(0x480000), u32(0x480000), u32(0), u16(1), zeros(32), u16(0x18), u16(0xffff)];
      if (t.codec === 'avc') entry = box('avc1', vis, box('avcC', t.description));
      else entry = box('vp09', vis, full('vpcC', 1, 0, u8(0), u8(40), u8((8 << 4) | (1 << 1) | 0), u8(1), u8(1), u8(1), u16(0)));
    } else if (t.codec === 'aac') {
      const asc = t.asc, dsi = [u8(5), u8(asc.length), asc];
      const dcd = [u8(4), u8(13 + 2 + asc.length), u8(0x40), u8(0x15), u24(0), u32(t.bitrate || 192000), u32(t.bitrate || 192000), dsi];
      const esd = [u8(3), u8(3 + 2 + 13 + 2 + asc.length + 3), u16(1), u8(0), dcd, u8(6), u8(1), u8(2)];
      entry = box('mp4a', zeros(6), u16(1), zeros(8), u16(t.channels), u16(16), u16(0), u16(0), u32(t.sampleRate << 16), full('esds', 0, 0, esd));
    } else {
      entry = box('sowt', zeros(6), u16(1), u16(0), u16(0), u32(0), u16(t.channels), u16(16), u16(0), u16(0), u32(t.sampleRate << 16));
    }
    const stsd = full('stsd', 0, 0, u32(1), entry);
    let stts, stsz, stsc, stss = null;
    if (t.codec === 'pcm') {
      stts = full('stts', 0, 0, u32(1), u32(t.duration), u32(1));
      stsz = full('stsz', 0, 0, u32(t.channels * 2), u32(t.duration));
      const last = t.chunks[t.chunks.length - 1].n, n = t.chunks.length, ent = [[1, 4800]]; if (last !== 4800 && n > 1) ent.push([n, last]); else if (n === 1) ent[0][1] = last;
      stsc = full('stsc', 0, 0, u32(ent.length), ent.map(([c, s]) => [u32(c), u32(s), u32(1)]));
    } else {
      const runs = []; for (const s of t.samples) { const r = runs[runs.length - 1]; if (r && r[1] === s.dur) r[0]++; else runs.push([1, s.dur]); }
      stts = full('stts', 0, 0, u32(runs.length), runs.map(([c, d]) => [u32(c), u32(d)]));
      stsz = full('stsz', 0, 0, u32(0), u32(t.samples.length), t.samples.map(s => u32(s.data.length)));
      stsc = full('stsc', 0, 0, u32(1), u32(1), u32(1), u32(1));
      if (vid) { const k = t.samples.map((s, i) => s.key ? i + 1 : 0).filter(Boolean); stss = full('stss', 0, 0, u32(k.length), k.map(u32)); }
    }
    const stco = full('stco', 0, 0, u32(t.chunks.length), t.chunks.map(c => u32(c.offset)));
    return box('stbl', stsd, stts, stss, stsc, stsz, stco);
  }
  // AAC helpers: strip ADTS headers and rebuild the AudioSpecificConfig from the header if needed
  function adts(data) {
    if (data.length > 7 && data[0] === 0xff && (data[1] & 0xf0) === 0xf0) {
      const prot = data[1] & 1, prof = ((data[2] >> 6) & 3) + 1, sfi = (data[2] >> 2) & 15, ch = ((data[2] & 1) << 2) | (data[3] >> 6);
      return { payload: data.subarray(prot ? 7 : 9), asc: new Uint8Array([(prof << 3) | (sfi >> 1), ((sfi & 1) << 7) | (ch << 3)]) };
    }
    return { payload: data, asc: null };
  }
  return { build, adts };
})();
