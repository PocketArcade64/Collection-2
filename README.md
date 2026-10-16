# Collection-2

Pool: Build Instructions for Claude

0. What to build
Build one first-person found-footage short, about 2:55, as a single self-contained HTML file that plays the film and can be exported to MP4. The file must work on a different computer with no internet and no extra files.
* Inline everything: the 3D library, all scripts, textures (base64), the bitmap font, and any images. Audio is synthesized with Web Audio, with no audio files.
* Find HD textures online where they help (ceramic pool tile, concrete, painted plaster, grout, rubber, brushed metal, rope). CC0 sources such as ambientCG or Poly Haven are ideal. Downscale to about 1024 px, compress to JPEG or WebP, and embed as base64. If the network is blocked, fall back to procedural textures with the same character.
* Build it as separate logical modules (world, rooms, textures, vhs, osd, subs, story, main), then bundle them inline into the one HTML file.
* Include the Dialogue Editor mode (section 9) and the MP4 export with audio checkboxes (section 10).
1. Where this short sits in the larger story
The world. A company, runs the Consciousness Simulation Network (CSN). It copies a person's consciousness into a simulated environment (a Build), runs a training scenario, then writes the experience back into the original body. The copy is a Cognitive Instance (CI) and is never called a person. Each short in this series is a recovered camcorder recording from inside a simulation. The tone is quiet, procedural, psychological unease. There is no gore, no monsters, no jump scares, no score, and the company never explains itself or behaves like a cartoon villain.
The Hat Man. In June 2025 the third-ever upload (Upload 003) lost its connection during a simple orientation puzzle. The extraction protocol had no handling for an unresponsive copy, so the file was marked "closed" and the copy was never pulled out. Left running with no evaluator, it walked the simulation's edges and learned its seams. He wants out, and later wants to shut down the thing that kept him in. The audience will eventually learn he is the Hat Man. In this short he is simply a lost, unextracted CI. He has not heard another voice since June 2025.
The Glyph. The official CSN manual-extraction icon is ten dots in a ring. In August 2025 he copied it by arranging nine loose objects in an evenly spaced ring and standing in the gap himself as the tenth position. The objects rotate erratically, then sink into the floor, and a two-note chime plays. His hands glow red, and he can turn the lights red (silent, with a very low hum). In October 2025 he repeated the ritual in the Staging Plane, and red glow seeped into every door there.
The Staging Plane and the Hotel. The Staging Plane is a blank, completely white environment that every CI passes through. Each door is a door-shaped hole in the white, tagged with a Build designation, and it opens onto a different environment. Visually each hole is a real window onto geometry that exists behind it, so the view parallaxes correctly as the camera moves (you see different parts of the other room as you shift). The door tagged HOTEL leads to an endless hotel corridor. In the corridor, each numbered door leads to a different test scenario. Door plates and timeline (a time jump only happens during static):
Plate	Environment	Type	Enter to exit	Days
22	Fairhaven house	in corridor short	Oct 23 to Oct 23, 2025	0
1930	Rubber hose ad room	in corridor short	Oct 23 to Oct 23, 2025	0
1944	Noir street (he gets a top hat)	separate short	Oct 23 to Oct 25, 2025	2
127	Blue mushroom forest	in corridor short	Oct 25 to Oct 31, 2025	6
1031	Rocky island (red sky, red rain)	separate short	Oct 31 to Oct 31, 2025	0
9	Indoor pool (THIS SHORT)	separate short	Oct 31, 2025 to Jan 3, 2026	64
10	Subway platform	separate short	Jan 3 to Mar 16, 2026	72
Plate 9 stands for nine objects in the ring, with him as the tenth. The next door, 10, is the ten dots on the exit sign. Each separate short starts with him already standing inside the environment and ends with him walking through a door back into the hotel corridor, as the door closes behind him.
What came just before. On Door 5 (rocky island, same day, Oct 31) he used his red power to turn the sky red and rain red, then left through the same door he entered. He is confident and treats the doors as a playground to test his power. He has always had the door he came in through. This short is where that stops being true.
What comes next. In the subway short (Door 10) the entry door vanishes again, his panic turns to anger and a wish for revenge, and he learns he can make a door by forming a rectangle with his hands. This short must set that up without stealing it.
2. Character arc for this short
This short is the first time the Hat Man loses control, and the first time his power cannot solve his problem.
Stage	Emotional state	What it shows
Arrival	Composed, curious, a little weary	He assumes this is just another test room.
Door gone	Shock, then panic	First loss of the safety net. He has no extraction path.
Power attempt	Desperate	He uses the red power on the wall (as in the October 2025 doorway) and it fails. His power is a tool, not a skeleton key.
Search	Exhausted, flat, human	Sixty-four days are compressed into a few minutes of tape. He counts to stay sane.
Ritual	Deliberate, almost reverent calm	The glyph is not a weapon. It is the only key he has, and it costs him time.
Exit	Hollow relief, then a first seed of intent	"There has to be a faster way." This is the seed of the hand-door he learns next.
Rules for the performance and writing:
* The audience should sympathize with him. He is a victim here, not a threat.
* No revenge talk yet (the subway short). No mention of the Company by name.
* No hat on screen. He wears the top hat from the Noir short, but the camera is first person and there is no mirror, reflection, or shadow of it.
* No outside voice at all (no intercom, no PA, no evaluator).
3. Found Footage: Indoor Pool
Title (YouTube): SUBJ_003_CAPTURE_PLATE_09.mp4 [RECOVERED]
Purpose of the camera: The subject-view capture camcorder is the standard recording device attached to every orientation exercise, and procedure says the subject keeps recording. It is also the only object he carries and the only thing that tells him what day it is. The date on its HUD is how he, and the audience, measure the 64 days.
Format: one continuous first-person handheld recording. The picture only breaks at tracking tears / static, and the on-screen date jumps only during those breaks. Do not time-compress. Keep keyframes in real time.
Act 1: Arrival (0:00 to 0:30)
* Tape roll-in. 
* He is already standing at the shallow end of a drained pool. Pale tile, empty basin, a lane rope slack on the deck, fluorescent panels, a constant low drone. No water, no lifeguard, no one.
* Slow, steady pan along the room. He is calm and a little tired from the last door.
* If the room reads computer generated, he mentions that textures are unfinished in this early build (line D03).
* He decides to film the door for the record and turns around.
Act 2: The door is gone (0:30 to 1:05)
* The wall behind him is plain tile. No frame, no seam, no paint change. Hold on it in silence.
* Panic. He puts a hand to the wall and checks the corners.
* He tries the red power as in the October 2025 doorway: hands up, the lights go red (silent, very low hum), and he bashes the wall. Three dull thuds and nothing opens. The lights return to normal.
* He forces himself to breathe, then leaves through the only exit, a hallway.
Act 3: The search (1:05 to 2:10)
* Hallways of the same tile and lights connect rooms with different sized pools (see room list below). No room repeats. Nobody is ever seen.
* In the second room (diving well) he sees a life ring on a wall hook and recognizes the shape: a ring, nine of them, and him as the tenth. He takes it.
* He collects rings, one per room, in different hiding places. Each time the picture tears and the date jumps: Nov 12, Dec 3, Dec 24. His gait slows, his breath lengthens, and the camera sits a little lower with the fatigue.
* He has eight and cannot find the ninth. He walks into a corridor with chipped tile that he recognizes.
Act 4: The ritual and the door (2:10 to 2:56)
* It is the arrival room. On the wall where the entry door was, a ninth life ring hangs on a hook. "That wasn't here before." Do not explain it.
* Another tear. Date reads JAN 03 2026.
* He lays the nine rings flat on the deck in an evenly spaced ring, with the gap facing the camera, then steps into the gap. The camera now stands in the tenth position.
* The rings rotate in place, erratically, then sink into the tile. When the last one sinks, the two-note chime plays once. His hands glow red and the room floods red (silent, very low hum).
* On the wall where the entry door was, a door-shaped opening forms. Through it is the hotel corridor (patterned carpet, warm wall lights, a row of doors), visible with true parallax.
* He walks through. In the last seconds he glances back and sees the door closing behind him, with a brass plate on the corridor side reading 9. Cut to static.
4. Timed script (burned-in captions, voice added later)
All lines are spoken by the Hat Man, the same voice actor as in every Hat Man short. Because the voice is recorded after the fact, the captions carry the timing. Leave enough time for each line to be spoken at a natural pace, without dead air. Hold captions for at least max(1.8 s, speech + 0.6 s).
ID	Start	Dur	Line	Delivery
D01	0:07.0	1.6	"Okay. Door nine."	Composed, slightly tired.
D02	0:10.0	3.0	"An empty pool. No lifeguard. No one."	Curious, a little uneasy.
D03	0:15.5	4.5	"Textures are still unfinished in here. Early build, I'd guess." (Only if necessary)	Matter of fact. Default on; toggle off if the scenery looks real enough.
D04	0:22.0	3.6	"Let me get a shot of the door, for the record."	Routine.
D05	0:31.0	1.8	"That was right there."	Quiet disbelief.
D06	0:34.5	2.8	"Oh no. My entry door is gone."	Breath catching, panicked.
D07	0:38.3	2.2	"How do I get out now?"	Rising panic.
D08	0:42.0	2.2	"Come on. It worked before."	Pleading, through his teeth.
D09	0:50.0	2.5	"Nothing. Why isn't it working?"	Shaken, out of breath.
D10	0:55.5	2.2	"Okay. Okay. Think."	Forced calm.
D11	1:07.0	1.8	"A life preserver."	A flat realization.
D12	1:11.0	2.2	"Nine of these. And me."	Quiet, resolved.
D13	1:16.0	0.8	"One."	Counting to stay steady.
D14	1:23.5	3.0	"Four. Another pool. Another size."	Tired, flat.
D15	1:37.5	3.2	"Six. Every hall ends in a pool."	Clipped, a flicker of irritation.
D16	1:52.5	2.8	"Christmas Eve, apparently. Eight."	Hollow.
D17	1:58.0	1.8	"Where is the ninth?"	Almost to himself.
D18	2:11.0	2.4	"That wasn't here before."	Wary, very quiet.
D19	2:36.5	3.5	"Sixty-four days. For one door."	Stunned, then bitter.
D20	2:41.5	2.6	"There has to be a faster way."	Thoughtful. The seed of the next short.
D21	2:45.5	3.6	"Finally, back at the hotel.”	Exhausted relief.

