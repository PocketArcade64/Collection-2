# Collection-2

Found Footage: Data Center

Note: if the technicians’s hand appear in this short, use the same hand models as the hat man, but yellow sleeves instead. This model has already been used in the sports facility short, please use those exact hand/sleeve references.

Attached Reference Images Explanation: the attached reference image is what the data center should look like, but without the fog. There are many rows of servers that create the liminal eerie feel.

Build Instructions for Claude
Found-footage short, March 2027. Read the whole brief before writing any code. Assume you have no prior context.
0. What you are building
A single self-contained HTML file that plays a 2:20 to 2:40 first-person found-footage film, rendered live in the browser (three.js), seen through a 1990s consumer camcorder. It must work when the one file is emailed to a different computer. Reference photos of the real data center environment will be included with this brief. Match their rack style, aisle width, floor tiles, signage, lighting color and general wear as closely as you can.
1. Universe context (you know nothing yet, so read this)
The Company is an in-universe corporation that uses the Consciousness Simulation Network (CSN) to copy a person's consciousness into simulated environments to train and evaluate it. The physical person is the Source Subject. The simulated copy is a Cognitive Instance (CI) and is never called a person. Environments are called Builds and carry version numbers (for example Build 1.3). A Technician is a CI doing in-sim work, usually the person holding the camera. The External Monitor is the company’s built-in observation of a run from outside. An Extraction forcibly pulls a CI out mid-run. A Seam is the boundary between environments.
The company is not a cartoon villain. Staff are calm, professional and matter-of-fact. The horror is in what the procedure implies, never in the tone.
The Hat Man is the threat. He was Upload 003, one of the first three uploads. His connection dropped during a test and the extraction protocol had no handling for it, so his copy was never pulled out. Left running with no evaluator, he learned the simulation's edges and began manipulating it. He wears a top hat, the one detail he kept from his intake photo. He wants out and wants to shut down the CSN. He blends in with other CIs and hovers at the edge of training runs.
Where this short sits. By 2027 The company’s staff are entering the sim. Earlier 2027 shorts: The Luminous Hollow (Jan 27, a technician is knocked out and dragged away as blue mushrooms turn red) and Model Estate (Feb 12, the operator falls into a red copy of a housing estate and a house shrinks around him). In this short, the Hat Man has started building his own scenarios by copying the real world outside. Nothing in the film states this. The audience only senses it.
Staging Plane note. The Staging Plane (a blank white expanse with door-shaped holes that show other environments behind them with parallax) does not appear in this short. You do not need to build it.
2. Purpose of the camera
The technician was assigned to load into the cruise ship build for a prep run. The External Monitor is reporting that he is on the cruise ship, so its feed cannot be used to document where he actually is. Procedure requires visual verification of any load mismatch, so he records manually with the handheld camcorder. He keeps recording because the log needs a rack, row and aisle identifier before he can file a mismatch report.
This answers "why not use the external camera": the external camera believes it is watching something else.
3. Story
The environment is a data center cold aisle: rows of identical server racks, perforated floor tiles, a constant roar of fans and cooling, cool blue-white light, and a status light that is wrong. It is an accurate replication of the company’s real second-floor server hall, down to tile numbers. Someone scanned it. That someone is the Hat Man, learning how to make a scenario.
Act 1: Load check (0:00 to 0:40). Tape roll-in with title text (scenario name redacted, date). He explains that he was assigned the cruise ship and this is not it. He begins logging rows and rack numbers in a flat, procedural voice, with a self-correction on a number.
Act 2: The aisle (0:40 to 1:40). He walks the cold aisle. Everything is plausible and slightly too accurate. He realizes it is a copy of the building he works in. He finds rack 413, where the status LED is a color that is not in the taped-up legend (legend: green OK, amber WARN, red FAULT; this one is steady white-blue). He logs it as not in legend. He radios control and gets only the roar of the fans.
Act 3: The feed (1:40 to 2:10). At the end of the aisle, a bank of wall monitors shows a live feed of the outside control room: operators seated at desks, ordinary and unaware. This is how the Hat Man learns about the outside world. The technician recognizes the room, tries speaking to it, and gets no reaction. (I will provide you a real video to put on the screen)
Ending (2:10 to 2:30). Something stands at the far end of the cross-aisle. Brief, partial, at the edge of focus: the Hat Man peeking around the end of a rack row, only the top hat brim and part of a face. The technician says someone is in the aisle and that they are not on the roster. The lights flicker deep red once (the Hat Man's signature) and the picture cuts to static.
Nothing attacks. The Hat Man does not approach, speak or gesture. He looks, then the tape ends.
Note: please use the same hat man body model as from the Sports facility short. Make him be wearing the same hat model from Noir that he put on.

4. Dialogue script (line by line, with timing)
The technician is not the Hat Man's voice actor. Keep the voice quiet, even, professional and dry, with proximity bass and breath. Allow exactly the time each line needs to be spoken, with no dead air between sentences unless it is intentional (marked). Space the lines like a professional production, not a metronome. All timings are targets and will be editable in the dialogue editor (section 8).
ID	Time	Speaker	Line	Notes
L01	0:05	Technician	"Technician check-in. Recording started."	Throat clear first
L02	0:11	Technician	"Assigned build: cruise ship. Loaded build is..."	Trails off, then L03
L03	0:17	Technician	"...a server room."	Breath before it
L04	0:23	Technician	"External Monitor is reporting the cruise ship. I'm not on a cruise ship."	Flat, not alarmed
L05	0:32	Technician	"Manual recording, then. Logging aisle, row, rack."	Starts walking
L06	0:42	Technician	"Row C. Rack 401, no, 410. Starting again. Rack 401."	Self-correction
L07	0:56	Technician	"Textures are unfinished in this one. Early development, I'd guess. Models too."	Conditional. Use only if the environment reads as computer generated; skip or soften if it looks convincing
L08	1:08	Technician	"Cold aisle. Fans are constant. That's accurate, at least."	Roar audible under voice
L09	1:18	Technician	"This is the second floor server hall. Our hall. Down to the tile numbers."	Realization, still calm
L10	1:30	Technician	"Status light, rack 413. Legend says green, amber, red. This one's white."	Autofocus hunts on the LED
L11	1:38	Technician	"Not in legend. Logging it."	
L12	1:45	Technician	"Control, this is Technician. Do you copy?"	Held beat of fan roar after, no reply (SDH: [NO RESPONSE])
L13	1:57	Technician	"That's the control room."	Sees wall monitors
L14	2:02	Technician	"That's live. They're at their desks. ...Hello?"	Operators do not react
L15	2:13	Technician	"Hold on. Someone's in the aisle."	Low, quiet
L16	2:18	Technician	"They're not on the roster."	Hat Man partial reveal here, red flicker, cut to static at about 2:24
Before writing audio, create a labeled section in the code for each line (L01 to L16) holding its start time, text, caption text and any SDH tag, so it can be retimed in one place.
5. Style prompt: simulation inspection footage
A single recording from a handheld camcorder carried into a replicated data center (Build tag shown as 4.13) because a load mismatch needs manual visual verification. Genre reference (grammar only): found footage, new-weird, "the system is wrong and nobody knows why" horror, 1990s consumer camcorder footage. Never use any existing organisation, logo, game or film title inside the film. The company, its forms, marker names and anything unseen are original.
5.1 Essence, and what it is not
* One first-person handheld recording (4:3, VHS-era look), continuous, ending when the tape does.
* A clean, loud, orderly environment that is subtly wrong: a status color that does not exist, a monitor feed of the outside world, and a figure who should not be there.
* Dread comes from small inconsistencies, a professional voice staying professional, and procedure continuing after it stops making sense.
* Not a creature feature. The Hat Man is glimpsed partially for under three seconds. No monster, no gore, no jump-scare stings. Not a ruin (it is clean and maintained). Not a CRT terminal piece (the artefacts are tape and lens, not scanlines).
* The audience never learns whether the Hat Man built this or merely found it.
5.2 Story shape (about 2:30)
Time	Beat
0:00 to 0:40	Tape roll-in, title-generator text (scenario name redacted, date). Load mismatch explained. Begins logging.
0:40 to 1:10	Row C walk, rack numbers, self-correction, optional texture comment. Fans constant.
1:10 to 1:40	Realizes it is a copy of the real server hall. Rack 413, white status light, "Not in legend."
1:40 to 2:10	Radio, no response. Wall monitors show the live control room. He speaks to it. No reaction.
2:10 to 2:30	Figure at the end of a rack row. "Not on the roster." One deep red flicker. Cut to static.
5.3 Materials and rendering
* Frame: 4:3 pillarboxed in 1920x1080. Render the 3D at low resolution (for example 720x540) and let the VHS pass upscale.
* Aim for worlds that look believable and realistic through the grainy filter. Make sure the important objects (rack doors, floor tiles, cable trays, wall signs) carry real texture detail. If the scenery reads as computer generated, the technician comments once that textures and models are still in early development (L07).
* Build a hall of at least six rows of racks with a cold aisle between facing rows, a hot aisle glimpsed through gaps, a raised floor of perforated tiles (some solid), overhead cable trays, ceiling grid with fluorescent or LED panels, rack numbers on door plates, and a few cross-aisles. Racks are identical by design. Vary incidental details: dust, a loose cable, a label slightly crooked, a scuffed tile, a missing blanking panel.
* Each rack front has small LEDs (mostly green, a few flickering amber for realism). Rack 413 carries the wrong light: steady white-blue, drawn to bloom slightly, and never explained.
* A taped legend near the end of Row C lists green OK, amber WARN, red FAULT. No white entry.
* The end-of-aisle monitor bank shows a live video feed of an office-like control room: desks, glowing screens, three or four seated operators seen from behind or side, small natural movements. Build it as a looped, low-resolution animated plane (procedural or canvas-drawn) with its own mild feed noise, softer than the main footage. Do not show faces clearly.
* Lighting: cold blue-white fluorescent with hard falloff in the aisle, warm from nowhere. A single deep red state at the end, driven emissive high enough to cross the bloom threshold (dark red has low luminance).
* VHS camcorder pass: small line jitter (0.25 px or less, low frequency), head-switching band, tracking tears on demand, barrel and vignette on the image but not the OSD, luma blur with edge ringing, chroma smeared right, light smear and bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks, soft clip. Noise at tape rate (30 fps). No scanlines, no RGB mask.
* OSD: bitmap font with black outline. REC dot, battery, time and date, a small label (for example LOAD CHECK), a build tag (BUILD 4.13), and an iteration counter (ITER 02). The title generator uses the same font, larger. His clipboard or assignment slip, if seen, reads BUILD 4.12 (the cruise ship).
5.4 Color logic
* Aisle: cold gray-blue and steel, pale ceiling panels, slightly green-white fluorescent cast.
* Status LEDs: small green points; rack 413 is the only white-blue one.
* Red: the one saturated signal, used for a single flicker at the end. Deep and bruised, not alarm red.
* White balance drifts, and shifts magenta during the red flicker. Colour is never graded clean.
* Example palette: steel #8b9299, floor tile #6f757a, ceiling #c9d1d6, aisle shadow #0b1118, LED green #3fe06b, wrong LED #bfe8ff, red #8a0f1c, deep red #4a0610.
5.5 Type and subtitles
* Closed captions (CEA-608 style): monospace (for example IBM Plex Mono 600) about 42 px, white on a solid black box per row, 32 characters or fewer, centred inside the 4:3 frame above the OSD. Untouched by tape noise. Hold for at least max(1.8 s, speech + 0.6 s).
* The technician needs no speaker mark. SDH descriptions in brackets: [FANS ROARING], [FOOTSTEPS], [TAPE NOISE], [NO RESPONSE], [SILENCE].
* The title is camcorder title-generator text over the first shot: scenario name (redacted) and date.
5.6 Motion quality
* One continuous handheld take. Cuts happen only where the tape breaks: power-on roll-in, any tracking tear, and the final static.
* Handheld: walking gait (head bob a few cm, sway, small roll), breathing (about 0.27 Hz) and a tremor whose amplitude follows a fear curve. Steady early, tightening at the monitor feed and again at the figure. Freeze everything at a held breath.
* Hold the camera at chest height, slightly low and wide, never eye level. Looking down shows only shoe toes and floor tile.
* Autofocus is animated with overshoot: blur, lock, slip, lock. It hunts on the white LED, on the monitors, and hardest on the far figure so it is never fully resolved.
* Auto-exposure lags about 0.45 s after sudden lighting changes, with gain noise pumping.
* Electronic image stabilization that occasionally overcorrects. Rolling-shutter skew on fast turns.
* The ending: the camera stays at chest height and does not drop.
5.7 Camera grammar
Move	Expresses	Use here
Walking POV down the aisle	routine, the job	rack logging
Slow pan along identical racks	repetition	first look at Row C
Held still on a small light	something wrong	rack 413
Glance back at something passed	doubt	after the radio call
Push toward the monitor bank	recognition	the control room feed
Hold on a distant gap between racks	the threshold	the Hat Man peek
Never give a clean look at anything that is not a rack, a tile, a screen, the technician's hands or boots. The Hat Man is the one exception, and only partially.
5.8 Sound palette
* No score. Only what the tape would have recorded.
* Bed: a constant broadband roar of fans and cooling, with a low tonal hum under it. This is the dominant sound and must be steady and uncomfortable but never mask speech.
* Footsteps on raised floor tiles (hollow, slightly metallic), cloth rustle, breath, camcorder clack and motor, zoom servo, AF ticks.
* The wrong LED has no sound. Do not give it a beep.
* The monitor bank is nearly silent, with only faint office room tone from the feed.
* Held digital-zero moment after "Do you copy?" (captioned [NO RESPONSE]), then the roar returns slowly.
* Red flicker: a single low swell, then static.
* Technician voice is dry. Heavy reverb destroys intelligibility.
* Mix: bed about -8 dB under voice, -14 LUFS, no added grain.
5.9 Native moves
* Autofocus and exposure hunting: the geometry resolves only when focus is right.
* The OSD as evidence: time code and battery tick regardless. The iteration counter and Build tag may change between the first and last frames.
* Emptiness and repetition: the same rack forty times, the same tile, the same light.
* Procedure as dread: he keeps logging while the space stops making sense.
5.10 Pitfalls
* Do not over-weird the first minute. It must feel mundane.
* Pure red never blooms at low emissive. Drive it far higher.
* The Hat Man reads as a cliché if shown too long or too sharp. Keep him under three seconds, partial and soft.
* Clean CG interiors read as a game. Keep the tape pass heavy and the textures worn but believable.
* Do not show a body, a pursuer or shapes in the racks.
* Line wobble skews text. Keep it 0.25 px or less and leave the caption box untouched.
* Do not time-compress a finished timeline. Keep keyframes in original time and map through one warp function.
5.11 Realism
The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished, less cinematic option. The camera is a 1990s consumer camcorder with a small CCD sensor. Use motion blur only on fast pans. No steadicam smoothness, no impossible angles, no mathematically perfect lighting, no uniform noise, no clean reveals. Speech feels unscripted: small hesitations, a throat clear, a breath before a number, a self-correction. Breathing and footsteps match the camera bob. Approximate the look of low-light handheld camcorder footage: crushed blacks, noisy shadows, blooming highlights and slow exposure recovery.
6. Optional continuity plants (open to your taste)
* Rack numbers, Build tag and slip: the loaded Build is 4.13, the assigned cruise ship Build is 4.12. In the April 2027 cruise ship short the cabin numbering will skip one number that matches this mismatch (413), so keep these numbers exactly.
* A subtle ring of nine pulled raised-floor tiles with the gap facing the camera at a far cross-aisle, visible only for a moment before the Hat Man peek. Include only if it can be done without reading as a gimmick.
* Do not name the Hat Man or show a placard. The audience recognizes the top hat.
7. Optional post-static clip
After the final static, the user may add a short real-world clip made with Grok video showing what the control room looks like after the video ends. Do not build this in the HTML. Leave a 3 second black or static slate at the end so it can be cut in later.
8. Delivery requirements
1. One HTML file. Everything (code, libraries, textures, audio, fonts, the control-room feed) is contained in that single file so it works on its own on another computer. Load three.js and any libraries from npm or a CDN at build time and inline them. Embed images and audio as data URIs.
2. Textures. Find HD textures online where applicable (for example CC0 sources such as Poly Haven or ambientCG for metal, concrete, perforated tile, painted steel, cable and rubber). Downsample sensibly and embed them. If your environment cannot reach those sites, use well-made procedural textures and say so clearly in your final message, and use the user's reference photos as visual targets.
3. Dialogue editor mode. Add a toggleable mode (key D and an on-screen button) that shows a simple visual timeline: one track per speaker, each line a draggable block with start time and duration, editable caption text, and Add and Remove buttons. Changes must retime the burned-in captions and the speech audio. Include an Export and Import JSON button for the dialogue so edits can be saved and pasted back into the file. Keep the editor out of exports.
4. Voice. Provide a way to supply recorded voice files per line (ID L01 to L16) or use text-to-speech as a placeholder. Dialogue timing must allow each word proper time to be spoken, with no excess silence unless marked.
5. MP4 export. Provide separate checkboxes to include or exclude Music, Sound Effects and Voice/Narration so each audio element can be exported independently. There is no score in this short, so Music may be disabled but must exist. Each stem exported separately must be exactly the same length as the video MP4, padded with silence where needed.
6. Engine files (as modules within the single HTML).
    * world.js: hall layout, rack and tile duplication, rack plates, ceiling and cable trays, lighting states (cold, red), rack 413.
    * tex.js: procedural and embedded textures, title text, control-room feed canvas.
    * vhs.js: VHS camcorder ShaderPass.
    * osd.js: bitmap font, REC, battery, clock, LOAD CHECK label, build tag, iteration counter, title generator.
    * subs.js: 608 captions, SDH tags.
    * audio.js: fan and hum bed, footsteps, foley, voice playback, stem export.
    * story.js: timeline, dialogue table (L01 to L16), camera keyframes, fear and focus curves, Hat Man peek, red flicker, ending hold.
    * editor.js: dialogue editor mode.
    * main.js: renderer, post chain (ambient occlusion, depth of field, bloom, then VHS), handheld rig.
9. Fixed and open
Fixed for this film: location (replicated data center cold aisle), reason for filming (manual verification of a load mismatch, External Monitor reports the wrong build), the wrong status light on rack 413, the live control-room feed, the Hat Man partial peek, the single red flicker, the ending (static then one-frame ID overlay), 4:3 camcorder format, length 2:20 to 2:40, March 2027 date (default March 16, 2027).
Open to your taste: exact row and rack counts, exact dialogue phrasing (keep it procedural), exact wording of the title text, whether a tracking tear marks the walk-in, the precise framing of the peek.
