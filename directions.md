# Procedural Found-Footage Film Playbook

What we learned building *Environmental Verification* and *Night Shift Orientation* (VHS camcorder horror shorts rendered live in the browser), and how to repeat the process for a new setting with the kit in this folder.

This is written for the next project, where the location, story and signal colour will change but the method will not. Each section separates what is **reusable as is** from what is **specific to a film** and has to be redesigned.

> **Kit revision.** This version merges the two films. The page, player controls and export panel follow *Environmental Verification*. The tape shader, camera display lettering, caption styling and the sound recipes come from *Night Shift Orientation*. Where the two disagreed, the change is noted in the section it affects.

---

## 1. What we built, in one paragraph

A single self-contained HTML file (`dist/<slug>.html`, built by `build.py` from `src/`). It renders a 3D scene in raw WebGL 2, runs a camcorder optics chain and a VHS tape pass, and draws a camcorder OSD and closed captions. It plays a soundtrack synthesised in JavaScript as three stems (music, effects, voice), with real voice recordings loadable per line. It exports a frame-accurate 30 fps MP4 using WebCodecs and a hand-written MP4 muxer. Export offers a choice of frame (1920×1080 16:9 with the camcorder image pillarboxed, or a bare 1440×1080 4:3 image), checkboxes to leave out each audio stem, a burn-in captions option, a camera display option and a sound format choice. A separate button saves the soundtrack as a WAV. Under the player, three view controls sit beside the captions toggle: a camera display toggle that hides the OSD text while keeping every tape and lens effect, a "Fill 16:9, no pillarbox" view for thumbnails, and a "Save frame (PNG)" button that saves the current frame, with captions and the camera display included or left out according to the export panel's checkboxes. Nothing loads from the network except Google Fonts, and those have fallbacks.

---

## 2. The process that worked

1. **Estimate first, then build.** The person asked for a cost estimate before starting. A useful estimate breaks down output tokens, cache writes and cache reads, and names the real variable: the number of look-tuning rounds. Be explicit that a first build with self-testing uses far more tool calls than a one-shot answer. Our first estimate was too low because it did not account for render-and-inspect loops.
2. **Lock the timeline before any graphics.** Write the story as keyframes in original time (see section 4). Every other module reads from it.
3. **Build the whole pipeline crudely, end to end,** before polishing anything: scene, post, VHS, OSD, captions, audio, export. Seeing a full ugly frame early caught the overexposure problem immediately.
4. **Test headlessly and look at frames.** Render specific timestamps to PNG, assemble contact sheets and view them (section 10). Every major fix in this project came from looking at a frame, not from reasoning about the code.
5. **Tune with knobs, not edits.** Expose a global `TUNE` object (light strength, fog, exposure, emission, signal-colour gain, bounce). Change values from the test harness and re-render without rebuilding.
6. **Verify the export with real tools.** Mux real H.264 and AAC produced by ffmpeg, then run `ffprobe` and a full `ffmpeg -f null` decode. Then run an actual in-browser export and decode that too.
7. **Measure audio, don't guess.** Compute LUFS per stem, speech RMS during lines, and bed RMS. Our first mix had effects 20 dB too loud and the voice quieter than the bed.
8. **Deliver the format the person asks for.** They first got a hosted artifact, then asked for a plain HTML file. Ask early if it isn't clear.

---

## 3. Architecture (reusable as is)

Write separate source files in `src/` and concatenate them into one `<script>` with `build.py` (`python3 build.py` writes `dist/<slug>.html`). Each module is a `const Name = (() => { ... })()` so names don't collide. Load order matters and is listed in `build.py`.

