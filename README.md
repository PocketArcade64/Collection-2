❇️ 🎥 Found Footage: Fairhaven: Build 1.3 Walkthrough 

Purpose of the camera: A scenario builder is doing a manual QA pass on a half-built environment, because the automated checker can't verify interior consistency across duplicated assets.

Act 1: Daytime walkthrough (Make the camcorder timestamp change instantly to a PM when it flips instantly to night)
* Bright, quiet estate. He narrates in a flat, procedural tone: lot numbers, "Unit 14, model B, same as 13 through 40."
* Interiors are staged: the same normal furniture, same blue owl painting on the same wall in each house 
* He walks into a few houses and checks their interiors
* The lived-in detail: Unit 22. The house has extra owl paintings on every wall. He logs it as a placement error.
Act 2: Night test
* A voice comes over the PA and says now I will change the time of day to night for the next test
* Someone outside the simulation switches to the night cycle to test lighting. Every house has a lamp on that he didn't switch on, but each is in a "default" staged state, so he marks it as a pass.
* In the street, the ground gives way. The crack grows progressively larger and heads towards him then he turns around to escape but another crack is also coming from that direction then the floor gives out from under him and he falls into the dark crack
Act 3: Red town
* Falling down the dark crack, he lands in an Identical neighborhood, but the sky and light are saturated red.
* He lands hard, and the camera overlay flickers once. He logs it flatly: "Fall recovered. Environment: duplicate of Build 1.3. Sky and lighting not matching daylight."
* The houses are identical, but the owl paintings are not. Every house now has the Unit 22 layout, with extra owls on every wall. Here, the "placement error" is the default.
* The only audio is his footsteps and the hum of the red light.
Ending: "Unit 41"
1. He walks to the end of the street and finds a house that shouldn't exist. The estate had 40 units, and this one is numbered 41.
2. Inside, it's the normal Build 1.3 interior: one owl painting, daytime lighting, no red. It's the only house that matches the original spec.
3. Abruptly, the hallway expands to be far longer than the house's footprint outside. He logs: "Interior exceeds lot footprint." He steps in, and the door behind him is already a different door.
4. Rotating rooms. The staircase climbs to the ceiling, then continues across it. A doorway opens onto the same hallway sideways. Furniture sits on walls, and he walks onto the wall because "floor is wherever collision registers."
5. Settling. As he nears the kitchen, the geometry snaps into place wall by wall, like it's snapping to a grid. By the time he reaches the counter, the room is perfectly normal.
* Now with the house stabilized, he turns to leave. The doorway he entered through is now plain wall, with no seam, no frame, and no paint change.
* He checks calmly: windows (none), the other doorways (none), the ceiling (flat).
* He tries the standard procedure: "Requesting extraction." No PA response. He tries again, and the lights hold steady.
* He steps closer to the wall to inspect it. The room quietly resizes, so the wall is now where he was standing and he's a few feet from the opposite one. Nothing moved, but the room is always the same distance from him.
* He looks around as the walls close in on him and the furniture crushes him then the camera cuts to static. END

________________________________

