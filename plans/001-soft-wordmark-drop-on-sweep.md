# 001 — Float the wordmark down softly when the broom sweeps

- **Status**: DONE
- **Commit**: 08f44ec
- **Severity**: MEDIUM
- **Category**: Missed opportunities (a layout jump that teleports)
- **Estimated scope**: 1 file (`src/components/shelf/ShelfNav.tsx`), ~25 lines

## Problem

On `/pieces/nav` the shelf is vertically centered in the viewport
(`src/app/pieces/nav/piece.css`, `display: grid; place-items: center`). When the
broom is clicked, ShelfNav sets `data-compact` ~520ms later, and the header's
reserved height shrinks from `160px * zoom` to `96px * zoom`
(`src/components/shelf/shelf-nav.css:41-48`). The centered block re-centers in a
single frame, so "howdy im Kai" (and the text row with it) **teleports down by
`(160 - 96) * zoom / 2`** — measured 57.6px at zoom 1.8, in one frame, 534ms
after the click. Un-sweeping teleports it back up the same distance.

Every other moving thing on the shelf floats: active toys idle with a
`cubic-bezier(0.37, 0, 0.63, 1)` sine-like ease (`shelf-nav.css:267`), and the
hover settle in `shelfMotion.ts` uses the same curve (`SWING`). The wordmark
should arrive the same way — drift down, sink a hair past its spot, and settle
back, like a toy landing on its hover height.

The existing FLIP in ShelfNav only handles the homepage garden, and it returns
early when there is no garden, so nothing animates the header on this page:

```tsx
// src/components/shelf/ShelfNav.tsx:110-146 — current
const before = useRef<{ plot: DOMRect; tools: DOMRect } | null>(null)
const parts = () => {
  const plot = document.querySelector<HTMLElement>('[data-home-hero] .garden-plot')
  const tools = document.querySelector<HTMLElement>('[data-home-tools]')
  return plot && tools ? { plot, tools } : null
}

const setLayout = (next: boolean) => {
  const p = parts()
  before.current = p ? { plot: p.plot.getBoundingClientRect(), tools: p.tools.getBoundingClientRect() } : null
  setCompact(next)
}

useLayoutEffect(() => {
  const p = parts()
  const b = before.current
  before.current = null
  if (!p || !b || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // ...garden FLIP...
}, [compact])
```

```tsx
// src/components/shelf/ShelfNav.tsx:163 — current
<div className="shelf-nav-draw" data-tidy={tidy ? '' : undefined} data-compact={compact ? '' : undefined}>
```

## Target

FLIP the whole `.shelf-nav-draw` vertically whenever compact toggles and the
draw actually moved. Animate the **individual `translate` property**, not
`transform`: `.shelf-nav-draw` already uses `transform: scale(var(--zoom))`
(`shelf-nav.css:55`), and a WAAPI `transform` keyframe would wipe the scale.
`translate` composes before `transform` and is not scaled by it, so the pixel
values are screen pixels.

Motion (exact values):

- Duration: `720ms`
- Keyframes, where `dy = beforeTop - afterTop` (negative when dropping) and
  `sink = -Math.sign(dy) * Math.min(4, Math.abs(dy) * 0.08)` (keeps going ~4px
  past the target in the direction of travel):
  1. `{ translate: \`0 ${dy}px\`, easing: 'cubic-bezier(0.37, 0, 0.63, 1)' }` at offset 0
  2. `{ translate: \`0 ${sink}px\`, easing: 'cubic-bezier(0.37, 0, 0.63, 1)', offset: 0.72 }`
  3. `{ translate: '0 0' }` at offset 1
- Skip when `Math.abs(dy) < 0.5` (the homepage header is top-anchored, so its
  draw never moves — this keeps the homepage exactly as it is).