| Module | Job | Reuse |
|---|---|---|
| `util.js` | math, seeded RNG, value noise, keyframe tracks, eases, 120 Hz tables, Catmull-Rom path, mat4, GL helpers, `TUNE` | as is |
| `story.js` | identity (slug, date, clock style, title card, end card), time warp, beats, route, walk schedule, camera keyframes, fear/focus curves, tape state, dialogue, captions, sound cues | **rewrite per film, keep the structure** |
| `rig.js` | the handheld operator: gait, breathing, tremor, wander, stabiliser kicks, held breath, focus spring, auto exposure, AGC noise gain | as is |
| `tex.js` | small procedural canvas textures (a paper notice helper) | replace contents |
| `world.js` | scene content (boxes, materials, fixtures, decals, dark zones) on top of the emitter lighting system | rewrite the content, keep the lighting system |
| `post.js` | bloom, depth of field, motion blur, cheap SSAO, exposure, soft shoulder, gamma | as is, retune |
| `vhs.js` | the tape pass | as is, retune |
| `osd.js` | the locked camera display (section 8.1) | **never edit**: per-film values live in `story.js` |
| `subs.js` | CEA-608 style captions and the end card | as is |
| `audio.js` | offline DSP, three stems, loudness normalisation, voice recordings | keep the engine, rewrite the events and `CFG` |
| `mux.js` | MP4 writer (avc, vp9, aac, pcm) | as is |
| `export.js` | WebCodecs export, MediaRecorder fallback, WAV, PNG, save | as is |
| `main.js` | render loop, playback, UI wiring, test hook | as is |
| `template.html` | page layout and controls | as is |

**Why raw WebGL 2 instead of three.js:** the sandbox has no network, so a CDN library cannot be loaded during testing. Raw WebGL 2 runs in headless Chromium with SwiftShader, which makes real screenshots possible. *Night Shift Orientation* used three.js with a Node render farm and Python mixing; its shaders and DSP recipes were ported into this kit rather than its toolchain, so one HTML file still does everything.

**Render pipeline per frame:**

1. CPU: `Rig.pose(t)` (story keyframes plus handheld layers), emitter intensities at `t`.
2. Upload the emitter texture.
3. Scene pass at 720×540 into an RGBA16F target with a depth texture (1024×540 in the fill view, see section 11).
4. Bloom: bright pass, 4 downsamples, 3 upsamples.
5. Camera pass: DOF from depth and the focus spring, motion blur on fast pans, cheap SSAO, bloom add, exposure, soft shoulder, gamma.
6. VHS pass at the output size (1920×1080 with a pillarboxed 4:3 image), with the OSD mixed into the signal and the caption layer composited untouched at the end.

---

## 4. Timeline and camera (the backbone)

**Keyframe tracks.** `track([[t, value, ease], ...])`, where the ease applies to the segment ending at that key. Useful eases are smooth, linear, out-cubic, in-cubic, a mild overshoot for whips, a hold (step) for autofocus targets, and a trapezoid-velocity "walk" ease. Walking needs the trapezoid ease. A plain smoothstep over a walk segment peaks at 1.5× average speed, which looks like lurching.

**One warp function.** Every consumer maps time through `Story.warp(t)` (film time to original time) and `Story.unwarp(u)` (back). `WARP` is a piecewise-linear table. If the film must be retimed, change the warp, never the keys. Captions and sound cues are written in original time too.

**Path.** Catmull-Rom through hand-placed points, arc-length parametrised so the walk schedule is in metres. Helpers you will want again: `pathAt(s)`, `place(s, lateral, forward)` and `yawTo(s, point)`. The last one computes keyframe angles that aim the camera at props automatically, so moving a prop never breaks the framing.

**Handheld rig layers** (`rig.js`), summed on top of the keyframes. The rig is reusable; only the keyframes in `story.js` change per film:

- **Gait:** phase = distance / stride. Bob at twice the step rate, sway and roll at the step rate, all scaled by walking speed.
- **Breathing:** integrate a rate curve (about 0.27 Hz calm, rising with fear) into a phase table. Share that table with the audio so the breath you hear matches the camera.
- **Tremor:** multi-octave noise at about 7 Hz, with amplitude following the fear curve squared.
- **Hand wander:** slow noise at about 0.3 Hz.
- **Electronic stabilisation overcorrection:** occasional small impulses that decay in about 0.1 s.
- **Held breath:** a multiplier that freezes breath, tremor and most wander.

**Precomputed tables.** Anything stateful (focus spring, breath phase, auto-exposure) is simulated once at load into 120 Hz tables. Playback, scrubbing and export then become pure functions of `t`, so export is deterministic and scrubbing never drifts.

**Autofocus.** A second-order spring in dioptres (1/distance), with ζ ≈ 0.42 for overshoot. Script the hunt as step changes in the target: wrong distance, lock, slip, relock. Circle of confusion = |1/d − 1/focus| × k, with k scaled by (50 / fov)². Wide shots stay sharp like a small CCD, and zooms show the hunting clearly.

