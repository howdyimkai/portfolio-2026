# Broom sweep exploration (2026-10-28)

Prototype: `/proto/broom-sweep` (keys 1–3 or the picker; click the broom chip to sweep).
Files: `src/app/proto/broom-sweep/` + ShelfNav's proto-only `sweep` prop. Delete both together.

## Why

2026-10-28 review: make the broom smoother, and erase the text where the broom hits it.
Measured on /works (1440): three beats that wait on each other, ~1.3s to settle, and nothing ever
crosses the shelf (the chip's icon flicks in place). The labels all fade at once, so the right to
left direction is lost.

| Time | Now |
|---|---|
| 0–100ms | only the chip icon flicks; the first toy's strong ease-in shows nothing |
| 100–400 | toys tumble off right to left (45ms stagger) |
| 400–470 | nothing moves |
| 470–650 | wood and all five labels fade together |
| 650–1000 | page rises (collapse at 520ms) |
| 750–1275 | text row writes in (600ms, 1.6 overshoot) |

## Variants

1. **Now**: the live shelf, untouched.
2. **Broom pass**: a broom crosses the shelf right to left in 480ms
   (`cubic-bezier(0.33, 0, 0.25, 1)`: quick start answers the click, long brake). One animated
   length, `--tip` (the bristle tip's x, an `@property`), drives everything: the broom rides it,
   each label is masked away right of it (10px soft edge), and each toy is pushed along at the
   bristles once they reach its right edge, so the toys bunch up into a pile and go off the
   end together. Collapse starts at 400ms (was 520) so it overlaps the wood fading; the text writes
   in 60ms after (was 180) with a 1.3 overshoot over 440ms (was 1.6, 600ms). Way back: box returns
   at 330ms, toys reappear in their cubbies (fade + grow) from 430ms instead of sliding back from
   the wall. Settles in ~900ms tidy / ~830ms untidy (was ~1275 / ~1200).
3. **Chalk eraser**: same pass, but the mask edge is a ragged eraser smear that leaves a faint
   streaky ghost of the letters behind the broom, fading as the wipe ends.

## Stand-ins (flag before shipping)

- The sweeping broom is the chip's line glyph, inked straw `#e2bf7e` (maroon disappears on the slate).
  Needs a **felt broom** like the toys. Its bristle tip sits 8 units in from its left edge; if the
  new art differs, update that 8 and the `--tip` range.
- `public/proto/broom-sweep/chalk-mask-standin.webp` is generated (numpy noise). Kai to draw the
  real eraser edge: 1576×208 (2× of 788×104), opaque left of center, the smear edge at x 788, the
  faint ghost to the right. Alpha is what counts; colour is ignored.

## Do the labels need per-letter SVGs?

No, not for the erase. The labels are live Commit Mono text, and a mask wipes them at any zoom. Per
letter SVG is only worth it if the labels become Kai's hand-lettered chalk (the taste rule:
hand-made over generated). If so, the plan would be:

1. Kai letters the five labels in chalk (Paper or Procreate), one artboard per label at 4× shelf units.
2. Export each as SVG with one `<path>` per stroke, in stroke order, ids `l-<label>-<n>`.
3. Swap `.shelf-label` text for an inline SVG (`aria-hidden`), and give the cubby link an
   `aria-label` with the label text, since the text is what names the link today.
4. Erase: either keep this mask (cheapest), or dissolve per stroke as `--tip` passes each stroke's
   x (each path's bbox measured once), which gives a smear per stroke rather than per edge.
5. Budget check: five small SVGs, likely under 15KB total.

## Picked (2026-10-28)

Kai liked **Broom pass**, a touch slower on the way out: the pass is now 528ms (was 480), and every
hit, fade and the collapse (440ms) scaled with it. Not promoted yet.

## Open

- Promotion: fold the `[data-sweep]` rules into `shelf-nav.css`, drop the prop and `data-sweep`.
- Performance: `--tip` is an inherited custom property, so the shelf subtree restyles each frame
  of the 480ms pass, and `mask-position` repaints the labels. Small area, fine in Chrome; check
  on an iPhone before shipping.
- Untidying mid-pass snaps the toys and labels back (no reverse sweep). Rare; left as is.

## Promoted (2026-10-28)

Broom pass is live in `ShelfNav` + `shelf-nav.css` (Sweep section). The prototype route, the
`sweep` prop, the Chalk eraser variant and its stand-in mask are deleted. Still open: felt broom
art, an iPhone performance check, and the mid-pass untidy snap.
