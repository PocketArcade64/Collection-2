# Procedural Found-Footage Film Playbook

What we learned building *Environmental Verification* (a 60 second VHS camcorder horror short rendered live in the browser), and how to repeat the process for a new setting.

This is written for the next project, where the location, story and signal colour will change but the method will not. Each section separates what is **reusable as is** from what is **specific to the mushroom forest** and has to be redesigned.

---

## 1. What we built, in one paragraph

A single self-contained HTML file. It renders a 3D scene in raw WebGL 2, runs a camcorder and VHS post chain, and draws a camcorder OSD and closed captions. It plays a soundtrack synthesised offline in JavaScript as three stems (music, effects, voice). It exports a frame-accurate 30 fps MP4 using WebCodecs and a hand-written MP4 muxer. Export offers a choice of frame (1920×1080 16:9 with the camcorder image pillarboxed, or a bare 1440×1080 4:3 image), checkboxes to leave out each audio stem, and a burn-in captions option. A separate button saves the soundtrack as a WAV. Under the player, three view controls sit beside the captions toggle: a camera display toggle that hides the OSD text while keeping every tape and lens effect, a "Fill 16:9, no pillarbox" view for thumbnails, and a "Save frame (PNG)" button that saves the current frame, with captions and the camera display included or left out according to the export panel's checkboxes. Nothing loads from the network except Google Fonts, and those have fallbacks.

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

Write separate source files and concatenate them into one `<script>` with a small build script. Each module is a `const Name = (() => { ... })()` so names don't collide. Load order matters.

| Module | Job | Reuse |
|---|---|---|
| `util.js` | math, seeded RNG, value noise, keyframe tracks, eases, mat4, GL helpers, `TUNE` | as is |
| `tex.js` | small procedural canvas textures (marker numerals) | replace contents |
| `story.js` | path, walk schedule, camera keyframes, fear/focus/breath curves, captions, voice lines, tape events | rewrite per film, keep the structure |
| `world.js` | scene generation, light data, scene shaders | rewrite the content, keep the lighting system |
| `vhs.js` | bloom, DOF, AO, exposure, tonemap, VHS pass | as is, retune |
| `osd.js` | the locked camera display: REC, battery, time, date, title card (section 8 and Appendix A) | copy verbatim; change only the date (and the title card words) |
| `subs.js` | CEA-608 style captions | as is |
| `audio.js` | offline DSP, three stems, loudness normalisation, voice import | keep the engine, rewrite the events |
| `mux.js` | MP4 writer (avc, vp9, aac, opus) | as is |
| `export.js` | WebCodecs export, MediaRecorder fallback | as is |
| `main.js` | render loop, playback, UI wiring | as is |

**Why raw WebGL 2 instead of three.js:** the sandbox has no network, so a CDN library cannot be loaded during testing. Raw WebGL 2 runs in headless Chromium with SwiftShader, which makes real screenshots possible. We wrote custom shaders for everything anyway, so three.js would only have supplied matrices and geometry. Note also that three.js r128 (the last build on cdnjs with simple script tags) has no GTAO, so post effects would have been custom regardless.

**Render pipeline per frame:**

1. CPU: evaluate the story at time `t`, update per-object state (colour state, intensity, visibility) and the emitter list.
2. Upload state and emitter textures.
3. Light map pass: a top-down 2D texture of local light, used for bounce and fog.
4. Scene pass at 720×540 into an RGBA16F target with a depth texture (1024×540 in the fill view, see section 11).
5. Bloom: bright pass, 4 downsamples, 3 upsamples.
6. Camera pass: DOF from depth and focus distance, motion blur on fast pans, cheap SSAO, bloom add, exposure, soft shoulder, gamma.
7. VHS pass at the output size (1920×1080 with a pillarboxed 4:3 image), with OSD and caption textures composited inside it.

---

## 4. Timeline and camera (the backbone)

**Keyframe tracks.** `track([[t, value, ease], ...])`, where the ease applies to the segment ending at that key. Useful eases are smooth, linear, out-cubic, in-cubic, a mild overshoot for whips, a hold (step) for autofocus targets, and a trapezoid-velocity "walk" ease. Walking needs the trapezoid ease. A plain smoothstep over a walk segment peaks at 1.5× average speed, which looks like lurching.

**One warp function.** Every consumer maps time through `Story.warp(t)`. If the film must be retimed, change the warp, never the keys.

