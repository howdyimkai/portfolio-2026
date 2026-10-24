# Kai Tran Portfolio — CLAUDE.md

Next 16 / React 19 / Tailwind v4 / TypeScript.

## Current state

The homepage and `/works` are being rebuilt in a design direction called
**K-Zen** on the `explore/k-zen` branch (not merged to `main`). `main` holds
the pre-K-Zen baseline. `/about` was rebuilt as the shelf page on
`explore/proto-about` (2026-10-18, see `AboutPage` below) and merged into
`explore/cal-v4-copy` on 2026-10-24. `/play` and
`/resume` are intentionally untouched — out of scope for this exploration.

## Taste (read first)

- **Calm page, playful touch.** Zen garden for structure: one sand tray,
  generous space, quiet type. The play lives in the interactions (rake,
  eraser, blossom, sweep), not in decoration. If everything moves, nothing
  feels thoughtful.
- **Felt toys, not photos.** Every object reads as handmade felt or clay
  (moss, rocks, pony, cowboy hat, star). Nothing photoreal. If a new asset
  looks like a photo, flag it instead of shipping it.
- **Works for someone who never touches it.** The hero has to land before
  anyone rakes or erases. Interactions are a bonus, never the only way to
  get the message.
- **Hand-made over generated.** Titles, principles, and brush strokes are
  Kai's drawn assets. Never recreate them with fonts, gradients, or CSS.

## Positioning & copy (locked 2026-10-10)

Copy source of truth: `~/Desktop/Claude-Workspace/projects/2026-10-PortfolioSprint/Positioning Brainstorm.md`.
Voice rules: `~/Desktop/Claude-Workspace/context/brand-voice.md` (sentence
case, no em dashes or hyphens in creative copy, no buzzwords).

- **Never "Design Engineer"** in visible copy. Kai is a "designer and tinkerer."
  The title stays off the site until announced.
- **H1:** Designer and tinkerer. I make learning feel like play.
- **First card under the hero:** Design Garden, then Tallo. Don't put the
  Tallo quiz numbers in the footer or hero.
- **Footer (every page):** I'm a designer and tinkerer who sweeps the gap
  between marketing and product, with roots in film and games. I translate
  pixels, stories and code, and I tinker and wrestle with AI until ideas
  work. My specialty is making hard things feel easy, with a sprinkle of
  whimsy. Sweep icon sits beside it.
- **CTA:** Come play. Say howdy at [email]

**Selected works live on `/works`, not under the hero (Kai, 2026-10-16).**
This replaces the 2026-10-10 plan to make the homepage scroll. The homepage
stays one full-bleed screen with no footer; the shelf's "selected works" toy
is the way in. `/works` uses the same `ShelfNav` on white grid paper
(`.grid-sheet`) with three cards: Design Garden, Tallo, ApolloEd. Tallo links to
the Cal case study (`/works/cal`, still noindex) but has no cover yet;
ApolloEd is "coming soon". Cards are
`src/components/works/ProjectCard.tsx`, promoted from `/proto/project-card`'s
Chalkboard variant.

