# Kai Tran Portfolio — CLAUDE.md

Next 16 / React 19 / Tailwind v4 / TypeScript.

## Current state

The homepage and `/works` are being rebuilt in a design direction called
**K-Zen** on the `explore/k-zen` branch (not merged to `main`). `main` holds
the pre-K-Zen baseline. `/about`, `/play`, `/resume` are intentionally
untouched — out of scope for this exploration.

## Design source of truth

- `design-intent/tokens.md` — colors, type, spacing, radii, motion intent.
  Read the **V2 delta** section first; it supersedes older sections below it
  where they conflict.
- `design-intent/frames/00_KaiDesignEngineer_HERO.png` (1440) and
  `00-KaiMobileHERO.png` (390) — layout truth for the homepage. When a
  position/size question comes up, measure the frame with PIL rather than
  eyeballing (see git log on `explore/k-zen` for examples of the row/col
  color-diff scanning approach used to place the garden elements).
- `design-intent/*.png` (`@2x` exports) — rendering truth for garden art.
  Never recreate these with CSS gradients/fonts. `KaiHeroTitle@2x.png` is the
  hero title asset, not typography.
- `design-intent/kai-tran-portfolio.dc.html` — behavior reference only for
  the rake groove algorithm (5 tines, paired dark/light stroke offset ±1px,
  6s hold + 3s linear fade). Don't port its code directly. Its hold/fade
  timing is close but not exact — see the `ZenGarden` entry below for the
  current model (10s hold + 3s linear fade per gesture, Kai's call
  2026-07-13, reverting the brief indefinite-persistence detour documented
  in `design-intent/GardenRakeStudy.mov`).

## Tokens & motion

- All design tokens live in `@theme` in `src/styles/globals.css` (Tailwind v4
  CSS-native theming). There is no `tailwind.config.js` — don't recreate one.
- Watch the naming: a token `--color-foo-bar` produces utility `bg-foo-bar`,
  not `bg-bar`. (`--color-page`, `--color-hairline` etc. were deliberately
  named to avoid double-prefix utilities like `bg-bg-page`.)
- Motion decisions follow the `emil-design-eng` skill
  (`.claude/skills/emil-design-eng/SKILL.md`, installed from
  github.com/emilkowalski/skills) — specific-property transitions only,
  custom ease-out curves, `scale(0.97)` press states, hover gated behind
  `(hover: hover) and (pointer: fine)`, `prefers-reduced-motion` handling.

## Key components

- **`AppShell`** (`src/components/AppShell.tsx`) — route-aware shell used by
  `layout.tsx`. The homepage is locked to `h-[100dvh]` with `overflow-hidden`
  on `main` — no page scroll at all; content that doesn't fit (the tool
  cards) is genuinely clipped at the fold, not just scrollable-to. Every
  other route uses normal `min-h-screen` scrolling.
- **`Navigation`** — route-aware: homepage renders 4 items edge-to-edge with
  no wordmark ("hello world" = home); other routes show the "Kai Tran"
  wordmark + 3 links. Each item's watercolor brush underlay fades in under
  the label on hover and stays persistent on the active page.
- **`ZenGarden`** — self-contained canvas-based tool system (teeth rake,
  eraser rake, blossom stamp). Rake/eraser act on **hover alone** — drawing
  starts on `pointerenter` and continues on every `pointermove`, no
  click-and-drag required (this was changed after user feedback that drag
  was hard to use). Blossom is still click-to-stamp (a discrete placement,
  not a drag gesture). Desktop and mobile have separate element positions
  (measured off the two `00_*` frames) since the plot is landscape on
  desktop and portrait on mobile (`sand.webp` vs `sand-portrait.webp`).
  Every `<Image>` in the garden needs `draggable={false}` — next/image
  renders real `<img>` tags, which are draggable by default and will hijack
  a mouse gesture mid-stroke otherwise. Grooves **hold 10s then fade over
  3s, linearly** (Kai's call, 2026-07-13) — the subtle paired dark/light
  pinstripe per tine, not the heavier trench+ridge stack from the
  GardenRakeStudy.mov detour. There is no persistent offscreen layer:
  every live rake chunk is kept in a plain list and the whole population
  is redrawn from scratch each frame in chronological order, so a chunk's
  carve pass (`destination-out` along its center path) only ever erases
  chunks drawn before it — this is what makes a gesture carve over its own
  earlier path (rolling ~120px chunks, same as before) or over an older,
  not-yet-faded gesture. Aging is per gesture, not per chunk: a gesture's
  chunks all render at full alpha while it's still being raked, and only
  start their hold/fade clock together once the gesture ends. The eraser
  reverts to whole-chunk removal (hit-testing each chunk's raw points
  against a radius) rather than a pixel wipe, since there's no persistent
  layer left to wipe into; blossoms stay object-based (React state) and
  are removed whole when the eraser passes near enough. Resize clears all
  live chunks and cancels the in-progress gesture — raked sand resets to
  smooth across a breakpoint change rather than warping old paths into new
  plot geometry, and since every chunk fades out within 13s regardless,
  this is never a jarring loss.

## Assets

- `public/garden/`, `public/nav/`, `public/hero/` — WebP, converted from
  `design-intent/` sources via `cwebp` (no new npm dependency for this).
  Garden payload budget is ~400KB total; check with
  `python3 -c "import os; print(sum(os.path.getsize(f'public/garden/{f}') for f in os.listdir('public/garden')))"`
  before adding new garden assets.

## Verifying changes

Dev server: `.claude/launch.json` has a `portfolio-dev` config
(`npm run dev`, port 3000) for the Browser pane / `preview_start`. Always
check both 1440px and 390px — desktop and mobile frequently need different
values (see `ZenGarden`'s responsive `left-[X%] md:left-[Y%]` pattern).
