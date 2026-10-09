// ---------- osd.js : the camera display (locked look: never edit per film) ----------
// Lettering from the Night Shift Orientation display: a 5x7 character generator with square pixels and a
// dark 1-pixel rim, drawn on a 720x540 "tape space" canvas that the VHS pass mixes into the signal (so it
// picks up the line jitter, tracking tears and chroma bleed but not the lens barrel or vignette).
// Layout: REC + red tally top left, battery top right, time above date bottom right, title card typed
// out character by character. Per-film values (date, clock style, start time, title words, battery)
// come from story.js, so this file never changes between films.
const OSD = (() => {
  const G = {
    '0': '01110 10001 10011 10101 11001 10001 01110', '1': '00100 01100 00100 00100 00100 00100 01110',
    '2': '01110 10001 00001 00010 00100 01000 11111', '3': '11111 00010 00100 00010 00001 10001 01110',
    '4': '00010 00110 01010 10010 11111 00010 00010', '5': '11111 10000 11110 00001 00001 10001 01110',
    '6': '00110 01000 10000 11110 10001 10001 01110', '7': '11111 00001 00010 00100 01000 01000 01000',
    '8': '01110 10001 10001 01110 10001 10001 01110', '9': '01110 10001 10001 01111 00001 00010 01100',
    'A': '01110 10001 10001 11111 10001 10001 10001', 'B': '11110 10001 10001 11110 10001 10001 11110',
    'C': '01110 10001 10000 10000 10000 10001 01110', 'D': '11100 10010 10001 10001 10001 10010 11100',
    'E': '11111 10000 10000 11110 10000 10000 11111', 'F': '11111 10000 10000 11110 10000 10000 10000',
    'G': '01110 10001 10000 10111 10001 10001 01111', 'H': '10001 10001 10001 11111 10001 10001 10001',
    'I': '01110 00100 00100 00100 00100 00100 01110', 'J': '00111 00010 00010 00010 00010 10010 01100',
    'K': '10001 10010 10100 11000 10100 10010 10001', 'L': '10000 10000 10000 10000 10000 10000 11111',
    'M': '10001 11011 10101 10101 10001 10001 10001', 'N': '10001 10001 11001 10101 10011 10001 10001',
    'O': '01110 10001 10001 10001 10001 10001 01110', 'P': '11110 10001 10001 11110 10000 10000 10000',
    'Q': '01110 10001 10001 10001 10101 10010 01101', 'R': '11110 10001 10001 11110 10100 10010 10001',
    'S': '01111 10000 10000 01110 00001 00001 11110', 'T': '11111 00100 00100 00100 00100 00100 00100',
    'U': '10001 10001 10001 10001 10001 10001 01110', 'V': '10001 10001 10001 10001 10001 01010 00100',
    'W': '10001 10001 10001 10101 10101 10101 01010', 'X': '10001 10001 01010 00100 01010 10001 10001',
    'Y': '10001 10001 10001 01010 00100 00100 00100', 'Z': '11111 00001 00010 00100 01000 10000 11111',
    ':': '00000 01100 01100 00000 01100 01100 00000', '.': '00000 00000 00000 00000 00000 01100 01100',
    '-': '00000 00000 00000 11111 00000 00000 00000', '/': '00001 00010 00010 00100 01000 01000 10000',
    '×': '00000 10001 01010 00100 01010 10001 00000', ' ': '00000 00000 00000 00000 00000 00000 00000',
    '(': '00010 00100 01000 01000 01000 00100 00010', ')': '01000 00100 00010 00010 00010 00100 01000',
  };
  const ROWS = {}; for (const k in G) ROWS[k] = G[k].split(' ');
  const INK = '#f4f4ee', RIM = 'rgba(0,0,0,.85)';
  // s = size of one generator pixel; rim = a dark 1-pixel edge (typical of camcorder character generators)
  function text(x, str, px, py, s, col = INK, outline = true) {
    const draw = (ox, oy, c) => {
      x.fillStyle = c; let cx = px;
      for (const ch of str.toUpperCase()) { const g = ROWS[ch] || ROWS[' ']; for (let r = 0; r < 7; r++) for (let q = 0; q < 5; q++) if (g[r][q] === '1') x.fillRect(cx + q * s + ox, py + r * s + oy, s, s); cx += 6 * s; }
    };
    if (outline) for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]]) draw(ox * Math.max(1, s * .5), oy * Math.max(1, s * .5), RIM);
    draw(0, 0, col);
    return str.length * 6 * s;
  }
  const width = (str, s) => str.length * 6 * s - s;
  function fmtTime(sec, style) {
    let h = Math.floor(sec / 3600) % 24; const m = Math.floor(sec / 60) % 60, pm = h >= 12; h = h % 12 || 12;
    const hm = `${h}:${String(m).padStart(2, '0')}`, ap = pm ? 'PM' : 'AM';
    return style === 'ampm-last' ? `${hm} ${ap}` : `${ap} ${hm}`;
  }
  const W = 720, H = 540, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  let lastKey = '';
  // returns true when the visible state changed (the caller re-uploads the texture only then)
  function draw(t) {
    const S = Story, u = S.warp(t), tp = S.tape(t);
    const bars = S.battery(t), blinkOff = bars <= 1 && Math.floor(t * 2) % 2 === 1;
    const titleN = S.TITLE && u >= S.T.title[0] && u < S.T.title[1] ? Math.floor((u - S.T.title[0]) * 16) : -1;
    const clock = fmtTime(S.clockSeconds(t), S.CLOCK_STYLE);
    const key = [tp.osd, tp.rec, titleN, bars, blinkOff, clock].join('|');
    if (key === lastKey) return false;
    lastKey = key; x.clearRect(0, 0, W, H);
    if (!tp.osd) return true;
    const s = 3;
    if (tp.rec) {
      x.fillStyle = RIM; x.beginPath(); x.arc(58, 55, 10, 0, 7); x.fill();
      x.fillStyle = '#e8261c'; x.beginPath(); x.arc(58, 55, 8.5, 0, 7); x.fill();
      text(x, 'REC', 76, 45, s);
    }
    if (!blinkOff) {   // battery: terminal nub on the right, one cell per bar
      const bx = W - 118, by = 44;
      x.fillStyle = RIM; x.fillRect(bx - 2, by - 2, 58, 26); x.fillRect(bx + 54, by + 5, 8, 12);
      x.fillStyle = INK; x.fillRect(bx, by, 54, 22); x.fillRect(bx + 54, by + 7, 5, 8);
      x.fillStyle = '#111'; x.fillRect(bx + 3, by + 3, 48, 16);
      x.fillStyle = INK; for (let k = 0; k < bars; k++) x.fillRect(bx + 5 + k * 16, by + 5, 12, 12);
    }
    text(x, clock, W - 50 - width(clock, s), H - 92, s);
    text(x, S.DATE, W - 50 - width(S.DATE, s), H - 58, s);
    if (titleN >= 0) {
      const ts = 6, L = S.TITLE; let k = 0;
      L.forEach((ln, i) => {
        const vis = ln.slice(0, Math.max(0, Math.min(ln.length, titleN - k))); k += ln.length;
        text(x, vis, (W - width(ln, ts)) / 2, H * .36 + i * 66 - (L.length - 1) * 33, ts, '#fbfbf2');
      });
    }
    return true;
  }
  return { draw, canvas: cv, text, width, fmtTime, reset: () => { lastKey = ''; } };
})();
