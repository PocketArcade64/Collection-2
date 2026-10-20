# Collection-2

Found footage: Container Port

Note: if the technicians’s hand appears in this short, use the same hand models as the hat man, but yellow sleeves instead. This model has already been used in the data center, please use those exact hand/sleeve references. If makes sense to place this Container Port area near water, use the same flowing water from Open Ocean.

Automated Container Port: Build Instructions for Claude
Found-footage short, May 2027. Read the whole brief before writing any code. Assume you have no prior context.
0. What you are building
A single self-contained HTML file that plays a 2:20 to 2:40 first-person found-footage film, rendered live in the browser (three.js), seen through a 1990s consumer camcorder. It must work when the one file is emailed to a different computer. Reference photos of automated container terminals will be included with this brief. Match their container stacking, crane proportions, lane markings, paving, weathering and lighting as closely as you can.
1. Universe context (you know nothing yet, so read this)
The company is an in-universe corporation that uses the Consciousness Simulation Network (CSN) to copy a person's consciousness into simulated environments to train and evaluate it. The physical person is the Source Subject. The simulated copy is a Cognitive Instance (CI) and is never called a person. Environments are called Builds and carry version numbers. A Technician is a CI doing in-sim work, usually the person holding the camera. The External Monitor is the company’s built-in observation of a run from outside. A Run is one scenario cycle. A Delta is the experience a CI gains, compressed for return. Reintegration is writing that Delta into the Source Subject, who wakes with new instincts about situations they never lived.
The company is not a cartoon villain. Staff are calm, professional and matter-of-fact. The horror is in what the procedure implies, never in the tone.
The Hat Man is the threat. He was Upload 003, whose connection dropped during an early test and who was never extracted. He learned the simulation's edges and now manipulates it. He does not appear in this short. His influence is only implied.
The ring rule. A recurring symbol: a ring of identical or same-category objects, evenly spaced, with exactly one missing, and the gap always faces the camera (the missing slot is where you would stand). It is a ring of ten positions with nine filled. The company’s logs treat it as a harmless performance marker. Viewers learn it and spot it everywhere. Here the objects are shipping containers.
Retention Drift is the company’s term for subtle change in a returned Source Subject. The company records it as improved performance. RA-positive (infected) subjects arrange objects in this ring without noticing. The company logs it as "Retention Drift: improved spatial organization."
Where this short sits. May 2027. Earlier 2027 shorts: The Luminous Hollow, Model Estate, then the March data center short and the April cruise ship short. This short ends with a real-world clip that shows the ring symbol outside the simulation for the first time, so it is the one that reveals the infection has already reached returned people. Release this short before the audience sees the symbol in the origin test room with the Hat Man, so the symbol is recognized there. The technician here is a new voice (not the technician from the data center and cruise ship shorts), which makes the archive feel bigger. The film must work as a standalone story.
2. Purpose of the camera
The External Monitor flagged motion in zone 9 of an idle Build (Build 5.09, automated container port). The run log shows zero registered iterations, so nobody officially entered the scenario. The monitor can report that something moved but cannot report a source. Procedure requires first-person visual verification of any unexplained motion in an unoccupied Build. A technician is sent in with a camcorder to look at the sensor location and document what is there.
Why not rely on the external camera: it logs motion events and coordinates, not what an observer would see and recognize on the ground.
3. Story
The environment is a huge automated container terminal: miles of stacked containers, driverless gantry cranes parked on their rails, driverless straddle carriers lined up in bays, no people, and numbered lanes (Lane 1 through Lane 12) painted on the paving. The sky is flat and overcast. It is quiet in the way a closed port is quiet. There are no birds anywhere, which only the attentive will notice.
Act 1: Check-in and entry (0:00 to 0:35). Tape roll-in with title text (scenario name redacted, date). The technician explains the motion alert, notes that nobody is officially in the run, and states why he is recording. He enters through the gate.
Act 2: The lanes (0:35 to 1:20). He walks the numbered lanes, noting that cranes are parked and nothing moves. Wind pushes cables and loose straps, and he reasons that this is probably the source of the alert. He says "probably" and lets it hang.
Act 3: Zone 9 (1:20 to 1:45). He reaches the sensor location at Lane 9. It is a clearing in the stacks.
Act 4: The ring (1:45 to 2:15). Nine containers stand in a ring in the clearing, evenly spaced, with one gap. The gap faces his camera. The yard plan has no such arrangement. The crane log shows no crane activity. Nothing could have put them there. He documents from a distance and says he will not go closer.
Ending (2:15 to 2:30). He steps sideways to a new vantage and looks again. The ring has not visibly moved, no crane has moved, but the gap faces him again from the new position. He requests extraction and gets silence. The picture cuts to static.

