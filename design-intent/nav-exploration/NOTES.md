# Nav exploration — Ruler concept (2026-10-01)

Branch: `proto/nav-explorations` (off `explore/k-zen`). Nothing here is wired into
`Navigation.tsx` or production routes. Prototype lives at `/proto/nav` — run
`npm run dev`, open `http://localhost:3000/proto/nav`, flip with `1`/`2` or `←`/`→`
(`?v=1` Slide, `?v=2` Rail). Code: `src/app/proto/nav/`, placeholder-free brand
assets in `public/proto/` (trimmed from `howdyimkai.png` and `Paper stamp avatar.png`).

Reference: `design-intent/Nav-RulerConcept.png` (Claude-Workspace copy).

## The two variants

Both share the same behavior:
- Washi-blue ruler: ticks along one edge, cell dividers as major marks.
- Hover (mouse only): ticks near the cursor swell (σ≈46px, up to ~1.95×), and a faded
  blue "measured span" slides to the hovered cell; it returns to the active page on
  leave. Ticks inside the span rest taller. No bottom/edge line on the span (Kai's call).
- Brand: stamp tips 8° clockwise like a hat tip on hover/focus of the stamp or the
  "howdy im Kai" wordmark (240ms overshoot in, 180ms out).
- Active cell: ink-primary label + the span's wash. Labels use `ink-body` at rest
  (the concept's lighter grey fails 4.5:1).

| Variant | Placement | Cost |
|---|---|---|
| **Slide** (`?v=1`) | Top bar, horizontal. Mobile: 4-cell strip under the wordmark (~108px tall). | Eats fold height on mobile (homepage never scrolls). |
| **Rail** (`?v=2`) | Left edge, vertical, on desktop. Mobile: fixed bottom bar, thumb reach. | ~170px of width; shifts the hero at 768–1100px; new mobile pattern. |

## Graphite (`?v=3`, added 2026-10-02)

Reference: `Nav-greengraphite.png` + felt icons in `rodeo/` (→ `public/proto/rodeo/*.webp`).
A different concept, not a Ruler variant: a green graph-paper sheet hanging off the top
edge, wordmark centered with the felt hat over it, mono lowercase labels either side.
- 800×165 sheet (mock). Paper is a seamless tile cut from Kai's `graphitepaper@2x.png`
  (`public/proto/graphite-tile.webp`), scaled to 33px squares — the mock's 50px read
  too large (Kai, 2026-10-02). Columns snap to the 24-cell grid at 5·4·6·4·5.
- Each label's felt icon (cloud / pony / walking pencil / star) pops up above it on
  hover (280ms overshoot in, 160ms out) and stays up for the active page — the
  icon *is* the active indicator, matching how the hat sits over the wordmark.
  Hat tips on brand hover, same as Ruler.
- Mobile: brand in the top two grid rows, four labels in the third (150px tall —
  ~40px taller than Slide's). No room for icons, so the active label gets a
  green-graphite marker wash instead.
- "writing" maps to the old `notes` key; still no route.

### Hover motion (`/proto/nav-hover`, 2026-10-02)
Comparing Pop (current) / Drop (gravity bounce, tunable) / Sprout (rises from behind
the label). Rejected: **Tag-along** (icon towed toward the cursor x with spring lag +
tilt) — dropped by Kai.

## Rejected along the way
- **Current** (brush-underlay links, hamburger) — baseline only.
- **Static Ruler** (discrete cells, ticks only lengthen on hover) — Kai preferred the live scale.
- **Tape** (collapsed tick strip that unrolls on hover/tap) — hides labels at rest;
  first-time discoverability, first-tap-only-unrolls on touch. Not carried forward.
- **Span bottom line** (2px blue underline on the sliding span) — removed; faded wash only.

## Open items
- "Field Notes" has no route; prototype-only label.
- Touch tap behavior of Tape was never tested on a real device (moot — rejected).
- Slide/Rail hover only verified in the in-app pane; check Safari/Firefox + real touch
  before promoting. Mobile screenshots are 1× pane captures, desktop are 2× headless.
- If promoted: build into `Navigation.tsx`/`AppShell` (homepage is `h-[100dvh]`
  locked), then delete `src/app/proto/` and `public/proto/`.

## Shadow-box shelf (`/proto/nav-shelf`, 2026-10-08)

Branch: `explore/nav-object-hover` (off `proto/nav-explorations`). Reference:
`design-intent/pony-test/` (shelf, pony, lift/settle sequence, bookshelf concept).
Five chalkboard cubbies: selected works (cloud), play ground (pony), humble abode
(hat), field notes (pencil), about me (star). Each toy is one static image moved
only by transforms (lift + tilt, shadow shrinks/fades, opposite-tilt settle).

All three variants kept for now, each with a live tuning panel (lift height, lift/settle
tilt, durations, spring/snappy/soft easing, 1–5 settle swings, speed, zoom):
- **Hop** (`?v=1`): one-shot spring hop on hover, two-swing settle.
- **Float** (`?v=2`): soft lift, held with an idle bob while hovered, settles on leave.
- **Tic** (`?v=3`): held, plus a per-toy loop — cloud puffs, pony prances, hat tips,
  pencil waddles, star coin-flips.

No pick yet. `--font-mono` doesn't resolve on this branch; labels use
`var(--font-commit-mono)` directly.

## Decision — Sweep shelf on the homepage (2026-10-10)

Decided from `/proto/nav-shelf` (Tic) + `/proto/nav-shelf-tidy` (Sweep). Built as
`src/components/shelf/ShelfNav.tsx`; homepage only (AppShell), other routes keep `Navigation`.
- Hover: **Tic** (lift 13px, −8° lift / +4° settle, 280ms lift snappy ease-out, 240ms
  gravity fall, one 150ms swing). Star tic gets a 0.35 brightness glint as it lands face-on.
- Broom (Kai's sparkle-broom SVG) top-right of the shelf toggles **Sweep**: toys knocked off
  right→left (45ms stagger, −34px / −28°), box + chalk fade at 300ms, plain mono text row
  writes in at 480ms. Reverse: text clears, box returns, toys slide back left→right.
  Sparkles go out while tidied. Lands with the shelf out.
- Links: selected works → /works, play ground → /play, humble abode → / (home),
  field notes → `#` (no page yet), about me → /about.
- Size: 0.86× on phones (16px+ gutters at 375), 1.4× from md. Desktop garden now yields
  width on short screens (`Hero.tsx`) so tool cards sit where they did under the old bar.
- Rejected: Hop, Float (hover); 3D thick-felt star turn (kept only the glint); Chalk line
  (text only, no sweep), Unboxed (toys without box), Suspend (box hoisted on strings),
  Elevator (box sinks into the floor).

## Decision — Phone menu: Split (2026-10-23, not built yet)

Decided from `/works/proto-phone-menu` (Split, with contact added). Phones only (< 768px);
desktop and tablet keep the shelf header and the chalk chapter frame.
- The shelf header goes away on phones. A 56px paper bar holds the top: wordmark (home) left,
  hamburger right (44px).
- The hamburger opens a full-screen menu on grid paper: a one-column shelf, one cubby per toy,
  rows sharing the phone's height (min 88px), toys on one shared center line (88px slot) and
  chalk labels on one shared left edge (14ch, the longest label), the whole set centered in the
  shelf, each label level with its toy's middle. Toys hover 8px over the board with the desktop
  shelf's soft floor shadow under them, bobbing 3px on a 2.8s ease-in-out loop, each toy
  0.55s apart, the shadow tightening as it rises (off under reduced motion). Current page underlined with a soft light in its cubby.
- Under the shelf: "Come play. Say howdy." The email address is a button that copies it
  (Copy → Copied for 2s, announced to screen readers), with a small "Open in mail" mailto
  beside it. Then LinkedIn, GitHub, TikTok, X as 44px icon chips (Contra left out for now).
- Case study chapters stay separate: the chalk chip at the bottom, opening the chalk frame as a
  sheet (from `/works/proto-chapter-nav`, Sheet).
- Overlay: 240ms fade + 8px rise in, 180ms out, none under reduced motion. Body pinned at its
  scroll offset while open (iOS ignores overflow hidden), Escape closes, focus returns to the
  hamburger by ref (Safari doesn't focus buttons on tap).
- Rejected: **Merged** (chapters board on top of the toy column in one menu: on a phone the
  toys sit below 11 chapters, a long scroll), **Context** (the bar names the current chapter
  and opens chapters + the original 5-across shelf: keeps the art, but isn't the one-column
  shelf, and the toys stay tiny). From the chapter round: **Rail** (sticky chapter row, the
  most chrome), **Contents** (in-flow board, almost a full screen tall).

Shelf art in (2026-10-23): Kai's generated 4-cubby birch shelf (`Cal-Visuals/11-navigation/
Mobile-Birch plywood shelf.png`, 821x582) sliced into `public/nav/shelf-column/` (top board +
one image per cubby, 20KB): rows a, b, c, then b mirrored, then the last chalk closed on a
regular board instead of the export's thick base. Each row is a border-image (6 51 board 51,
drawn at 0.44), so only the chalk stretches, vertically. Rows share the phone's height, min
88px: fits a 393x852 phone with the contact block; on a 375x667 phone the socials scroll ~47px.
Generators wouldn't give 5 cubbies; slicing makes the count not matter.

Icons (2026-10-23): Central Icons (centralicons.com, line / 1.5px / medium / 24px), Twitter as
the X logo; Contra left out for now (not in Central either). Social tiles are chalk cut from the shelf
(`shelf-column/chalk-tile.webp`) with icons in #ECE8E0 (9.2:1 average, 3.2:1 on the brightest
smudge). Brand marks are Central's filled set (source: `Cal-Visuals/icon-svg.md`), inlined
as `currentColor` paths at 22px. Toys are the
5-across row's art at 1.7x; check them on a real phone.

When promoting: add the root `viewport` export (`viewportFit: 'cover'`, `themeColor` =
page `#F2EBE1`) so the `env(safe-area-inset-*)` paddings take effect; give case study sections
`scroll-mt` of at least 72px on phones so anchors clear the bar; then delete
`src/app/works/proto-phone-menu` and `src/app/works/proto-chapter-nav`.