**Sprint scope (updated 2026-10-11):** the homepage hero is built and Kai
likes it. Remaining sprint work: footer (every page), high level project
cards under the hero, and About v2 with the five principles on `/about`.
About copy draft lives in the Positioning Brainstorm doc.

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
  Never recreate these with CSS gradients/fonts. The hero title is an asset, not
  typography: `Kai-October-Hero.GIF` (2026-10-08, supersedes
  `KaiHeroTitle@2x.png`), a line-boil GIF that ping-pongs 7 unique drawings
  at 140ms. Shipped as a 7-cell sprite strip in scrambled order (1-4-2-6-3-7-5,
  `public/hero/kai-hero-october-boil.webp`, `cwebp -q 60 -alpha_q 50 -m 6`,
  ~320KB) stepped by the `.title-boil` keyframe in `globals.css`, plus a
  first-frame still that paints first and feeds the ink grid. Not an animated
  WebP on purpose: the title rests and only wiggles while hovered (desktop:
  hit-tested from the plot's pointer events, since the title layer is
  pointer-events-none; mobile: a tap plays one loop), finishing one loop after
  the pointer leaves, which needs `animation-play-state`. Kai, 2026-10-08:
  auto-boiling on load / garden entry "feels kinda abrupt". Current tool art:
  `Teethrake4prongs-2x.png` (teeth rake — also the groove SCALE truth: 4
  tines, drawn band ≈ its prong span at the cursor. Rake and eraser cursors
  are 48px since 2026-10-24, 20% up, while blossom stays 40px; ~15.8px between
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
  `layout.tsx`. The homepage is the **Full bleed sandbox** (promoted from
  `/proto/garden-full?v=2`, 2026-10-15): `<main>` locked to `h-[100dvh]` with
  `overflow-hidden`, and `SandboxHome` (`src/components/SandboxHome.tsx`) brings
  its own floating `ShelfNav` over `SandGarden layout="bleed"`. No footer on `/`.
  `/pieces/*` renders bare (one piece of the site on its own, for recordings).
  `/works`, its case studies and `/about` use `ShelfNav` + `Footer` on white grid paper; below
  md the shelf gives way to `PhoneMenu` (paper bar + hamburger opening a one-column shelf) and
  case studies get a chalk `ChapterSheet` chip. The black-ink wordmark overrides in AppShell and
  `SandboxHome` target `.shelf-wordmark img`, since `.shelf-wordmark` is now the link. Every other route
  uses `Navigation` + `Footer` with normal scrolling.
- **`Navigation`** — route-aware: homepage renders 4 items edge-to-edge with
  no wordmark ("hello world" = home); other routes show the "Kai Tran"
  wordmark + 3 links. Each item's watercolor brush underlay fades in under
  the label on hover and stays persistent on the active page.
- **`ShelfNav`** (`src/components/shelf/`) — the homepage nav (AppShell renders it
  instead of `Navigation` on `/`). A shadow-box shelf of felt toys drawn at 1× shelf
  units and scaled by `--zoom` (0.86 phones, 1.4 md+). Hover runs the "Tic" motion in
  `shelfMotion.ts`; the broom button sweeps the toys off and leaves a plain text row.
  Taller than the old bar, so `Hero.tsx` shrinks the garden on short desktop screens to
  keep the tool cards at the fold. The "howdy im Kai" wordmark links home on every shelf page
  (2026-10-24), like `PhoneMenu`'s. Decision record: `design-intent/nav-exploration/NOTES.md`.
- **`AboutPage`** (`src/components/about/`) — `/about`, the "Shadow box" picked
  from `/proto/about` (decision + rejected options:
  `design-intent/about-exploration/NOTES.md`). Three floating birch planks of
  felt objects (`AboutShelf`, driven by `data.ts`; moving an object is changing
  its `shelf`; the principles frame hangs on the wall above the shelves on desktop, beside them at md) to the right of a docked panel (left, sticky) that starts as the bio and swaps to an
  object's "currently into" card when picked. Every hover moment is CSS over a
  single image (no paired on/off exports) and fires on mouse hover or keyboard
  focus only, via `data-on`. AppShell gives `/about` the same chrome as `/works`
  (shelf nav, `PhoneMenu` below md, footer, white grid paper `.grid-sheet`). Cards marked `draft: true` still have placeholder copy.
  Sources: `design-intent/about-shelf/` (Paper exports), WebPs in `public/about/`.
- **`ZenGarden`** — self-contained canvas-based tool system (teeth rake,
  eraser rake, blossom stamp). Rake/eraser act on **hover alone** — drawing
  starts on `pointerenter` and continues on every `pointermove`, no
  click-and-drag required (this was changed after user feedback that drag
  was hard to use). Putting a tool down (2026-10-24): click it again, press
  Escape, or use the rail's "put down" button; within 32px of the shelf
  the held tool goes quiet so the nav can be reached
  (`design-intent/tool-exit-exploration/NOTES.md`). R, E and B pick the
  rake, eraser and blossom (the held tool's key puts it down). Blossom is still click-to-stamp (a discrete placement,
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
  over the hero title fades it by swept coverage, then — after a 1s beat of
  bare sand (`REVEAL_DELAY_MS`, 2026-10-08) — plays one of Kai's five
  hand-written principles as a write-on video, holds, and fades back to the
  title (shuffled bag, no repeat at the seam). Coverage is a 16×6 grid where
  only cells holding title ink count (mask read from the asset's alpha), hit
  by the head's swept SEGMENT, not its sample points — both fixes for "fast
  straight wipes erase weaker than turning" (2026-09-29); 80% of inked cells
  triggers. A caption under the title ("psst, try the erase above") fades in
  after 4s and leaves for good once the eraser first touches the title
  (`design-intent/hint-exploration/NOTES.md`). The 4s read clock starts when the video ends; the returns use an
  even ease-in-out, since the shared strong ease-out made a 900ms fade look
  like a snap.
  Videos live in `public/principles/` (`.mp4` + final-frame `.webp` poster,
  which is the whole reveal under reduced motion). They're blended onto the
  sand with `mix-blend-multiply` on the **wrapper**, not the `<video>` — the
  wrapper's opacity isolates it, so a child blend leaves a white box.
  `filter: blur` over a `<video>` draws a dark frame at the layer edges
  (multiply makes it visible), so when the write-on ends the video is swapped
  for its identical `.webp` still, and blur is only ever applied to the still.
  The principle is **erasable** like the title (same swept-segment coverage
  over an ink-only 20×8 grid read from the still, scrubbed opacity + blur) —
  but only once its writing has finished, because the wipe that erased the
  title is usually still moving over the same spot. Fully erased → title
  returns; partly erased then left alone for 2.5s → finishes on its own;
  never touched → the 4s read timer returns it.
  Sources are `design-intent/principles-v2/*` (bolder brush, two lines,
  2026-10-08; v1 single-line originals stay in `design-intent/principles/`).
  v2 clips already start blank, so regenerate by dropping any leading blank
  frames, `hue=s=0` + `curves=all='0/0 0.88/1 1/1'` to level the paper to pure
  white, then padding white and cropping at native scale to a shared 1440×540
  frame centered on each ink bbox so the handwriting scale matches. Verifying
  with synthetic events: React's `onPointerEnter` is driven by `pointerover`,
  not `pointerenter`.

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
