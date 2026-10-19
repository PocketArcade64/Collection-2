# Collection-2

Found Footage: Return to the Test Room: Build Instructions 

Runtime: about 2:55 (hard range 2:40 to 3:00) Date on tape: OCT 15 2026 Deliverable: one self-contained HTML file that plays, previews and exports the short

Note: This room model is already built when making the Orientation short so please look there first to establish a baseline of what you already have.

0. Read this first: context (assume you know nothing)
What you are building. A single first-person handheld recording from a 1990s-style consumer camcorder, played inside a browser. It is a short "recovered footage" piece from an in-universe corporation. The film is quiet psychological unease, not a monster film. No gore, no jump scares, no score, no shape that attacks anyone.
The universe in brief. The company runs the Consciousness Simulation Network (CSN). A person (the Source Subject) is photographed and given a Subject number, sedated on a procedure table, and the CSN copies their brain pattern into a Cognitive Instance (CI). The CI runs scenarios (Builds) inside a simulation, believing it is the person. When the Run ends, its experience is compressed into a Delta and written back into the Source Subject (Reintegration), and the CI is retired. The company staff speak about all of this calmly and professionally. The company is not cartoonishly evil.
Who the camera belongs to: the Hat Man. Upload 003 was one of the first three uploads. In June 2025 its orientation exercise lost connection mid-session. The extraction protocol had no handling for a CI that stopped responding, so the original body woke up fine, the file was marked "closed", and the copy was never pulled out. Left running with no objective and no evaluator, it learned the simulation's edges by walking them, and over time began to manipulate the CSN. He keeps one detail from the original upload: the top hat from his intake photo. He wants two things: to get out, and to shut down the thing that kept him in. The audience never gets a clean look at his face. In this film we only see his hands, his boots, and (once, in a reflection) the silhouette of a hat brim.
His story so far (earlier shorts, for context only. The viewer may not have seen them):
Date range	Place	What happened
Jun 10 to Oct 23, 2025	ORIENTATION_TEST_003	Connection drops, he is stranded, learns the glyph ritual and his red power, opens a way to the Staging Plane, enters the HOTEL door
Oct 23, 2025 to Mar 16, 2026	Hotel corridor, doors 1 to 7	Each hotel door opens onto a different Build. He works out how to leave each one by repeating the ring ritual
Jan 3 to Mar 16, 2026	Subway platform	Panic turns to anger ("I will have my revenge"). He learns he can form a rectangle with his hands and spawn a door at will
Mar 16 to Oct 15, 2026	Static	213 days pass with no footage
Oct 15, 2026	This short	The simulation is repaired. He returns to where it started
The glyph ritual (he did this in 2025): the official EMERGENCY EXTRACTION sign shows ten dots in a ring around the words. He copied it by laying out nine objects (the cube, stools, tubing, pedestal caps) in an even ring and standing in the gap himself as the tenth position. The objects rotate in place, sink into the floor with a two-note chime (the recurring audio cue), and red light seeps out. The chime means "the system did not expect this."
The repair (the plot fact of this film). On Oct 15, 2026 the company patches the CSN: restores the build, and updates the extraction protocol "to handle unresponsive instances". The patch also blocks "unauthorized transition boundary creation", which kills the ring ritual. It does not touch anyone already affected, and it does not remove the glyph from the sign. Company staff will not enter simulations until Jan 2027, when he is causing far more chaos.
The Staging Plane and the parallax doors (needed for the ending). The Staging Plane is a blank, completely white, unmonitored space with many door-shaped holes in its walls. Each hole is tagged with a plate number and opens onto a Build. Looking through a door must feel like looking through a real window, not at a flat picture: the Build beyond is rendered as a real second scene and the view shifts with correct parallax as the camera moves. Implement this as a portal: a second camera whose position is the main camera's position transformed by the offset between the doorway and the destination scene, rendered into a render target (or stencil-masked) that only shows through the doorway shape. In this film the Staging Plane appears at the start and at the end. The door he spawns with his hands uses the same portal technique to show the Staging Plane beyond it.
Where this sits in release order. This is the last Hat Man short posted. Viewers will already have seen the 2027 technician shorts (Luminous Hollow, Model Estate, and so on), and this film makes them reread differently. Nothing here may depend on them. It must also work completely cold.

