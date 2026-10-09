// ---------- tex.js : small procedural canvas textures (replace contents per film; keep the helpers) ----------
const Tex = (() => {
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  // paper / fabric grain: many small translucent dots
  function grain(x, w, h, n, a, R, cols) {
    for (let i = 0; i < n; i++) { x.fillStyle = cols[Math.floor(R() * cols.length)]; x.globalAlpha = a * (.3 + R() * .7); const s = 1 + R() * 2; x.fillRect(R() * w, R() * h, s, s); }
    x.globalAlpha = 1;
  }
  function wrap(x, text, maxW) {
    const words = text.split(' '), lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  }
  const SANS = "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif";
  // photocopied paper notice (portrait 0.34 x 0.46 m). All text passed in.
  function notice({ header = '', title = [], items = [], footer = [], numbered = true, age = .6, seed = 5 } = {}) {
    const W = 510, H = 690, c = cv(W, H), x = c.getContext('2d'), R = Util.mulberry(seed);
    x.fillStyle = age > .5 ? '#ece4c6' : '#f2eedd'; x.fillRect(0, 0, W, H);
    const eg = x.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75);
    eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, `rgba(150,120,50,${.18 + age * .2})`); x.fillStyle = eg; x.fillRect(0, 0, W, H);
    grain(x, W, H, 9000, .06, R, ['#8c7c55', '#fff9e6']);
    const ink = '#1d1b17', M = 40; x.fillStyle = ink; x.textBaseline = 'alphabetic';
    x.font = `700 15px ${SANS}`; x.fillText(header, M, 59); x.fillRect(M, 68, W - 2 * M, 2.5);
    x.font = `700 43px ${SANS}`; title.forEach((ln, i) => x.fillText(ln, M, 125 + i * 45));
    let y = 125 + title.length * 45 + 20;
    items.forEach((r, i) => {
      const ind = numbered ? 35 : 0;
      if (numbered) { x.font = `700 22px ${SANS}`; x.fillText(`${i + 1}.`, M, y); }
      x.font = `600 22px ${SANS}`; for (const ln of wrap(x, r, W - 2 * M - ind)) { x.fillText(ln, M + ind, y); y += 28; } y += 15;
    });
    x.fillRect(M, H - 85, W - 2 * M, 1); x.font = `400 15px ${SANS}`; x.fillStyle = '#3a362d';
    footer.forEach((ln, i) => x.fillText(ln, M, H - 59 + i * 20));
    for (let i = 0; i < 45; i++) { x.fillStyle = `rgba(30,30,30,${R() * .25})`; x.fillRect(R() * W, R() * H, 1 + R() * 2, 1 + R()); }
    x.fillStyle = 'rgba(0,0,0,.05)'; x.fillRect(0, H * .52, W, 2);
    return c;
  }
  function upload(gl, canvas) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  return { cv, grain, wrap, notice, upload };
})();