**Path.** Catmull-Rom through hand-placed points, arc-length parametrised so the walk schedule is in metres. Helpers you will want again: `pathAt(s)`, `place(s, lateral, forward)` and `yawTo(s, point)`. The last one computes keyframe angles that aim the camera at props automatically, so moving a prop never breaks the framing.

**Handheld rig layers,** summed on top of the keyframes:

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

Order inside one shader:

1. Line index in 540-line tape space.
2. Horizontal offset: low-frequency jitter of at most 0.25 px, tracking tears on demand, a head-switching band on the bottom lines, and rolling-shutter skew from yaw rate.
3. Vertical roll for the tape roll-in.
4. Barrel distortion on the image only.
5. Luma through a 7-tap kernel with negative side lobes (edge ringing). Chroma averaged over 8 taps to the left, so colour smears to the right.
6. Light smear: bright highlights trail to the right.
7. Drifting white balance, pushed toward magenta as the signal colour spreads.
8. AGC noise strongest in the darks, seeded at tape rate (`floor(t * 30)`) so it never looks like digital grain.
9. Lifted blacks, soft clip, vignette.
10. Dropouts (see below).
11. Snow for the start and end.
12. OSD composited with the tape jitter and tears but without barrel, then captions composited untouched.

**Dropouts, the lesson.** Solid white one-line bars look like a cheap overlay. Real decks conceal most dropouts by repeating the line above. What looks right:

- About 72% concealed: copy a short segment from 3 lines above, nudged sideways.
- The rest: broken sparkles a few lines tall with an exponential tail to the right, brightening the image rather than replacing it.
- Each flake persists for 2 frames.
- Rate is driven by fear and by damage events.
- Optionally, a faint tracking-noise band that drifts up the frame under stress.

**Interlacing and scanlines:** leave them out. The brief asked for tape and lens artefacts, not a CRT.

---

## 8. OSD and captions

### 8.1 The camera display is locked

The person approved the final camera display and wants **exactly the same display in every future film**. The only thing that changes between projects is the date. Do not redesign it, restyle it, move it, or "improve" it. Copy `osd.js` from Appendix A byte for byte and edit only the `DATE` constant.

It was matched by eye against a reference frame from a real 1990s consumer camcorder (REC top left, battery top right, time above date bottom right). Rebuilding it from memory is how drift creeps in, so always copy the appendix.

**Elements and positions** (in the 720×540 OSD canvas, which maps onto the 4:3 image):

| Element | Position | Details |
|---|---|---|
| REC tally dot | centre (48, 53) | red `#d8342b` disc, radius 8.5, on a dark rim disc of radius 11 |
| "REC" | top-left of text at (66, 43) | pixel lettering, scale 3 |
| Battery | top-left at (606, 40) | 60×26 body, terminal nub on the **right**, thick off-white outline, three cells (drops to two at a story moment, 0:38 in this film) |
| Time | right edge at x 684, top at y 456 | format `H:MM AM` / `H:MM PM`: time first, then AM or PM, no seconds, no leading zero on the hour |
| Date | right edge at x 684, top at y 492, directly under the time | format `MMM.DD.YYYY`: three-letter month in capitals, then a period, **no spaces after the periods**, for example `JAN.27.2027` |
| Title card (first seconds only) | centred at x 360, rows at y 190 and y 246 | same lettering, scale 5 for the name, scale 3 for the second line |

**The lettering:**

- **The grid.** A 5×7 pixel character generator, monospaced on a 6-unit cell (5 pixels plus a 1-unit gap). Drawn with square pixels at scale 3 (3 px per font pixel).
- **The heavy uprights.** Each lit pixel is drawn 1.4× wider than it is tall (`fw = round(s * 1.4)`). This makes the upright strokes read heavier, like the reference. Without it the letters look too thin.
- **The colours.** Ink is off-white `#f2efe4`. Every lit pixel sits on a dark rim `rgba(14,12,10,0.8)`, expanded by `max(1, round(s * 0.55))` px on each side.
- **Glyph details that matter:**
  - "1" has a flag and a base.
  - "." and ":" are single square pixels.
  - "9" has a curled tail.
  - "3" has a flat top.

**How it is composited (also locked):**

