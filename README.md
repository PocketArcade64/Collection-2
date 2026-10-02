# Collection-2

Build a single-file HTML animation (1920x1080, 16:9, exactly 10 seconds) of a studio logo sting for "Prowler Productions". I have attached the final logo image (Prowler_Productions_16-9.png).

CRITICAL FIDELITY REQUIREMENT
The final logo must be an exact 1:1 recreation of the attached image. It is fine to recreate the owl by tracing it (for example, as vector paths or SVG), or by using the image pixels directly, as long as the result is indistinguishable from the original. Requirements:
- The owl must keep my exact proportions, shapes, feather details, eye details, and positioning. Do not simplify, stylize, redraw from imagination, or "improve" anything.
- The lettering must be my exact font and letterforms: "PR", "OWL" (gold), and "ER" in the arched wordmark, plus the smaller "PRODUCTIONS" below it. Match the exact weight, spacing, curvature, and baseline. If the font cannot be identified, trace the letterforms from the image rather than substituting a similar font.
- The gold arcs, gold wing/body accents, colors, and overall layout must match exactly. Sample the exact navy background value from the image.
- The final frame at 10.0s must be visually identical to the attached PNG when composited at rest. Verify this by overlaying or diffing against the source before finishing.

Layer structure (needed for animation):
(1) white owl body and wings, (2) gold wing/body accents, (3) gold arcs, (4) white letters "PR", "ER" and "PRODUCTIONS", (5) gold letters "OWL", (6) navy background.
- Animate the wings by splitting the left and right wing regions at the shoulder and rotating or warping them around a pivot (mesh or piecewise warp) so the flap looks natural. The head, body, and talons stay intact.
- The gold OWL letters must be their own layer so they can glow independently.

TIMELINE (single master clock, requestAnimationFrame, deterministic by time t in seconds)
0.0-1.0s: Navy background only. No elements. Silent.
1.0-4.5s: The owl emerges from darkness (fade up from navy) and glides toward the camera, scaling from about 15% to 100% with ease-out. Wings flap in a slow, powerful rhythm (about 3 full flaps), with subtle motion blur on the wings and a slight vertical bob. A wing-beat whoosh sound plays on each downstroke, getting louder as it nears.
4.5-5.5s: The owl flares (wings sweep forward and up) and settles into the exact end-frame pose and position. As it lands, fade in the white wordmark letters, "PRODUCTIONS", and the gold arcs (arcs sweep in from the center outward). The gold OWL letters appear dim and unlit (about 15% brightness).
5.5-6.5s: One deliberate wing flap, then HOOT 1 at t=6.0s. At t=6.05s the gold OWL letters ignite to full gold with a soft glow pulse (outer glow rising to peak in 150ms, decaying over 500ms).
7.2s: HOOT 2. Gold OWL pulse in sync with the hoot.
8.2s: HOOT 3. Gold OWL pulse in sync with the hoot.
8.2-10.0s: The owl eases to a gentle stop (wings settle to the exact end pose with damped motion), the glow decays to the resting end-frame look, and everything holds perfectly still until 10.0s.

AUDIO
Sound effects only. Absolutely no music, no musical score, no melodic bed, and no drones that read as music. Use the Web Audio API to synthesize:
- Wing whooshes (filtered noise) on each wing beat, louder as the owl approaches.
- A low, soft, realistic owl hoot (about 300-400 Hz, two-note "hoo-hoo" feel, soft attack, gentle vibrato, light reverb) at 6.0s, 7.2s, and 8.2s, unless I supply an audio file.
- A very faint room-tone hush is allowed, but nothing tonal or rhythmic beyond the effects above.
Include a "Click to play" overlay, since browsers block autoplay audio.

TECHNICAL
- Single HTML file, no external dependencies, canvas-based.
- Include a Replay button and a ?t= URL parameter to scrub to a specific time for checking frames.
- Include a frame-accurate export mode (render at a fixed 30 or 60 fps by stepping t, not by wall-clock) so I can capture it as video, with audio synced to the same timeline.
- Before finishing, verify that the frame at t=10.0s matches the source PNG, that the lettering and owl proportions are unchanged, and that the OWL letters are the only gold element that glows.
