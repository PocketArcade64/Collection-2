// ---------- story.js : THE FILE YOU REWRITE PER FILM (keep the structure) ----------
// Everything here is placeholder content: a quiet corridor walk that exercises every system once
// (autofocus hunt, zoom, flicker, tracking tear + clock jump, one second of silence, a turn into a room).
// Keys are in ORIGINAL time. Retime the film by changing WARP only, never the keys.
const Story = (() => {
  const { track, path } = Util;

  // ---------- identity of the film ----------
  const SLUG = 'untitled-found-footage';            // export file names
  const DATE = 'JAN.27.2027';                       // camera display date, MMM.DD.YYYY, no spaces
  const CLOCK_STYLE = 'ampm-first';                 // 'ampm-first' = "PM 11:58" (new display) | 'ampm-last' = "11:58 PM"
  const TITLE = ['PLACEHOLDER', 'LOCATION 01'];     // OSD title card lines (null = no title card)
  const END_CARD = ['UNTITLED', 'FOUND FOOTAGE'];   // end card lines (pixel lettering)

  // ---------- time warp: film time -> original time (piecewise linear) ----------
  const WARP = [[0, 0], [38, 38]];                  // e.g. [[0,0],[20,20],[38,36]] speeds up the second half
  const pl = (A, x, i, j) => { for (let k = 1; k < A.length; k++) if (x <= A[k][i] || k === A.length - 1) { const a = A[k - 1], b = A[k], f = (x - a[i]) / (b[i] - a[i]); return a[j] + (b[j] - a[j]) * f; } };
  const warp = t => pl(WARP, t, 0, 1), unwarp = u => pl(WARP, u, 1, 0);
  const DUR = WARP[WARP.length - 1][0];

  // ---------- beats (original time) ----------
  const T = {
    rollIn: .85,                  // tape roll-in finishes, OSD appears
    title: [1.1, 5.6],
    flick: [15.0, 15.5, 16.0],    // three flickers (picture dip + ballast sounds); [] for none
    tear: [25.0, 25.65],          // tracking tear (null for none)
    clockJump: 107 * 60,          // seconds the clock skips during the tear (0 for none)
    hush: [30.2, 31.2],           // one second of digital silence, camera held still (null for none)
    recOff: 34.6,
    endCard: [35.0, 38.0],
  };

  // ---------- route ----------
  const P = path([[0, 1.6], [0, -6], [0, -15], [.05, -20.2], [.55, -22.5], [2.4, -23.1], [5.2, -23.0]]);
  const SIDE = [2.8, -8.6];      // dark side opening the camera glances into
  const FAR = [0, -26];          // end wall
  const ROOM = [6.4, -23];       // back of the room
  // distance walked (m) over original time; 'walk' = trapezoid velocity
  const WALK = track([[0, 0], [2.2, 0], [9.4, 7.0, 'walk'], [10.2, 7.6, 'walk'], [13.8, 10.2, 'walk'], [17.6, 10.2], [24.6, 17.6, 'walk'],
    [25.65, 17.6], [29.8, 21.4, 'walk'], [31.6, 21.4], [34.6, 24.6, 'walk']]);
  // yaw offset from the path heading (rad); yawTo() aims at props so moving a prop never breaks framing
  const glance = P.yawTo(9.6, SIDE) - P.heading(9.6);
  const YAWOFF = track([[0, 0], [10.4, 0], [11.6, glance * .85, 'smooth'], [13.0, glance * .9], [13.9, 0, 'smooth'], [26.2, 0], [27.0, -.25], [28.6, -.2], [29.4, 0]]);
  const PITCH = track([[0, -.06], [2.2, -.04], [15.1, -.02], [15.6, .32, 'out'], [17.0, .3], [17.6, -.03], [30.0, -.05], [30.4, -.12], [31.4, -.12], [31.8, -.05]]);
  const CAMH = track([[0, 0], [38, 0]]);
  const FOV = track([[0, 52], [18.2, 52], [19.6, 24, 'smooth'], [21.6, 24], [22.4, 52, 'smooth'], [38, 52]]);   // horizontal degrees
  // autofocus target in metres: 'hold' steps script the hunt (wrong, lock, slip, relock)
  const FOCUS = track([[0, 1.2], [.9, 9, 'hold'], [1.7, 2.4, 'hold'], [2.3, 6, 'hold'], [11.6, 2.6, 'hold'], [13.9, 7, 'hold'], [19.4, 15, 'hold'], [20.1, 9, 'hold'], [20.6, 16, 'hold'], [22.4, 7, 'hold'], [31.8, 4, 'hold']]);
  const APER = track([[0, 1], [38, 1]]);
  const FEAR = track([[0, 0], [14.8, .1], [16.4, .55, 'out'], [24, .35], [25.6, .7], [30.2, .85], [34.6, .9]]);

  // ---------- camera display state ----------
  const START = 23 * 3600 + 58 * 60;                // 11:58 PM
  const clockSeconds = t => { const u = warp(t); return START + u + (T.tear && u > T.tear[1] ? T.clockJump : 0); };
  const battery = t => { const u = warp(t); return u < 25.65 ? 3 : u < 33 ? 2 : 1; };   // 1 bar blinks
  function tape(t) {
    const u = warp(t);
    return {
      osd: u > T.rollIn && u < T.recOff + .22, rec: u > T.rollIn && u < T.recOff,
      snow: u < T.rollIn - .45 || (u > T.recOff + .1 && u < T.recOff + .5),
      off: (u > T.recOff + .5) ? 1 : 0,
    };
  }

  // ---------- dialogue ----------
  // who: 'PA' = ceiling speaker, 'ME' = whispered camera operator. text feeds the cue sheet, captions and the
  // placeholder murmur. Load real recordings named <id>.wav in the player to replace the murmur.
  const LINES = [
    { id: 'w1', who: 'ME', t: 2.6, text: "Okay. It's recording." },
    { id: 'p1', who: 'PA', t: 6.6, text: 'This floor is now closed. Please make your way to the exit.', chime: 5.8 },
    { id: 'w2', who: 'ME', t: 12.2, text: "There's nobody else here." },
    { id: 'w3', who: 'ME', t: 26.4, text: "That's not right." },
  ];
  // SDH captions: [PA] prefix for the speaker, it = italic (operator), sounds in [BRACKETS].
  // end(id, pad, min) and the line durations come from subs.js once voices are known.
  const CAPTIONS = h => [
    ...(SOUND.roomTone === 'fluorescent' ? [{ t0: .9, t1: 2.5, text: '[FLUORESCENT LIGHTS HUMMING]' }] : []),
    { t0: h.L.w1, t1: h.end('w1'), text: "(whispering) Okay. It's recording.", it: true },
    { t0: h.L.p1, t1: h.end('p1'), text: '[PA] This floor is now closed. Please make your way to the exit.' },
    { t0: h.L.w2, t1: h.end('w2'), text: "There's nobody else here.", it: true },
    { t0: T.flick[0] - .05, t1: T.flick[0] + 1.9, text: '[LIGHTS FLICKER]' },
    { t0: T.tear[0], t1: T.tear[1] + .5, text: '[TAPE NOISE]' },
    { t0: h.L.w3, t1: h.end('w3'), text: "That's not right.", it: true },
    { t0: T.hush[0], t1: T.hush[1] + .1, text: '[SILENCE]' },
  ];

  // ---------- sound cues not derived from motion (original time) ----------
  // Footsteps, breath, cloth rustle (from camera turn rate), zoom servo and autofocus ticks are automatic.
  const SOUND = {
    // room tone is a story decision: 'fluorescent' only when buzzing tubes belong to the scene (it gets
    // tiring), 'air' for a quiet room, null for nothing at all
    roomTone: 'air',
    zoom: null,                           // [[t0, t1], ...] servo windows; null = follow the FOV keyframes
    rustle: [[15.6, .9], [30.4, .6]],      // extra cloth moves: [t, strength]
    extra: [],                            // custom {t, type, ...}: add a generator in audio.js CUSTOM
    musicEnd: 30.2,                       // in-world music stops (null = keep playing)
    drone: [24.0, 30.2],                  // low dread bed window (null = none)
  };

  return { SLUG, DATE, CLOCK_STYLE, TITLE, END_CARD, DUR, warp, unwarp, T, P, WALK, YAWOFF, PITCH, CAMH, FOV, FOCUS, APER, FEAR,
    clockSeconds, battery, tape, LINES, CAPTIONS, SOUND, FAR, ROOM, SIDE };
})();
