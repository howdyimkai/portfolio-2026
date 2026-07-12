# Kai Tran Portfolio — Design Tokens (K-Zen direction)

Source of truth for homepage + Selected Works index, desktop (1440) + mobile (390).
Reference frames: `frames/homepage-desktop-1440.png`, `frames/homepage-mobile-390.png`,
`frames/selected-works-desktop-1440.png`, `frames/selected-works-mobile-390.png`.
Interactive reference: `kai-tran-portfolio.dc.html` (open directly in a browser).

> **Addendum 2026-07-11:** The `@2x` PNG exports in this folder are the rendering truth
> for garden elements — use these assets, do not recreate them with CSS gradients.
> Optimize/convert assets before shipping. Sand: use `Sand beach@1.5x.png` (373 KB,
> 1255×891) as the source — `Sand-Background@2x.png` (~1 MB) is the archive original;
> don't ship it.

## V2 delta — 2026-07-11 (supersedes conflicting sections below)

**Layout truth is now `frames/00_KaiDesignEngineer_HERO.png` (desktop) and
`frames/00-KaiMobileHERO.png` (mobile).** The older `homepage-*` frames show a
superseded flat rendering; keep them only as layout fallback where the new frames agree.
The `selected-works-*` frames have NOT been redone in the new style — structure/layout
still valid, rendering style must follow this delta (texture, palette, hand-drawn accents).

Changes visible in the new frames:

- **Positioning:** title is now "Kai Tran — DESIGN ENGINEER" (handwritten script +
  hand-lettered caps on a blue washi-tape strip), replacing the mono tagline hero.
- **Nav:** four top-nav items — `hello world` (home), `selected works`, `playground`,
  `about me`, each with a hand-drawn ink underline. **Hover behavior (confirmed by Kai):**
  on hover, that item's watercolor brush stroke (`hover-helloworld@2x.png`,
  `hover-selectedworks@2x.png`, `hover-playground@2x.png`, `hover-aboutme@2x.png`)
  appears UNDER the text — an underlay behind the label, not a replacement. Fade it
  in/out ~150ms. The current page's item keeps its brush persistently (see desktop frame,
  `hello world` active). Mobile uses a hamburger (overlay design not provided — see open items).
- **Palette additions** (sampled from frame, confirm exact values in Paper):
  `accent-washi-blue` ≈ `#8AB4D1`, `brush-blue-light` ≈ `#AEC5D4`, blossom pink (see
  `blossomstamp@2x.png`). The "exactly one accent (orange)" rule below is superseded —
  blue is now the primary accent; orange role unclear/possibly dropped.
- **Garden composition:** textured sand plot (`Sand-Background@2x.png`), moss clump,
  3 speckled rocks, bonsai (`Bonsai tree aerial@2x.png`) overflowing the plot's
  bottom-right edge (needs overflow visible + z-index care), bamboo sprigs
  (`bamboo1–4@2x.png`) on the page background at low opacity outside the plot.
  Additional set pieces available: `Moss tree rock@2x.png`, `Mossy island rock@2x.png`.
- **Tool palette (new interaction):** cards below the garden — TEETH RAKE
  (`teethrake@2x.png`), ERASER RAKE (`eraserrake@2x.png`), BLOSSOM
  (`blossomstamp@2x.png`). Assumed behavior, Kai to confirm: teeth rake draws the
  multi-tine grooves per the motion spec below; eraser rake smooths/clears grooves and
  stamped blossoms; blossom stamps a blossom onto the sand on click/tap. Selected tool
  drives the custom cursor.

**Resolved:** Title lockup exported as `KaiHeroTitle@2x.png` (transparent, script +
washi strip together) — use this asset for the hero title at both breakpoints; never
reproduce it with fonts. Nav hover behavior confirmed (see Nav bullet above).

**Executor proceeds on these assumptions unless Kai corrects them:**
1. Tool behaviors: teeth rake draws grooves, eraser rake clears grooves/blossoms,
   blossom stamps onto the sand.
2. Rocks are decorative/interactive garnish only — navigation lives in the top bar.
   (The rock-label-chip idea in Layout notes below is superseded.)
3. Mobile hamburger opens a plain full-screen overlay reusing the nav styles.

## Colors (hex)

| Token | Value | Use |
|---|---|---|
| `bg-page` | `#F2ECE2` | Page background, cards, chips background |
| `ink-primary` | `#3A3226` | Headings, wordmark, active nav |
| `ink-body` | `#6B6152` | Body copy, taglines |
| `ink-muted` | `#8A8074` | Secondary text, meta (year, blurb on cards) |
| `ink-faint` | `#A99A7F` | Hint text ("drag to rake..."), placeholders |
| `sand-light` | `#DED1B3` | Garden hero gradient start (top-left) |
| `sand-dark` | `#C9B992` | Garden hero gradient end (bottom-right) |
| `sand-vignette` | `rgba(70,55,30,0.16)` | Radial vignette overlay on garden edges |
| `rock-highlight` | `#8F887A` | Stone gradient — lit edge |
| `rock-mid` | `#6F6A5D` | Stone gradient — mid tone |
| `rock-shadow` | `#4C483D` | Stone gradient — shaded edge |
| `groove-shadow` | `rgba(70,55,38,0.32)` | Rake line — dark/engraved edge |
| `groove-highlight` | `rgba(255,248,232,0.5)` | Rake line — lit edge |
| `accent-orange` | `#C9622F` | Single accent — active nav underline, stone marker, hover states, tag/CTA arrows |
| `border-hairline` | `rgba(61,50,38,0.12)` | Hairlines under nav, between rows |
| `chip-border` | `rgba(120,100,70,0.3)` | Rock-label chip border |
| `tag-bg` | `#E9E1CF` | Project tag pill background |
| `placeholder-stripe-a` | `#E7DDC9` / `#DED1B3` | Diagonal stripe placeholder (project covers) |