- **The canvas and its texture.** The OSD is drawn on its own 720×540 canvas. It is uploaded as a texture with nearest filtering, and only when its visible state changes (the minute ticks, the battery changes, the title appears or goes).
- **Inside the VHS pass.** The OSD gets the same horizontal line jitter, tracking-tear offsets and head-switching offset as the picture, plus a slight two-tap horizontal blur. It gets **no lens barrel and no vignette**. This is what makes it look burned in by the camera rather than pasted on.
- **When it shows.** The OSD appears after the tape roll-in (0.85 s) and disappears at the tape end (59.5 s), following `Story.tape(t).osd`.
- **Hiding it.** The person wanted the option to hide the display text and keep the camera look. That is a viewer and export toggle, done by passing 0 for `uOSDOn` in `main.js`. Never edit `osd.js` to hide it. The toggle hides the whole OSD layer, title card included, and leaves the VHS pass untouched. Export gets its own "Camera display" checkbox, and files made without it get a `-noosd` suffix.
- **The red dot is the one exception to the single-signal-colour rule.** It matches the reference camera, so keep it even when the story's signal colour is also red.

**Per project, change only:**

1. `DATE` in `osd.js`. Ask the person for the date at the start of every project, and write it in the `MMM.DD.YYYY` format.
2. The title card words (location name and environment number) are story content, not interface. They use the locked lettering, sizes and positions, but their text comes from the new setting. If the person wants no title card, remove those two lines and change nothing else.

The time shown comes from `Story.clockSeconds(t)` (start time plus elapsed time, plus any scripted jump after a tracking tear). Keep the display format exactly as specified. If a new story calls for a different start time or no jump, change it in `story.js`, never in `osd.js`.

**Verify it every time:** render one frame during the title card and one later frame, crop the top-left and bottom-right corners at 2×, and compare them with Appendix A's description. Check the date has no spaces after its periods, the time reads time first then AM/PM, and the battery nub is on the right.

### 8.2 Captions

- **Captions:** a 1440×1080 canvas in IBM Plex Mono 600 at 42 px, a solid black box per row, at most 32 characters per row. The bottom of the last row sits at y 896, which keeps it clear of the time and date. Hold each for at least max(1.8 s, speech + 0.6 s). Wait for `document.fonts.load` before the first draw. Check that every SDH caption sits where its sound actually is; we had a stray tape-noise caption over a moment of silence.

---

## 9. Audio (keep the engine, rewrite the events)

**Engine:** plain JavaScript DSP into Float32Arrays at 48 kHz.

- RBJ biquad filters (`lp`, `hp`, `bp`, `peak`, low shelf).
- An event helper `ev(stem, t0, dur, generator, pan, gain)`.
- Continuous beds computed per sample with phase accumulators so pitch can glide.
- Three stems rendered once at load, about 1 to 2 s on a laptop.

**Shared curves.** Footsteps come from the walk schedule: one step per 0.7 m travelled, plus scripted shuffles on turns. Breath comes from the same phase table as the camera. Cloth rustle follows the camera's angular velocity. Zoom servo whine follows the zoom keyframes. Autofocus ticks fire when the focus spring moves fast.

**Footsteps were too loud.** The person found the footsteps too loud in the finished film. Next time start them clearly lower than this film did (here they are `step(S, t, 0.075 * l)` in `audio.js`; try roughly half that, about 6 dB down, as the starting point), then measure them against the voice and the bed and ask the person to listen before the mix is final. Footsteps should sit under the voice and only lead during the quiet walking stretches.

**Silence.** Use real digital zero windows across all stems, then fade the bed back in so it doesn't click.

**Loudness.**

- Implement BS.1770 K-weighting, 400 ms blocks with 75% overlap, and both gates.
- Normalise the full processed mix to −14 LUFS, then run one correction pass measured after the limiter. Without the second pass the limiter left us at −14.6.
- Apply the same gain to every stem, so a stems-only export keeps the right relative level.

**Balance targets and how we got them.**

- Measure speech RMS only inside the voice-line windows, and compare it with the bed's RMS.
- Target the bed about 8 dB under the voice. We ended at −16.7 dB speech against −25.3 dB bed.
- Impacts and drags must be scaled hard; our first pass had them about 10 dB too loud.

**Voice.** The browser cannot synthesise convincing speech that Web Audio can capture or export. We used a formant-synthesised murmur that follows the line timings, and added a "load voice recording" input plus an on-page cue sheet. Next time, raise this limitation before building and suggest recording the lines early.

---

## 10. Testing in the sandbox (the workflow that made everything possible)

- **Headless browser:** Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Launch flags: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. WebGL 2 and float render targets work.
- **Serve over http://localhost,** not `set_content`, because WebCodecs needs a secure context.
- **Run the HTTP server inside the Python test script.** Background servers started in one bash call die before the next.
- **Expose a test hook,** `window.__film = { renderAt, TUNE, computeExposure, Story, World, Snd, Exporter, ready }`. The harness can then set tuning values, render any timestamp, read pixels, and project 3D points to screen space to find out where things are.
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

