# Collection-2

Build Brief: "Hoot's Wide Eyed Wonders" (1930s Rubber Hose Cartoon, HD)
This brief assumes you have no prior context. Read it fully before building. Your job is to build ONE finished cartoon, exactly 2 minutes 35 seconds long, as a single self contained HTML file that plays and exports as HD video. Nothing else appears in the video: no hotel, no viewer, no projector, no camcorder, no HUD. Another Claude instance will later take your exported video and place it inside a larger scene.
1. Context you need
Prowler Productions is a fictional corporation that copies human consciousness into computer simulations to train people, then writes the lessons back into the original person. This cartoon is an in universe advertisement the company made in the style of a 1930s children's cartoon to explain how its service works. Nobody in the story has seen this explanation before, so the cartoon has to teach the whole process clearly.
The tone is the entire point. The cartoon must be a kids show that children would genuinely enjoy: cheerful, bouncy, funny, sincere. Prowler never sounds sinister. The unsettling feeling comes only from the audience slowly realizing that things the cartoon treats as adorable are not (a copy being told it is not a person, a copy tucked in forever, a promise that extraction works every time). Do not wink at the audience. Do not add horror music, gore, glitches or monsters. The creep is tiny and sits inside the cheer.
The process has one rule that matters. The Source Subject (the real participant, a mouse named Pip) sleeps only once to create the copy. He then wakes up and goes back to his normal life while the copy (Mini-Pip, the Cognitive Instance) keeps learning over time inside Scenarios. When the copy is ready, Pip sleeps a second time to receive what it learned. He is never asleep the whole time.
Vocabulary the cartoon must teach, in order of appearance:
Term	What it means in the cartoon	Shown onscreen
Subject, Identity File	Pip's photo and his number, SUBJECT No. 1	Step 1
Capture	The first nap, when the Machine makes the copy	Step 2
Source Subject	The real Pip, who naps only once to start	Banner in Step 2
Cognitive Instance (CI)	The copy of Pip's thinking. Never called a person	Large bouncing title, then a corner tag
Scenario	Each make believe world the copy explores	On the toy door in Step 3
Run	One playthrough of a Scenario	Under the Step 3 title
Iteration	One copy of one Run, many at once	Step 3
Big Eye (External Monitor)	Watches every Run from outside	Step 3
Technician	Repair bugs who tidy a Scenario, camera on	Step 3
Delta	Everything the copy learned, folded up small	Step 4
Reintegration	Pip's second nap, when the Delta tucks in	Step 5
Retirement	The copy's goodnight	Step 6
Extraction	Pulling a stuck copy out, only promised in the safety scene	Ten dot exit sign
2. Output requirements
1. One single HTML file. Every asset is embedded (fonts, textures, images, audio as base64 or generated in code). It must work offline on another computer with no external requests. The three fonts named below (IM Fell English SC, Shrikhand, Limelight) are open licensed: pull them from npm (for example the @fontsource packages), embed them as base64 and give each a fallback. If you search for textures (paper grain, film scratches), embed them as data URIs.
2. HD output: 1920 by 1080 export, 24 fps, with a 4:3 picture gate (1440 by 1080) centered on black pillarbox bars like an authentic 1930s frame. Put the aspect ratio in a single constant so it can be switched to full 16:9.
3. Total runtime exactly 155 seconds (2:35). Every timecode below is on this timeline.
4. Export MP4 (use MediaRecorder with MP4 if supported, otherwise WebM with clear on screen instructions for converting). Also export the audio as a separate WAV file that is EXACTLY the same length as the video (155.000 seconds). Render the audio with an OfflineAudioContext so the length is exact.
5. Add a toggleable Editor Mode (button, top corner, hidden during export) with a timeline visualizer. It must let me add, remove and edit every line of dialogue, every onscreen word and every caption, and change when each one appears and how long it stays. All changes must update playback instantly. Provide a button to export the edited timeline as JSON and to load it back in.
6. Voices: use clearly labeled placeholder voices (browser speech synthesis for preview only), and include a slot to load a single dialogue audio file that plays in sync on the timeline. Music and sound effects should be synthesized in code.
7. Show readable subtitles for all dialogue on a toggle (default off in the final export, on in Editor Mode), styled as described in section 3.
8. Everything is done inside the page: grain, film damage, the old soundtrack processing and loudness. Do not depend on ffmpeg or any other outside tool for the deliverable.
3. Look (1930s rubber hose)
Another creator already tested this style in code. Use them as grammar only: never copy any existing character, name, silhouette, melody or logo. Their engine splits into several files and uses ffmpeg, while ours must be one HTML file with everything done in the page, so take the techniques, not the file layout. The rules below are the parts to apply.
* Frame. 1920 by 1080 output with the 4:3 gate (1440 by 1080) centered on black bars. Gate corners are rounded (radius about 28 px) with a soft inner shadow on the gate edge.
* Hand inked, not filtered. Hand inked black and white animation from the early sound era, not a retro filter over modern animation. No joints, no rendered shading, no 1950s flat limited look. Characters are flat white, grey and ink on soft grey watercolor backgrounds, and the whole film looks like a worn 35 mm print.
* Palette. Mostly greyscale with a warm sepia tint: about 6 grey steps plus a separate character white, tinted once in the final pass so everything feels like one aged print. Add a small amount of spot color on a few key props only: red REC dots on the beetle cameras, a deep red bow tie on Hoot, and red dots on the lit exit sign. Never put spot color on backgrounds or film damage. Characters own the extremes (brighter whites and darker inks than anything in the background) and backgrounds live in the middle greys. Add a mild contrast boost (about 1.1 to 1.15) in the final composite so it reads as rich black and bright white, never flat grey.
* Character rendering. Flat fills with ONE hard edged light grey form shadow band on the side away from an upper left light (never a gradient). The ink outline stays constant in screen space at any zoom (transform the points first, then stroke, about 6 px at 1080p). Add a light line boil: plus or minus 1.2 px, cycling 3 drawings at 12 fps.
* Anatomy kit. Limbs are noodle tubes of constant width (about 1/20 of the character's height) with one smooth bend and round caps, no elbows or knees. Gloves have a palm, 3 fat fingers and a thumb, a flared cuff with a fold line and 3 stitch lines on the back; stroke all glove parts thick first, then fill, so only the outer shape is outlined. Pie eyes are a white oval with a big black pupil (about 64% by 74% of the eye) with a wedge cut toward the upper right; blink with an eyelid in body color and a lid line. Mouths: smile with cheek ticks, open grin, "O", wavy (scared), pucker, tongue out. Shoes are big black ovals with a white toe glint.
* Object characters. The whole object is the body (the Big Eye, the gumdrop boxes, the clocks). The face sits on the body and a secondary feature carries the mood (a cap tilt, a spring, steam). Never build an object head on a human body.
* Backgrounds. Paint each Scenario background once into a cached canvas at 1.25 to 1.5 times size so push ins stay crisp: flat wash, soft blotches (plus or minus 5%), inner edge darkening, a thin dark grey outline and paper grain. Backgrounds never boil. Use period motifs (patterned wallpaper, paneled furniture, checker floors, brick, clapboard) and make every Scenario instantly recognizable: the Dream Machine room, Pip's neighborhood, the candy maze, the giant clock room, the cardboard street.
* Film damage (a separate final pass over the whole frame). Low frequency gate weave (plus or minus 1.2 px) with a rare jump, flicker of plus or minus 4%, 0 to 3 drifting vertical scratches, 3 to 8 dust specks per frame, an occasional hair, a strong vignette, a small jump on every cut and a slight blur. Add film grain in the page. Keep it tasteful so the picture stays crisp at 1080p.
* Titles. Shrikhand (fat retro script), white face, heavy ink outline (about 14% of the cap height) and an ink drop shadow down and right. Letters hop in a travelling wave on the beat. Sub lines use Limelight capitals.
* Subtitles (toggle). Period title cards: a small near black plate with a white double rule border and dot and ring corner ornaments, text in IM Fell English SC (about 36 px) in paper white. Draw them inside the scene layer so they weave and flicker with the film. They pop on and off with no fades, sit at the bottom (top when the action is low), and each holds for the longer of 1.8 seconds or the speech length plus 0.6 seconds. Merge consecutive short clips into one card.
4. Motion and camera
* Beat grid. Use one constant BEAT_FRAMES = 12 (120 BPM) so every beat lands on a whole frame at 24 fps (8, 10, 16 or 20 also work if the music needs it). Every timecode in the script falls on a beat.
* Twos and ones. Characters animate on twos (12 fps drawings). The camera moves on ones (24 fps), because a stepped camera reads as judder.
* Everything breathes on the beat. Every idle object and background prop squashes and stretches with cos(2 pi x beats): stretch on the beat, squash on the off beat, about 5 to 7% amplitude, all in phase, sampled on twos. At a peak of joy the amplitude can triple.
* Walks and runs. One step per beat with a body bob. Runs use windmill legs, a forward lean and speed lines.
* Anticipation, hold, action. Before every big move, crouch (squash to about 0.8), hold, then snap. Impacts squash and spring back.
* Held frames are acting. A chain of holds, each glance on an eighth note with a woodblock tick, reads as thinking.
* Freeze on a band stop. When the music stops, freeze everything, including the background breathing.
* Camera. A theatre camera: mostly locked, moving only to follow a runner or land a gag. Use a locked stage wide shot at eye level for introductions and the title; a hard cut to a face close up for reactions; a trucking pan beside Mini-Pip when he runs through a Scenario; medium follow shots (character about a quarter to a third of the frame height) where every step is a note; a pull back from a close up to a packed medium full shot for the Iterations; and an iris in or out, which a character can grab, for beginnings, endings and scene changes. Transitions are iris, a hard cut on a beat or a title card rolling up like a window shade, never dissolves. Faces must read, so no far wide shots for gags or musical moments, and the destination prop enters the frame before the gag lands.
5. Characters
HOOT (host, the owl). Round body, huge pie cut eyes, ear tufts, white gloved wings, tiny bow tie. He must resemble the owl in the Fairhaven wall artwork: [REPLACE THIS LINE with the exact colors, markings, eye style and shape from the Fairhaven owl art before building]. His voice is warm, bright and a little fluttery, like a 1930s radio host. His pupils always track the camera, even when his body is turned away.
PIP (the Source Subject). A sleepy little mouse in pajamas and a nightcap, holding a teddy bear. He is a cartoon stand in for the real human participant, and in the real world he has an ordinary job (he delivers the morning mail by bicycle). His silhouette must not resemble any existing cartoon mouse: no round disc ears, use tall floppy oval ears and a long thin tail. Placard: SUBJECT No. 1.
MINI-PIP (the Cognitive Instance). Identical to Pip but drawn slightly paler with a faint shimmering outline, and his shadow lags a beat behind him. He is always smiling. He speaks only a few words, always cheerful.
THE BIG EYE (External Monitor). A giant friendly eyeball on a little cloud wearing a tiny cap, the whole object being the body. It never blinks and rotates to follow Mini-Pip. The tilt of its cap carries its mood.
REPAIR BUGS (Technicians). Tiny beetles in overalls, each with a toy camcorder strapped to its head with a small blinking red REC dot.
CHORUS. Three bouncy harmony voices in an Andrews Sisters style for the jingle and the songs.
6. Tiny unsettling details (use all, keep each very small)
1. Hoot's eyes track the lens at all times, and after certain lines he holds eye contact half a second too long.
2. Mini-Pip's smile never changes, including during the goodnight scene. His eyes stay open one beat after the lights go out.
3. Background characters (flowers, clocks, the sun) all face the camera and never react to the action.
4. During the safety scene the film skips exactly one frame, and Hoot repeats the last word of his sentence ("safe and sound, sound"). The band then stops dead and everything freezes for his last two words.
5. When the Big Eye is mentioned, the screen briefly shows the scene from the Big Eye's point of view.
6. After Pip wakes from his second nap, he absentmindedly sets nine acorns on the table in a perfect ring with exactly one gap, and the gap faces the camera. Nobody comments on it. (This is a quiet continuity hook, so do not draw attention to it.)
7. Hoot only says the word "person" to explain what a Cognitive Instance is not.
7. Script and timeline
Every line has an ID and a start time, and every timecode falls on a beat. Leave natural human spacing between sentences and do not pad silence. Onscreen words are in bold. Word reveals bounce in on the beat. Speakers: HOOT, PIP (the real mouse), MINI-PIP (the copy), CHORUS.
A. Title card (0:00 to 0:08)
Opens with an iris in on one giant pie eye that widens to reveal Hoot. Title card: HOOT'S WIDE EYED WONDERS, "brought to you by PROWLER PRODUCTIONS". Hoot pops up through the title and bounces on the letters.
* C1 (0:01), CHORUS (sung): "Hoot, hoot, hooray! Let's learn something new today!"
B. Hello from Hoot (0:08 to 0:19)
* H1 (0:08), HOOT: "Hello, hello, my wide eyed friends! I'm Hoot! And today, we're visiting the Dream Machine!"
* H2 (0:14), HOOT: "Do you know what it does? Whoo knows? Whoo does!"
He points at the camera on "Whoo does" and his eyes grow to fill the screen.
C. Step 1: Hello (Intake) (0:19 to 0:32)
Onscreen: 1. HELLO! with INTAKE in small letters beneath it.
Pip waddles in carrying his teddy bear. A flash bulb pops. A photo develops and gets stamped SUBJECT No. 1.
* H3 (0:20), HOOT: "First, we say hello! Pip gets his picture taken, and a number all his own."
* H4 (0:26), HOOT: "That's his Identity File. It's how we always know who's who!"
* P1 (0:30), PIP (yawning): "I'm Number One!"
D. Step 2: Sleepy time (Capture) (0:32 to 0:46)
Onscreen: 2. SLEEPY TIME with CAPTURE beneath it. When Hoot says "Source Subject", the words SOURCE SUBJECT appear on a banner above Pip's head.
Pip lies on a soft table. Musical notes drift into his ears and a dial spins. His snore bubble grows.
* H5 (0:33), HOOT: "Next, sleepy time! The Machine takes a teeny peek at everything in Pip's head. And it doesn't hurt a bit!"
* H6 (0:40), HOOT: "Pip is our Source Subject, the real one, and he only has to nap this once!"
E. The Cognitive Instance (0:46 to 1:17)
Onscreen: COGNITIVE INSTANCE (CI) in large bouncing letters, each syllable bouncing with its sung note (COG, NI, TIVE, IN, STANCE) while a bouncing ball follows the letters. After the song, the abbreviation CI stays in a corner of the screen for the rest of the cartoon.
The snore bubble pops. Out steps Mini-Pip, shimmering.
* P2 (0:46), MINI-PIP: "Hiya!"
* H7 (0:48), HOOT: "And look who just popped out! Pip's Cognitive Instance!"
* H8 (0:52), HOOT: "Say it with me: Cog-ni-tive In-stance! Or, for short, a C-I!"
* C2 (0:58), CHORUS (sung): "Cog-ni-tive In-stance, that's his name! A copy to play the thinking game!"
* H9 (1:04), HOOT: "A C-I has all of Pip's memories, right up to his nap. But a C-I is never a person. He's a C-I!"
* P3 (1:10), MINI-PIP: "I'm Pip!"
* H10 (1:11), HOOT (chuckling): "Of course you are! He thinks so, and that's what makes him so good at it!"
F. Step 3: Playtime (Run) (1:17 to 1:42)
Onscreen: 3. PLAYTIME with RUN beneath it. The word SCENARIO appears on the toy door when Hoot says it. The word ITERATION appears when Hoot explains the copies.
Pip hops off the table wide awake, waves goodbye to Mini-Pip and trots off to his normal day (delivering the morning mail by bicycle). Calendar pages flip across the screen to show time passing. Hoot opens a toy door in the wall. Behind it, in turn: a candy maze, a giant clock room and a street of cardboard houses. Mini-Pip runs through each (trucking pan beside him). Cut back now and then to Pip going about his day. A repair bug follows Mini-Pip with a toy camcorder. The Big Eye floats above.
* H11 (1:17), HOOT: "Now Pip wakes up, feeling fine, and heads right back to his day!"
* H12 (1:21), HOOT: "Meanwhile, Mini-Pip explores a Scenario, our name for a make believe world. Each playthrough is a Run!"
* H13 (1:29), HOOT: "And one Run can have lots of copies. We call those Iterations. Look at all the Pips!"
A dozen Mini-Pips fill the screen (pull back from a close up to a packed medium full shot), all waving at the same time.
* H14 (1:35), HOOT: "The Big Eye watches from outside, and our Technician bugs tidy the toys, camera on, of course!"
Onscreen when he says it: BIG EYE (EXTERNAL MONITOR) and TECHNICIAN.
G. Step 4: What did we learn? (Consolidation) (1:42 to 1:50)
Onscreen: 4. WHAT DID WE LEARN? with CONSOLIDATION beneath it. Then DELTA on the wrapped package.
Mini-Pip squishes into a small gumdrop box tied with a bow, labeled DELTA. Across town, Pip stretches and yawns on a park bench.
* H15 (1:42), HOOT: "When he's learned enough, Mini-Pip folds up nice and small into a Delta, the difference between who he was and who he is now!"
H. Step 5: Wake up wiser (Reintegration) (1:50 to 2:02)
Onscreen: 5. WAKE UP WISER! with REINTEGRATION beneath it.
Pip lies down on the soft table for his second nap. The Delta slides into his ear. He sits up, stretches and snaps a jigsaw puzzle together in one move. While Hoot talks, Pip sets nine acorns on the table in a perfect ring with one gap facing the camera.
* H16 (1:50), HOOT: "Then Pip takes a second nap, and the Delta tucks right in. He wakes up knowing things he never lived!"
* P4 (1:58), PIP: "Golly, I feel so organized!"
I. Step 6: Goodnight (Retirement) (2:02 to 2:13)
Onscreen: 6. GOODNIGHT! with RETIREMENT beneath it.
Hoot tucks Mini-Pip into a tiny gumdrop box bed. Mini-Pip smiles up at him. The sun in the background looks at the camera.
* H17 (2:02), HOOT: "And now Mini-Pip's work is done, so we say goodnight!"
* P5 (2:07), MINI-PIP: "Goodnight, Hoot."
* H18 (2:10), HOOT: "Nothing else comes back. Isn't that tidy?"
Hoot grabs the edge of the iris and pulls it shut on Mini-Pip's smile, but his eyes stay open one beat after the iris closes.
J. Safety and the pitch (2:13 to 2:31)
Iris in on a door with a lit exit sign showing ten dots in a ring, with a lever marked PULL beside it. The dots must be evenly spaced, all ten drawn. One frame of the film skips here.
* H19 (2:14), HOOT: "And if a pal ever gets stuck, we pull him out, safe and sound, sound!" (The band stops dead and everything freezes.) "Every time!"
* C3 (2:20), CHORUS (sung): "Ten little dots in a ring, that's the way out, that's the thing!"
* H20 (2:24), HOOT: "Most folks only get one try at a big decision. With Prowler Productions, you get to sleep on it!"
K. End card (2:31 to 2:35)
End card: PROWLER PRODUCTIONS, LIVE IT BEFORE YOU LIVE IT. The card rolls down like a window shade, and Hoot's eyes linger on the lens an instant longer through the gap. Fade to black at 2:34 and hold black until 2:35 exactly.
* C4 (2:31), CHORUS (sung): "Prowler Productions! Live it before you live it!"
8. Audio
* Mono 1930s sound with a hot dance band and ragtime feel: stride piano, clarinet, trumpet (open and plunger mute wah wah), trombone smears, tuba oom pah, banjo on beats 2 and 4, snare with brushes and rolls, xylophone, woodblocks, slide whistle, cymbal, kazoo, washboard and a pit organ. No string pads and no modern synths. Write one short original syncopated theme and restate it in different arrangements. Never copy an existing melody.
* Music should be bright and genuinely catchy. Do not add any dark or horror underscore.
* Score to the picture: a band member can answer a character (a trombone raspberry, a trumpet laugh), each gag gets a stinger, a slide whistle marks every stretch or fall, a hard silence (reverb tails too) lands before a gag or on a stare, and a key change lifts the happy moments.
* Foley by material, synthesized: porcelain and glass use hard inharmonic partials with a tiny transient, wood is a woodblock, metal is bells and clanks, springs go boing, water is filtered noise with rising blips and bubbles, rubber is a sawtooth creak through a band pass.
* Sound effects to include: bounce boings on every title word, camera flash pop, snore whistle, bubble pop, magical sparkle for the Delta, soft chime when ITERATION appears.
* Voice chain: high pass about 260 Hz, low pass about 4.6 kHz, tanh saturation, a short room and compression. Duck the music about 8 dB under speech.
* Old film soundtrack pass over music and foley: band limit about 110 Hz to 6.2 kHz, slight wow (about 0.6 Hz) and flutter (about 7 Hz), soft saturation. Then add a bed of hiss, crackle and a 24 Hz projector gate clatter, the ONLY sound allowed inside a silence.
* Loudness target about -14 LUFS (an in page estimate is fine).
* Export the audio as a separate WAV exactly 155.000 seconds long, matching the video.
9. Pitfalls and final checks
Pitfalls of the medium:
* Flat grey frames: push backgrounds to mid grey, keep pure white and ink for characters, and keep the contrast boost.
* Wide shots kill gags: use medium shots and a packed medium full shot for crowds.
* Define eyebrows by inner and outer end (inner is the end nearest the nose), not by left and right, so worry is not drawn as anger.
* A limb drawn behind the body gets hidden by the silhouette: kick and reach outward past it.
* Painted characters can collide with background props at some camera positions: check the last frame of every shot.
* Smoke puffs in a row read as thought bubbles: scatter them and let them grow.
Final checks before you hand it over:
1. Every line of dialogue appears at its listed time and has enough room to be spoken naturally.
2. The word COGNITIVE INSTANCE (CI) is fully visible and readable on screen while Hoot defines it, and SCENARIO appears when he says it.
3. Pip sleeps exactly twice (the capture and the second nap) and is awake and living his day in between.
4. All seven unsettling details are present and subtle.
5. The picture is a warm sepia tinted greyscale, with spot color only on the approved accents (REC dots, Hoot's bow tie, exit sign dots).
6. The file works offline as a single HTML file with the fonts embedded.
7. Video and audio exports are both exactly 155 seconds.
8. There is no hotel, no viewer, no projector, no camcorder overlay and no HUD anywhere in the picture.
9. No character, name or silhouette resembles an existing cartoon character (check Pip in particular).
