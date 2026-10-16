'use client'

// One high level case study card: the frosted card (name, role, cover window) sitting on Kai's
// chalkboard, which carries the hook and the story. Promoted from /proto/project-card (Chalkboard).
import { useRef, type PointerEvent } from 'react'
import './project-card.css'

export type Project = {
  name: string
  hook: string
  story: string
  role: string
  year?: string
  // Animated cover plus its first frame for reduced motion. No cover → a quiet empty window.
  cover?: { anim: string; still: string; alt: string }
  // No href → the card is a "coming soon" placeholder and isn't a link.
  href?: string
  cta?: string
}

export default function ProjectCard({ project: p }: { project: Project }) {
  const windowRef = useRef<HTMLDivElement>(null)
  // The window tilts toward the cursor: --tx/--ty run -1..1 across the card, and the CSS turns
  // them into a rotation. Mouse only, and not under reduced motion.
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    const el = windowRef.current
    if (!el || !p.cover || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    el.style.setProperty('--tx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--ty', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
  }
  const settle = () => {
    windowRef.current?.style.setProperty('--tx', '0')
    windowRef.current?.style.setProperty('--ty', '0')
  }

  const body = (
    <>
      <div onPointerMove={tilt} onPointerLeave={settle} className="wk-frost relative aspect-[333/328] overflow-hidden rounded-t-[22px]">
        {/* The window plus two of the garden's blossoms perched on opposite corners. A plain
            <picture>, not next/image: the optimizer would flatten the animation. */}
        <div ref={windowRef} className="wk-window absolute">
          {p.cover ? (
            <>
              <picture>
                <source media="(prefers-reduced-motion: reduce)" srcSet={p.cover.still} />
                <img src={p.cover.anim} alt={p.cover.alt} draggable={false} className="wk-gif block w-full rounded-[5px]" />
              </picture>
              <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="wk-blossom wk-blossom-a" />
              <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="wk-blossom wk-blossom-b" />
            </>
          ) : (
            <div className="wk-window-empty flex items-center justify-center font-mono text-[12px] text-ink-faint">coming soon</div>
          )}
        </div>
        {/* Header: what it is, then my part in it, on the chalkboard's 24px gutter. */}
        <div className="absolute inset-x-6 top-5 flex items-baseline justify-between gap-4 font-mono text-[13px]">
          <span className="text-ink-primary">{p.name}</span>
          <span className="text-ink-faint">{[p.role, p.year].filter(Boolean).join(' · ')}</span>
        </div>
      </div>

      {/* The hook leads, the story supports it, and the one action sits at the bottom. */}
      <div className="wk-raised wk-chalkboard flex flex-1 flex-col rounded-b-[22px] px-6 pb-6 pt-[calc(7.6%+22px)]">
        <h2 className="wk-chalk-ink font-display text-[19px] font-medium leading-[1.3] [text-wrap:balance]">{p.hook}</h2>
        <p className="wk-chalk-ink mt-2 font-mono text-[13px] leading-[1.6] opacity-70 [text-wrap:pretty]">{p.story}</p>
        {p.href && (
          <span className="wk-chalk-ink mt-auto flex items-center gap-2 self-start pt-6 font-mono text-[13px]">
            <span className="wk-link">{p.cta ?? 'read the story'}</span>
            <svg className="wk-arrow" width="16" height="10" viewBox="0 0 22 14" fill="none" aria-hidden="true">
              <path d="M1 7h18M14 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </>
  )

  return p.href ? (
    <a
      href={p.href}
      className="wk-card group flex h-full w-full flex-col rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-primary"
      aria-label={`${p.name} case study`}
    >
      {body}
    </a>
  ) : (
    <article className="wk-card flex h-full w-full flex-col" aria-label={`${p.name}, case study coming soon`}>
      {body}
    </article>
  )
}
