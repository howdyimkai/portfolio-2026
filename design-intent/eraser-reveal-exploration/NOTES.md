# Eraser reveal exploration (2026-10-28)

Prototype: `/proto/eraser-reveal` (desktop; picker at the bottom, or keys 1–2). Pick the eraser
(E) and wipe the hero title.
Files: `src/app/proto/eraser-reveal/`, `src/components/EraseCanvas.tsx`, and the proto-only
`titleErase` prop on `SandGarden` / `SandboxHome`. Delete together.

## Why

2026-10-28 review: erase the text where the eraser hits it. Measured at 1440: one pass across the
top line ("DESIGNER and TINKERER") faded the whole title, PLAY included, to 72% with blur. The
16×6 ink grid feeds one opacity for the whole title, so the eraser works like a dimmer, and
nothing shows which parts are already wiped.

## Variants

1. **Fade (now)**: the live behavior, untouched.
2. **Pixel erase**: the title is drawn into a canvas (same still, same 7 cell boil strip at
   140ms) and the eraser cuts out only what the towed head passes over. The brush is a soft,
   grainy dab (radial falloff × per-pixel noise, random turn per dab) stamped every 0.2 radius
   along each head segment, same radius as groove erasing (28 × 1.2). One pass clears the middle
   of the band and leaves a ragged partial edge, so the wipe reads as sand smoothed over ink.
   Erased strokes live on their own layer, so the wiped part stays wiped while the rest boils.
   Progress is real ink removed (title alpha × erase alpha on a 96×46 copy), and the reveal still
   fires at 80%. The rest is unchanged: hints, the 1s beat, the principle, the return (the erase
   layer clears while the title is hidden, so it comes back whole).

## Measured

- One horizontal pass wipes a clean band through that line only; the rest stays at full ink.
- Reveal took 5 horizontal passes (top to bottom) vs ~2 for the fade: 80% of the actual ink is
  more than 80% of grid cells. If it feels like a chore, lower the threshold to ~0.7.
- Full loop verified: ~1s bare sand, principle in, read, out, title back whole at ~7.6s.
- Boil still steps through all 7 drawings while hovered. No console errors.

## Picked (2026-10-28)

Kai: "I LOVE PIXEL ERASE", and asked for it on all the messages. The five principles now erase
the same way: once the write-on ends, the still is an EraseCanvas (dark ink on white, ink measured
as darkness, still multiplied onto the sand, so wiped pixels show sand). Still erasable only after
the writing finishes; 80% gone returns the title, a partial wipe left alone 2.5s finishes on its own.

Guard added: a returning title isn't erasable until the eraser has left its box once. Otherwise
the stroke that just cleared the principle (same spot) carves into the title as it comes back.
Verified: zigzagging inside the title box for 3 passes after the return left it at 99% ink; a fresh
stroke after leaving erases it as normal.

## Tuned (2026-10-28)

- Threshold 0.6 for both (pixel erase only, `PIXEL_ERASE_THRESHOLD`; the fade keeps 0.8). First 0.7,
  then 0.6 once the bigger art cancelled it out.
- Title and principles 15% larger in the pixel variant (title 58.3u → 67u, principle 67u → 77u).
  1440×900: clears the shelf and tool rail; its box grazes the bonsai's box at an empty corner.
  1280×720: 16px between shelf and title. The bigger title cancels the easier threshold:
  the title still took 5 passes in the same test.

## Open

- Promote: replace TitleArt + the grid fade on desktop with EraseCanvas, the principle stills too;
  keep TitleArt for the mobile block; drop the `titleErase` prop and the fade paths (ink grids,
  opacity/blur scrubbing).
- Size: the title is a 900px wide raster. At +15% it draws ~604px wide, so ~1.34x upscaled on a
  retina screen. If it reads soft, re-export the still and strip from the 2160px source GIF
  (the strip grows from ~320KB, so check the garden budget).
- Per-letter SVGs: not needed for this. They'd only erase a whole letter at a time, and the boil
  means ~40 letters × 7 drawings. Only worth it if the letters should act like objects.

## Promoted (2026-10-28)

Pixel erase is live in `SandGarden` (desktop title + principle stills via `EraseCanvas`), with
`ERASE_THRESHOLD` 0.6 and the 15% larger art. The prototype route, the `titleErase` prop, and the
old grid fade (ink grids, opacity/blur scrubbing) are deleted. The phone title is unchanged (static,
no erase). Still open: a sharper title export if it reads soft on retina.
