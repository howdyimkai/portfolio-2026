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

Also added the same day: R, E and B pick the rake, eraser and blossom (pressing the held
tool's key puts it down), shown as small keycaps under each tool's label on
hover-capable screens, matching the esc keycap under "put down".

Rejected:
- Nudge (the eraser wiggles on the rail, the title boils when it's picked): no words,
  but easy to miss, and it still depends on people picking the eraser first
- Ghost (a see-through eraser demonstrates one sweep and the title heals): works for
  someone who never touches anything, but it's the most motion on a calm page, and
  reduced-motion visitors would get no hint at all
