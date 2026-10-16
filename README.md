# Collection-2

Hat Man hotel arc | Starts October 23, 2025, ends October 31, 2025 | Target runtime about 6:00 (see section 8 for where to trim)
Read this first. You have no prior context. This is one short in a series of first-person found-footage analog horror shorts set inside simulations run by a fictional company. Build it as a single HTML file that plays and exports the short. Everything must live inside that one file (inline every JS library, embed textures, models, fonts and the cartoon video as base64, no network calls at runtime) so it works alone when sent to another computer. Never use any real organisation, logo, game or film title.
Attachments the user will supply:
* The hotel carpet pattern (image). Embed it and tile it. If it is not seamless, mirror-tile or blend the edges.
* The finished 1930s rubber hose cartoon video (the “owl video”, about 2:35, sepia with spot color, explains the service). It plays on a screen inside one room. Transcode it to about 540p H.264 at roughly 1 Mbps with AAC audio, embed as base64, and budget the whole file at about 40 MB.
* 3D environment models (GLB), generated later: the Fairhaven house interior and street, the blue mushroom forest, and the screening room. If they are not attached, build clearly labelled placeholder environments with the same footprint and a loader hook (embedded base64 GLB) so models can be swapped in without touching the story code.
* The finished builds or briefs of the neighbouring Hat Man shorts, and the finished Fairhaven video as a camcorder look and mix reference (see section 5).
Textures: find HD textures online where applicable (CC0 sources such as Poly Haven or ambientCG) for wallpaper, wood paneling, door wood, brass and ceiling tile. Downscale to about 1K, embed as base64 JPEG, and fall back to procedural textures if a download fails. The carpet is always the user's pattern.

