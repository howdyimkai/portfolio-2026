'use client'
// Chalk sheet: a small chalkboard chip rides the bottom once the chapters start, naming where you
// are. Tap it and the desktop's chalk frame slides up as a sheet. Axis: on demand, the desktop object.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CHAPTERS, goTo, useActive, usePast } from './shared'

const firstChapter = () => document.getElementById(CHAPTERS[0].id)

export default function ChalkSheet() {
  const active = useActive()
  const shown = usePast(firstChapter, 480)
  const [open, setOpen] = useState(false)
  const chip = useRef<HTMLButtonElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const cur = CHAPTERS.find((c) => c.id === active)!

  useEffect(() => {
    if (!open) return
    sheet.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function close(to?: string) {
    setOpen(false)
    if (to) goTo(to)
    else chip.current?.focus()
  }

  return (
    <div className="lg:hidden">
      <button
        ref={chip}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        inert={!shown || open}
        data-shown={shown && !open ? '' : undefined}
        onClick={() => setOpen(true)}
        className="pn-chip"
      >
        <span className="tabular-nums opacity-60">{cur.num || '··'}</span>
        <span>{cur.title}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true" className="ml-1 size-3"><path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
        <span className="sr-only">, open chapters</span>
      </button>

      <div className="pn-scrim" data-open={open ? '' : undefined} onClick={() => close()} aria-hidden="true" />
      <div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Chapters" inert={!open} data-open={open ? '' : undefined} className="pn-sheet">
        <div className="cs-frame pn-sheet-frame">
          <ol className="cs-chalk pn-chalk">
            <li><Link href="/works" className="cs-chalk-back">Back to More Work</Link></li>
            <li className="cs-chalk-rule" aria-hidden="true" />
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={c.id === active ? 'location' : undefined} onClick={(e) => { e.preventDefault(); close(c.id) }}>
                  <span className="tabular-nums">{c.num || '··'}</span>
                  <span>{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
