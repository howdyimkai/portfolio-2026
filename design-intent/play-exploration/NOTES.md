# Playground tiles — decided from /proto/play (Kai, 2026-11-02)

Brief: `~/Desktop/Claude-Workspace/projects/2026-10-PortfolioSprint/playground/IMPLEMENTATION_Playground.md`
(lineup, copy, Round 2 additions). Media sources and processed files are in that folder's
`artifacts/` and `processed/`.

## Picked: Gallery
- Raised rounded tiles on `--color-page` (#F2EBE1), the piece centered inside, caption row underneath:
  name (display font) left, `type · year` (small mono) right, the second line below in body mono.
- Rounded top, square bottom: each tile stands on the wooden ledge from the /works chalkboard
  (`public/play/ledge.webp`, the top 52 of `case-study-chalk-large.webp`'s 706px), at 50% of the
  /works ledge's height (52/706 of one column × 0.5, so wide and normal tiles match). Full /works
  height was tried and felt too heavy here.
- radius 22px (the /works cards') · gap 32px (rows 40px) · lift 3px on hover (fine pointer only) ·
  caption 13px · tile height 1.06 × column · inner padding 28px.
- Roasts use the case study Toggle's control and crossfade (`tg-seg` / `tg-view`), opening on
  after. Both captures are cropped to one canvas so nothing jumps; the hidden after loop pauses.
- Title: Kai's hand-drawn "playground" line boil, shipped like the hero title (7-drawing strip in
  1-4-2-6-3-7-5 order, 140ms steps), resting and boiling only on hover. Inked like the shelf
  wordmark (black at 85%), 208px wide (160px on phones), 20% under the first size so it doesn't
  compete with the wordmark.

## Lineup (9 tiles, 4 rows; phones are one column in the same order)
Ruler (wide) + Lightning Round · Curiosity + AI for Humans (wide) · Hobonichi (wide) + Gengar
Clefairy · Moo Deng + Claude & Cursor poster + Bootcamp.

## Rejected
- **Cubby** (recessed shadow boxes like the shelf's cubbies, chalk name labels, the piece lifting
  out of its box): belonged to the site's toy world, but eight dark recessed boxes read heavier
  than the work, and blended pieces (Moo Deng) went muddy on the darker box.
- **Graphite nav** loop: cut; Ruler took the wide tile, which also fixed its tiny labels.
- **Meow Memory Lane**: cut, didn't hold up next to the rest. Its "before" (someone else's
  memorial site) was never shipped.
- **Stacked / side by side before and after** for the roasts: replaced by the toggle, which gives
  each capture the whole tile.
- **Hobonichi's "The Latest Collections" row**: cropped off so the collage shows ~30% bigger.
- **Design Garden Harvest video**: never used (crew faces and a crew member's post).

## Copy sign-off (Kai, 2026-11-02)
Approved as shipped: the Claude & Cursor 101 line ("I designed the poster and hosted this hands-on
workshop with Ashita Achuthan."), the meta description ("Interactions, concept roasts and
illustrations by Kai Tran."), and "Ruler nav" as the nav tile's name. Media pipeline notes and open
items: the brief's "Status" section (sprint folder, `playground/IMPLEMENTATION_Playground.md`).
