'use client'

// One high level case study card: the frosted card (name, role, cover window) sitting on Kai's
// chalkboard, which carries the hook and the story. Promoted from /proto/project-card (Chalkboard).
import { useRef, type PointerEvent } from 'react'
import './project-card.css'

export type Project = {
  name: string
  hook: string
  // Words in the hook a yellow highlighter sweeps across when the card is hovered or focused. Must
  // appear in the hook exactly.
  mark?: string
  story: string
  role: string
  year?: string
  // Animated cover plus its first frame for reduced motion. No cover → a quiet empty window,
  // labeled "coming soon" only when there's no case study to link to either.
  // `float` is a layer that bobs over the cover, placed by [left, top, width, height] in % of it.
  // `device: 'browser'` puts a full desktop screen in the case study's three dot window, in a wider
  // window than the portrait covers get.
  cover?: {
    anim: string
    still: string
    alt: string
    float?: { src: string; box: [number, number, number, number] }
    device?: 'browser'
  }
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
        <div ref={windowRef} className={`wk-window absolute ${p.cover?.device === 'browser' ? 'wk-window-wide' : ''}`}>
          {p.cover ? (
            <>
              <div className={`wk-gif ${p.cover.device ? `wk-${p.cover.device}` : ''}`}>
                {p.cover.device === 'browser' && (
                  <div className="wk-browser-bar" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} />
                    ))}
                  </div>
                )}
                <div className="relative">
                  <picture>
                    <source media="(prefers-reduced-motion: reduce)" srcSet={p.cover.still} />
                    <img src={p.cover.anim} alt={p.cover.alt} draggable={false} className="wk-screen block w-full rounded-[5px]" />
                  </picture>
                  {p.cover.float && (
                    <img
                      src={p.cover.float.src}
                      alt=""
                      draggable={false}
                      className="wk-float absolute"
                      style={{
                        left: `${p.cover.float.box[0]}%`,
                        top: `${p.cover.float.box[1]}%`,
                        width: `${p.cover.float.box[2]}%`,
                        height: `${p.cover.float.box[3]}%`,
                      }}
                    />
                  )}
                </div>
              </div>
              <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="wk-blossom wk-blossom-a" />
              <img src="/garden/tool-blossom.webp" alt="" draggable={false} className="wk-blossom wk-blossom-b" />
            </>
          ) : (
            <div className="wk-window-empty flex items-center justify-center font-mono text-[12px] text-ink-faint">{!p.href && 'coming soon'}</div>
          )}
        </div>
        {/* Header: what it is, then my part in it, on the chalkboard's 24px gutter. Each half stays
            whole; when both don't fit on a phone, the role and year drop to their own line. */}
        <div className="absolute inset-x-6 top-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 font-mono text-[13px]">
          <span className="whitespace-nowrap text-ink-primary">{p.name}</span>
          <span className="whitespace-nowrap text-ink-faint">{[p.role, p.year].filter(Boolean).join(' · ')}</span>
        </div>
      </div>

      {/* The hook leads, the story supports it, and the one action sits at the bottom. */}
      <div className="wk-raised wk-chalkboard flex flex-1 flex-col rounded-b-[22px] px-6 pb-6 pt-[calc(7.6%+22px)]">
        <h2 className="wk-chalk-ink font-display text-[19px] font-medium leading-[1.3] [text-wrap:balance]">
          {p.mark && p.hook.includes(p.mark) ? (
            <>
              {p.hook.slice(0, p.hook.indexOf(p.mark))}
              <span className="wk-mark">{p.mark}</span>
              {p.hook.slice(p.hook.indexOf(p.mark) + p.mark.length)}
            </>
          ) : (
            p.hook
          )}
        </h2>
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