Nothing attacks him. No person is seen inside the sim. The unease is motion without a source, a physical impossibility handled professionally, and a ring that is oriented toward him.
4. Dialogue script (line by line, with timing)
The technician is a new voice actor and not the Hat Man's voice actor. Keep the voice quiet, even, professional and dry, with proximity bass and breath. Allow exactly the time each line needs to be spoken, with no dead air between sentences unless marked. Space the lines like a professional production, not a metronome. All timings are targets and will be editable in the dialogue editor (section 8).
ID	Time	Speaker	Line	Notes
L01	0:05	Technician	"Technician check-in. Recording started."	Throat clear first
L02	0:11	Technician	"Build 5.09. Automated container port. Motion alert, zone 9."	Dry, no emphasis
L03	0:20	Technician	"Run log shows no entries. Nobody's in here."	
L04	0:29	Technician	"The monitor can see motion. It can't see a source. So I'm here to look."	Walks through the gate
L05	0:42	Technician	"Lane three. Cranes are parked. Nothing's moving."	Wide pan of stacks
L06	0:54	Technician	"No vehicles. No people. No birds, either."	Slight pause on the last word
L07	1:03	Technician	"Textures are unfinished in places. Early development, I'd guess."	Conditional. Use only if surfaces read as computer generated
L08	1:12	Technician	"Lane six. Wind's moving the cables. That's probably the motion."	Cables sway
L09	1:20	Technician	"Probably."	Beat after
L10	1:30	Technician	"Lane nine. This is the sensor location."	Rounds a corner of containers
L11	1:42	Technician	"...That's nine containers. In a ring."	Slow count, then stop
L12	1:52	Technician	"That's not in the yard plan. Crane log shows nothing moved."	Flat
L13	2:02	Technician	"Nothing could have put them there."	Quiet
L14	2:08	Technician	"Documenting from here. Not going closer."	Holds position
L15	2:15	Technician	"I moved. The gap's facing me again."	Steps sideways, re-frames
L16	2:21	Technician	"Requesting extraction."	Held silence after (SDH: [SILENCE])
Before writing audio, create a labeled section in the code for each line (L01 to L16) holding its start time, text, caption text and any SDH tag, so it can be retimed in one place.