**Auto-exposure.** Estimate on the CPU what the lens sees, summing emitters in the view cone with distance falloff. Run a lagged spring toward key / luminance, then cap the maximum exposure. Derive the AGC noise gain from exposure plus fear, so noise pumps in dark scenes.

**Scripted violent motion** (the camera knock). Build it as its own set of tracks starting from the handheld pose at the moment it begins. Unwrap the rest yaw so it is within 180° of the start yaw. Accumulate roll past 360° for a full tumble. Use in-cubic eases on falling segments.

---

## 5. Lighting from emissive objects (reusable system)

When the light sources are many small glowing things (mushrooms here; it could be screens, candles, lanterns, signs or embers):

- **Group sources into clusters** and treat each cluster as one emitter, capped at 512. Per-object emission is drawn in the object's own shader. Clusters only light the surroundings.
- **Emitter texture:** a 512×2 RGBA32F texture. Row 0 holds position and intensity, row 1 holds colour and a softening epsilon, which grows with cluster spread and height. Re-upload it every frame.
- **Spatial grid:** 2.5 m cells, each storing the 16 strongest nearby emitter indices (ranked by I / (d² + 1.5)). Fragments loop over 16 emitters only.
- **Falloff:** `I / (d² + eps) * exp(-d * 0.28) * rangeFade`. The exponential term was essential. Without it, overlapping emitters lit everything evenly and the scene looked like a theme park.
- **Wrapped diffuse,** `max(n·l * 0.62 + 0.38, 0)`, gives soft wrap with no hard shadows. Add a Blinn specular term scaled by surface wetness.
- **Light map** (top-down, 0.5 m texels): used for a small bounce term and for fog.
- **Fog that follows light:** march 6 samples along the view ray through the light map. Fog colour = base × (local light / a fixed average). Using a fixed average rather than the live one means fog darkens as the signal colour spreads, which adds to the oppression.
- **Dark zones.** The lighting has no shadows, so light reaches through walls and a side room that should be black comes out lit. `ZONES` in `world.js` lists boxes `[x0, z0, x1, z1, k]` that multiply all light inside by `k` with a soft 0.35 m edge (up to 8). Use them for every deliberate dark gap, then check the frame.
- **The placeholder** builds the light grid from ceiling fixtures (one emitter each, with `ok`, `flicker` and `dead` kinds from *Night Shift Orientation*), a 2.5 m grid over the scene bounds, and fog tied to local light.

---

## 6. Colour, exposure and the signal colour (biggest lessons)

- **Albedo is not the palette.** The brief's hex colours (trunk #121c24 and so on) describe the final look, not surface reflectance. Treating them as albedo made everything invisible.
- **The first build was badly overexposed and washed out.** Fixes that worked: raise surface light, reduce emission, add exponential falloff, cut bounce to a quarter, cap auto-exposure at 2.2, and lower the VHS black lift slightly.
- **Gamma destroys saturated dark colours.** A "deep red" with even 0.04 in green and blue becomes salmon pink after gamma. Keep the off-channels below 0.002 in linear space.
- **Making a dark colour bloom without making it bright:** weight the bright pass toward the signal colour (multiply red by 4 before thresholding, only on red-dominant pixels). The visible red stays dark and bruised while its halo blooms hard. A global emissive boost made the red scarlet instead.
- **Surface albedo should oppose the signal colour.** A cool teal ground under red light falls to near-black, which is what the brief asked for. Our first brownish leaf litter turned the whole floor rusty red.
- **Stems or secondary parts need their own timing.** Pale blue stems under red caps looked lavender-white. Turning them earlier and dimming them fixed it.
- **The signal colour should spread per object,** with per-object onset times. Use distance from an origin point plus jitter, a few early ones turning one by one, and roughly 8% late ones. Inside each object, a front moves from the edge inward. Drain back with randomised order.

Working values from this film, a good starting point: `light 2.0, fogK 0.4, fogAvg 0.05, fogDen 0.062, expo 0.75, key 0.42, bounce 0.25, emis 0.7, redGain 1.7, maxExp 2.2`.

---

## 7. VHS camcorder pass (reusable, tune strength only)

The shader is the *Night Shift Orientation* pass ported to WebGL 2, with the playbook's improvements added. Order inside one shader:

