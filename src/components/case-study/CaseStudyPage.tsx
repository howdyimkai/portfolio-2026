'use client'

// The one case study template (sprint plan, 2026-10-20): header, hero, a stat strip of three,
// then chapters with a chapter bar on the left. Everything is driven by a CaseStudy in src/content/.
// Backdrop and chapter bar: design-intent/case-study-exploration/NOTES.md (2026-10-20).
import { useEffect, useState, type CSSProperties } from 'react'
import BrowserFrame from './BrowserFrame'
import CalKit, { CAL, CAL_ASPECT } from './CalKit'
import StepFrame from './StepFrame'
import Strip from './Strip'
import Toggle from './Toggle'
import type { Block, CaseStudy, Visual } from './types'
import './case-study.css'

const num = (i: number) => String(i + 1).padStart(2, '0')

// Reading text caps at ~62 characters a line (mono reads dense past that); visuals, the stat strip
// and charts use the full column. Body text is fluid, 16px on phones to 18px on large screens
// (.cs-body), and the ch cap grows with it, so a line stays ~62 characters at every size.
const PROSE = 'max-w-[62ch]'
const BODY = 'cs-body font-mono text-ink-body [text-wrap:pretty]'

export default function CaseStudyPage({ study: s }: { study: CaseStudy }) {
  const active = useActiveChapter(s.chapters.map((c) => c.id))
  // Chapter numbers skip unnumbered chapters, so a TL;DR can sit ahead of chapter 01.
  let n = 0
  const labels = s.chapters.map((c) => (c.unnumbered ? '' : num(n++)))

  return (
    <article className="mx-auto max-w-[1280px] px-4 pb-32 pt-12 md:px-10 md:pt-24">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        {/* Chapter bar: desktop only, chalked on the birch frame from /about and sticky beside the
            whole page. The chip on its corner closes the case study back to /works. */}
        <nav aria-label="Chapters" className="relative z-10 hidden lg:block">
          <div className="cs-frame sticky top-10">
            <a href="/works" aria-label="Back to selected works" className="cs-close">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
            <ol className="cs-chalk">
              {/* Says in words what the X chip does; hovering either lights up both. */}
              <li>
                <a href="/works" className="cs-chalk-back">Back to More Work</a>
              </li>
              <li className="cs-chalk-rule" aria-hidden="true" />
              {s.chapters.map((c, i) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={c.id === active ? 'location' : undefined}>
                    {/* An unnumbered chapter (the TL;DR) counts as 00 on the bar, but stays unnumbered on the page. */}
                    <span className="tabular-nums">{labels[i] || '00'}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
              <li className="cs-chalk-rule" aria-hidden="true" />
              <li>
                <a href="#">
                  <span className="invisible tabular-nums" aria-hidden="true">00</span>
                  <span>Back to Top</span>
                </a>
              </li>
            </ol>
          </div>
        </nav>

        {/* Everything sits above the backdrop, which fades the grid paper out under the column. */}
        <div className="relative max-w-[880px] [&>*:not(.cs-backdrop)]:relative">
          <div className="cs-backdrop" aria-hidden="true" />
          <header>
            {s.coldOpen && (
              <p className={`mb-12 ${PROSE} font-mono text-[13px] leading-[1.7] text-ink-muted [text-wrap:pretty]`}>
                {s.coldOpen.text}
              </p>
            )}
            {s.eyebrow && <p className="mb-3 font-mono text-[12px] text-ink-faint">{s.eyebrow}</p>}
            <h1 className="font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.015em] md:text-[68px]">{s.title}</h1>
            <p className="mt-5 max-w-[640px] font-display text-[20px] leading-[1.35] text-ink-body [text-wrap:balance] md:text-[26px]">{s.hook}</p>
            <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 border-t border-hairline pt-6 font-mono text-[13px] leading-[1.6] sm:grid-cols-2">
              {s.meta.map((m) => (
                <div key={m.label}>
                  <dt className="mb-1 text-[12px] text-ink-faint">{m.label}</dt>
                  <dd className="text-ink-primary [text-wrap:pretty]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-16">
            <VisualBlock v={s.hero} />
          </div>

          <StatStrip stats={s.stats} />
          {s.quote && (
            <div className="mt-12">
              <BlockView b={{ kind: 'quote', ...s.quote }} />
            </div>
          )}

          {s.chapters.map((c, i) => (
            <section key={c.id} id={c.id} className="mt-[77px] scroll-mt-12 md:mt-[104px]">
              {/* Chapter number as a quiet label above, so the title alone carries the weight. */}
              {labels[i] && <p className="mb-2 font-mono text-[13px] tabular-nums text-ink-faint">{labels[i]}</p>}
              <h2 className="font-display text-[28px] font-medium leading-[1.15] tracking-[-0.01em] md:text-[36px]">{c.title}</h2>
              <div className="mt-7 flex flex-col gap-7">
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
    <div className="mt-14">
      <dl className="grid grid-cols-3 border-y border-hairline">
        {stats.map((st, i) => (
          <div key={st.label} className={`py-6 md:py-8 ${i > 0 ? 'border-l border-hairline pl-4 md:pl-8' : ''}`}>
            <dt className="sr-only">{st.label}</dt>
            <dd>
              <span className="block font-display text-[32px] font-semibold leading-none tracking-[-0.01em] text-ink-primary md:text-[52px]">
                {st.value}
                {st.note && <span className="ml-1 align-top font-mono text-[13px] font-normal text-ink-faint">*</span>}
              </span>
              <span className="mt-3 block font-mono text-[12px] leading-[1.45] text-ink-body [text-wrap:balance] md:text-[13px]">{st.label}</span>
            </dd>
          </div>
        ))}
      </dl>
      {notes.map((st) => (
        <p key={st.label} className={`mt-4 ${PROSE} font-mono text-[12px] leading-[1.6] text-ink-faint`}>
          * {st.note}
        </p>
      ))}
    </div>
  )
}

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case 'p':
      return <p className={`${PROSE} ${BODY}`}>{b.text}</p>
    case 'owned':
      return (
        <ol className={`${PROSE} cs-body flex flex-col gap-4 font-mono text-ink-body`}>
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
        <div className={PROSE}>
          <h3 className="font-mono! text-[13px] font-normal text-ink-primary">{b.slug}</h3>
          <p className={`mt-2 ${BODY}`}>{b.text}</p>
        </div>
      )
    case 'quote':
      return (
        <figure className={`my-3 ${PROSE} border-l-2 border-ink-primary pl-6`}>
          <blockquote className="font-display text-[20px] leading-[1.4] text-ink-primary [text-wrap:pretty] md:text-[22px]">
            “{b.text}”
          </blockquote>
          {b.cite && <figcaption className="mt-2 font-mono text-[12px] text-ink-faint">{b.cite}</figcaption>}
        </figure>
      )
    case 'callout':
      return (
        <p className="my-2 border-y border-hairline py-7 font-display text-[23px] leading-[1.3] tracking-[-0.005em] text-ink-primary [text-wrap:balance] md:py-8 md:text-[30px]">
          {b.label && <span className="mb-2 block font-mono text-[12px] text-ink-faint">{b.label}</span>}
          {b.text}
        </p>
      )
    case 'rules':
      if (b.items.some((r) => r.pose))
        return (
          <ul className="flex flex-col gap-3">
            {b.items.map((r, i) => (
              <li key={i} className="grid grid-cols-1 gap-3 rounded-[14px] bg-tag/55 p-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-7 sm:p-5">
                {/* On phones the pose sits above the rule, so the text keeps the card's full width. */}
                {r.pose ? <img src={r.pose.src} alt={r.pose.alt} draggable={false} className={`${CAL} ml-0 sm:mx-auto`} style={{ aspectRatio: CAL_ASPECT }} /> : <span />}
                <p className={`${PROSE} cs-body font-mono text-ink-body [text-wrap:pretty]`}>
                  <span className="block font-semibold text-ink-primary">{r.title}</span>
                  <span className="mt-1 block">{r.text}</span>
                </p>
              </li>
            ))}
          </ul>
        )
      return (
        <ul className={`${PROSE} cs-body flex flex-col gap-5 font-mono text-ink-body [text-wrap:pretty]`}>
          {b.items.map((r, i) => (
            <li key={i} className="border-l border-hairline pl-5">
              <span className="block font-semibold text-ink-primary">{r.title}</span>
              <span className="mt-1 block">{r.text}</span>
            </li>
          ))}
        </ul>
      )
    case 'cards':
      return (
        <ul className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {b.items.map((item, i) => (
            <li key={i} className="flex flex-col gap-4">
              <VisualBlock v={{ aspect: '1 / 1', ...item.visual }} />
              <p className="font-mono text-[14px] leading-[1.5] text-ink-primary [text-wrap:pretty]">{item.text}</p>
            </li>
          ))}
        </ul>
      )
    case 'quotes':
      return (
        <ul className={`my-2 ${PROSE} flex flex-col gap-7 border-l-2 border-ink-primary pl-6`}>
          {b.items.map((q, i) => (
            <li key={i}>
              <figure>
                <blockquote className="font-display text-[19px] leading-[1.4] text-ink-primary [text-wrap:pretty] md:text-[20px]">“{q.text}”</blockquote>
                {q.cite && <figcaption className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-faint">{q.cite}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      )
    case 'funnel':
      return <Funnel steps={b.steps} caption={b.caption} />
    case 'kit':
      return <CalKit kit={b.kit} />
    case 'visual':
      return (
        <div className="mt-2">
          <VisualBlock v={b.visual} />
        </div>
      )
  }
}

function VisualBlock({ v }: { v: Visual }) {
  return (
    <figure>
      {v.flow ? (
        <StepFrame flow={v.flow} />
      ) : v.pair ? (
        <Pair items={v.pair} />
      ) : v.browsers ? (
        <Browsers items={v.browsers} aspect={v.aspect ?? '16 / 9'} cols={v.cols ?? [1, 2]} />
      ) : v.strip ? (
        <Strip items={v.strip} aspect={v.aspect ?? '1 / 1'} cols={v.cols ?? [v.strip.length, v.strip.length]} look={v.frame === 'screen' || v.frame === 'device' ? v.frame : 'art'} />
      ) : v.compare ? (
        <Toggle views={v.compare} aspect={v.aspect ?? '16 / 10'} framed={v.frame === 'browser'} />
      ) : v.src ? (
        <div className="overflow-hidden rounded-[14px] border border-hairline bg-white" style={{ aspectRatio: v.aspect ?? '16 / 10' }}>
          {/* A plain <picture>, not next/image: the optimizer would flatten animated WebPs. */}
          <picture>
            {v.still && <source media="(prefers-reduced-motion: reduce)" srcSet={v.still} />}
            <img src={v.src} alt={v.alt ?? ''} draggable={false} className="block h-full w-full object-cover" />
          </picture>
        </div>
      ) : (
        <Placeholder v={v} />
      )}
      {v.caption && <figcaption className="mt-4 font-mono text-[12px] leading-[1.6] text-ink-faint">{v.caption}</figcaption>}
    </figure>
  )
}

// Pieces side by side at one height from sm up (each column's share is its image's aspect ratio),
// stacked on phones with a device kept to phone width.
function Pair({ items }: { items: NonNullable<Visual['pair']> }) {
  const cols = items.map((it) => `${it.width / it.height}fr`).join(' ')
  return (
    <ul className="grid gap-x-5 gap-y-8 sm:[grid-template-columns:var(--pair-cols)]" style={{ '--pair-cols': cols } as CSSProperties}>
      {items.map((it) => (
        <li key={it.src} className="min-w-0">
          <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-primary">{it.label}</p>
          <img
            src={it.src}
            alt={it.alt}
            draggable={false}
            loading="lazy"
            className={`block w-full ${it.look === 'card' ? 'rounded-[12px] border border-hairline' : 'max-w-[260px] sm:max-w-none'}`}
            style={{ aspectRatio: `${it.width} / ${it.height}` }}
          />
          {it.credit && <p className="mt-2.5 font-mono text-[12px] leading-[1.5] text-ink-faint [text-wrap:pretty]">{it.credit}</p>}
        </li>
      ))}
    </ul>
  )
}

// Captures in browser frames, a label over each and a caption under, in a grid.
function Browsers({ items, aspect, cols }: { items: NonNullable<Visual['browsers']>; aspect: string; cols: [number, number] }) {
  return (
    <ol className="cs-tiles grid items-start gap-x-5 gap-y-9 md:gap-y-10" style={{ '--cols': cols[0], '--cols-md': cols[1] } as CSSProperties}>
      {items.map((it) => (
        <li key={it.src}>
          <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-primary">{it.label}</p>
          <BrowserFrame>
            <img src={it.src} alt={it.alt} draggable={false} loading="lazy" className="block w-full" style={{ aspectRatio: aspect }} />
          </BrowserFrame>
          <p className="mt-3 font-mono text-[13px] leading-[1.55] text-ink-body [text-wrap:pretty]">{it.caption}</p>
          {it.note && <p className="mt-1.5 font-mono text-[12px] leading-[1.5] text-ink-faint [text-wrap:pretty]">{it.note}</p>}
          {it.link && (
            <a href={it.link.href} target="_blank" rel="noopener noreferrer" className="sf-link press-scale mt-2 inline-block font-mono text-[12px] text-ink-primary">
              {it.link.label} <span aria-hidden="true">↗</span>
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}

// A visual that isn't made yet, shaped roughly like the planned one. data-placeholder carries the
// label, so every slot left on a page can be found with [data-placeholder].
function Placeholder({ v }: { v: Visual }) {
  const slot = 'cs-placeholder flex items-center justify-center rounded-[14px] border border-dashed border-chip-line p-4 text-center font-mono text-[12px] leading-[1.6] text-ink-muted'
  if (!v.tiles) {
    return (
      <div data-placeholder={v.label} className={`${slot} relative overflow-hidden ${v.frame === 'browser' ? 'pt-12' : ''}`} style={{ aspectRatio: v.aspect ?? '16 / 10' }}>
        {v.frame === 'browser' && (
          <span className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 border-b border-dashed border-chip-line bg-white/70 px-3" aria-hidden="true">
            {[0, 1, 2].map((d) => (
              <span key={d} className="size-2 rounded-full bg-chip-line" />
            ))}
          </span>
        )}
        <span className="max-w-[420px]">visual: {v.label}</span>
      </div>
    )
  }
  const [base, md] = v.cols ?? [v.tiles.length, v.tiles.length]
  return (
    <div data-placeholder={v.label}>
      <p className="mb-3 font-mono text-[12px] leading-[1.6] text-ink-muted">visual: {v.label}</p>
      <div className="cs-tiles grid items-start gap-3 md:gap-4" style={{ '--cols': base, '--cols-md': md } as CSSProperties}>
        {v.tiles.map((t, i) => (
          <div key={i} className={slot} style={{ aspectRatio: t.aspect }}>
            {t.label && <span>{t.label}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// Each step's bar is its share of the first step, with the count and the share labeled on every
// row (four values, so labels replace a hover layer). One series, so no legend.
function Funnel({ steps, caption }: { steps: { label: string; share: number; value?: string }[]; caption?: string }) {
  return (
    <figure className="mt-2">
      <ol className="flex flex-col gap-6">
        {steps.map((st) => (
          <li key={st.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-[13px] leading-[1.4] text-ink-body">{st.label}</span>
              <span className="font-display text-[20px] font-semibold leading-none tabular-nums text-ink-primary md:text-[24px]">
                {st.value ?? `${st.share}%`}
              </span>
            </div>
            {/* The track is the whole 100%, so each bar reads as a share of everyone who started. */}
            <div className="mt-2.5 h-3 rounded-full bg-tag" aria-hidden="true">
              <div className="h-full rounded-full bg-ink-primary" style={{ width: `${st.share}%` }} />
            </div>
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-5 font-mono text-[12px] leading-[1.6] text-ink-faint">{caption}</figcaption>}
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