5. Style prompt: simulation inspection footage
A single recording from a handheld camcorder carried into an unoccupied automated container terminal (Build 5.09) to visually verify unexplained motion. Genre reference (grammar only): found footage, new-weird, "the system is wrong and nobody knows why" horror, 1990s consumer camcorder footage. Never use any existing organisation, logo, shipping line, brand, game or film title inside the film. The company, its forms, its marker names, container codes and anything unseen are original.
5.1 Essence, and what it is not
* One first-person handheld recording (4:3, VHS-era look), continuous, ending when the tape does.
* Scale and emptiness carry the dread: miles of identical stacks, parked machinery, a professional voice.
* Not a creature feature: no monster, no silhouette, no gore, no jump-scare stings. Not a ruin (the port is clean and orderly). Not a CRT terminal piece (the artefacts are tape and lens, not scanlines).
* The audience never learns what moved the containers.
5.2 Story shape (about 2:30)
Time	Beat
0:00 to 0:35	Tape roll-in, title text (scenario name redacted, date). Motion alert explained. Gate entry.
0:35 to 1:20	Numbered lanes, parked cranes, wind and cables, "No birds." Optional texture comment.
1:20 to 1:45	Lane 9, the sensor clearing.
1:45 to 2:15	The ring of nine containers. Not in the plan. Cranes did nothing.
2:15 to 2:30	He moves; the gap faces him again. Extraction request, silence, static, one-frame ID overlay with iteration +1.
5.3 Materials and rendering
* Frame: 4:3 pillarboxed in 1920x1080. Render the 3D at low resolution (for example 720x540) and let the VHS pass upscale.
* Aim for worlds that look believable and realistic through the grainy filter. Give important surfaces (corrugated container steel, rust streaks, door bars, twist-locks, painted lane lines, wet concrete) real texture detail. If the scenery reads as computer generated, the technician comments once that textures and models are still in early development (L07).
* Containers: instance thousands of 20 ft and 40 ft containers in faded colors (rust red, dull blue, gray-green, off-white, mustard), stacked up to five high, with visible corrugation, door hardware, fictional container codes and stenciled numbers, dents, rust and variation in fade. No real shipping line logos or reefer branding.
* Cranes: tall gantry cranes on rails, parked, with cable and spreader details. Driverless straddle carriers parked in bays. Light poles with large lamp heads, off. Cranes must not move at any point in the film.
* Ground: wet concrete paving with painted lane lines and large lane numbers (1 to 12), puddles, tire marks, drains, rail tracks, bollards, a perimeter fence, a gate and a small unmanned gatehouse.
* Zone 9 clearing: a square of open paving among the stacks at Lane 9. Nine identical containers (same size, same faded color family) stand in a ring of ten evenly spaced positions, one position empty. The gap must face the camera on first view and again after the camera moves, with no visible movement. Implement by rotating the ring offscreen between observations, or by keeping it always oriented to the camera and ensuring nothing perceptible changes. The ring must be physically plausible: containers sit on the ground, not stacked.
* Lighting: flat overcast gray sky, soft shadows, cool daylight, damp matte surfaces. No sun rays. Late afternoon cast.
* Motion cues for the alert: loose straps, a cable swaying, a flapping tarp, a door bar that slowly rotates in the wind, a puddle with ripples. Keep them minimal and plausible.
* VHS camcorder pass: small line jitter (0.25 px or less, low frequency), head-switching band, tracking tears on demand, barrel and vignette on the image but not the OSD, luma blur with edge ringing, chroma smeared right, light smear and bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks, soft clip. Noise at tape rate (30 fps). No scanlines, no RGB mask.
* OSD: bitmap font with black outline. REC dot, battery, time and date, a small label (for example MOTION CHECK), a build tag (BUILD 5.09), a zone tag that updates (ZONE 9 when he arrives), and an iteration counter (ITER 01). The title generator uses the same font, larger.
5.4 Color logic
* Overall: flat gray sky, damp concrete gray, muted faded container colors, cool and desaturated.
* Lane numbers and lines: worn yellow and white paint.
* No red in this short. Red belongs to the Hat Man.
* White balance drifts slowly cooler. Colour is never graded clean.
* Example palette: sky #aab3b8, concrete #7d8083, wet concrete #55595c, container red #7a3b2e, container blue #3d5a73, container green #5c6b5a, container mustard #a58a3a, lane paint #c9b24a.
5.5 Type and subtitles
* Closed captions (CEA-608 style): monospace (for example IBM Plex Mono 600) about 42 px, white on a solid black box per row, 32 characters or fewer, centred inside the 4:3 frame above the OSD. Untouched by tape noise. Hold for at least max(1.8 s, speech + 0.6 s).
* SDH descriptions in brackets: [FOOTSTEPS], [WIND], [CABLES CREAKING], [TAPE NOISE], [SILENCE].
* The title is camcorder title-generator text over the first shot: scenario name (redacted) and date.
5.6 Motion quality
* One continuous handheld take. Cuts happen only where the tape breaks: power-on roll-in, any tracking tear, and the final static.
* Handheld: walking gait (head bob a few cm, sway, small roll), breathing (about 0.27 Hz) and a tremor whose amplitude follows a fear curve. Calm and steady early, tightening at the ring and again after the re-frame. Freeze everything at a held breath.
* Hold the camera at chest height, slightly low and wide, never eye level. Looking down shows only shoe toes and wet paving.
* Autofocus is animated with overshoot: blur, lock, slip, lock. It hunts on repeating corrugation and on far stacks.
* Auto-exposure lags about 0.45 s after sudden lighting changes, with gain noise pumping.
* Electronic image stabilization that occasionally overcorrects. Rolling-shutter skew on fast turns.
* The ending: the camera stays at chest height and does not drop.
5.7 Camera grammar
Move	Expresses	Use here
Walking POV down a lane	routine, the job	lane walk
Slow pan along the stacks	scale and repetition	first look at the port
Tilt up a parked crane	scale, stillness	"Cranes are parked"
Held on swaying cable	a plausible explanation	"That's probably my motion"
Rounding a corner of containers	the threshold	arrival at zone 9
Slow count with the camera	recognition	counting the nine
Sidestep and re-frame	doubt	the gap facing him again
Never give a clean look at anything that is not a container, a crane, a vehicle, paving, the technician's hands or his boots.
5.8 Sound palette
* No score. Only what the tape would have recorded.
* Bed: steady wind moving through container gaps, a low tonal hum from electrical systems, distant metal groans, cables creaking, loose straps flapping. No birds. This absence matters.
* Footsteps on wet concrete, small splashes through puddles, cloth rustle, breath, camcorder clack and motor, zoom servo, AF ticks.
* Zone 9 clearing: the wind drops slightly and the bed thins, so the clearing reads as quieter than the rest.
* Held digital-zero moment after "Requesting extraction," captioned [SILENCE]. Then only room tone, then static.
* Technician voice is dry. Heavy reverb destroys intelligibility.
* Mix: bed about -8 dB under voice, -14 LUFS, no added grain.
5.9 Native moves
* Counting as recognition: he counts the containers and stops at nine.
* The OSD as evidence: time code and battery tick regardless. The iteration counter changes between the first and last frames. The zone tag updates on arrival.
* Emptiness and repetition: the same container, the same lane line, the same stack, miles of it.
* Procedure as dread: he keeps documenting while the evidence stops making sense.
5.10 Pitfalls
* Do not over-weird the first minute. It must feel genuinely mundane.
* The ring must feel placed, not generated. Vary container weathering and tiny spacing errors, but keep even ring spacing.
* Do not show a body, a pursuer, or any figure.
* Do not animate cranes or vehicles at any point.
* Repetitive stacks look fake if tiled visibly. Vary color, height, rust, dents and door orientation.
* Line wobble skews text. Keep it 0.25 px or less and leave the caption box untouched.
* Do not time-compress a finished timeline. Keep keyframes in original time and map through one warp function.
5.11 Realism
The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished, less cinematic option. The camera is a 1990s consumer camcorder with a small CCD sensor. Use motion blur only on fast pans. No steadicam smoothness, no impossible angles, no mathematically perfect lighting, no uniform noise, no clean reveals. Speech feels unscripted: small hesitations, a throat clear, a breath before a number, a self-correction. Breathing and footsteps match the camera bob. Approximate the look of low-light handheld camcorder footage: crushed blacks, noisy shadows, blooming highlights and slow exposure recovery.
6. Continuity (open to your taste)
* Keep Build 5.09 and Lane 9 exactly. The ring has 10 positions and 9 containers, matching the exit glyph (ten dots, one missing).
* Do not show the Hat Man or any hat.
* The gap must face the camera every time the ring is seen.
8. Delivery requirements
1. One HTML file. Everything (code, libraries, textures, audio, fonts) is contained in that single file so it works on its own on another computer. Load three.js and any libraries from npm or a CDN at build time and inline them. Embed images and audio as data URIs.
2. Textures. Find HD textures online where applicable (for example CC0 sources such as Poly Haven or ambientCG for corrugated metal, rusted steel, wet concrete, asphalt and painted lines). Downsample sensibly and embed them. If your environment cannot reach those sites, use well-made procedural textures and say so clearly in your final message, and use the user's reference photos as visual targets.
3. Dialogue editor mode. Add a toggleable mode (key D and an on-screen button) that shows a simple visual timeline: one track per speaker, each line a draggable block with start time and duration, editable caption text, and Add and Remove buttons. Changes must retime the burned-in captions and the speech audio. Include an Export and Import JSON button for the dialogue so edits can be saved and pasted back into the file. Keep the editor out of exports.
4. Voice. Provide a way to supply recorded voice files per line (ID L01 to L16) or use text-to-speech as a placeholder. Dialogue timing must allow each word proper time to be spoken, with no excess silence unless marked.
5. MP4 export. Provide separate checkboxes to include or exclude Music, Sound Effects and Voice/Narration so each audio element can be exported independently. There is no score in this short, so Music may be disabled but must exist. Each stem exported separately must be exactly the same length as the video MP4, padded with silence where needed.
6. Engine files (as modules within the single HTML).
    * world.js: terminal layout, instanced container stacks, parked cranes and carriers, lane numbers and paving, zone 9 clearing, ring of nine containers with camera-facing gap, lighting.
    * tex.js: procedural and embedded textures, container codes, lane paint, title text.
    * vhs.js: VHS camcorder ShaderPass.
    * osd.js: bitmap font, REC, battery, clock, MOTION CHECK label, build tag, zone tag, iteration counter, title generator.
    * subs.js: 608 captions, SDH tags.
    * audio.js: wind and electrical bed, footsteps, foley, voice playback, stem export.
    * story.js: timeline, dialogue table (L01 to L16), camera keyframes, fear and focus curves, the re-frame and ring re-orientation, ending hold.
    * editor.js: dialogue editor mode.
    * main.js: renderer, post chain (ambient occlusion, depth of field, bloom, then VHS), handheld rig.
9. Fixed and open
Fixed for this film: location (unoccupied automated container port, Build 5.09), reason for filming (visual verification of unexplained motion in an unregistered run), numbered lanes with zone 9 at Lane 9, parked cranes that never move, no birds, a ring of nine containers with the gap facing the camera and facing it again after he moves, static then one-frame ID overlay, 4:3 camcorder format, length 2:20 to 2:40, May 8, 2027 date,
Open to your taste: the technician's exact phrasing (keep it procedural), lane and stack counts, the title text wording, whether a tracking tear marks the re-frame, the precise container colors.