1. Map the output pixel into 4:3 image units (with `uPad` and overscan for the fill view).
2. Vertical roll for the roll-in and the tear.
3. Line index in 540-line tape space.
4. Horizontal offset per line: time-base jitter plus a slow wobble (period about 80 lines, so text never leans), rolling-shutter skew from yaw rate, the head-switching band on the bottom lines, and the tracking-tear band on demand.
5. Dropouts (see below), applied by moving the sample point before decoding.
6. Barrel distortion on the picture only. The OSD is an electronic overlay: it skips the lens but is mixed into the signal, so it picks up the line jitter, tears and chroma bleed. It gets a slight two-tap smear.
7. Luma through a narrow and a wide gaussian, sharpened against each other (edge-enhancement ringing). Chroma (YIQ) averaged wide and shifted, so colour smears and lags to the right.
8. Highlight comet tails trailing right.
9. AGC noise, horizontally stretched, strongest in the darks, seeded at tape rate (`floor(t * 30)`) so it never looks like digital grain.
10. Snow inside the tracking band, head-switching noise, dropout sparkles.
11. White balance (settles after power-on, drifts slightly with fear), lifted blacks, soft highlight clip.
12. Optional tape-line structure (`TUNE.scan`, default 0).
13. Vignette, snow (no signal) and black.
14. Captions and the end card, composited untouched inside the 4:3 frame.

**Dropouts, the lesson.** Solid white one-line bars look like a cheap overlay. Real decks conceal most dropouts by repeating the line above. What looks right:

- About 72% concealed: the sample point moves 3 lines up and is nudged sideways, so the deck "repeats" a short segment.
- The rest: broken sparkles 1 to 3 lines tall with an exponential tail to the right, brightening the image rather than replacing it.
- Each flake persists for 2 frames.
- Rate is driven by fear and by damage events (the tear).

**Interlacing and CRT scanlines:** off by default. The brief asks for tape and lens artefacts, not a tube. If a film wants a faint line structure, raise `TUNE.scan` (0.1 to 0.2) and compare frames before committing.

---

## 8. OSD and captions

### 8.1 The camera display is locked

The camera display looks the same in every film. **Never edit `osd.js`.** Everything that changes between films is read from `story.js`: `DATE`, `CLOCK_STYLE`, the start time and any jump inside `clockSeconds`, `battery`, `TITLE`, and the `title` window in `T`.

**Revision note.** This kit uses the *Night Shift Orientation* lettering and layout, which replaced the earlier display: it adds Q, X, Z, dash, slash, brackets and ×, draws square pixels with a dark 1-pixel rim offset in five directions, and types the title card out character by character. The time style is a setting: `'ampm-first'` gives `PM 11:58` (as in the *Night Shift Orientation* frame) and `'ampm-last'` gives `11:58 PM` (as in *Environmental Verification*).

**Elements and positions** (in the 720×540 OSD canvas, which maps onto the 4:3 image):

| Element | Position | Details |
|---|---|---|
| REC tally dot | centre (58, 55) | red `#e8261c` disc, radius 8.5, on a dark rim disc of radius 10 |
| "REC" | top-left of text at (76, 45) | pixel lettering, scale 3 |
| Battery | top-left at (602, 44) | 54×22 body, terminal nub on the **right**, one cell per bar; one bar blinks |
| Time | right edge at x 670, top at y 448 | `PM 11:58` or `11:58 PM`, no seconds, no leading zero |
| Date | right edge at x 670, top at y 482 | `MMM.DD.YYYY`, no spaces after the periods, for example `JAN.27.2027` |
| Title card | centred, rows 66 px apart around y 194 | scale 6, typed out at 16 characters per second |

**How it is composited (also locked):**

- **The canvas and its texture.** The OSD is drawn on its own 720×540 canvas and uploaded (premultiplied) only when its visible state changes: the minute ticks, the battery changes or blinks, a title character appears.
- **Inside the VHS pass.** Mixed into the signal before luma and chroma decoding, so it gets the line jitter, tracking tears and chroma bleed, with no lens barrel and no vignette. This is what makes it look burned in by the camera rather than pasted on.
- **When it shows.** After the tape roll-in and until the tape end, following `Story.tape(t).osd`.
- **Hiding it.** A viewer and export toggle (`osdOn` in the VHS uniforms). The toggle hides the whole OSD layer, title card included, and leaves the tape look untouched. Files made without it get a `-noosd` suffix.
- **The red dot** matches the reference camera, so keep it even when the story's signal colour is also red.

