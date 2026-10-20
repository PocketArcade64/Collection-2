# Collection-2

Found Footage: Cruise Ship

Note: if the technicians’s hand appears in this short, use the same hand models as the hat man, but yellow sleeves instead. This model has already been used in the data center, please use those exact hand/sleeve references. Also, if any water/ocean appears, look at how that was handed in the Open Ocean short.

Cruise Ship in Dry Dock: Build Instructions for Claude
The Company’s found-footage short, April 2027. Read the whole brief before writing any code. Assume you have no prior context.
0. What you are building
A single self-contained HTML file that plays a 2:20 to 2:40 first-person found-footage film, rendered live in the browser (three.js), seen through a 1990s consumer camcorder. It must work when the one file is emailed to a different computer. Reference photos of cruise ship interiors and dry dock windows will be included with this brief. Match their carpet patterns, corridor proportions, door styles, lighting color and wear as closely as you can.
1. Universe context (you know nothing yet, so read this)
The company is an in-universe corporation that uses the Consciousness Simulation Network (CSN) to copy a person's consciousness into simulated environments to train and evaluate it. The physical person is the Source Subject. The simulated copy is a Cognitive Instance (CI) and is never called a person. Environments are called Builds and carry version numbers. A Technician is a CI doing in-sim work, usually the person holding the camera. The External Monitoris The company’s built-in observation of a run from outside. A Run is one scenario cycle. A Delta is the experience a CI gains, compressed for return to the Source Subject. Reintegration is writing that Delta into the Source Subject, who then wakes with new instincts about situations they never lived.
The company is not a cartoon villain. Staff are calm, professional and matter-of-fact. The horror is in what the procedure implies, never in the tone.
The Hat Man is the threat. He was Upload 003, whose connection dropped during an early test and who was never extracted. He learned the simulation's edges and now manipulates it. He wears a top hat. He does not appear in this short. His influence is only implied.
Where this short sits. This is the follow-up to the March 2027 Data Center Cold Aisle short. The same technician (same voice, same camcorder) was misloaded into a replica of the company’s server room (Build 4.13) when he should have been on the cruise ship (Build 4.12). Now he is loaded correctly. Nothing in this short explains the earlier misload. The only link is one missing number: cabin 413 does not exist. Attentive viewers will connect it.
Earlier 2027 shorts: The Luminous Hollow (Jan 27) and Model Estate (Feb 12). Neither appears here.
2. Purpose of the camera
This is a navigation-training dry run (Build 4.12). A future Source Subject's Cognitive Instance will be told to find a destination on this ship from a starting point. For that to work, the route must exist as a verified, followable path. The technician walks it first, counting cabin numbers aloud and recording the route (landmarks, turns, fire doors, carpet changes) so the training script can give the subject directions.
Why not the External Monitor: it logs the technician's position as coordinates but cannot record what a person would actually see and recognize. Procedure requires first-person visual verification of the route. The camcorder is that verification.
3. Story
The environment is a large passenger cruise ship sitting in dry dock: no passengers, no crew, no engine noise. Kilometers of identical corridors, repeated cabin doors, a vast ballroom with chairs stacked in towers, and the sea visible only through a few windows near the hull where the dock gate is open. It is quiet in the way a closed building is quiet.
Act 1: Check-in and start (0:00 to 0:35). Tape roll-in with title text (scenario name redacted, date). The technician states the assignment. He notes he is loaded into the correct build this time. He stands at Muster Station C on Deck 4 and begins the route.
Act 2: The corridor (0:35 to 1:25). Long identical corridors. He counts cabin doors aloud and calls out each landmark and turn, in a flat procedural voice. The count is the spine of the film. The scenery is repetitive on purpose and must feel genuinely mundane. A mild stretch of time where nothing is wrong.
Act 3: The skip (1:25 to 1:50). The numbering goes 411, 412, 414. There is no 413. There is no gap in the wall, no blank door, no covered plate. The corridor is exactly as long as it should be. He walks back and re-counts to be sure. He logs it as a numbering error and notes, once and flatly, that 413 was the number from his earlier misload.
Act 4: The ballroom and the windows (1:50 to 2:15). The route ends in the ballroom: chairs stacked in towers across a huge floor, folded tables, covered stage. Along one wall, a few dry-dock windows show the sea beyond the open dock gate. The water is higher than a drained dock should allow and it does not move. He logs it and records the final landmark.
Ending (2:15 to 2:30). He says the route is recorded and a subject can follow it. He glances back along the route. The corridor lights go out one section at a time, from the far end toward him, in a calm, orderly sequence, like a session being shut down. The picture cuts to static.
After the static: a real-world clip made with Grok video (see section 7).
Nothing attacks. Nothing is chasing him. The unease is a missing number, a sea that does not behave, and a run being quietly ended.
4. Dialogue script (line by line, with timing)
The technician is the same voice actor as the data center short. He is not the Hat Man's voice actor. Keep the voice quiet, even, professional and dry, with proximity bass and breath. Allow exactly the time each line needs to be spoken, with no dead air between sentences unless marked. Space the lines like a professional production, not a metronome. All timings are targets and will be editable in the dialogue editor (section 8).
ID	Time	Speaker	Line	Notes
L01	0:05	Technician	"Technician check-in. Recording started."	Throat clear first
L02	0:11	Technician	"Build 4.12. Cruise ship. Correct build this time."	Dry, no emphasis
L03	0:19	Technician	"Navigation training. I walk the route, count the cabins, and record it so a subject can follow."	Explains purpose
L04	0:30	Technician	"Starting at Muster Station C, Deck 4."	Camera pans the muster sign
L05	0:41	Technician	"Corridor, starboard side. Cabins 401, 402, 403."	Counting begins, steady rhythm
L06	0:52	Technician	"Fire door. Left at the fire door. Same carpet."	Landmark call
L07	1:02	Technician	"Textures are unfinished in places. Early development, I'd guess."	Conditional. Use only if surfaces read as computer generated
L08	1:10	Technician	"Cabins 408, 409, 410. Second fire door."	Rhythm unbroken
L09	1:22	Technician	"Four eleven. Four twelve. Four...fourteen."	Slows on the skip
L10	1:31	Technician	"No four thirteen."	Beat after
L11	1:36	Technician	"Going back. Counting again."	Walks back, re-counts quietly
L12	1:44	Technician	"Four twelve, four fourteen. No gap. Logging a numbering error."	Flat
L13	1:49	Technician	"Four thirteen was my misload. I'll note that."	Very brief, not dramatic
L14	1:57	Technician	"Ballroom. Chairs stacked. Tables folded."	Wide empty room
L15	2:05	Technician	"Dry dock windows. Sea's visible. ...Dock should be drained. Water's at deck level."	Hold on the unmoving water
L16	2:15	Technician	"Route recorded. A subject can follow it from here."	Almost relieved
L17	2:21	Technician	"What’s going on with these lights."	Corridor shutdown seen behind him
Before writing audio, create a labeled section in the code for each line (L01 to L17) holding its start time, text, caption text and any SDH tag, so it can be retimed in one place.
5. Style prompt: simulation navigation footage
A single recording from a handheld camcorder carried through a cruise ship in dry dock (Build 4.12) to verify a navigation route. Genre reference (grammar only): found footage, new-weird, "the system is wrong and nobody knows why" horror, 1990s consumer camcorder footage. Never use any existing organisation, logo, ship, brand, game or film title inside the film. The company, its forms, its marker names and anything unseen are original.
5.1 Essence, and what it is not
* One first-person handheld recording (4:3, VHS-era look), continuous, ending when the tape does.
* Kilometers of identical corridors give dread through repetition and scale, with a professional voice counting.
* Not a creature feature: no monster, no silhouette, no gore, no jump-scare stings. Not a ruin (the ship is clean, carpeted and closed, not decayed). Not a CRT terminal piece (the artefacts are tape and lens, not scanlines).
* The audience never learns why 413 is missing, why the water does not move, or who turns the lights off.
5.2 Story shape (about 2:30)
Time	Beat
0:00 to 0:35	Tape roll-in, title text (scenario name redacted, date). Assignment explained. Muster Station C.
0:35 to 1:25	Corridor counting, landmarks, optional texture comment. Mundane.
1:25 to 1:50	411, 412, 414. He re-counts. Numbering error logged. Misload noted.
1:50 to 2:15	Ballroom with stacked chairs. Dry dock windows, unmoving water.
2:15 to 2:30	Route recorded. Lights go out behind him, section by section. Cut to static, then one-frame ID overlay with iteration +1.
5.3 Materials and rendering
* Frame: 4:3 pillarboxed in 1920x1080. Render the 3D at low resolution (for example 720x540) and let the VHS pass upscale.
* Aim for worlds that look believable and realistic through the grainy filter. Give important surfaces (carpet, cabin doors, wall panels, handrails, brass plates) real texture detail. If the scenery reads as computer generated, the technician comments once that textures and models are still in early development (L07).
* Corridors: long, narrow, with a slight gentle curve so the far end is never visible, patterned carpet (repeating geometric), wood-veneer wall panels, a handrail, recessed ceiling lights in a regular rhythm, cabin doors on both sides with brass number plates, occasional fire doors with glass panels, framed prints repeated at intervals, emergency exit signs. Use instancing and a chunked layout so kilometers of corridor are cheap to render; reuse and recycle segments behind the camera.
* Cabin numbering: starboard side odd or even as appropriate to a real ship. Number plates must be legible at the camera's resolution. Cabin 413 does not exist: doors read 411, 412, 414 with consistent spacing and no sign of a removed door.
* Ballroom: double-height, parquet floor, chandeliers off, a covered stage, chairs stacked in towers of about ten across a huge floor, folded round tables on carts, a dance floor outline. Dust sheets over a bar.
* Dry dock windows: a few large rectangular windows along one wall near the hull. Beyond them, pale overcast light, a distant dock gate, and water. The water sits at an impossible height and does not move or ripple. Keep it low-resolution and soft so it reads as a plausible view through glass.
* Lighting: warm hotel-style practicals in the corridors with gentle falloff, cooler daylight spill in the ballroom, deep dark in unlit sections. Light timing is the plot at the end: corridor panels extinguish in a smooth, orderly wave toward the camera.
* VHS camcorder pass: small line jitter (0.25 px or less, low frequency), head-switching band, tracking tears on demand, barrel and vignette on the image but not the OSD, luma blur with edge ringing, chroma smeared right, light smear and bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks, soft clip. Noise at tape rate (30 fps). No scanlines, no RGB mask.
* OSD: bitmap font with black outline. REC dot, battery, time and date, a small label (for example NAV TRAINING), a build tag (BUILD 4.12), and an iteration counter (ITER 01). The title generator uses the same font, larger.
5.4 Color logic
* Corridors: muted burgundy and navy carpet, warm honey wood, tarnished brass, dim amber light.
* Ballroom: cream, pale gold, gray daylight.
* Windows: pale desaturated blue-gray.
* No red in this short, except none. Red belongs to the Hat Man and he is not here.
* White balance drifts, and corridor lights shift slightly cooler as they go out. Colour is never graded clean.
* Example palette: carpet burgundy #5b1f2a, carpet navy #1d2742, wood #7a5a3a, brass #b08d57, ballroom cream #cfc6a8, window gray-blue #9fb0bd, dark corridor #0c0a0b.
5.5 Type and subtitles
* Closed captions (CEA-608 style): monospace (for example IBM Plex Mono 600) about 42 px, white on a solid black box per row, 32 characters or fewer, centred inside the 4:3 frame above the OSD. Untouched by tape noise. Hold for at least max(1.8 s, speech + 0.6 s).
* SDH descriptions in brackets: [FOOTSTEPS], [TAPE NOISE], [VENTILATION HUM], [CHAIRS CREAKING], [SILENCE].
* The title is camcorder title-generator text over the first shot: scenario name (redacted) and date.
5.6 Motion quality
* One continuous handheld take. Cuts happen only where the tape breaks: power-on roll-in, any tracking tear, and the final static.
* Handheld: walking gait (head bob a few cm, sway, small roll), breathing (about 0.27 Hz) and a tremor whose amplitude follows a fear curve. Very calm during the count. Tightens slightly at the skip and at the windows. Freeze everything at a held breath.
* Hold the camera at chest height, slightly low and wide, never eye level. Looking down shows only shoe toes and carpet.
* Autofocus is animated with overshoot: blur, lock, slip, lock. It hunts on low-contrast carpet and on the far end of the corridor.
* Auto-exposure lags about 0.45 s after sudden lighting changes, with gain noise pumping.
* Electronic image stabilization that occasionally overcorrects. Rolling-shutter skew on fast turns.
* Walking pace must be believable for a long count, with natural pauses to read plates.
5.7 Camera grammar
Move	Expresses	Use here
Walking POV down a corridor	routine, the job	the count
Tilt to read number plates	procedure	cabin counting
Held on a blank stretch of wall	something missing	where 413 should be
Glance back along the corridor	doubt	re-counting
Wide slow pan of the ballroom	scale and emptiness	chair towers
Held still at a window	the threshold	the unmoving water
Look back as lights go out	the run ending	final shot
Never give a clean look at anything that is not a corridor, a room, a door, a window, the technician's hands or his boots.
5.8 Sound palette
* No score. Only what the tape would have recorded.
* Bed: soft ventilation hum, distant ship structure creaks, a faint tonal shimmer of electrical systems, no engine.
* Footsteps on carpet (soft, slightly dry) and on parquet (hollow, echoing) in the ballroom, cloth rustle, breath, camcorder clack and motor, zoom servo, AF ticks.
* Ballroom: larger room tone, faint creak of stacked chairs, distant dock water sound that does not match the still water.
* Final shutdown: a soft series of relay clicks and light ticks moving toward the camera, then silence, then static.
* Technician voice is dry. Heavy reverb destroys intelligibility.
* Mix: bed about -8 dB under voice, -14 LUFS, no added grain.
5.9 Native moves
* Counting as structure: the rhythm of numbers and footsteps is the heartbeat of the film.
* The OSD as evidence: time code and battery tick regardless. The iteration counter changes between the first and last frames.
* Emptiness and repetition: the same door, the same print, the same carpet, kilometers of it.
* Procedure as dread: he keeps logging while small things stop making sense.
5.10 Pitfalls
* Do not over-weird the first minute. It must feel genuinely mundane and almost boring, which is the point.
* Corridors that look obviously tiled on screen break realism. Vary wear, stains, scuffs, a door slightly ajar, a luggage tag on a handle, a crooked print.
* The missing 413 must not be telegraphed with a blank door or a plate. It is simply absent.
* Water that is too obviously fake reads as a bug. Keep it soft and distant.
* Do not show a body, a pursuer or shapes in the dark sections.
* Line wobble skews text. Keep it 0.25 px or less and leave the caption box untouched.
* Do not time-compress a finished timeline. Keep keyframes in original time and map through one warp function.
5.11 Realism
The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished, less cinematic option. The camera is a 1990s consumer camcorder with a small CCD sensor. Use motion blur only on fast pans. No steadicam smoothness, no impossible angles, no mathematically perfect lighting, no uniform noise, no clean reveals. Speech feels unscripted: small hesitations, a throat clear, a breath before a number, a self-correction. Breathing and footsteps match the camera bob. Approximate the look of low-light handheld camcorder footage: crushed blacks, noisy shadows, blooming highlights and slow exposure recovery.
6. Optional continuity plants (open to your taste)
* Keep Build 4.12 on the OSD and cabin 413 absent. These numbers must match the data center short exactly.
* A ring of nine stacked-chair towers in the ballroom, evenly spaced, with the gap facing the camera, visible only briefly in the wide pan. Include only if it can be done without reading as a gimmick.
* Do not show the Hat Man or any hat.
7. Post-static clip (Grok video)
After the final static and the one-frame ID overlay, add a short real-world clip made with Grok video showing what the lab or control room looks like after the video ends. This is not built in the HTML. Leave a 3 second black or static slate at the end so it can be cut in later.
Give the user a ready-to-paste Grok prompt in your final message. Suggested content:
* A modern, dim, clinical control room. Two or three operators in plain clothes seated at desks with multiple monitors, calm and unhurried.
* One monitor shows the ship corridor playback ending in static. Another shows a log line reading "Route verified. Cabin 413: not found. Logged as numbering error."
* An operator taps a key to close the file without alarm. A Source Subject lies sedated on a procedure table in the background behind glass.
* Handheld security-camera or lab-documentary framing, muted color, 6 to 8 seconds, no dialogue, no visible faces in close-up.
* The company’s perspective must read as professional and calm. No hint of an evil corporation.
8. Delivery requirements
1. One HTML file. Everything (code, libraries, textures, audio, fonts) is contained in that single file so it works on its own on another computer. Load three.js and any libraries from npm or a CDN at build time and inline them. Embed images and audio as data URIs.
2. Textures. Find HD textures online where applicable (for example CC0 sources such as Poly Haven or ambientCG for carpet, wood veneer, brass, plaster and parquet). Downsample sensibly and embed them. If your environment cannot reach those sites, use well-made procedural textures and say so clearly in your final message, and use the user's reference photos as visual targets.
3. Dialogue editor mode. Add a toggleable mode (key D and an on-screen button) that shows a simple visual timeline: one track per speaker, each line a draggable block with start time and duration, editable caption text, and Add and Remove buttons. Changes must retime the burned-in captions and the speech audio. Include an Export and Import JSON button for the dialogue so edits can be saved and pasted back into the file. Keep the editor out of exports.
4. Voice. Provide a way to supply recorded voice files per line (ID L01 to L17) or use text-to-speech as a placeholder. Dialogue timing must allow each word proper time to be spoken, with no excess silence unless marked.
5. MP4 export. Provide separate checkboxes to include or exclude Music, Sound Effects and Voice/Narration so each audio element can be exported independently. There is no score in this short, so Music may be disabled but must exist. Each stem exported separately must be exactly the same length as the video MP4, padded with silence where needed.
6. Engine files (as modules within the single HTML).
    * world.js: corridor chunks and recycling, cabin doors and number plates (no 413), fire doors, ballroom, dry dock windows, lighting states, corridor shutdown wave.
    * tex.js: procedural and embedded textures, brass plates, title text.
    * vhs.js: VHS camcorder ShaderPass.
    * osd.js: bitmap font, REC, battery, clock, NAV TRAINING label, build tag, iteration counter, title generator.
    * subs.js: 608 captions, SDH tags.
    * audio.js: ventilation bed, footsteps (carpet, parquet), foley, voice playback, stem export.
    * story.js: timeline, dialogue table (L01 to L17), route and camera keyframes, fear and focus curves, the skip, window hold, shutdown wave, ending hold.
    * editor.js: dialogue editor mode.
    * main.js: renderer, post chain (ambient occlusion, depth of field, bloom, then VHS), handheld rig.
9. Fixed and open
Fixed for this film: location (cruise ship in dry dock, Build 4.12), reason for filming (navigation-training route verification), the same technician and voice as the data center short, cabin numbering that skips 413, the ballroom with stacked chairs, the few dry-dock windows with unmoving sea, the orderly lights-out ending, static then one-frame ID overlay, 4:3 camcorder format, length 2:20 to 2:40, April 2027 date (April 3, 2027), post-static Grok clip.
Open to your taste: exact deck and corridor layout, cabin counts per segment, exact dialogue phrasing (keep it procedural), the title text wording, whether a tracking tear marks the re-count, the precise look of the dry dock view.