Also add when he returns to the hotel he says “One of these door has to provide a way to exit this simulation”

Non-speech caption cues (SDH, optional, editable in the editor): [TAPE NOISE] at each tear (about 1:20, 1:34, 1:49, 2:14), [THUDS] at about 0:46 to 0:49, [FOOTSTEPS ECHO] during the hallway walks, [CHIME] at about 2:30, [SILENCE] at about 0:30 to 0:31.
Beat timing:
Time	Beat
0:00 to 0:06	Roll-in, title text.
0:07 to 0:30	Arrival, then turn to the door.
0:30 to 0:55	Door gone, panic, red power attempt fails.
0:55 to 1:15	Hallway, second pool, first ring.
1:15 to 2:00	Collection montage. Tears at about 1:20, 1:34 and 1:49 (dates Nov 12, Dec 3, Dec 24).
2:00 to 2:14	Back into the arrival room, ninth ring on the wall.
2:14 to 2:36	Tear (date JAN 03 2026), ritual, chime at about 2:30, red flood, door opens.
2:36 to 2:53	Final lines, walk through the door, glance back, the door closes on plate 9.
2:53 to 2:56	Static.
5. Rooms (hand-authored, no room repeats)
All rooms use the same tile and lighting language, but each has a different pool. Each has a numbered wall placard (for example "POOL 03"). The arrival room is. There are no placards in each room to give a sense of unease and if he has been here before. Some pools are filled with water. 
Room	Pool	Life Preserver place
POOL 01 (arrival)	Medium lap pool with steps at the shallow end	Wall hook where the entry door was (appears only at the end)
POOL 02	Diving well with a tall ceiling and platforms	Wall hook by the ladder
POOL 03	Round wading pool with a faded painted fish	On the floor of the basin
POOL 04	Very long 50 m lane pool	Tangled in the end lane rope
POOL 05	Therapy pool with ramp and handrails	On a hook under a handrail
POOL 06	Circular pool with a central island	On the island
POOL 07	Spa room with plastic benches	Hung on a locker door
POOL 08	Pool with a stacked lifeguard chair	Over the lifeguard chair
Only some of these are shown on screen (the camera does not need to visit all of them). The rest are implied by the date jumps.
6. Style prompt: Simulation Capture Footage
Essence
* One continuous first-person handheld recording (4:3, VHS-era camcorder look), ending when the tape does.
* A liminal, drained pool complex, clean and quiet at first. It goes wrong through absence and repetition: the entry door is gone, hallways keep producing new pools, and a ring hangs where a door used to be.
* Dread comes from small inconsistencies and a person staying methodical as his situation worsens.
* Nothing is ever shown attacking. No figure, no silhouette in the glass, nothing in the basins.
Materials and rendering
* Frame: 4:3 pillarboxed in 1920x1080. Render the 3D at low resolution (for example 720x540) and let the VHS pass upscale.
* The scenery must look believable through a grainy camcorder filter. Give the important objects real textures: tile with grout and grime, scuffed concrete, painted plaster, rope, rubber.
* Tile: small square ceramic tile, pale aqua and off-white, chipped corners, faint tide lines, rust stains near drains and ladders.
* Basins: drained, sloped from shallow to deep, painted depth markers ("3 FT", "5 FT", "9 FT"), lane lines on the floor, drains with grates, a few small puddles.
* Ceilings and lighting: drop-ceiling tiles with flat fluorescent panels, a few panels dimmer or flickering. No windows. The look is bright and sterile, slightly too clean.
* Life rings: a classic ring buoy (white with four red bands, rope around the outside). Use the identical model for all nine (same category, same shape).
* Doors and hallways: plain painted doors, white corridors with a tile band, a drinking fountain, a mop bucket, a closed locker bank. Vary incidental details (stains, scuffs, crooked signs), but not the layout language.
* Hands: simple, believable low-poly hands and plain dark sleeve cuffs (match the other Hat Man shorts). Looking down shows only boots, tile and hands.
* Hotel corridor (final shot): build real corridor geometry behind the wall opening so the parallax is genuine. Use the hotel carpet pattern, supplied by the filmmaker, embedded as base64 in one constant HOTEL_CARPET_DATA_URI. If it is missing, use a procedural stand-in. Warm sconces, numbered doors. Place it far behind the wall so it is not visible through any other opening.
* Red state: the red power changes surface color as well as emission (it stains surfaces, it is not an overlay). It rises from his hands outward and returns to normal after. Drive the emissive high enough to cross the bloom threshold.
* VHS camcorder pass: small line jitter (0.25 px or less, low-frequency), head-switching band, tracking tears on demand, barrel distortion and vignette on the image but not on the OSD, luma blur with edge ringing, chroma smeared right, light smear and bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks, soft clip. Noise at tape rate (30 fps). No scanlines, no RGB mask.
* OSD (identical in every Hat Man short): bitmap font with black outline, REC dot, battery, time, date (the key element), and a small label SUBJ 003. The title generator uses the same font, larger. Time and battery tick on through every tear. Only the date jumps.
Color logic
* Normal: pale aqua, off-white, flat institutional gray, slightly green-yellow fluorescent cast.
* Red: deep, dark, bruised red, not bright alarm red. White balance drifts toward magenta in the red state.
* The only saturated accents are the red bands of the life rings and the red power.
* Example palette: tile #b9d3d0, grout #8f9794, concrete #8a8a86, ceiling #d9d9d2, ring white #e8e8e2, ring red #b3262e, red wash #8a0f1c, deep red #4a0610.
Type and captions
* Closed captions in CEA-608 style: monospace (for example IBM Plex Mono 600) at about 42 px, white on a solid black box per row, 32 characters or fewer per row, centered inside the 4:3 frame above the OSD, untouched by tape noise.
* There is only one speaker, so no speaker tags. SDH descriptions go in brackets.
* Title text over the first shot: scenario name [REDACTED] and the date.
Motion quality
* One continuous handheld take. Cuts happen only at the power-on roll-in, tracking tears (date jumps), and the final static.
* Handheld = walking gait (head bob of a few cm, sway, small roll) + breathing (about 0.27 Hz) + tremor whose amplitude follows a fear curve:
    * 0:00 to 0:30 calm and steady.
    * 0:30 to 0:35 sharp spike when the door is gone.
    * 0:35 to 0:55 high tremor, quick uneven breathing.
    * 0:55 to 1:15 settling.
    * 1:15 to 2:00 fatigue: slower gait, longer breaths, camera sags a little lower.
    * 2:00 to 2:14 a brief spike at the ninth ring.
    * 2:14 to 2:36 deliberate, steady calm (the ritual should be disturbingly composed).
    * At the chime, freeze the handheld motion entirely for a held breath, then release.
