'use client'

// One high level case study card: the frosted card (name, number, cover window, hook) sitting on
// Kai's chalkboard, which carries the story. Promoted from /proto/project-card (Chalkboard).
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

export default function ProjectCard({ project: p, index }: { project: Project; index: number }) {
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
        <span className="absolute left-2 top-2 px-3 py-2.5 font-mono text-[13px] text-ink-primary">{p.name}</span>
        <span className="absolute right-2 top-2 px-3 py-2.5 font-mono text-[13px] text-ink-faint tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-4 px-3 py-2.5 font-mono text-[13px] text-ink-primary">
          <span className="[text-wrap:balance]">{p.hook}</span>
          {p.href && (
            <svg className="wk-arrow shrink-0" width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
              <path d="M1 7h18M14 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      <div className="wk-raised wk-chalkboard flex flex-1 flex-col rounded-b-[22px] px-6 pb-6 pt-[calc(7.6%+20px)]">
        <div className="flex items-baseline justify-between border-b border-[rgb(240_236_226/0.22)] pb-2 font-mono text-[11px] tracking-[0.04em] text-[rgb(240_236_226/0.6)]">
          <span>the story</span>
          <span>{[p.role, p.year].filter(Boolean).join(' · ')}</span>
        </div>
        <p className="wk-chalk-ink mt-4 font-mono text-[13px] leading-[1.6] [text-wrap:pretty]">{p.story}</p>
        <span className={`wk-chalk-ink mt-auto self-start pt-4 font-mono text-[13px] ${p.href ? 'wk-link' : 'opacity-60'}`}>
          {p.href ? p.cta ?? 'read the story' : 'case study coming soon'}
        </span>
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