Answer these before writing code, then change only `story.js`, `world.js` content, the date and title card words in `osd.js`, the audio events and the tuning values.

1. **The light source.** What glows (screens, lanterns, coral, signage, embers)? Can it be clustered into at most 512 emitters? What does its emission look like up close?
2. **The signal colour.** What changes colour, and how does it spread and return? Pick surface albedos that go dark under it, and check its off-channels stay near zero.
3. **The space.** What is the walkable path, what fills the space procedurally, and where are the deliberate dark gaps?
4. **The inconsistencies.** A duplicate, a changed detail, something that vanishes. Where are they, and which camera move reveals each one?
5. **The camera reason and the date.** Why is someone filming, and what are the title card words? Ask for the **date** to show on the camera display. The display itself is locked (section 8.1): copy it from Appendix A and change only the date.
6. **The threat beat.** What happens to the camera, and how do you show the aftermath without showing anything that would give the threat a shape?
7. **The sound world.** What is the bed made of, what darkens as the signal spreads, what are the source sounds, and where are the silences? Keep the footsteps well down from the start (section 9).
8. **Voice.** Will real recordings be supplied? If not, flag it early.
9. **Delivery.** A plain HTML file or a hosted page? 16:9 with pillarbox, bare 4:3, or both? Which stems need export checkboxes? Should captions be burnt in? Keep the camera display toggle, the fill 16:9 still view and the PNG frame button from this film (sections 8.1 and 11), and keep the film itself primarily 4:3. Which browser and player will the person use, so you know whether the MP4 needs uncompressed PCM sound (Mac, QuickTime, editors) or AAC?
10. **Budget.** Estimate the first build plus at least 4 to 6 render-and-inspect tuning rounds, and say so before starting.

---

## 14. Known limitations to mention up front next time

- The guide voice is not intelligible speech.
- First load takes several seconds while the world and the soundtrack generate.
- Export speed depends on the GPU, roughly a minute on a decent laptop.
- The H.264 and AAC export path was validated through the muxer and ffmpeg but not end to end in the sandbox, because the sandbox browser lacks both encoders.
- PCM sound inside an MP4 plays in QuickTime, editors and VLC, but some web players may not play it. The AAC option and the WAV soundtrack cover those cases.
- Procedural legs and other human parts read poorly up close. Keep them cropped, small, dark, blurred or moving fast.

---

## Appendix A. Locked camera display (`osd.js`)

Copy this file exactly. Change only `const DATE` (format `MMM.DD.YYYY`, no spaces) and, if the setting changes, the two title card lines. It depends on `Story.tape(t).osd` (whether the display is on) and `Story.clockSeconds(t)` (seconds since midnight). The caller uploads `OSD.canvas` as a 720×540 texture with nearest filtering whenever `OSD.draw(t)` returns true.

