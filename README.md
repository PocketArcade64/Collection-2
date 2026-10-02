# Collection-2

Build a single-file HTML animation (1920x1080, 16:9, exactly 10 seconds) of a CHRISTMAS-EDITION studio logo sting for "Prowler Productions". I have attached the base logo image (Prowler_Productions_16-9.png).

CRITICAL FIDELITY REQUIREMENT (unchanged)
The base logo must be an exact 1:1 recreation of the attached image. It is fine to recreate the owl by tracing it (for example, as vector paths or SVG), or by using the image pixels directly, as long as the result is indistinguishable from the original. Requirements:
- The owl must keep my exact proportions, shapes, feather details, eye details, and positioning. Do not simplify, stylize, redraw from imagination, or "improve" anything.
- The lettering must be my exact font and letterforms: "PR", "OWL" (gold), and "ER" in the arched wordmark, plus the smaller "PRODUCTIONS" below it. Match the exact weight, spacing, curvature, and baseline. If the font cannot be identified, trace the letterforms from the image rather than substituting a similar font.
- The gold arcs, gold wing/body accents, colors, and overall layout must match exactly. Sample the exact navy background value from the image.
- The only differences from the source PNG in the final frame are the new Christmas additions listed below (hat, snow dusting, lit string lights). With those additions hidden, the final frame must match the source PNG. Verify by overlay or diff before finishing.

Layer structure (needed for animation):
(1) white owl body and wings, (2) gold wing/body accents, (3) gold arcs, (4) white letters "PR", "ER" and "PRODUCTIONS", (5) gold letters "OWL", (6) navy background, plus new layers: (7) Santa hat with pom-pom, (8) falling snow, (9) snow accumulation on shoulders and lettering, (10) string lights.
- Animate the wings by splitting the left and right wing regions at the shoulder and rotating or warping them around a pivot (mesh or piecewise warp) so the flap looks natural. The head, body, and talons stay intact.
- The gold OWL letters must be their own layer so they can glow independently.

NEW CHRISTMAS ELEMENTS

1. SANTA HAT
- The owl wears a classic red Santa hat with a white fur brim and a white pom-pom at the tip, on its head from the very first frame the owl appears. Design the hat in a flat, bold style that matches the logo's graphic look (clean shapes, minimal gradients, tasteful darker red shading). Use a red that looks good against the navy.
- The hat sits naturally on the head, between and over the ear tufts. It may cover part of the head top and tufts, but it must not alter the eyes, face, or any other part of the owl. The hat scales, moves, and tilts with the head as one rigid unit.
- The hat's tip folds over and hangs to one side, ending in the pom-pom.