1. Purpose of the camera
Why is this person recording? The camcorder is the subject-view capture unit tied to Subject 003's identity file. Orientation exercises require it, and it is the only thing the CSN still logs about him. When the restoration re-initialised his subject file, the camcorder's REC state came back on by itself. He does not turn it on. He keeps it running because it is the one record that proves he exists, and because if anyone ever reviews it, they will see.
So the recording exists for two layered reasons: a mundane procedural one (the camcorder resumed capture because the restore reset subject 003 to its June 2025 state) and a human one (he does not switch it off).
He is not recording to make a film. He should barely acknowledge the camera.

2. The Hat Man's arc: what must happen to him here
Every earlier short moved him one step along this line:
1. Compliant (June 2025): follows procedure, trusts the evaluator.
2. Abandoned (Aug 2025): realizes nobody is coming, tests his power.
3. Panicked (pool, Oct 2025 to Jan 2026): "my entry door is gone."
4. Angry (subway, Jan to Mar 2026): "I will have my revenge."
5. Capable (end of subway): spawns doors with his hands.
6. This short: the last hope, then the end of asking.
This short must do three things to him, in order:
* Hope. The intercom ding is the first sound from the system in 492 days. For the first time since the connection dropped he behaves like a person again: he runs, he calls out, his voice cracks. He still believes someone might extract him.
* Confirmation. The voice is automated, not the evaluator. The fix exists, but it is for the next one. His own file is read aloud as "Closed Files: one. No action required." The system has not forgotten him. It has filed him. This is the emotional core and the line the film is built around.
* Resolution. He stops asking the system to save him. The grief goes still, then cold. He no longer wants out through the CSN's procedures. He wants out through the people on the other side, and he wants the CSN gone. He stands, and for the first time in the film he chooses the exit.
He should never say the words "destroy the CSN" or "revenge" in this short. Viewers infer it from his stillness and from the way he leaves. His last lines are short and quiet.
The key distinction: in the earlier shorts he is reacting. After this scene he is deciding. That is why the 2027 shorts feel different.

3. Story beats
Structure: normal procedure, subtle anomaly (a voice returns), increasing contradiction (the voice is not for him), realization, quiet resolve, exit.
Act 1: Back through the Staging Plane (0:00 to 0:44)
* Tape roll-in. Title-generator text: ORIENTATION_TEST_003 and OCT 15 2026 (0:00 to 0:05).
* He leaves the hotel and steps back into the Staging Plane. It is blank and white as before, but there are many more doors in its walls now, each a parallax portal (see section 0). The HOTEL door closes behind him. He says nothing and only looks.
* The intercom ding carries across the plane: a single distant tone. He stops, turns toward it, then walks to the door tagged ORIENTATION_TEST_003 and goes back through to the test area (0:13 to 0:22).
* Room 1 is the orientation room: grid-banded walls, plain floor tiles, a red button and a blue button, red and blue doors, an electronic wall sign reading 003 / HANDSHAKE: PENDING.
* The room is restored. It is clean and finished: crisp textures, no scuffs, no tally marks. He crouches and runs his hand along the low wall where his tally marks used to be. Bare paint. In 2025 he would have commented that textures were unfinished. Now he says they finished them.
* He tests the puzzle anyway because procedure says to: red opens the red doors and closes the blue ones. It works. Nobody evaluates him.
* No glitches. No red. Room tone only, until the speaker grille crackles at 0:44.
Act 2: The static (0:44 to 1:25)
* Static takes over the speaker grille for a few seconds, the sign flickers, and a voice begins to come through the walls. The ding he followed from the Staging Plane was this system waking up. It is a plain one-tone sound, clearly not the two-note chime.
* He rushes toward it. He crosses Room 2 (where the cube sits) and enters Room 3, the last room, with the EMERGENCY EXTRACTION sign and its ten dots. The camera is hurried but never impossibly smooth.
* He says, breathlessly, who he is: "I'm here. This is Upload 003. I'm here."
* The voice answers. It is flat, synthesized and unhurried. It reads the restoration notice. It is not the evaluator.
* He realizes this a half-second after the audience does. Stumble. A second plea.
Act 3: The list (1:25 to 2:08)
* The announcement reads the closed-file status: "Closed files: one. No action required."
* The wall sign flips to 003 / FILE CLOSED with an empty extraction-date field.
* He presses the EMERGENCY EXTRACTION button. Nothing, just like the first time.
* Last test. He gathers nine loose objects (cube, stools, tubing, pedestal caps) and lays them in an even ring with a gap facing the camera, then stands in the gap. Nothing happens. No rotation, no sink, no chime. The patch works. This is the proof the viewer needs.
* He sits down on the floor in the middle of the broken ring. The camera lowers smoothly to seated height and stays there.
* He says quietly, almost to himself: "They fixed it. They fixed it for the next one." Hold on this. Give it silence before and after.
Act 4: Flush and exit (2:09 to 2:57)
* The white floor begins to flush red from the floor up: deep, dark and bruised rather than alarm-bright. It stains the floor tiles first, then the walls, then the sign's ten dots.
* The two-note chime plays once, low and quiet. The system did not authorize this and no ritual was performed, which tells attentive viewers that he is now outside what the patch can see.
* He sits through the rise. He does not stand until the red is at wall height.
* He stands. The camera rises to chest height. Looking down, the red tile floor from above shows a ring of tiles with one gap where he is standing (the hat brim seen from above). Do not call attention to it.
* A faint reflection in the dark glass panel by the extraction sign shows a silhouette of a hat brim for a few frames and nothing else.
* He says one short line, level and cold: "They can patch the simulation, but they cannot alter me."
* He raises both hands in front of the lens and forms a rectangle with his fingers. A thin white outline cuts into the red wall and opens. Through it, with correct parallax, is the Staging Plane, blank and white, with all of its doors.
* He reaches his hands out through the doorway. A saturated red hue spreads from his fingers across the whole Staging Plane, door by door (deep and bruised in tone, driven high enough to bloom). Hold on this for about a second and a half.
* Over the red plane he says, quietly: "File's closed. I'm not..." The audio cuts on "not" and holds in silence. Then, lower and almost conversational: "This experiment isn't over."
* He steps through the door into the red Staging Plane. The camera looks back once: the test room behind him is entirely red and the door is already closing. Cut to static. Two seconds of static, then a one-frame overlay: simulation ID and ITER +1.

