// ---------- subs.js : CEA-608 style captions + end card (reusable as is) ----------
// Monospaced white text in a solid black box per row, at most 32 characters a row, on a 1440x1080 canvas
// that maps onto the 4:3 picture. The bottom of the last row sits at y 896, clear of the time and date.
// Caption content comes from story.js (CAPTIONS); hold times come from the real voice durations.
const Subs = (() => {
  const W = 1440, H = 1080, COLS = 32, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const FONT = "'IBM Plex Mono', 'Courier New', monospace";
  let CAPS = [], lastKey = '';
  function wrap(s) { const out = []; let cur = ''; for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (t.length > COLS && cur) { out.push(cur); cur = w; } else cur = t; } if (cur) out.push(cur); return out; }
  // dur(id) = spoken length of a line in seconds
  function build(dur) {
    // CAPTIONS are written in original time (like every story key) and mapped to film time here
    const S = Story, L = Object.fromEntries(S.LINES.map(l => [l.id, l.t]));
    const end = (id, pad = .6, min = 1.8) => L[id] + Math.max(min, (dur(id) || 2) + pad);   // hold >= max(1.8 s, speech + 0.6 s)
    const C = S.CAPTIONS({ L, end, T: S.T }).map(c => ({ ...c, t0: S.unwarp(c.t0), t1: S.unwarp(c.t1) }));
    C.sort((a, b) => a.t0 - b.t0);
    for (let k = 0; k < C.length - 1; k++) C[k].t1 = Math.min(C[k].t1, C[k + 1].t0);
    C.forEach(c => c.rows = wrap(c.text));
    CAPS = C; lastKey = ''; return C;
  }
  function endCard(a) {
    x.globalAlpha = a; x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    const [l1, l2] = Story.END_CARD, s1 = 9, s2 = 4;
    if (l1) OSD.text(x, l1, (W - OSD.width(l1, s1)) / 2, 430, s1, '#ecece4', false);
    if (l2) OSD.text(x, l2, (W - OSD.width(l2, s2)) / 2, 560, s2, '#b9b39a', false);
    x.globalAlpha = 1;
  }
  // returns true if the canvas changed
  function draw(t, showCaps) {
    const S = Story, u = S.warp(t), ec = u >= S.T.endCard[0] ? Util.ss(Util.seg(u, S.T.endCard[0], S.T.endCard[0] + .6)) : 0;
    const c = showCaps ? CAPS.find(c => t >= c.t0 && t < c.t1) : null;
    const key = (c ? c.text : '') + '|' + ec.toFixed(3);
    if (key === lastKey) return false;
    lastKey = key; x.clearRect(0, 0, W, H);
    if (ec > 0) endCard(ec);
    if (c && ec < 1) {
      const fs = 42, cw = fs * .6, rh = 54, cx = W / 2, n = c.rows.length, yb = 896 - rh / 2;
      x.font = `600 ${fs}px ${FONT}`; x.textBaseline = 'middle';
      c.rows.forEach((r, i) => {
        const y = yb - (n - 1 - i) * rh, w = (r.length + 2) * cw, x0 = Math.round(cx - w / 2);
        x.fillStyle = '#000'; x.fillRect(x0, y - rh / 2, w, rh); x.fillStyle = '#f2f2f2'; x.save();
        if (c.it && !r.startsWith('[')) { x.translate(x0 + cw, y); x.transform(1, 0, -.2, 1, 0, 0); x.fillText(r, 0, 2); }
        else x.fillText(r, x0 + cw, y + 2);
        x.restore();
      });
    }
    return true;
  }
  return { build, draw, canvas: cv, caps: () => CAPS, reset: () => { lastKey = ''; } };
})();