2. Where this short fits
The world. The company copies human consciousness into simulations (the CSN, Consciousness Simulation Network) to train people. The copy is a Cognitive Instance (CI, never called a person). The sedated body outside is the Source Subject. When a Run ends, the CI's experience is compressed into a Delta, written back into the Source Subject (Reintegration), and the CI is retired. Staff are calm, polite and sincere. The company is never framed as evil.
The Hat Man. Upload 003. On June 10, 2025 he ran a basic button-puzzle orientation exercise. The connection dropped, the extraction protocol had no handling for a copy that stopped responding, the body woke fine, the file was marked closed, and the copy was never pulled out. Alone in the test rooms he learned the exit glyph (ten dots in a ring), arranged nine objects in a ring and stood in the gap as the tenth position, and gained a red-glow power. On October 23, 2025 he opened the Staging Plane (a blank white space of door-shaped holes, each tagged to an environment) and, after arranging nine objects there, sent red light seeping into every door frame. He then walked through the door tagged HOTEL straight into the hotel corridor, and that short ended there. This short starts at that exact moment. He is seen only as POV: hands and boots, never face or body.
His arc by short:
Short	State of mind
Orientation test (Jun to Oct 2025)	Compliant, procedural, waiting for rescue
This short, Oct 23 to Oct 31, 2025	Curious, still hunting for extraction. Learns what the company does, learns his own file's fate, learns his power works across Builds
Noir street, Rocky island	Searching, increasingly uneasy
Indoor pool	Panic: his entry door vanished
Subway platform	Panic turning to anger, learns to form a door with his hands
Return to the test room (Oct 15, 2026)	Last hope dies, he refuses their terms
Job of this short. The audience has never been told what the company does. This is where the Hat Man, and the audience, learn it: through a cheerful 1930s cartoon that explains capture, run, Delta and Reintegration. He realises nothing was ever written back for him. He also sees that the places behind these doors are real scenarios, and that his red light reaches into them. He does not understand the hotel yet. He never says he intends harm.
Release note. Post in March, after the technician shorts, so the hotel is the reveal. Nothing here should explain what those shorts left open.
The red counterpart rule. Every environment in the hotel has a red-light twin: identical geometry, lit by a deep red sky and ambient light, with details slightly wrong. The Fairhaven twin is the red town where every house has extra owl paintings on every wall (the “Unit 22 layout”). The mushroom twin is the same forest glowing red. Technicians meet these twins in 2027 shorts and the audience should recognise them.
3. The hotel (rules the build must follow)
* Setting: no lobby, no reception, no windows, just the corridor of doors. He arrives directly from the Staging Plane into the corridor. The user's carpet runs underfoot. Warm dim lamps, faint ventilation hum. This corridor is also where the other Hat Man shorts end, so keep it consistent and reusable.
* Corridors: endless in both directions. Build modular segments that recycle (teleport the rig back one module length when it passes a threshold, with matching haze and lighting so no seam shows) so the far ends never arrive. Wallpaper and wood trim, sconces every few metres, one gently flickering fixture, haze that swallows the distance.
* Doors: wooden hotel doors with brass plates. Ordinary doors carry ordinary three-digit numbers and do not open. Scenario doors carry odd plate numbers and do open: 22, 1930, 1944, 127, 1031, 9, 10 in the order he meets them. This short uses 22, 1930, 1944 (handoff only) and 127. Plate 1031 is seen at the end. Plate meanings (never explained on screen): 22 is the house number he sees outside; 1930 and 1944 are eras; 127 is January 27; 1031 is October 31; 9 and 10 relate to the ring and the ten dots.
* Doorways are portals. Each scenario door looks onto a separate scene. Render it through a portal camera offset to match the player camera, so moving the camera produces true parallax and depth through the opening rather than a flat picture. (This is the same technique as the doors in the Staging Plane.) Lighting inside the portal is separate from the corridor, so a daylight street can sit beside warm lamplight.
* Seed (my suggestion, optional): at the start he glances back and the door he arrived through is now plain wall. He does not comment. It sets up the later “my entry door keeps disappearing”.
4. Camera purpose and story acts
Why is he recording? It is his subject-view capture camcorder, required for orientation exercises. Procedure says record. He logs everything that might be an exit. It is the last procedure he still follows.
Act 0: Corridor arrival (0:00 to 0:25). No static, no title: it is a direct continuation. The Orientation short already shows him stepping from the Staging Plane into the corridor, so do not restage the arrival; start on the first frame after that walk. The OSD date is OCT 23 2025, with the clock continuing from the origin short's last frame. He logs the date, the empty corridor, and that it is not on the orientation map. It runs both ways.
Act 1: Door 22, Fairhaven house (0:25 to 1:35). He walks to plate 22 and opens it expecting a hotel room. It is a suburban house front hall (the Fairhaven interior: beige carpet, couch, table, one blue owl painting). He says it is not a hotel room. He walks the interior to test whether doors really lead somewhere. He steps out the front door onto a bright, quiet street of identical houses (early-build look). The house number he walks out of reads 22 and he looks at the house number. He wonders aloud why this is here and whether it is another testing area. He returns to the corridor through the door he came in.
Act 2: Door 1930, the screening room (1:35 to 3:45). He wonder if every door goes somewhere different. A hum and flickering light leak under plate 1930. Inside is a small screening room (folding chairs, a film projector, a pull-down screen). The cartoon is already running. He says “What is this.” He watches in near silence. When the term COGNITIVE INSTANCE appears on screen, he repeats it quietly. After the cartoon he summarises the service, picks up on Retirement, and says nothing was written back for him.
Act 3: Door 1944 handoff (3:45 to 4:27). He stops at plate 1944, says it is a different era, and steps through. The door closes. Static. The next dated frame reads OCT 25 2025 (the Noir short, a separate video, happens inside this gap). He is back in the corridor at plate 1944.
Act 4: Door 127, the blue mushroom forest (4:27 to 5:17). He walks to plate 127. Behind it is the bioluminescent blue mushroom forest. He says it is another scenario. He steps in, raises his hands, the red glow appears, the two-note chime plays, and the mushrooms turn red then fade back to blue. His power works across Builds. Static. Make the time progress gradually and cut to static to show him gradually exploring the mushroom forest. Eventually, the date reads OCT 31 2025 (six days later) and he is back at the door.
Act 5: The twins (5:17 to 6:10). In the corridor the lights stutter and the chime sounds. Red light creeps under every door. He opens door 22: the red town, owls on every wall inside the house. He opens door 127: the red glowing mushroom forest. He opens door 1930: the screening room lit red, the projector screen stuck on one frame. He says they are all red. He walks on to door 1031 and rests his hand on the handle. He enters the door and where this short ends is exactly where the Open Ocean short begins. (no time jump: the Open Ocean short begins right here on Oct 31, 2025).
5. Continuity ledger (VITAL: dates and places must line up exactly)
Canonical timeline. The ledger wins over everything else.
#	Short	Plate	Enter	Exit	Days
0	Orientation test	n/a	Jun 10, Aug 17, Oct 23, 2025	Ends with him walking from the Staging Plane through the HOTEL door into the hotel corridor, Oct 23, 2025	n/a
1	This short, Door 1Fairhaven house	22	Oct 23, 2025	Oct 23, 2025	0
2	This short, Door 2Rubber hose room	1930	Oct 23, 2025	Oct 23, 2025	0
3	Door 3 Noir street (separate short)	1944	Oct 23, 2025	Oct 25, 2025	2
4	This short, Door 4Blue mushroom forest	127	Oct 25, 2025	Oct 31, 2025	6
5	Door 5 Rocky island (separate)	1031	Oct 31, 2025	Oct 31, 2025	0
6	Door 6 Indoor pool (separate)	9	Oct 31, 2025	Jan 3, 2026	64
7	Door 7 Subway platform (separate)	10	Jan 3, 2026	Mar 16, 2026	72
gap	Static	n/a	Mar 16, 2026	Oct 15, 2026	213
This short's first dated frame is OCT 23 2025 and its last is OCT 31 2025. Only static is a time jump.
STEP 0, before writing any code:
1. Check the Orientation Test build or brief: the exact last frame (where in the corridor he stands and which way he faces), the last OSD date and clock, the OSD font, color and position, the chime sound, and how the glyph and red glow look. This short's first frame must follow it with no gap.
2. Check the Noir street short: how it begins and how it ends. This short's frame after the plate 1944 static must match where and how the Noir short returns him to the corridor, with the date OCT 25 2025.
3. Check the Rocky island short: its opening door and frame. This short's final frame (hand on plate 1031, OCT 31 2025) must match it.
4. Check the Fairhaven, Luminous Hollow (mushrooms) and rubber hose assets for layout, house number 22, the blue owl painting, the mushroom look, and the cartoon's own runtime and on-screen terms.
5. Report the result in a short table at the top of your reply, each item marked MATCH or MISMATCH. On a mismatch, follow the ledger and say so. If a neighbouring short was not attached, say so and use the ledger.
6. Define every date as a constant in one DATES config and compute displayed or spoken numbers with real calendar math. Add runtime assertions: Oct 23 + 2 days = Oct 25, 2025; Oct 25 + 6 days = Oct 31, 2025; Oct 23 to Oct 31 = 8 days.
6. Dialogue and timing (starting spec, times are approximate and re-derived after the cartoon is trimmed)
Pace each line like a real person with no dead air beyond what is written. Captions hold at least max(1.8 s, speech + 0.6 s). The cartoon has its own audio and is not captioned here.
#	Start	End	Line	Action
2	0:08.0	0:13.0	“Hotel corridor. No signs, no staff. Not on the orientation map.”	Pan along the corridor
3	0:16.0	0:20.5	“Both directions, doors on both sides. Logging all of it.”	Looks down each corridor
4	0:38.0	0:39.5	“Twenty-two.”	Plate
5	0:44.0	0:49.0	“That's not a hotel room. That's a house.”	Door open, hallway beyond
6	0:57.0	1:03.0	“Ordinary house. Basic couch, painting. Checking if a door really leads somewhere.”	Walking the interior
7	1:05.0	1:07.5	“Seems it does.”	Reaches the front door
8	1:17.0	1:21.0	“Number twenty-two. Same as the hotel door.”	On the street, house number
9	1:24.0	1:30.5	“This area looks interesting. I wonder why this is here. Is it another testing area?”	Pan across identical houses
10	1:52.0	1:58.5	“Does every door lead somewhere different. These aren't rooms. They're scenarios.”	Back in the corridor
11	2:03.0	2:04.5	“Nineteen thirty.”	Plate, hum under the door
12	2:17.0	2:18.5	“What is this.”	The cartoon starts on the screen
13	about 3:00	about 3:02	“Cognitive Instance.”	Cue: the term appears on screen. Quiet
14	3:43	3:50	“So that's the service. Capture, run, Delta, written back.”	Cartoon ends
15	3:53	3:58	“Retirement. Nothing else comes back.”	
16	4:00	4:06	“Nothing got written back. I'm still in the run.”	Slow, controlled. Corridor
17	4:12	4:14	“Nineteen forty-four.”	Plate
18	4:18	4:22	“Different era. I'll look.”	Steps through, then static
20	4:38	4:40	“One twenty-seven.”	Plate
21	4:46	4:51	“Another scenario. A bioluminescent mushroom forest.”	Door open, forest beyond
22	4:58	5:01	“Testing something.”	Hands up
23	5:08	5:13	“Works here too. Different build, same effect.”	Mushrooms fade back to blue
25	5:33	5:36	“Something changed.”	Red under the doors
26	5:55	5:59	“Every one of them. Red.”	After looking into 22, 127 and 1930
Non-dialogue timing: 2:25 to 3:40 cartoon excerpt (75 s), 4:23 to 4:27 static, 5:14 to 5:18 static, 5:28 flicker and chime, 6:08 hand on plate 1031, 6:10 black.