Simulation Inspection Footage: Style Prompt
A single recording from a handheld QA camcorder, carried into an unfinished simulated housing estate (Build 1.3) because the automated checker cannot verify interior consistency across duplicated assets. Genre reference (grammar only): found footage, new-weird, "the system is wrong and nobody knows why" horror; 1990s consumer camcorder footage. Never use any existing organisation, logo, game or film title inside the film. The company, its forms, its marker names and anything unseen are original. Suits films of 2:20 to 2:40.
1. Essence, and what it is not
* One first-person handheld recording (4:3, VHS-era camcorder look), continuous, ending when the tape does.
* A bright, quiet estate of 40 identical model homes that goes wrong through duplication: a night cycle he did not request, a collapsing street, a red copy of the town, and an extra house that should not exist. It starts as a routine QA pass and ends as the last recorded evidence.
* Dread comes from small inconsistencies, spaces that exceed their own footprint, a professional voice staying professional, and procedure continuing after it stops making sense.
* Nothing is ever shown attacking. The audience never learns whether the build is unstable or the test is aimed at him. The unseen PA voice stays calm and polite, and the company never explains.
* Not a creature feature (no monster, no silhouette, no gore, no jump-scare stings). Not a ruin (the estate is clean and pleasant at first). Not a CRT terminal piece (the artefacts are tape and lens, not scanlines).
2. Story shape (about 2:30)
Time	Beat
0:00 to 0:40	Tape roll-in. Title-generator text: scenario name (redacted) and date. The technician explains the manual QA pass. Bright daytime street, lot numbers, "Unit 14, model B, same as 13 through 40." He checks a few interiors: same furniture, same blue owl painting on the same wall. Unit 22 has extra owls on every wall. "Placement error. Logging."
0:40 to 1:05	PA voice: "Now I will change the time of day to night for the next test." Cut to night. Every lamp is on, in its default staged state: "Pass." In the street, a crack grows toward him. He turns and a second crack is closing from behind. The floor gives out and the camera tumbles into black.
1:05 to 1:30	Hard landing, one overlay flicker. A duplicate of the estate under a saturated red sky. "Fall recovered. Sky and lighting not matching daylight." Every house now has the Unit 22 owl layout. "Consistent." Only footsteps and the hum of the red light.
1:30 to 1:50	End of the street: Unit 41, in a 40-unit estate. Inside, the original interior: one owl, daylight, no red. The hallway lengthens past the lot footprint. "Interior exceeds lot footprint." The door behind him is a different door.
1:50 to 2:05	Control-style geometry: slab walls slide on hidden tracks, stairs continue across the ceiling, a doorway opens onto the same hallway sideways, furniture sits on walls. "Floor is wherever collision registers."
2:05 to 2:20	The geometry snaps to grid, wall by wall, and the kitchen is perfectly normal. The overlay iteration number ticks up by one. He turns to leave and the entry is plain wall. He checks windows, doorways, ceiling. "Requesting extraction." Silence. Again. The lights hold steady.
2:20 to 2:30	He steps toward a wall and the room resizes, so the wall is now where he stood. The walls close in and the furniture slides into frame edges. Cut to static. Two seconds of static, then a one-frame overlay: simulation ID, iteration +1.
3. Materials & rendering
* Frame: 4:3 pillarboxed in 1920×1080. Render the 3D at low resolution (e.g. 720×540) and let the VHS pass upscale.
* Aim for the worlds to look believable and realistic enough when seen through a grainy filter on the camcorder
    * Ensure that enough important objects have textures and the scenery looks believable when seen through the grainy camcorder filter
