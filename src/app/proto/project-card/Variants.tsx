// PROTOTYPE — one high level case study card, second round. Delete with src/app/proto/project-card.
import { useRef, type PointerEvent } from 'react'

const P = {
  name: 'design garden',
  hook: 'Most online courses never get finished. These sprints do.',
  body: 'A four week sprint platform I built and run. Designers pair up, check in weekly, and end on showcase night with real progress on their next move.',
  role: 'founder',
  year: '2026',
  // designgarden-cover.gif frames 0-66 only (the Takeaway tab, before the tab switch changes the
  // window's height), scaled to 480px wide and re-encoded as an animated WebP (~240KB).
  coverAnim: '/proto/project-card/design-garden-cover-anim.webp',
  coverStill: '/proto/project-card/design-garden-cover-still.webp',
  href: '#',
}

// The white frosted card from the reference: name and number up top, the app window on its own,
// hook and arrow below.
// `onShelf` squares the bottom corners so the card sits flush on the chalkboard's ledge.
function FrostedCard({ onShelf = false }: { onShelf?: boolean }) {
  const windowRef = useRef<HTMLDivElement>(null)
  // The window tilts toward the cursor: --tx/--ty run -1..1 across the card, and the CSS turns
  // them into a rotation. Mouse only, and not under reduced motion.
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = windowRef.current
    if (!el || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    el.style.setProperty('--tx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--ty', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
  }
  const settle = () => {
    windowRef.current?.style.setProperty('--tx', '0')
    windowRef.current?.style.setProperty('--ty', '0')
  }
  return (
    <div
      onPointerMove={tilt}
      onPointerLeave={settle}
      className={`pc-frost relative aspect-[333/328] overflow-hidden ${onShelf ? 'rounded-t-[22px]' : 'rounded-[22px]'}`}
    >
      {/* The window plus two of the garden's blossoms perched on opposite corners, half over
          the edge like they landed there. A plain <picture>, not next/image: the optimizer would
          flatten the animation, and reduced motion gets the first frame. */}
      <div ref={windowRef} className="pc-window absolute">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={P.coverStill} />
          <img
            src={P.coverAnim}
            alt="Design Garden: two designers' shared garden board for the week"
            draggable={false}
            className="pc-gif block w-full rounded-[5px]"
          />
        </picture>
        <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="pc-blossom pc-blossom-a" />
        <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="pc-blossom pc-blossom-b" />
      </div>
      {/* Commit Mono by its next/font variable: the `font-mono` token resolves to system sans
          site-wide, since the variable lives on <body> but the token is read on :root. */}
      <span className="absolute left-2 top-2 rounded-[14px] px-3 py-2.5 font-[family-name:var(--font-commit-mono)] text-[13px] text-ink-primary">{P.name}</span>
      <span className="absolute right-2 top-2 rounded-[14px] px-3 py-2.5 font-mono text-[13px] text-ink-faint tabular-nums">01</span>
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-4 rounded-[14px] px-3 py-2.5 font-mono text-[13px] text-ink-primary">
        <span className="[text-wrap:balance]">{P.hook}</span>
        <svg className="pc-arrow shrink-0" width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
          <path d="M1 7h18M14 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

// 1 — Kai's two tone: the same white card, with the butter panel carrying the story under it.
export function FrostedStory() {
  return (
    <a href={P.href} className="pc-card group block w-full max-w-[440px] rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-primary" aria-label="Design Garden case study">
      <FrostedCard />
      <div className="pc-raised mt-1.5 rounded-[22px] bg-[#F1DCB6] px-6 py-5">
        <p className="font-display text-[15px] leading-[1.45] text-ink-primary [text-wrap:pretty]">{P.body}</p>
      </div>
    </a>
  )
}

// Specimen's bottom (meta row on a hairline, the story, a quiet link) as the panel under the card,
// drawn on chalk. The hook stays in the card's footer, so the panel doesn't repeat it.
function ChalkStory({ tone }: { tone: 'board' | 'dust' }) {
  const board = tone === 'board'
  return (
    <div className={`pc-raised px-6 pb-6 ${board ? 'pc-chalkboard rounded-b-[22px] pt-[calc(6%+20px)]' : 'pc-chalkdust mt-1.5 rounded-[22px] pt-5'}`}>
      <div className={`flex items-baseline justify-between border-b pb-2 font-mono text-[11px] tracking-[0.04em] ${board ? 'border-[rgb(240_236_226/0.22)] text-[rgb(240_236_226/0.6)]' : 'border-hairline text-ink-faint'}`}>
        <span>the story</span>
        <span>
          {P.role} · {P.year}
        </span>
      </div>
      <p className={`mt-4 font-mono text-[13px] leading-[1.6] [text-wrap:pretty] ${board ? 'pc-chalk-ink' : 'text-ink-body'}`}>{P.body}</p>
      <span className={`pc-link mt-4 inline-block font-mono text-[13px] ${board ? 'pc-chalk-ink' : 'text-ink-primary'}`}>see how it grew</span>
    </div>
  )
}

function ChalkCard({ tone }: { tone: 'board' | 'dust' }) {
  return (
    <a href={P.href} className="pc-card group block w-full max-w-[440px] rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-primary" aria-label="Design Garden case study">
      <FrostedCard onShelf={tone === 'board'} />
      <ChalkStory tone={tone} />
    </a>
  )
}

// 2 — Chalkboard: Kai's drawn board under its wooden ledge, story written in chalk.
export function Chalkboard() {
  return <ChalkCard tone="board" />
}

// 3 — Chalk dust: a pale matte chalk ground, closer to the page, ink type.
export function ChalkDust() {
  return <ChalkCard tone="dust" />
}