4. Dialogue and timing (one block per spoken line)
Speakers: HM = Hat Man, [AUTO] = automated restoration voice (the same voice that reads the restoration notice and the closed-file notice). The evaluator never speaks.
Place each line so it sounds human: allow a breath before a number, keep dry audio (no reverb), and do not leave dead air between sentences unless the beat needs it. Hold each caption for at least max(1.8 s, speech length + 0.6 s).
#	Start	Speaker	Line (CC, 32 characters max per row)	Notes
,	0:13	SFX	[INTERCOM DING]	Single distant tone across the Staging Plane; he stops and turns
1	0:25	HM	They finished the textures.	Quiet, to himself, hollow, just inside Room 1
2	0:31	HM	Four hundred ninety-two days.	Crouched at the wall, flat
3	0:39	HM	Red opens red. Still works.	Procedural, after pressing red
,	0:44	SFX	[STATIC]	Grille crackles, sign flickers, to 0:49
4	0:50	HM	Hello? Evaluator? I'm here.	Running, breathless
5	0:54	HM	This is Upload 003. I'm here.	Cracks on "here"
6	1:00	[AUTO]	Simulation restoration complete.	Flat, intercom-filtered
7	1:04	[AUTO]	Extraction protocol updated to / handle unresponsive instances.	Two caption rows
8	1:10	[AUTO]	Thank you for your patience.	Pleasant, final
9	1:14	HM	That's not you. That's not...	Voice falls apart
10	1:19	HM	Somebody. I'm still here.	Almost a whisper
11	1:25	[AUTO]	Closed files: one. / No action required.	Sign flips at 1:29
,	1:32	SFX	[BUTTON CLICK] [SILENCE]	He presses the extraction button; held digital zero for about 1.5 s
12	1:58	HM	They fixed it.	Seated, still
13	2:01	HM	They fixed it for the next one.	The line the film is built around
,	2:09	SFX	[CHIME]	Low, once. Red begins
14	2:25	HM	They can patch the simulation, / but they cannot alter me.	Standing, level, cold
15	2:44	HM	File's closed. I'm not...	Quiet; audio cuts on "not" while red spreads across the plane
16	2:48	HM	This experiment isn't over.	Lower, almost conversational; the last line
Total speech is about 50 seconds across roughly 2:57. Everything else is room tone, footsteps, breath, hum, camera foley.
Beat timing outside dialogue: roll-in and title 0:00 to 0:05, he steps out of the HOTEL door into the Staging Plane 0:05, ding 0:13, through the ORIENTATION_TEST_003 door 0:15 to 0:22, static and sign flicker 0:44 to 0:49, he rushes through Room 2 into Room 3 0:50 to 1:00, extraction button 1:32, ring attempt 1:36 to 1:52, sits 1:52 to 1:57, red rises 2:09 to 2:22, stands 2:23, hands raise and the rectangle forms 2:32 to 2:38, the door opens onto the Staging Plane and red floods its doors 2:38 to 2:46, steps through 2:51, look back 2:53, static 2:54 to 2:57, ID frame at 2:57.

