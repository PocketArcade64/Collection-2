# Found footage kit

One self-contained HTML player per film: a WebGL 2 scene, camcorder optics, the VHS tape pass, the locked camera display, CEA-608 captions, an in-browser soundtrack in three stems, and MP4 / WAV / PNG export. The story and scene are neutral placeholders that exercise every system once.

```
python3 build.py          # -> dist/<slug>.html (open it in Chrome, Edge or Safari)
```

Read `directions.md` before starting a film. In short, per film you edit:

| File | What changes |
|---|---|
| `src/story.js` | Slug, date, clock style, title card, end card, beats, route, camera keyframes, focus hunt, fear, dialogue, captions, sound cues |
| `src/world.js` | The CONTENT block: boxes, materials, fixtures, decals, dark zones |
| `src/tex.js` | Canvas textures for signs and props |
| `src/audio.js` | `CFG` levels and any `CUSTOM` sound events |
| `src/util.js` | `TUNE` look values |

Everything else (`rig`, `post`, `vhs`, `osd`, `subs`, `mux`, `export`, `main`, `template.html`) is reusable as is. `osd.js` is the locked camera display and is never edited.

Voices: until you load recordings, lines play as wordless murmurs. Use "Load voice recordings" with WAV files named after the line ids (`w1.wav`, `p1.wav`). Kokoro TTS output works.

Testing (headless Chromium + SwiftShader, see directions.md section 10):

```
python3 test/shots.py 2.0,9.0,15.05,25.3   # contact sheet -> /tmp/sheet.png
python3 test/export_test.py                # 8-frame MP4s (both frames), WAV, PNG, fill view
python3 test/voice_test.py                 # loads test recordings
node test/node_audio.js                    # soundtrack in Node -> /tmp/mix.wav
node test/node_mux.js                      # muxer vs ffmpeg H.264 / AAC / PCM
```