* Exterior: a hand-authored street of 40 model homes in two rows, model B repeated, with lot numbers on posts. Early-build look: flat stucco, simple roof tiles, basic lawns, repeated sidewalk slabs, sparse trees. If anything reads as computer generated, he mutters that textures and models are still in early development.
* Interiors: the same furniture set and one blue owl painting on the same wall in every house. Unit 22 carries owls on every wall. Plain walls, beige carpet, a table, a couch.
* Lighting has three states, each driven by the story timeline: day (soft overcast sun, flat sky), night (cold dark sky, lamps in every window, warm practical light), and red (saturated red sky and ambient light). Windows light the interiors in each state.
* Ground crack: displace the street mesh along an animated crack path with a dark gap beneath. It grows toward him, then a second crack closes the escape route. Floor collapse, then a fall into black.
* Control-style interior: brutalist concrete and drywall slabs, fluorescent panels, sliding wall modules with visible track seams, rooms that detach, drift and re-dock. Gravity reorients to whichever surface he is nearest. Grid snap: modules ease into place with a heavy final settle.
* Room resize: scale the room geometry around the camera while keeping the camera's apparent distance to the wall constant, so the wall is "always the same distance."
* Crush: walls translate inward and furniture slides into frame edges. No visible body. The picture breaks to static as walls contact the lens.
* VHS camcorder pass: small line jitter (≤ 0.25 px, low-frequency), head-switching band, tracking tears on demand, barrel and vignette on the image but not the OSD, luma blur with edge ringing, chroma smeared right, light smear and bloom, drifting white balance, AGC noise in darks, dropouts, lifted blacks, soft clip. Noise at tape rate (30 fps). No scanlines, no RGB mask.
* OSD: bitmap font with black outline. REC dot, battery, time and date, a small label such as QA MODE, a build tag (BUILD 1.3), and an iteration counter (ITER 07). The title generator uses the same font, larger.
4. Color logic
* Day: washed, pale suburban neutrals (beige stucco, off-white trim, dull green lawn, flat pale sky). Pleasant and slightly too perfect.
* Night: cold blue-black sky and ground, with warm amber lamps in every window.
* Red: the one saturated signal. Deep, dark red sky and light, heavy and bruised rather than bright alarm red. Drive its emissive high enough to cross the bloom threshold, since dark red has low luminance.
* Blue owl: the single recurring small accent. Keep it the same blue in every state, tinted by the ambient light.
* White balance drifts, especially toward magenta in the red town. Colour is never graded clean.
* Example palette: day stucco #cfc7b4, day sky #b9c2c4, lawn #6b7a58, night sky #0a1220, lamp #ffb45a, owl blue #2f5f9a, red sky #8a0f1c, deep red #4a0610, interior concrete #8a8a86.
5. Type & subtitles
* Closed captions (CEA-608 style): monospace (e.g. IBM Plex Mono 600) ~42 px, white on a solid black box per row, ≤ 32 characters, centred inside the 4:3 frame above the OSD. Untouched by tape noise. Hold ≥ max(1.8 s, speech + 0.6 s).
* Speakers: the technician needs no mark. The PA voice is captioned [PA]. SDH descriptions in brackets: [FOOTSTEPS], [TAPE NOISE], [WALLS GRINDING], [SILENCE].
* Suggested lines (calm, procedural, a little tired): "Unit 14, model B." / "Same as 13 through 40." / "Default. Pass." / "Placement error. Logging." / [PA] "Now I will change the time of day to night." / "Lamp on. Default state. Pass." / "Fall recovered." / "Sky not matching daylight." / "Interior exceeds lot footprint." / "Floor is wherever collision registers." / "Requesting extraction." / the last words kept short and unfinished.
* The title is camcorder title-generator text over the first shot: scenario name (redacted) and date.
6. Motion quality
* One continuous handheld take. Cuts happen only where the tape breaks: power-on roll-in, the fall to black, any tracking tear, and the final static.
* Handheld = walking gait (head bob a few cm, sway, small roll) + breathing (~0.27 Hz) + tremor whose amplitude follows a fear curve. Calm and steady in the day, tightening after the cracks and again in Unit 41. At a held breath, freeze all of it.
* Looking down shows only shoe toes and floor.
* Autofocus is animated with overshoot: blur, lock, slip, lock. It hunts hard during the geometry shifts.
* The fall: a violent tumble, spinning frame, then black. The landing is a hard thump and a short roll.
* Wall-walking: the camera reorients gradually as gravity shifts, with a slow horizon tilt rather than a snap.
* The ending: the camera stays at chest height and does not drop. The frame shakes and tightens as the walls close, then breaks into static.
* Auto-exposure lags (~0.45 s) after sudden lighting changes, and gain noise pumps.
7. Camera grammar
Move	What it expresses	Use here
Walking POV down the street	routine, the job	opening, lot numbers
Slow pan across identical houses	repetition	first look at the estate
Glance back at something already passed	doubt	the door that is now a different door
Held still while the light changes	the threshold	night switch, red sky
Pan along a growing crack	approaching danger	the street collapse
Tilt up as the horizon rotates	disorientation	gravity shifts in Unit 41
Check wall, ceiling, doorway in sequence	procedure under stress	the sealed room
Frame tightening on a wall	confinement	the final seconds
Framing: nothing ever shown is attacking. The audience should never get a clean look at anything that is not a house, a room, the technician's hands or his boots.
8. Sound palette
* No score. Only what the tape would have recorded.
* Day bed: soft wind, distant insect-like clicks, a faint electrical shimmer, footsteps on pavement and carpet, cloth rustle, breath.
* Night: the lamp hum added, the bed slightly darker. The PA arrives with a click and a hiss, then the calm voice.
* Crack: a low rumble, concrete splitting, a sharp drop.
* Red town: nearly silent. Only footsteps and the hum of the red light, lower in pitch than the lamps.
* Unit 41: heavy track-and-slab grinding for the sliding walls, furniture scrapes, a deep thud at each grid snap.
* Technician: quiet, even, professional. A few short lines with proximity bass and breath. Breath rate follows the fear curve. A held breath, then one long exhale.
* Silence: a held digital-zero moment after "Requesting extraction," captioned [SILENCE]. When sound returns, only the room tone remains, then the walls.
* Foley: camcorder clack and motor, zoom servo, AF ticks, the thump of landing, the final wall contact muffled into static.
* Mix: bed ≈ −8 dB under voice. −14 LUFS; no added grain.
9. Native moves
* Autofocus and exposure hunting: the geometry resolves only while focus is right.
* The OSD as evidence: time code and battery tick on regardless; the iteration counter changes between the first and last frames, and a tracking tear may jump the clock.
* Emptiness and repetition: the same house forty times, the same owl, the same door that is now a different door.
* Lighting as plot: day, night and red carry the structure without dialogue explaining it.
* Procedure as dread: he keeps logging and checking while the space stops behaving.
10. Pitfalls
* Too much weirdness early reads as a horror cliché; the day section must feel genuinely mundane.
* Pure red never blooms at low emissive; drive it far higher.
* Geometry chaos fails if it is constant. Let it build, then settle, then close.
* Clean CG interiors read as a game; keep the tape pass heavy and the textures plain but believable.
* Do not show a body, a pursuer or any shape in the walls.
* Wall-walking can read as a camera bug; keep the horizon tilt slow and the gravity logic consistent.
* Line wobble skews text; keep it ≤ 0.25 px and leave the caption box untouched.
* Heavy reverb destroys intelligibility; keep the technician's lines dry.
* Do not time-compress a finished timeline; keep keyframes in original time and map through one warp function.
11. Engine
* world.js: estate layout, house duplication, lot numbers, day/night/red lighting states, crack mesh.
* interiors.js: furniture set, owl painting variants (single, Unit 22 multiple), Unit 41 modular rooms, sliding walls, grid snap, gravity reorientation, room resize and wall close-in.
* tex.js: procedural stucco, carpet, concrete, drywall, owl painting, title text.
* vhs.js: VHS camcorder ShaderPass.
* osd.js: bitmap font, REC, battery, clock, QA MODE label, build tag, iteration counter, title generator.
* subs.js: 608 captions, [PA] tags.
* story.js: timeline, lighting-state keyframes, crack growth, fall, camera keyframes, fear and focus curves, geometry shifts, ending hold.
* main.js: renderer, post chain (GTAO + DOF + bloom, then VHS), handheld rig.
* When exporting the video as an MP4, provide separate checkboxes to optionally exclude Music, Sound Effects, and Voice/Narration, allowing each audio element to be exported independently.
12. Variation space Fixed for this film: location (the simulated model estate, Build 1.3), reason for filming (manual QA pass because the automated checker fails on duplicated assets), signal colour (deep red), the opening (tape roll-in with a title), the ending (sealed room, walls close in, cut to static), length 2:20 to 2:40. Open to your taste: the number of houses he enters in the day section, the exact lot and unit numbers, the PA voice's exact lines, whether a tracking tear marks a time jump, and whether the final frame carries a one-frame ID and iteration overlay.
13. Realism The goal is footage that looks captured, not rendered. When anything conflicts with realism, choose the less polished, less cinematic option.
Camera behavior
* The camera is a 1990s consumer camcorder with a small CCD sensor and electronic image stabilization that occasionally overcorrects.
* Hold it at chest height, slightly low and wide, never at eye level.
* Add rolling-shutter skew on fast turns. Use motion blur only on fast pans, not constantly.
* Autofocus hunts on low-contrast surfaces. Exposure overshoots when lighting changes, then settles with lag.
Physically grounded light
* Day uses a soft sun and sky with window light falling into rooms. Night uses lamps as the practical sources. Red uses a red sky and ambient light that stains every surface.
* The red state changes surface colour as well as emission. Red light on the blue owl pushes it toward near-black, not a simple tint.
* Red interacts with haze and surfaces. It is never a flat overlay.
Imperfect world
* The houses are identical by design, so keep the house models and layout identical, but vary the incidental details: lawn wear, sidewalk stains, tree placement, light and shadow.
* Add subtle clutter outside: leaves, litter, cracks in the pavement, utility boxes, hedge irregularities.
* Interiors are plain and slightly worn: faint scuffs, uneven wall shading, a crooked blind.
* Avoid symmetry, clean gradients and CG-smooth surfaces everywhere except where the repetition itself is the point.
The technician as a person
* Speech feels unscripted: small hesitations, a throat clear, a breath before a number, a self-correction ("Unit 14, no, 15").
* Breathing and footsteps audibly match the camera bob.
Realism "do not" list
* No dramatic cinematic camera moves, impossible angles or steadicam smoothness.
* Nothing appears in sharp focus that the camera could not plausibly resolve.
* No uniform noise, no mathematically perfect lighting, no clean reveals.
* Nothing is ever resolved into a shape that attacks him.
Reference calibration Approximate the look of real estate walkthrough footage on a 1990s camcorder, handheld low-light camcorder footage, and early digital camcorder behavior: crushed blacks, noisy shadows, blooming highlights and slow exposure recovery.