8. Look, motion, sound and technical rules
* Frame: 4:3 pillarboxed in 1920x1080. Render 3D at about 720x540 and let the VHS pass upscale. One continuous handheld take, with cuts only at static (plates 1944 and 127) and the final cut to black.
* Camera: 1990s consumer camcorder, small CCD, stabilization that occasionally overcorrects, chest height, slightly low and wide, never eye level. Walking bob, breathing about 0.27 Hz, rolling-shutter skew on fast turns, autofocus hunting on low-contrast surfaces, exposure lagging about 0.45 s. Looking down shows only boot toes and the carpet. No steadicam moves.
* VHS pass: line jitter 0.25 px or less, head-switching band, tracking tears, luma blur with edge ringing, chroma smear, bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks. No scanlines, no RGB mask. Barrel and vignette on the picture, not the OSD. OSD: match the Orientation build (date, REC dot, battery).
* Carpet: the user's pattern, scaled to read as real hotel carpet (repeat about 60 to 80 cm), anisotropic filtering, slight wear and a faint stain or two. It must stay readable after the grain pass.
* Hotel light and color: warm amber lamps, dark wood, muted wallpaper, slightly too clean. Haze fades the far end of the corridor.
* Red state: heavy, bruised deep red, not alarm red (sky and light #8a0f1c, deep #4a0610). Drive the emissive high enough to bloom. Red light stains surfaces, pushes the blue owl painting toward near-black, and is never a flat overlay. White balance drifts toward magenta. Red seeping under doors is a thin bright line along each threshold that widens.
* Fairhaven door: match the Fairhaven brief (flat stucco, model B, lot numbers on posts, blue owl painting, soft overcast daylight). If the 3D model is not supplied, use a placeholder.
* Screening room: small and slightly worn. Film projector with a moving light cone and dust, projector clatter, folding chairs, pull-down screen. The cartoon video is mapped to the screen with projector flicker and gate weave on the screen only so on-screen words stay legible. The cartoon's audio comes from the room with a mild low-pass and tiny room slap. In stem export, put the cartoon audio on the Music stem.
* Cartoon excerpt: the cartoon is 2:35. Play a 75 s excerpt by default through a TRIM config (list of in/out seconds) that keeps the capture, Cognitive Instance, Delta, Reintegration and Retirement beats and the end card line. If the user prefers the full cartoon, change the trim and the dialogue times shift. Note that the full short then runs well past the usual 1 to 3 minutes. Offer a cut-down option and say so.
* Sound: no score. Room tone: ventilation hum, light buzz, footsteps muffled on carpet, cloth, breath. The two-note chime plays whenever his red light appears (the mushrooms and the corridor event). Door opening: a soft latch and a change in room tone. Static bursts: short and hard.
* Captions: CEA-608 style, monospace (IBM Plex Mono 600 or similar, embedded), about 42 px, white on a solid black box per row, 32 characters or fewer per row, centred above the OSD. Hat Man unmarked. SDH: [FOOTSTEPS], [STATIC], [CHIME].
* Never show: his body or face, any other person, a pursuer, a monster, gore, jump scares, or a score.
* Realism rule: when anything conflicts, choose the less polished, less cinematic option.
9. Tools inside the HTML
1. Dialogue editor (toggle with D): timeline strip with one bar per line and a playhead. Drag a bar to move it, drag its edges to change duration, edit text, add a line at the playhead, delete a line, play and scrub. Captions are generated live from the same DIALOGUE array (seeded with section 6). Include Export JSON and Import JSON.
2. MP4 export: in-file encoding (WebCodecs plus an inlined muxer, MediaRecorder fallback). Checkboxes to include or exclude Music, Sound Effects and Voice/Narration independently, plus separate WAV stem export.
3. Audio length: every exported audio file must be exactly the same length as the MP4, to the sample.
4. All config lives in one object at the top: DATES, DIALOGUE, TRIM, plate list, OSD text, and the environment slots (FAIRHAVEN, FOREST, SCREENING_ROOM) with placeholder and swap-in model hooks.
10. Pitfalls and final checklist
* The first minute must feel mundane and procedural. Do not signal dread early.
* Keep the endless corridor seamless: no visible teleport, no repeating pattern that is obviously a loop.
* Pure dark red does not bloom at low emissive. Drive it up.
* Cartoon text must stay legible through the grain pass.
* Check before delivering: dates assert correctly; first frame follows the Orientation short; static handoffs match the Noir and Rocky island shorts; the chime plays only with his red light; scenario plates are 22, 1930, 1944, 127 and 1031; the single file works offline; exported audio lengths match the video; the dialogue editor works.
Appendix: rules this short sets for the other Hat Man shorts
* Every separate short ends with him entering a doorway that leads back into this corridor. In those shorts, he says: “Finally, I made my way back to the hotel.” That line is not used in this short.
* The corridor, carpet, plate style and door sound defined here must be reused.
* The two-note chime marks every red-light moment.