**Verify it every time:** render one frame during the title card and one later frame, crop the top-left and bottom-right corners at 2×, and check the date has no spaces after its periods, the time follows `CLOCK_STYLE`, and the battery nub is on the right.

### 8.2 Captions

- A 1440×1080 canvas in IBM Plex Mono 600 at 42 px, a solid black box per row, at most 32 characters per row, the operator's lines in italics, PA lines prefixed `[PA]`, sounds in `[BRACKETS]` (styling from *Night Shift Orientation*). The bottom of the last row sits at y 896, clear of the time and date. Hold each for at least max(1.8 s, speech + 0.6 s), using the real recording length once voices are loaded. Wait for `document.fonts.load` (with a timeout) before the first draw. Check that every SDH caption sits where its sound actually is.
- The end card is drawn on the same layer in the OSD lettering, so it survives the captions toggle.

---

## 9. Audio (keep the engine, rewrite the events)

**Engine:** plain JavaScript DSP into Float32Arrays at 48 kHz (`audio.js`), with the recipes ported from the *Night Shift Orientation* mixer.

- RBJ biquad filters (`lp`, `hp`, `bp`, `peak`, low shelf), a Freeverb-style room with its wet level matched to the dry, a compressor, variable-speed tape playback and a look-ahead limiter.
- Three stems rendered once at load (about 5 s in headless Chromium): music (in-world music through a wall plus the drone), effects (room tone, hiss, foley, camera mechanics, breath, tear), voice (PA speaker with its chime, and the operator).
- Per-film levels in `CFG`; custom event types in `CUSTOM` for `Story.SOUND.extra`.

**Shared curves.** Footsteps come from the walk: one per 0.72 m stride. Breath uses the same phase table as the camera. Cloth rustle follows the camera's turn rate, plus scripted extras. The zoom servo follows the zoom keyframes. Autofocus ticks fire when the focus spring moves fast. Room tone and in-world music follow the flicker light level.

