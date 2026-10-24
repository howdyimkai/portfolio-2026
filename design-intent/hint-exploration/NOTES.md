# Principles hint — decided from /proto/hint (2026-10-24)

Problem: the erase-the-name reveal (sweep the eraser over the hero title to find one of
the five principles) had no hint, so most visitors never found it.

- Direction: Whisper, a caption under the hero title
- Copy: "psst, try the erase above" (shown uppercase, as Kai wrote it)
- Fades in (500ms opacity) after 4s in the same idle state, hides while a principle
  plays, and leaves for good the first time the eraser touches the title
- Desktop only, like the reveal
- font-mono 12px, uppercase, 0.08em tracking, ink-primary. The prototype's ink-muted at
  10px measured 3.3:1 against the sand; ink-primary is 7.7:1 (ink-body was only 3.7:1)

Second hint, added the same day: once an erase reaches halfway to the reveal (40% of
the title's ink; 0.75 was tried first and felt too late) without finishing, the same caption slot reads "keep going,
try an ∞ infinity pattern", since a figure eight clears the title best with the eraser.
The ∞ is a small inline SVG (20×10px) where a bright segment travels round a faint
figure eight every 1.8s, tracing the stroke; under reduced motion it's the still outline.
It stays until the reveal fires, then never shows again this visit. The caption now sits
beside the title rather than inside it, so it doesn't fade as the title is erased.

Also added the same day: R, E and B pick the rake, eraser and blossom (pressing the held
tool's key puts it down), shown as small keycaps under each tool's label on
hover-capable screens, matching the esc keycap under "put down".

Rejected:
- Nudge (the eraser wiggles on the rail, the title boils when it's picked): no words,
  but easy to miss, and it still depends on people picking the eraser first
- Ghost (a see-through eraser demonstrates one sweep and the title heals): works for
  someone who never touches anything, but it's the most motion on a calm page, and
  reduced-motion visitors would get no hint at all