* Hold the camera at chest height, slightly low and wide, never eye level.
* Autofocus hunts on the tile and the distant end of long rooms, with overshoot (blur, lock, slip, lock). Auto-exposure lags (about 0.45 s) after sudden lighting changes, and gain noise pumps.
* Rolling-shutter skew on fast turns. Motion blur only on fast pans.
* Camera grammar: slow pan across the first room (emptiness), glance back (doubt, the missing door), a pan along the 50 m pool (scale and loneliness), a held framing on the ring as it sinks (the threshold), a final look back at the closing door.
Sound palette
* No score. Only what the tape would have recorded.
* Room tone: a constant low dehumidifier drone, fluorescent buzz, distant pump hum, occasional drain drip. Reverberant tiled space for footsteps, rope and rubber, but keep the voice dry (heavy reverb destroys intelligibility).
* Footsteps and breath match the camera bob. The breath rate follows the fear curve.
* Red power: silent apart from a very low hum (about 40 to 55 Hz).
* Chime: the canonical two-note chime plays once, when the last object of a ring sinks. It must be identical in every short. If building standalone, define it as a shared constant: two soft bell tones (a sine fundamental with a few inharmonic partials) a fourth apart, descending, about 0.35 s between notes, dry. Never play it at any other point.
* Rings: rubber scrape on tile, a soft hollow spin, then a muffled sink into the floor.
* Foley: camcorder clack and motor, zoom servo, AF ticks, tape noise at each tear.
* Mix: bed about -8 dB under voice, -14 LUFS overall.
Native moves
* The OSD date as the story clock: it jumps only in static and tells the audience how long this has taken.
* Emptiness and repetition: the same tile, a different pool every time.
* Procedure as dread: counting to nine, laying objects in a ring, still filming.
* The ring appearing where the door was, never explained.
Pitfalls
* The first 30 seconds must feel genuinely mundane, with no early weirdness.
* Clean CG pools read as a game. Keep the tape pass heavy and the textures plain but believable (grime, chips, stains).
* Do not repeat rooms. Different pool sizes and shapes are the whole point.
* Do not show a figure, a reflection of the hat, or anything in the drains.
* Do not let the red power open the door. The ritual does.
* Do not explain the ninth ring.
* Keep line wobble at 0.25 px or less and leave the caption box untouched.
* Pure red never blooms at low emissive. Drive it far higher.
7. Realism
The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished, less cinematic option.
* 1990s consumer camcorder: small CCD, electronic stabilization that occasionally overcorrects, crushed blacks, noisy shadows, blooming highlights, slow exposure recovery.
* Physically grounded light: fluorescent panels as practical sources, slight flicker, light falling off down long halls.
* No dramatic cinematic camera moves, no impossible angles, no steadicam smoothness.
* Nothing appears in sharp focus that the camera could not plausibly resolve. No uniform noise or mathematically perfect lighting.
* Breathing and footsteps must audibly match the camera bob.
8. Engine
* world: room layouts, pools, hallways, placards, lighting states (normal, red), the hotel corridor behind the wall.
* rooms: the eight pool rooms plus the arrival room, ring placement, ring physics (flat on the deck, spin, sink), the wall opening and its parallax view.
* tex: embedded HD textures with procedural fallbacks.
* vhs: the camcorder shader pass.
* osd: bitmap font, REC, battery, time, date (jumps only in tears), SUBJ 003 label, title generator.
* subs: 608 captions.
* story: timeline, fear curve, focus curve, date-jump keyframes, ritual, ending.
* main: renderer, post chain (ambient occlusion, depth of field, bloom, then VHS), handheld rig.
9. Dialogue Editor mode (in the HTML file)
I need to change the burned-in dialogue and its timing without editing code. Add a toggleable Dialogue Editor mode (button and the E key). It is hidden by default and never appears in an MP4 export.
* Data: a single DIALOGUE array at the top of the script: { id, type: "speech" | "sfx", start, dur, text, delivery, enabled }. The script table in section 4 is the default content.
* Visualizer: a timeline strip along the bottom, 0:00 to the end, with a playhead and each line as a draggable, resizable block. Speech and sfx cues sit on separate lanes. The block shows its ID and text.
* Edit: click a block to edit its text, start (mm:ss.s), duration, delivery note and enabled toggle. Buttons to add at the playhead, duplicate, and delete.
* Preview: play, pause and scrub, with the real caption box updating live. Optional loop-region playback.
* Validation: warn if a row exceeds 32 characters, if lines overlap, if the hold is shorter than max(1.8 s, speech + 0.6 s), or if the speech rate exceeds about 17 characters per second.
* Persistence: import and export JSON, plus a "Bake into HTML" button that downloads a copy of the file with the current DIALOGUE written into it. Do not rely on localStorage alone.
10. MP4 export
Export the 4:3 picture pillarboxed in 1920x1080 at 30 fps using a deterministic, frame-stepped render. Provide separate checkboxes to include or exclude Music, Sound Effects, and Voice/Narration so each audio element can be exported independently. This film has no music, so the Music box exports silence for that stem. Captions are burned in and the Dialogue Editor UI is never included. Use WebCodecs with an inlined MP4 muxer when available and a MediaRecorder fallback otherwise.
11. Variation space
Fixed: the drained pool setting, the vanishing entry door, the nine life rings with him as the tenth, the date jumps at tears (Nov 12, Dec 3, Dec 24, Jan 3), the ninth ring on the wall where the door was, the canonical chime, the hotel corridor exit, the final close-up of plate 9, and the ending in static.
Open to your taste: the exact pool shapes and room order, the ring hiding places, minor wording in the lines, how many rooms are shown on screen, and small environmental clutter.
