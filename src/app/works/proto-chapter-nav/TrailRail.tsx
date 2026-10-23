'use client'
// Trail rail: once the chapters start, a slim bar holds the top with every chapter in a sideways
// row (the current one inked and kept in view) and a hairline that fills as you read.
// Axis: always visible, the whole map at a glance.
import { useEffect, useRef } from 'react'
import { CHAPTERS, goTo, useActive, usePast } from './shared'

const firstChapter = () => document.getElementById(CHAPTERS[0].id)

export default function TrailRail() {
  const active = useActive()
  const shown = usePast(firstChapter, 80)
  const row = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  // Keep the inked chip in view without scrolling the page.
  useEffect(() => {
    const r = row.current
    const el = r?.querySelector<HTMLElement>('[aria-current]')
    if (!r || !el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    r.scrollTo({ left: el.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' })
  }, [active])

  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement
      const p = Math.min(1, Math.max(0, d.scrollTop / (d.scrollHeight - innerHeight)))
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav aria-label="Chapters" inert={!shown} data-shown={shown ? '' : undefined} className="pn-rail lg:hidden">
      <ol ref={row} className="pn-rail-row">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={c.id === active ? 'location' : undefined} onClick={(e) => { e.preventDefault(); goTo(c.id) }}>
              {c.num && <span className="tabular-nums opacity-60">{c.num}</span>}
              <span>{c.title}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="pn-rail-track" aria-hidden="true"><div ref={bar} className="pn-rail-fill" /></div>
    </nav>
  )
}
