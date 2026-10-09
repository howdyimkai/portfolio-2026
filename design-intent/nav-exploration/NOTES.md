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