5. Style prompt
5.1 Essence
* One continuous first-person recording, 4:3 pillarboxed in 1920x1080, with a 1990s consumer camcorder look.
* The room is cleaner and more finished than it was in 2025. The horror is that the repair worked perfectly.
* Dread comes from the automated voice staying polite and from procedure continuing after it stops meaning anything.
* Nothing attacks anyone. The audience never learns whether the red is his power, the system, or both.
5.2 Materials and rendering
* Render the 3D at low resolution (for example 720x540) and let the VHS pass upscale it.
* Find HD textures online (CC0 sources such as Poly Haven and ambientCG) for floor tile, painted wall, brushed metal, rubber, plastic and carpet. Downscale to 512 to 1024 px and embed them as base64 in the HTML. Record the source and license of each in a comment block.
* Room 1: grid-banded walls (pale gray #c9ccce with blue-gray bands #9fb0bd), floor tiles #d8d8d4, red door #a3202a, blue door #2a4f9a, small fluorescent panels, a speaker grille, a dark glass observation panel.
* Room 2: same style with the cube on a pedestal and a few stools.
* Room 3: the EMERGENCY EXTRACTION sign (ten dots in a ring around the words, in a clean sans bitmap look), the extraction button below it.
* Restored build: crisp seams, no scuffs, no tally marks, no graffiti. A faint vertical smear of unevenness on one wall keeps it from looking CG-perfect.
* If any surface looks computer generated he does not comment on it this time. The earlier excuse is gone.
* Staging Plane (start and end of the film): a blank white floor, walls and ceiling with no visible seams, and many door-shaped holes in the walls, each with a small plate number. Each door is a parallax portal onto a different Build (simple stand-in scenes are fine). The doors tagged HOTEL and ORIENTATION_TEST_003 must be readable. At the end the whole plane takes on the red hue. The HOTEL door he steps out of shows a sliver of hotel corridor behind him: warm amber light and the provided carpet pattern (leave a clearly labelled texture slot for the user to drop in).
5.3 Color logic
* Room: clean, slightly cold fluorescent neutral.
* Red is the only saturated signal: deep, dark, bruised red (sky-red from earlier shorts), not alarm red. Drive its emissive high enough to cross the bloom threshold, since dark red has low luminance.
* Red must interact with surfaces (stain the tiles, push blue toward near-black) and never behave as a flat overlay.
* Palette: wall gray #c9ccce, wall band #9fb0bd, tile #d8d8d4, red door #a3202a, blue door #2a4f9a, red flush #8a0f1c, deep red #4a0610, Staging Plane white #f4f4f2.
* White balance drifts toward magenta as the red takes over. Never grade clean.
5.4 Overlay (OSD) and captions
* Bitmap font with black outline. REC dot, battery, time, date OCT 15 2026, label SUBJECT CAPTURE, build tag BUILD 1.0 (the repair bumped it, earlier shorts showed a lower version), iteration counter ITER 01, which ticks to ITER 02 on the last frame.
* Closed captions (CEA-608 style): monospace (IBM Plex Mono 600 or similar), about 42 px, white on a solid black box per row, 32 characters or fewer, centered inside the 4:3 frame above the OSD. Untouched by tape noise.
* Hat Man needs no mark. Automated voice is captioned [AUTO]. SDH descriptions in brackets: [INTERCOM DING], [STATIC], [FOOTSTEPS], [SILENCE], [CHIME].
* Title generator uses the same font, larger.
5.5 Motion
* Handheld: walking gait with head bob, sway and small roll, plus breathing (about 0.27 Hz) plus tremor following a fear curve: steady in Act 1, frantic in Act 2, collapsing in Act 3, and very still when seated. Freeze everything at held breaths.
* Chest height, slightly low and wide. Looking down shows only boot toes and floor.
* Autofocus hunts with overshoot, especially on the sign and the speaker grille. Exposure lags about 0.45 s after the red starts.
* Smooth camera lowering to seated height (about 1.5 s), no snap.
* The look back through the closing door is the only deliberate turn in the final seconds.
5.6 Camera grammar
Move	What it expresses	Use here
Held still on a wall	grief	tally marks gone
Rush toward sound	hope	Act 2
Glance up at the speaker	disbelief	automated voice
Held low and still	acceptance	after "for the next one"
Hands raised into frame	decision	forming the door
Look back through a closing door	leaving something behind	final beat
5.7 Sound palette
* No score. Only what the tape would have recorded.
* Room tone: fluorescent hum, faint HVAC, footsteps on tile, cloth rustle, breath that follows the fear curve.
* Intercom ding: single clean tone, distinct from the glyph chime. Static burst: loud and sudden but brief.
* Automated voice: flat, slightly compressed, intercom-filtered but fully intelligible. Never sinister in delivery.
* Silence after the extraction button: a held digital zero for about 1.5 s, captioned [SILENCE], then room tone returns.
* Red flush: a low hum, lower in pitch than the fluorescents, rising slowly. The two-note chime plays once, quietly.
* Foley: camcorder clack and motor, zoom servo, AF ticks, button click, object scrapes on tile, door seam opening.
* Mix: bed about 8 dB under voice, -14 LUFS. Keep the Hat Man's voice dry.
5.8 Pitfalls
* Do not show the Hat Man's face or any shape in the walls.
* Do not let the final red look like a screen overlay.
* Do not rush the line "They fixed it for the next one." It needs silence on both sides.
* Do not explain the patch beyond the three automated lines.
* Do not make the room look broken. It should look better than ever.
* The ring attempt must fail without any glitch, visual or audio.
* Do not time-compress a finished timeline. Keep keyframes in original time and map through one warp function.
* Keep line wobble to 0.25 px or less and leave the caption box untouched.
5.9 Realism
The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished option: crushed blacks, noisy shadows, blooming highlights, slow exposure recovery, rolling-shutter skew on fast turns, electronic stabilization that overcorrects.

6. Engine and single-file requirements
One HTML file. Everything (code, libraries, textures, fonts, audio) must be embedded so the file works when emailed to another computer with no network. Inline any libraries (such as Three.js) instead of loading them from a CDN. Organize the single file into clearly labelled regions that mirror these modules: world (rooms, Staging Plane, doors, lighting states, red flush shader), portal (Staging Plane doors and the hand-door), tex (embedded textures), vhs (camcorder shader pass), osd (overlay and title), subs (captions), story (timeline, keyframes, fear and focus curves), main (renderer, post chain, handheld rig), editor (dialogue editor), export (video and audio).
Post chain: ambient occlusion, depth of field and bloom, then the VHS pass. VHS pass: small line jitter, head-switching band, tracking tears on demand, barrel and vignette on the image but not the OSD, luma blur with ringing, chroma smeared right, light smear, drifting white balance, AGC noise in darks, dropouts, lifted blacks. Noise at tape rate (30 fps). No scanlines or RGB mask.
Dialogue editor (toggleable). A key (for example D) opens an overlay timeline that shows every burned-in caption as a draggable block.
* One lane per speaker (Hat Man, Automated, SFX captions).
* Drag to move start time, drag the right edge to change hold length. Snap to 0.1 s.
* Click a block to edit text, speaker and caption rows, with a live count against the 32-character limit.
* Add and delete lines. A playhead scrubs the film and the captions update live.
* Auto-compute hold as max(1.8 s, speech + 0.6 s) with an override.
* Warn on overlapping lines.
* Export and import the dialogue as JSON so edits survive between sessions. Edits must also drive the video export.
* Let each line optionally carry a user-supplied audio clip (embedded as base64) so a real voice performance can replace the placeholder.
Exports.
* MP4 export with the video rendered at a fixed timestep (deterministic, not real-time). Use WebCodecs with an inlined MP4 muxer. If MP4 is unsupported in the browser, say so clearly and fall back.
* Separate checkboxes to include or exclude Music, Sound Effects, and Voice/Narration. There is no music in this film, but keep the checkbox.
* Also export each audio stem as its own WAV file. Every audio file must be exactly the same length as the video MP4 (pad with digital silence to the exact sample count).

8. Variation space
Fixed: the test room, the restored build, the ding, the automated voice, the "for the next one" line, the red flush, the hand-made door onto the red Staging Plane, the final static with ID frame.
Open to taste: the exact wording of the Hat Man's smaller lines, the precise count of days he says, the exact objects he uses for the failed ring, whether the reflection of the hat appears at all, and the number and arrangement of doors in the Staging Plane as long as the continuity details stay.