Palette is warm/neutral (sand, stone) with exactly one accent hue (orange). No other accent colors.

## Type

Families: **Bricolage Grotesque** (display/headings) + **Commit Mono** (all UI text, body, nav, labels).

| Style | Family | Size (desktop → mobile) | Weight | Line-height |
|---|---|---|---|---|
| Hero name (home) | Bricolage Grotesque | 76px → 40px | 600 | 1.05 |
| Hero name (garden-embedded, 2a/2b) | Bricolage Grotesque | 72px → 36px | 600 | 1.05 |
| Page H1 (Selected Works) | Bricolage Grotesque | 48px → 32px | 600 | 1.1 |
| Card title | Bricolage Grotesque | 24px → 19px | 600 | 1.2 |
| Wordmark (top nav) | Bricolage Grotesque | 20px → 17px | 600 | 1 |
| Tagline / hero subtitle | Commit Mono | 16px → 12px | 400 | 1.7 |
| Body / card blurb | Commit Mono | 14px → 13px | 400 | 1.5–1.6 |
| Nav links | Commit Mono | 14–15px | 400–500 | 1 |
| Meta (year) | Commit Mono | 12px → 11px | 400 | 1 |
| Tag pill | Commit Mono | 11px | 400 | 1 |
| Hint text | Commit Mono | 12px → 11px | 400 | 1 |

Letter-spacing: hero name only, -0.5 to -1px. Everything else default.

## Spacing scale

Base unit 4px: **4, 8, 12, 14, 16, 18, 22, 24, 28, 32, 40, 48, 56, 64, 72, 96** (px).
Section padding: 64px desktop / 20–28px mobile. Card gap: 40px (desktop grid) / 32px (mobile stack).

## Corner radii

| Element | Radius |
|---|---|
| Garden hero plot | 34–40px desktop, 22–28px mobile |
| Project card image | 16px desktop, 14px mobile |
| Chips / tag pills | 999px (full) |
| Rock-label tooltip | 6px |

## Motion intent (describe, don't code)

- **Rake grooves**: appear immediately, following the cursor/finger path exactly, as a multi-tine stroke (5 parallel lines, ~7px apart desktop / ~5px mobile). Each line rendered as a paired dark+light stroke offset by 1px to read as an engraved groove, not a flat line.
- **Groove healing**: a stroke holds at full opacity for ~6s, then fades linearly to 0 over ~3s (ease not required — linear reads as "settling"). Fully faded strokes are removed.
- **Rake tool cursor**: a small rake icon (handle + 5 tines) follows the pointer while hovering the garden, fading in/out over 150ms. Rotates to match the current drag direction.
- **Rock hover**: subtle lift — scale ~1.04 + soft shadow increase, ~150ms ease-out. (Not yet built into the mock; call out to dev as expected polish.)
- **Rock click → label chip**: chip fades + rises ~8px into place above the stone, ~150–200ms ease-out. Clicking the same stone again, or elsewhere, dismisses it the same way in reverse.
- **Card/list entrances** (Selected Works): opacity 0→1 + translateY(8px)→0, 200–250ms ease-out, staggered ~40ms per card, on first scroll into view.
- **Nav hover**: color transitions to accent orange, ~150ms ease-out; active item keeps a permanent 2px orange underline.
- **General rule**: animate transform/opacity only. Hover-driven effects gated behind `@media (hover: hover)`. All durations reduced to ~0 under `prefers-reduced-motion: reduce` (fades/transitions still happen instantly rather than being skipped, so state changes aren't jarring).

## Layout notes

- Homepage is a single viewport screen (no scroll) — garden hero is the whole page.
- Two homepage variants under consideration: hero text above the garden (turn 1) vs. hero text embedded directly on the sand inside the garden container, with a plain skip-nav row above it for people who don't want to interact (turn 2, `2a`/`2b` — currently preferred direction).
- Selected Works is a normal scrolling page: sticky/plain top bar (wordmark + nav), H1 + one-line intro, then a project grid (2-col desktop / 1-col mobile). Cards are placeholders — swap `imgLabel`/`title`/`blurb`/`tags`/`year` per project once real content is provided.
- Rocks in the garden double as primary navigation (`selected works`, `playground`, `about me`) — clicking/tapping reveals a label chip; wire to real routes in implementation.