2. POM-POM PHYSICS
- Simulate the pom-pom with real physics: a damped spring or pendulum (Verlet or spring-damper) attached to the hat tip, with gravity and light air drag, driven by the actual motion of the head and hat (the glide, bob, wing flaps, the flare, and each hoot's small head movement).
- It must lag behind motion, overshoot, swing, and gradually settle. Each wing flap gives it a visible bounce. The hat tip fabric flexes slightly with it.
- By 10.0s it eases to a gentle, nearly still resting position, with a tiny residual sway at most.

3. FALLING SNOW (entire animation, 0.0-10.0s)
- Soft snow falls through the whole intro, starting from frame 0 over the plain navy background. Use varied flake sizes with parallax depth (small, slow, dim flakes in back; larger, brighter, slightly blurred flakes in front), gentle horizontal drift, and slight turbulence. White with soft edges, never overpowering the logo. Keep it tasteful.
- Flakes pass behind and in front of the owl for depth, but must not obscure the lettering or the owl's face.
- The owl's wing flaps push the snow: each downstroke creates a local swirl and burst of flakes that get swept outward and upward, then drift back into the normal fall. Stronger swirls during the approach flaps and the 5.5-6.5s flap, with a softer one when the owl flares.

4. SNOW DUSTING
- When the owl settles (about 4.5-5.5s), snow starts to collect on the owl's shoulders and the top edges of the white lettering "PR", "ER" and "PRODUCTIONS", and on the hat brim. Build it up gradually and subtly through 10.0s as small soft white accumulations, like a light dusting. It must stay light so the exact letterforms and owl details remain clearly legible. The gold OWL letters get only a very light dusting so the glow still reads.

5. STRING LIGHTS
- The two long gold arcs on the left and right of the word "PRODUCTIONS" each carry a string of multicolor Christmas lights (classic red, green, blue, yellow/orange, and pink or purple bulbs), draped along the arcs with a thin dark wire, with evenly spaced bulbs. Keep the gold arcs themselves visible and exactly in place.
- The lights are fully dark (unlit bulbs, dull, no glow) when the arcs sweep in at 4.5-5.5s.
- Hoot 1 at 6.0s: the first third of the bulbs on each string light up, working outward from the center, with a soft colored glow.
- Hoot 2 at 7.2s: the next third light up, so about two thirds are on.
- Hoot 3 at 8.2s: the remaining bulbs light up and the ENTIRE string flashes on at once with a brief bright pop, then settles to a steady glow, and the lights REMAIN ON through 10.0s. Optionally add a very gentle twinkle after the flash, but they must never go dark again.
- The bulb glow is soft and colored, and it must not wash out the "PRODUCTIONS" text.

TIMELINE (single master clock, requestAnimationFrame, deterministic by time t in seconds; SAME TIMING BEATS AS BEFORE)
0.0-1.0s: Navy background with soft snow falling. No owl yet. Silent apart from a faint hush.
1.0-4.5s: The owl, already wearing the Santa hat, emerges from darkness (fade up from navy) and glides toward the camera, scaling from about 15% to 100% with ease-out. Wings flap in a slow, powerful rhythm (about 3 full flaps), with subtle motion blur on the wings and a slight vertical bob. Each flap swirls the snow, and the pom-pom swings with physics. A wing-beat whoosh plays on each downstroke, getting louder as it nears.
4.5-5.5s: The owl flares (wings sweep forward and up) and settles into the exact end-frame pose and position, with a big snow swirl on the flare. As it lands, fade in the white wordmark letters, "PRODUCTIONS", and the gold arcs (arcs sweep in from the center outward) with the string lights in place but dark. Snow begins to dust the shoulders and lettering. The gold OWL letters appear dim and unlit (about 15% brightness).
5.5-6.5s: One deliberate wing flap (with snow swirl and pom-pom bounce), then HOOT 1 at t=6.0s. At t=6.05s the gold OWL letters ignite to full gold with a soft glow pulse (outer glow rising to peak in 150ms, decaying over 500ms). First third of the string lights turn on.
7.2s: HOOT 2. Gold OWL pulse in sync with the hoot. Next third of the string lights turn on.
8.2s: HOOT 3. Gold OWL pulse in sync with the hoot. The whole string of lights flashes on and stays on.
8.2-10.0s: The owl eases to a gentle stop (wings settle to the exact end pose with damped motion), the OWL glow decays to the resting end-frame look, the pom-pom settles, and the snow dusting finishes building. The snowfall continues softly to the end. Everything else holds still until 10.0s, with the string lights remaining lit.

AUDIO
Sound effects only. Absolutely no music, no musical score, no melodic bed, no jingles, and no drones that read as music. Use the Web Audio API to synthesize:
- Wing whooshes (filtered noise) on each wing beat, louder as the owl approaches.
- A low, soft, realistic owl hoot (about 300-400 Hz, two-note "hoo-hoo" feel, soft attack, gentle vibrato, light reverb) at 6.0s, 7.2s, and 8.2s, unless I supply an audio file.
- A very faint room-tone or winter-wind hush is allowed, but nothing tonal or rhythmic beyond the effects above.
- Optional tiny, subtle sound effects: a soft "tink" as each group of bulbs lights, and a slightly bigger electric "pop" on the final all-on flash at 8.2s. These must stay quiet and must not sound like music.
Include a "Click to play" overlay, since browsers block autoplay audio.