**The zoom sound (keep it).** The person liked the *Environmental Verification* zoom, so the kit uses that recipe exactly: a 1180 Hz motor tone plus its octave at 0.35, chopped by a 92 Hz gear buzz (gain 0.6 to 1.0), plus uniform noise through a 900 Hz band-pass (Q 2.5), with 80 ms smoothstep ramps in and out. Windows come from `Story.SOUND.zoom` if listed, otherwise from the FOV keyframes. In that film the servo sat at about 0.26 of the footstep RMS, but those footsteps were about 6 dB too loud, so the kit matches it to the mix rather than to the quieter footsteps (about 0.52 of the kit's footstep RMS). `CFG.zoomGain = 1` means "as heard in that film"; change only that value.

**Room tone is a story decision.** A constant 120 Hz fluorescent hum gets annoying fast. Choose it per film with `Story.SOUND.roomTone`:

- `'fluorescent'`: hum, ballast buzz, high whine and failing-tube crackle. Use it only when buzzing tubes are part of the story (an office at night, a light the story draws attention to). The opening `[FLUORESCENT LIGHTS HUMMING]` caption and the ballast "tink" on each flicker come with it.
- `'air'` (the default): a quiet room, soft low noise with no pitch, about 5 dB above nothing in the quiet moments.
- `null`: no room tone at all, for when the setting's own bed (wind, a forest, machinery) is written as a custom sound.

Without tubes, flickers make a dry relay click instead of the ballast tink, and the return from the silence keeps its low thud but loses the ballast buzz. Ask the person which room tone the setting needs before building the mix, and let them listen to a draft with it before it's final.

**Footsteps.** Start low: `stepGain` is 0.16 here, half of what *Night Shift Orientation* used, then measure them against the voice and the bed and ask the person to listen before the mix is final.

**Silence.** Real digital zero across all stems, then the ballasts restart with a faded-in thud so it doesn't click.

**Loudness.**

- BS.1770 K-weighting, 400 ms blocks with 75% overlap, both gates.
- Normalise the full mix to −14 LUFS, limit, measure again and correct once.
- The same gain applies to every stem, so a stems-only export keeps the right relative level. The player's voice panel shows the measured result.

**Balance targets.** Measure speech RMS inside the voice windows against the bed. The 8 dB target applies when the film has a real bed: with `'fluorescent'` the placeholder lands at −16.1 dB speech against −25.6 dB bed. With the quiet `'air'` tone the bed sits much lower (about −35 dB), which is right for a silent room; don't push it up to hit the target.

**Voice.** The browser cannot synthesise convincing speech that Web Audio can capture or export, so each line plays as a wordless formant murmur (voiced for the PA, whispered for the operator) until a recording is loaded. "Load voice recordings" takes WAV files named after line ids. Kokoro TTS output from the *Night Shift Orientation* pipeline works: generate the lines, rename them to their ids and load them all at once. PA recordings go through the ceiling speaker chain; operator recordings through the close-mic whisper chain. Raise this early in every project.

---

## 10. Testing in the sandbox (the workflow that made everything possible)

- **Headless browser:** Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Launch flags: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. WebGL 2 and float render targets work.
- **Serve over http://localhost,** not `set_content`, because WebCodecs needs a secure context.
- **Run the HTTP server inside the Python test script.** Background servers started in one bash call die before the next.
- **Expose a test hook,** `window.__film = { renderAt, TUNE, Story, World, Rig, Snd, Exporter, Mux, ready, project }`. The harness can then set tuning values, render any timestamp, read pixels, and project 3D points to screen space. Set `window.__saveHook = (name, blob) => ...` to capture saved files: headless downloads from a scripted link click are unreliable.
- **The harness is in `test/`:** `shots.py` renders a contact sheet of timestamps, `export_test.py` exports 8-frame MP4s in both frames plus the WAV and PNG, `voice_test.py` loads recordings, `node_audio.js` renders the soundtrack in Node and `node_mux.js` checks the muxer against ffmpeg-made H.264 and AAC.
- **Contact sheets:** render 4 to 10 timestamps, crop the 4:3 area, tile them and view the image. This is the core loop.
- **Numeric debugging beats staring.** The vanished-beacon bug was found by projecting the beacon into NDC and reading the rendered pixel there. The beacon was in frame but hidden behind a close mushroom whose bent cap sat outside the stem-based clearance check.
- **Time limits:** a SwiftShader frame takes about 2.5 s and a single command times out at 300 s. Export tests use a `frames` option (8 frames) and run in the background with `setsid nohup`, polling a log file.
- **Codecs in headless Chromium:** no H.264 encoder and no AAC encoder, so in-browser tests produce VP9 video with uncompressed PCM sound. Test the H.264 and AAC path by muxing ffmpeg-generated streams in Node and checking them with `ffprobe` and a full decode.
- **A passing test is not a playable file.** Our exports passed `ffprobe` and decoded cleanly with sound, yet the person heard nothing: the sound inside the MP4 was compressed by the browser in a form QuickTime on the Mac would not play. When checking audio, confirm the sound is really there (`-af volumedetect` or `-af ebur128` on the audio stream) and also note which codec a real user's browser will pick, not just the sandbox's.
- **Check output dimensions after a frame option.** For the 4:3 export, confirm `ffprobe` reports 1440×1080 and pull a frame (`-frames:v 1`) to see that no bars remain.

---

## 11. MP4 export (reusable as is)

- **Prefer WebCodecs.** Try `avc1.640028`, then `4d0028`, then `42e028` (with `avc: {format: 'avc'}`), then `vp09.00.40.08`. Audio: uncompressed PCM or AAC (see Sound compatibility). Bitrate 14 Mbps video, 192 kbps for AAC.
- **Render each frame at `t = i / 30`**, wrap the canvas in a `VideoFrame` (the canvas needs `preserveDrawingBuffer: true`), and apply backpressure on `encodeQueueSize`.
- **Muxer details that matter:**
  - Use one sample per chunk and interleave samples by time.
  - Build moov once to measure its size, then build it again with the real chunk offsets.
  - avcC comes from `decoderConfig.description`. Build vpcC by hand.
  - For AAC, use esds with the AudioSpecificConfig (default `0x11 0x90` for 48 kHz stereo).
  - For uncompressed PCM, use a QuickTime `sowt` sample entry (16-bit little-endian, version 0 sound description, no child boxes). Each 4-byte stereo frame is one sample: `stsz` has a constant sample size of 4, `stts` is one entry of (total frames, 1), and `stsc` maps blocks of 4800 frames per chunk. Use major brand `qt  ` (with `isom` compatible) when the file carries PCM.
  - Add a version-1 ctts only if timestamps arrive out of order.
- **Frame options.** The VHS shader places the 4:3 image from the output size (image width = height × 4/3, centred). A 1920×1080 output therefore gets pillarbox bars, and a 1440×1080 output fills edge to edge with nothing cropped. To export 4:3, resize the canvas to 1440×1080 for the export, pass the size to the encoder and muxer, and restore 1920×1080 afterwards. The OSD and caption layers are authored in 4:3 space, so they land in the same place in both frames. Add a suffix such as `-4x3` to the file name.
- **Still frames and the fill view (for thumbnails).** The video stays primarily 4:3. Keep composing, lighting and testing every shot for the 4:3 frame, and keep the MP4 frame options as they are. The fill view exists only so the person can save a full 16:9 thumbnail. How it works:
  - **The scene renders wider.** A second set of render targets at 1024×540 (bloom chain scaled to match) is built on first use. The projection keeps the same vertical field of view with aspect `Post.W / Post.H`, so the centre 4:3 is unchanged and the pillarbox area fills with more of the world.
  - **The VHS pass takes `uPad`,** the extra width per side in 4:3 image units (0.211 for 1024 wide, 0 normally). `img()` maps 4:3 coordinates into the wide texture, the bar and barrel bounds checks use `-uPad` to `1 + uPad`, and the OSD and caption lookups are masked to the 4:3 range so their clamped edges never smear into the sides. All the 720-based noise and jitter maths stays in 4:3 units, so the look carries across.
  - **A 4% overscan in the fill view only,** otherwise the lens barrel leaves thin black slivers at the top and bottom corners.
  - **Do not design for the sides.** Whatever happens to sit in the side areas (props, path ends, the legs, unfinished geometry) is acceptable. The person said not to worry about it, so do not spend build or tuning time on it.
  - **Export ignores the fill view.** `renderAt` only goes wide when the view toggle is on, nothing is exporting, and the output is wider than 1.5:1.
  - **Saving the PNG.** Render the current time once more and call `canvas.toBlob(..., 'image/png')` straight away; the canvas has `preserveDrawingBuffer`, and `toBlob` copies the bitmap at call time, so it works while playing. The PNG follows the export checkboxes, not the on-screen toggles, for the overlay layers: "Burn in captions" and "Camera display" decide whether captions and the OSD appear in the still (the person asked for this so a clean thumbnail needs no extra clicks). Pass them as the `capOverride` and `osdOverride` arguments of `renderAt`, then set `dirty` so the next frame restores the on-screen view. The fill toggle still decides the frame. Say in the export panel's hint that the PNG uses those boxes. The file is named by its timestamp plus a suffix for each layer left out, for example `environmental-verification-0m20.00s-fill16x9-noosd-nocaps.png`. Save it through the same `save()` helper as the MP4 so it works in both a hosted artifact and a plain file.
- **Sound compatibility (the bug the person hit).** On a Mac, the MP4 played with no sound while the WAV soundtrack played fine. The browser-compressed sound was the problem: some browsers only make Opus, which QuickTime plays as silent, and QuickTime is also strict about AAC as browsers frame it. The fix that worked:
  - **Put uncompressed PCM in the MP4.** It needs no browser audio encoder at all, uses the exact samples of the working WAV, and plays in QuickTime, Final Cut, Premiere, Resolve, VLC and ffmpeg. It adds about 11 MB per minute.
  - **Offer a Sound format choice:**
    - Automatic (the default): PCM on Apple devices, AAC elsewhere when the browser supports it, otherwise PCM.
    - Uncompressed PCM.
    - AAC, for a smaller file.
    - Never fall back to Opus.
  - **Harden AAC:** request `aac: {format: 'aac'}`, strip ADTS headers if an encoder returns them anyway, and rebuild the AudioSpecificConfig from the header if no description arrives.
  - **Tell the person** which video and sound formats their browser will produce before export, and report the formats actually used after saving.
  - **Refuse to save** if the encoded audio covers less than the full running time.
  - **Keep the "Save soundtrack (WAV)" button** (16-bit, 48 kHz stereo, built from the same stem checkboxes, aligned at 0:00) as a dependable fallback.
  - **In the real-time fallback,** resume the AudioContext before recording; a suspended context records silence.
- **Fallback:** MediaRecorder in real time, mp4 if supported, otherwise webm.
- **Saving:** in a published Claude artifact, call `claude.use('downloads')` and `save({filename, data: blob})` with the `downloads` capability declared. In a plain HTML file, an `<a download>` link works. Support both.

---

## 12. Story craft lessons for this genre

- **Inconsistencies must be slow and easy to miss.** Use a duplicate landmark with one detail changed (a missing branch, a cluster moved to the other side). Make a distant feature that exists only while focus is correct; hide it while the image is blurred, so nothing ever snaps. A clock that jumps after a tracking tear is another option.
- **Never show the threat.** Even the victim's body should only partly exist. The drag works best with the boots already lying low in a bottom corner, flopped onto their sides, the legs running out of frame, then yanked back out the way they came. Our first version pulled them across the ground in view, which revealed that only boots existed.
- **Make sure the sightline is actually clear.** Keep a view-cone corridor (narrow near the camera, wide at the target) free of trees, branches and the bent caps of nearby objects, not just their bases.
- **The quiet ending matters most.** Leave about seven still seconds for the signal colour to drain completely. The person flagged this as the strongest idea, and the final cut kept it long.
- **Dialogue:** procedural, tired, with a self-correction that is itself an anomaly ("Marker four, no, five").

---

## 13. Adapting to a new setting: checklist

Answer these before writing code, then change only `story.js`, the `world.js` content, `tex.js`, the audio events and `CFG`, and the tuning values. `osd.js` never changes.

1. **The light source.** What glows (screens, lanterns, coral, signage, embers)? Can it be clustered into at most 512 emitters? What does its emission look like up close?
2. **The signal colour.** What changes colour, and how does it spread and return? Pick surface albedos that go dark under it, and check its off-channels stay near zero.
3. **The space.** What is the walkable path, what fills the space procedurally, and where are the deliberate dark gaps?
4. **The inconsistencies.** A duplicate, a changed detail, something that vanishes. Where are they, and which camera move reveals each one?
5. **The camera reason and the date.** Why is someone filming, and what are the title card words? Ask for the **date** and the clock style to show on the camera display. Both go in `story.js`; the display itself is locked (section 8.1).
6. **The threat beat.** What happens to the camera, and how do you show the aftermath without showing anything that would give the threat a shape?
7. **The sound world.** What is the bed made of, what darkens as the signal spreads, what are the source sounds, and where are the silences? Pick the room tone from the story (section 9): fluorescent hum only when the tubes matter, otherwise the quiet `'air'` tone or none. Keep the footsteps well down from the start, and keep the *Environmental Verification* zoom servo.
8. **Voice.** Will real recordings be supplied? If not, flag it early.
9. **Delivery.** A plain HTML file or a hosted page? 16:9 with pillarbox, bare 4:3, or both? Which stems need export checkboxes? Should captions be burnt in? Keep the camera display toggle, the fill 16:9 still view and the PNG frame button from this film (sections 8.1 and 11), and keep the film itself primarily 4:3. Which browser and player will the person use, so you know whether the MP4 needs uncompressed PCM sound (Mac, QuickTime, editors) or AAC?
10. **Budget.** Estimate the first build plus at least 4 to 6 render-and-inspect tuning rounds, and say so before starting.

---

## 14. Known limitations to mention up front next time

- Without loaded recordings the voices are not intelligible speech.
- First load takes several seconds while the world and the soundtrack generate.
- Export speed depends on the GPU, roughly a minute on a decent laptop.
- The H.264 and AAC export path was validated through the muxer and ffmpeg but not end to end in the sandbox, because the sandbox browser lacks both encoders.
- PCM sound inside an MP4 plays in QuickTime, editors and VLC, but some web players may not play it. The AAC option and the WAV soundtrack cover those cases.
- Procedural legs and other human parts read poorly up close. Keep them cropped, small, dark, blurred or moving fast.
- The emitter lighting has no shadows. Use dark zones (section 5) for spaces that must stay dark.
- In headless Chromium the soundtrack takes about 5 s to build at load.

---

## Appendix A. Locked camera display

The locked display is `src/osd.js` itself. Copy that file unchanged into every project; do not retype it. Its inputs are `Story.tape(t).osd` and `.rec`, `Story.clockSeconds(t)`, `Story.battery(t)`, `Story.DATE`, `Story.CLOCK_STYLE`, `Story.TITLE` and `Story.T.title`. The caller uploads `OSD.canvas` as a 720×540 texture whenever `OSD.draw(t)` returns true.