- Skip under `prefers-reduced-motion: reduce` (the jump stays; that's fine).
- Interruptible: measure `beforeTop` *including* any running animation, then
  cancel the running draw animation, then measure `afterTop`, so a quick double
  click on the broom retargets from where the wordmark is right now.

## Repo conventions to follow

- The FLIP pattern already lives in this same effect: measure in `setLayout`
  before `setCompact`, re-measure in `useLayoutEffect`, cancel old animations,
  `el.animate(...)` from the delta to `none`. Imitate it.
- The float curve `cubic-bezier(0.37, 0, 0.63, 1)` is the shelf's existing
  "hover" ease (`shelf-nav.css:267`, `shelfMotion.ts` `SWING`). Reuse that literal
  value; don't introduce a new token.
- Comments are short, plain, and explain *why* (see the comment above
  `setLayout`).

## Steps

1. In `src/components/shelf/ShelfNav.tsx`, add a ref next to `broomRef`:
   ```tsx
   const drawRef = useRef<HTMLDivElement>(null)
   ```
   and attach it: `<div ref={drawRef} className="shelf-nav-draw" ...>`.

2. Add a second ref for the draw's old position, next to `before`:
   ```tsx
   const drawBefore = useRef<number | null>(null)
   ```

3. In `setLayout`, record it before `setCompact(next)`:
   ```tsx
   drawBefore.current = drawRef.current?.getBoundingClientRect().top ?? null
   ```

4. At the **top** of the existing `useLayoutEffect(() => { ... }, [compact])`,
   before `const p = parts()`, add the header FLIP so it runs even when there is
   no garden on the page:
   ```tsx
   // Where the header re-centers (/pieces/nav), the wordmark floats down to its
   // new spot and sinks a hair past it, like a toy settling onto its hover height.
   const draw = drawRef.current
   const drawTop = drawBefore.current
   drawBefore.current = null
   if (draw && drawTop !== null && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
     draw.getAnimations().filter((a) => !(a instanceof CSSAnimation)).forEach((a) => a.cancel())
     const dy = drawTop - draw.getBoundingClientRect().top
     if (Math.abs(dy) >= 0.5) {
       const sink = -Math.sign(dy) * Math.min(4, Math.abs(dy) * 0.08)
       const float = 'cubic-bezier(0.37, 0, 0.63, 1)'
       draw.animate(
         [
           { translate: `0 ${dy}px`, easing: float },
           { translate: `0 ${sink}px`, easing: float, offset: 0.72 },
           { translate: '0 0' },
         ],
         { duration: 720 },
       )
     }
   }
   ```
   Leave the rest of the effect (the garden FLIP) unchanged.

## Boundaries

- Do NOT touch `shelf-nav.css`, `shelfMotion.ts`, `piece.css`, or the garden FLIP code.
- Do NOT change `COMPACT_AFTER_MS` / `EXPAND_AFTER_MS` or any sweep timing.
- Do NOT animate `transform`, `top`, or `margin` on `.shelf-nav-draw` — `translate` only.
- Do NOT add dependencies.
- If the code at the cited lines doesn't match (drift since 08f44ec), STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit -p .` passes with no output.
- **Measure** (in the browser console on `http://localhost:3000/pieces/nav`):
  sample `document.querySelector('.shelf-wordmark').getBoundingClientRect().top`
  every animation frame for 1.5s after `document.querySelector('.shelf-broom').click()`.
  Before the fix it changes once (one 57.6px step at zoom 1.8). After: it moves
  over ~720ms, goes ~4px past the final value, then comes back to it.
- **Feel check**:
  - Click the broom: the toys get swept, then the wordmark *drifts* down instead of
    snapping, with a soft little sink-and-rise at the end that matches the floating
    active toy.
  - Click the broom again: the wordmark rises the same way (sinks ~4px past upward).
  - Double-click the broom fast: the wordmark never snaps back to an old position
    before moving; it reverses from where it is.
  - DevTools Animations panel at 10%: the start has no jolt (ease-in-out start)
    and the overshoot is subtle, not a bounce.
  - Rendering panel → `prefers-reduced-motion: reduce`: the wordmark jumps as before,
    with no animation.
  - Homepage `/` at 1440 and 390: sweep looks exactly as before (the header's draw
    doesn't move there, so no animation should run on it).
- **Done when**: the wordmark's position changes over ~720ms on `/pieces/nav` in both
  directions, and the homepage behaves the same as before.
