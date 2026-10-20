'use client'

// The one case study template (sprint plan, 2026-10-20): header, hero, a stat strip of three,
// then chapters with a chapter bar on the left. Everything is driven by a CaseStudy in src/content/.
// Backdrop and chapter bar: design-intent/case-study-exploration/NOTES.md (2026-10-20).
import { useEffect, useState } from 'react'
import type { Block, CaseStudy, Visual } from './types'
import './case-study.css'

const num = (i: number) => String(i + 1).padStart(2, '0')

export default function CaseStudyPage({ study: s }: { study: CaseStudy }) {
  const active = useActiveChapter(s.chapters.map((c) => c.id))

  return (
    <article className="mx-auto max-w-[1180px] px-4 pb-24 pt-8 md:px-10 md:pt-12">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        {/* Chapter bar: desktop only, chalked on the birch frame from /about and sticky beside the
            whole page. The chip on its corner closes the case study back to /works. */}
        <nav aria-label="Chapters" className="relative z-10 hidden lg:block">
          <div className="cs-frame sticky top-10">
            <img src="/about/frame.webp" alt="" width={722} height={923} draggable={false} />
            <a href="/works" aria-label="Back to selected works" className="cs-close">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <ol className="cs-chalk">
              {s.chapters.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={c.id === active ? 'location' : undefined}>
                    <span className="tabular-nums">{num(i)}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* Everything sits above the backdrop, which fades the grid paper out under the column. */}
        <div className="relative max-w-[720px] [&>*:not(.cs-backdrop)]:relative">
          <div className="cs-backdrop" aria-hidden="true" />
          <header>
            {s.coldOpen && (
              <p className="mb-8 max-w-[560px] font-mono text-[13px] leading-[1.7] text-ink-muted [text-wrap:pretty]">
                {s.coldOpen.text}
              </p>
            )}
            <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.01em] md:text-[56px]">{s.title}</h1>
            <p className="mt-4 font-display text-[20px] leading-[1.35] text-ink-body [text-wrap:balance] md:text-[24px]">{s.hook}</p>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 font-mono text-[13px] leading-[1.6] sm:grid-cols-2">
              {s.meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-ink-faint">{m.label}</dt>
                  <dd className="text-ink-primary">{m.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-10">
            <VisualBlock v={s.hero} />
          </div>

          <StatStrip stats={s.stats} />

          {s.chapters.map((c, i) => (
            <section key={c.id} id={c.id} className="mt-16 scroll-mt-10 md:mt-20">
              <h2 className="flex items-baseline gap-3 font-display text-[24px] font-medium leading-[1.2] md:text-[28px]">
                <span className="font-mono text-[13px] font-normal tabular-nums text-ink-faint">{num(i)}</span>
                {c.title}
              </h2>
              <div className="mt-5 flex flex-col gap-5">
                {c.blocks.map((b, j) => (
                  <BlockView key={j} b={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}

function StatStrip({ stats }: { stats: CaseStudy['stats'] }) {
  const notes = stats.filter((st) => st.note)
  return (
    <div className="mt-10">
      <dl className="grid grid-cols-3 border-y border-hairline">
        {stats.map((st, i) => (
          <div key={st.label} className={`py-5 ${i > 0 ? 'border-l border-hairline pl-4 md:pl-6' : ''}`}>
            <dt className="sr-only">{st.label}</dt>
            <dd>
              <span className="block font-display text-[32px] font-semibold leading-none text-ink-primary md:text-[44px]">
                {st.value}
                {st.note && <sup className="ml-0.5 font-mono text-[13px] font-normal text-ink-faint">*</sup>}
              </span>
              <span className="mt-2 block font-mono text-[12px] leading-[1.4] text-ink-body md:text-[13px]">{st.label}</span>
            </dd>
          </div>
        ))}
      </dl>
      {notes.map((st) => (
        <p key={st.label} className="mt-3 font-mono text-[12px] leading-[1.6] text-ink-faint">
          * {st.note}
        </p>
      ))}
    </div>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return <p className="font-mono text-[15px] leading-[1.75] text-ink-body [text-wrap:pretty]">{b.text}</p>
    case 'owned':
      return (
        <ol className="flex flex-col gap-3 font-mono text-[15px] leading-[1.6] text-ink-body">
          {b.items.map((item, i) => (
            <li key={i} className="flex gap-4">
              <span className="tabular-nums text-ink-faint">{num(i)}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'scene':
      return (
        <div>
          <h3 className="font-mono! text-[13px] font-normal text-ink-primary">{b.slug}</h3>
          <p className="mt-1.5 font-mono text-[15px] leading-[1.75] text-ink-body [text-wrap:pretty]">{b.text}</p>
        </div>
      )
    case 'quote':
      return (
        <figure className="my-2 border-l-2 border-ink-primary pl-5">
          <blockquote className="font-display text-[20px] leading-[1.4] text-ink-primary [text-wrap:pretty] md:text-[22px]">
            “{b.text}”
          </blockquote>
          {b.cite && <figcaption className="mt-2 font-mono text-[12px] text-ink-faint">{b.cite}</figcaption>}
        </figure>
      )
    case 'visual':
      return (
        <div className="mt-3">
          <VisualBlock v={b.visual} />
        </div>
      )
  }
}

function VisualBlock({ v }: { v: Visual }) {
  return (
    <figure>
      {v.src ? (
        <div className="overflow-hidden rounded-[14px] border border-hairline bg-white" style={{ aspectRatio: v.aspect ?? '16 / 10' }}>
          {/* A plain <picture>, not next/image: the optimizer would flatten animated WebPs. */}
          <picture>
            {v.still && <source media="(prefers-reduced-motion: reduce)" srcSet={v.still} />}
            <img src={v.src} alt={v.alt ?? ''} draggable={false} className="block h-full w-full object-cover" />
          </picture>
        </div>
      ) : (
        <div
          className="cs-placeholder flex items-center justify-center rounded-[14px] border border-dashed border-chip-line p-6 text-center font-mono text-[12px] leading-[1.6] text-ink-muted"
          style={{ aspectRatio: v.aspect ?? '16 / 10' }}
        >
          <span className="max-w-[420px]">visual: {v.label}</span>
        </div>
      )}
      {v.caption && <figcaption className="mt-3 font-mono text-[12px] leading-[1.6] text-ink-faint">{v.caption}</figcaption>}
    </figure>
  )
}

// The chapter whose top has most recently crossed a line 30% down the viewport.
function useActiveChapter(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const onScroll = () => {
      const line = window.innerHeight * 0.3
      let current = ids[0]
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids.join()]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}
