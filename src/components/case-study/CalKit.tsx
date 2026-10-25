'use client'

// Cal's kit (chapter 6), from Kai's Paper layout (Portfolio Brainstorm › v3 › Cal Kit), stacked to
// fit the column: personas, type specimen, expressions, props, palette, then where Cal went outside
// the quiz. The specimen and palette are live text and color, not images, so they stay sharp; they
// are the only place Tallo's fonts appear outside the art.
import type { CSSProperties } from 'react'
import { Adamina, Hubballi, Inter } from 'next/font/google'
import type { Kit } from './types'
import YouTube from './YouTube'
import './step-frame.css'

const adamina = Adamina({ weight: '400', subsets: ['latin'], display: 'swap' })
const hubballi = Hubballi({ weight: '400', subsets: ['latin'], display: 'swap' })
const inter = Inter({ subsets: ['latin'], display: 'swap' })

// Sizes from the Paper layout (1352px wide) scaled to the column, a step smaller on phones.
const FACE = {
  adamina: { font: adamina, size: 'text-[30px] md:text-[42px]', leading: 1.1 },
  hubballi: { font: hubballi, size: 'text-[19px] md:text-[23px]', leading: 1.3 },
  inter: { font: inter, size: 'text-[15px] md:text-[17px]', leading: 1.6 },
} as const

const CAPS = 'font-mono font-semibold uppercase tracking-[0.08em] text-ink-primary'
const LABEL = `${CAPS} text-[12px]`
const NOTE = 'font-mono text-[12px] leading-[1.5] text-ink-faint'
const PANEL = 'rounded-[14px] bg-tag/55'

// Every Cal (personas and expressions) is cut to one canvas with the dial the same width and the
// feet on one baseline (kit-build/normalize_cal.py in the sprint folder), and drawn at one width:
// 104px on phones, 120px from md, the narrowest cell in either grid. So Cal is the same size
// wherever Cal appears in the kit. Chapter 4's rule cards use the same, so Cal matches there too.
export const CAL = 'mx-auto block w-full max-w-[104px] mix-blend-multiply md:max-w-[120px]'
export const CAL_ASPECT = '200 / 196'

const grid = (base: number, md: number) => ({ '--cols': base, '--cols-md': md }) as CSSProperties

export default function CalKit({ kit }: { kit: Kit }) {
  return (
    <div className="mt-2 flex flex-col gap-12 md:gap-14">
      <div>
        <p className={LABEL}>{kit.label}</p>
        <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-body">{kit.intro}</p>
        <ul className={`mt-5 cs-tiles grid gap-x-2 gap-y-6 px-3 py-6 md:px-5 md:py-7 ${PANEL}`} style={grid(3, 6)}>
          {kit.personas.map((p) => (
            <li key={p.name} className="flex flex-col items-center text-center">
              <img src={p.src} alt={p.alt} draggable={false} className={CAL} style={{ aspectRatio: CAL_ASPECT }} />
              {/* No tracking on phones, so the longest names (THE RESEARCHER, THE ORGANIZER) stay on one line at 12px. */}
              <p className={`mt-3 ${CAPS} text-[12px] max-md:tracking-normal`}>{p.name}</p>
              <p className="mt-1 font-mono text-[12px] text-ink-muted">{p.type}</p>
            </li>
          ))}
        </ul>
      </div>

      <dl className="border-t border-hairline">
        {kit.specimen.map((row, i) => {
          const f = FACE[row.face]
          return (
            <div key={i} className="grid grid-cols-[36px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-hairline py-3 md:grid-cols-[40px_minmax(0,1fr)_160px] md:gap-x-4">
              <dt className={`${NOTE} tabular-nums`}>{row.scale}</dt>
              <dd className={`${f.font.className} ${f.size} text-[#201F1F] [text-wrap:pretty]`} style={{ lineHeight: f.leading }}>
                {row.text}
              </dd>
              <dd className={`col-start-2 mt-1 ${NOTE} md:col-start-3 md:mt-0`}>{row.note}</dd>
            </div>
          )
        })}
      </dl>

      <section aria-label="Expressions">
        <Head label="Expressions" note={kit.expressionsNote} />
        <ul className="mt-4 cs-tiles grid gap-x-2 gap-y-5" style={grid(3, 6)}>
          {kit.expressions.map((e) => (
            <li key={e.name} className="flex flex-col items-center">
              <img src={e.src} alt={`Cal, ${e.name}`} draggable={false} className={CAL} style={{ aspectRatio: CAL_ASPECT }} />
              <p className="mt-2 font-mono text-[12px] text-ink-muted">{e.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Props">
        <Head label="Props" note={kit.propsNote} />
        <ul className={`mt-4 cs-tiles grid gap-2 p-4 md:p-6 ${PANEL}`} style={grid(4, 6)}>
          {kit.props.map((p) => (
            <li key={p.name}>
              <img src={p.src} alt={p.name} draggable={false} className="mx-auto block w-full max-w-[100px] mix-blend-multiply" style={{ aspectRatio: '1 / 1' }} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Palette">
        <Head label="Palette" note={kit.paletteNote} />
        <ul className="mt-4 cs-tiles grid gap-2 md:gap-3" style={grid(3, 6)}>
          {kit.palette.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-[10px] border border-hairline bg-white">
              <div className="h-14 md:h-16" style={{ backgroundColor: c.hex }} />
              <div className="flex items-baseline justify-between gap-2 px-2.5 py-2">
                <span className={`${CAPS} text-[12px]`}>{c.name}</span>
                <span className="font-mono text-[12px] uppercase text-ink-faint">{c.hex}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="In use">
        <Head label="In use" note={kit.inUse.note} />
        {/* Side by side from md, sized so both stand the same height: each column's share is
            its piece's aspect ratio. */}
        <div
          className="mt-4 grid gap-3 md:[grid-template-columns:var(--kit-cols)]"
          style={{ '--kit-cols': `${kit.inUse.image.width / kit.inUse.image.height}fr ${9 / 16}fr` } as CSSProperties}
        >
          <img
            src={kit.inUse.image.src}
            alt={kit.inUse.image.alt}
            draggable={false}
            className="block w-full rounded-[10px] border border-hairline"
            style={{ aspectRatio: `${kit.inUse.image.width} / ${kit.inUse.image.height}` }}
          />
          <YouTube
            {...kit.inUse.video}
            chip="Watch the build"
            className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-[10px] bg-[#211e1a] md:max-w-none"
          />
        </div>
      </section>
    </div>
  )
}

function Head({ label, note }: { label: string; note?: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-hairline pt-3 md:flex-row md:items-baseline md:justify-between md:gap-6">
      <p className={LABEL}>{label}</p>
      {note && <p className={`${NOTE} md:text-right [text-wrap:pretty]`}>{note}</p>}
    </div>
  )
}
