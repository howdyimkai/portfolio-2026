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
  hero title asset, not typography. Current tool art:
  `Teethrake4prongs-2x.png` (teeth rake — also the groove SCALE truth: 4
  tines, drawn band ≈ its prong span at the 40px cursor, ~13.4px between
  outer tine centers) and `cherryblossomstampNEW@2x.png` (blossom).
  `teethrake@2x.png` / `blossomstamp@2x.png` are superseded originals.
- `design-intent/GardenRakeStudy.mov` — 176MB real-raking study video,
  deliberately untracked (gitignored); lives only on Kai's machine. Was the
  reference for groove mark character; the heavy trench+ridge rendering
  derived from it was reverted 2026-07-13, but it stays the reference if
  mark realism comes up again.
- `design-intent/kai-tran-portfolio.dc.html` — behavior reference only for
  the rake groove algorithm (paired dark/light stroke offset ±1px; it shows
  5 tines and 6s hold — the current build uses 4 tines per the 4-prong
  asset, and 10s hold + 3s linear fade per gesture, Kai's calls 2026-07-13).
  Don't port its code directly. See the `ZenGarden` entry below for the
  current model.

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

  **Pulled, not pushed (2026-07-13):** the rake/eraser head is a towed
  point, not the raw pointer. It trails `RAKE_FOLLOW_DIST` (24px) behind
  the pointer along the head→pointer line — caster/tractrix follow, the
  same math as a trailer behind a car — recomputed on every pointer sample
  including coalesced ones (`stepHead` in `ZenGarden.tsx`). Grooves are
  generated from the head's path, not the pointer's, so a fast zigzag hand
  motion sweeps into arcs instead of snapping to sharp corners. The cursor
  renders at the head position, rotated so the handle points from the head
  toward the pointer (`CURSOR_HANDLE_OFFSET_DEG`, -90° — the mirror of the
  old push-mode +90°, since pulling swaps which end leads). On every
  (re)arm — `pointerenter`, tool switch, resize — the head is reset to
  `null`, a signal consumed by the next `pointermove` sample to snap the
  head onto the pointer rather than stepping from a stale position; it
  then falls behind naturally as the pointer pulls away. A second gate,
  `HEAD_MIN_TRAVEL` (6px), withholds the first groove point until the head
  has accumulated that much of its own travel, so the moment it starts
  moving can't stamp a short stub. The eraser uses the same towed head
  (`eraseAt` receives head positions, not raw pointer positions); blossom
  stamping is untouched — still a discrete click at the raw pointer. All
  of this is isolated to `stepHead` + three constants at the top of the
  file plus the towed branch in `handlePointerMove`, so it's revertible
  without touching the groove rendering system described above.

  **Erase-the-name reveal (desktop only, 2026-09-29):** sweeping the eraser
  over the hero title fades it by swept coverage (8×4 grid, 85% threshold),
  then plays one of Kai's five hand-written principles as a write-on video,
  holds, and fades back to the title (shuffled bag, no repeat at the seam).
  Videos live in `public/principles/` (`.mp4` + final-frame `.webp` poster,
  which is the whole reveal under reduced motion). They're blended onto the
  sand with `mix-blend-multiply` on the **wrapper**, not the `<video>` — the
  wrapper's opacity/filter isolate it, so a child blend leaves a white box.
  Sources are `design-intent/principles/*` (each opens ~1.1s on the finished
  sentence, then a blank flash, then the rewrite). Regenerate by trimming to
  the last blank frame, `hue=s=0` + `curves=all='0/0 0.88/1 1/1'` to level the
  paper to pure white, and cropping to a shared 1240×280 frame centered on
  each ink bbox so the handwriting scale matches. Verifying with synthetic
  events: React's `onPointerEnter` is driven by `pointerover`, not
  `pointerenter`.

## Assets

- `public/garden/`, `public/nav/`, `public/hero/` — WebP, converted from
  `design-intent/` sources via `cwebp` (no new npm dependency for this).
  Garden payload budget is ~400KB total; check with
  `python3 -c "import os; print(sum(os.path.getsize(f'public/garden/{f}') for f in os.listdir('public/garden')))"`
  before adding new garden assets.

## Verifying changes

Dev server: `.claude/launch.json` has a `portfolio-dev` config
(`npm run dev`, port 3000, `autoPort: true` so it falls back to a free port
when another session holds 3000) for the Browser pane / `preview_start`.
Note: two `next dev` instances can't share this working tree (they fight
over `.next/dev/lock`) — reuse a running server via `preview_start {url}`,
or run a second server from an isolated git worktree. Always check both
1440px and 390px — desktop and mobile frequently need different values (see
`ZenGarden`'s responsive `left-[X%] md:left-[Y%]` pattern). Canvas behavior
(groove timing, fade) must be verified with in-page scripts and real
timestamps, not screenshot round-trips.