```javascript
// ---------- osd.js : consumer camcorder display (REC, battery, time, date) and title generator ----------
const OSD = (() => {
  const W = 720, H = 540;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  // 5x7 camcorder character generator, drawn with fat square pixels and a dark rim,
  // matching the burned-in date/time lettering of a 1990s consumer camcorder
  const G5 = {
    '0': '01110 10001 10011 10101 11001 10001 01110', '1': '00100 01100 00100 00100 00100 00100 01110',
    '2': '01110 10001 00001 00010 00100 01000 11111', '3': '11111 00010 00100 00010 00001 10001 01110',
    '4': '00010 00110 01010 10010 11111 00010 00010', '5': '11111 10000 11110 00001 00001 10001 01110',
    '6': '00110 01000 10000 11110 10001 10001 01110', '7': '11111 00001 00010 00100 01000 01000 01000',
    '8': '01110 10001 10001 01110 10001 10001 01110', '9': '01110 10001 10001 01111 00001 00010 01100',
    'A': '01110 10001 10001 11111 10001 10001 10001', 'B': '11110 10001 10001 11110 10001 10001 11110',
    'C': '01110 10001 10000 10000 10000 10001 01110', 'D': '11110 10001 10001 10001 10001 10001 11110',
    'E': '11111 10000 10000 11110 10000 10000 11111', 'F': '11111 10000 10000 11110 10000 10000 10000',
    'G': '01110 10001 10000 10111 10001 10001 01111', 'H': '10001 10001 10001 11111 10001 10001 10001',
    'I': '01110 00100 00100 00100 00100 00100 01110', 'J': '00111 00010 00010 00010 00010 10010 01100',
    'K': '10001 10010 10100 11000 10100 10010 10001', 'L': '10000 10000 10000 10000 10000 10000 11111',
    'M': '10001 11011 10101 10101 10001 10001 10001', 'N': '10001 10001 11001 10101 10011 10001 10001',
    'O': '01110 10001 10001 10001 10001 10001 01110', 'P': '11110 10001 10001 11110 10000 10000 10000',
    'R': '11110 10001 10001 11110 10100 10010 10001', 'S': '01111 10000 10000 01110 00001 00001 11110',
    'T': '11111 00100 00100 00100 00100 00100 00100', 'U': '10001 10001 10001 10001 10001 10001 01110',
    'V': '10001 10001 10001 10001 10001 01010 00100', 'W': '10001 10001 10001 10101 10101 10101 01010',
    'Y': '10001 10001 01010 00100 00100 00100 00100', ':': '00000 00000 00100 00000 00000 00100 00000',
    '.': '00000 00000 00000 00000 00000 00000 00100', ' ': '00000 00000 00000 00000 00000 00000 00000',
  };
  const GL = {}; for (const k in G5) GL[k] = G5[k].split(' ');
  const INK = '#f2efe4', RIM = 'rgba(14,12,10,0.8)';
  const adv = (s) => 6 * s;                      // monospaced cell: 5 pixels + 1 gap
  function label(str, px, py, s = 3, align = 'left') {
    const w = str.length * adv(s) - s;
    if (align === 'right') px -= w; else if (align === 'center') px -= w / 2;
    px = Math.round(px); py = Math.round(py);
    const cells = [];
    for (let i = 0; i < str.length; i++) {
      const g = GL[str[i]] || GL[' '];
      for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === '1') cells.push([px + i * adv(s) + c * s, py + r * s]);
    }
    const o = Math.max(1, Math.round(s * 0.55));
    // the character generator's pixels bleed sideways, so vertical strokes read heavier
    const fw = Math.round(s * 1.4);
    x.fillStyle = RIM; for (const [a, b] of cells) x.fillRect(a - o, b - o, fw + 2 * o, s + 2 * o);
    x.fillStyle = INK; for (const [a, b] of cells) x.fillRect(a, b, fw, s);
  }
  function battery(px, py, bars) {
    // thick outline, three cells, terminal nub on the right
    const w = 60, h = 26, k = 3;
    x.fillStyle = RIM; x.fillRect(px - 2, py - 2, w + 4, h + 4); x.fillRect(px + w, py + 6, 10, h - 12);
    x.fillStyle = INK; x.fillRect(px, py, w, h); x.fillRect(px + w, py + 8, 7, h - 16);
    x.fillStyle = RIM; x.fillRect(px + k, py + k, w - 2 * k, h - 2 * k);
    const cw = (w - 2 * k - 4 * 2) / 3;
    x.fillStyle = INK;
    for (let i = 0; i < bars; i++) x.fillRect(px + k + 2 + i * (cw + 2), py + k + 2, cw, h - 2 * k - 4);
  }
  function fmtTime(sec) {
    let h = Math.floor(sec / 3600) % 24; const m = Math.floor(sec / 60) % 60;
    const pm = h >= 12; h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${pm ? 'PM' : 'AM'}`;
  }
  const DATE = 'JAN.27.2027';
  let lastKey = '';
  function draw(t) {
    const on = Story.tape(t).osd;
    const title = t > 1.1 && t < 6.6;
    const bars = t < 38 ? 3 : 2;
    const time = fmtTime(Story.clockSeconds(t));
    const key = [on, title, bars, time].join('|');
    if (key === lastKey) return false;
    lastKey = key;
    x.clearRect(0, 0, W, H);
    if (!on) return true;
    // REC with its red tally dot
    x.fillStyle = RIM; x.beginPath(); x.arc(48, 53, 11, 0, 7); x.fill();
    x.fillStyle = '#d8342b'; x.beginPath(); x.arc(48, 53, 8.5, 0, 7); x.fill();
    label('REC', 66, 43, 3);
    battery(606, 40, bars);
    // time above the date, bottom right
    label(time, 684, 456, 3, 'right');
    label(DATE, 684, 492, 3, 'right');
    if (title) {
      label('LUMINOUS HOLLOW', 360, 190, 5, 'center');
      label('ENV 3  VERIFICATION', 360, 246, 3, 'center');
    }
    return true;
  }
  return { draw, canvas: cv };
})();
```
