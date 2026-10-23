'use client'

// Chapters below lg, where the chalk frame doesn't fit beside the page: a small chalkboard chip
// rides the bottom once the chapters start, naming where you are, and opens the same frame as a
// sheet. Picked from /works/proto-chapter-nav (Sheet, 2026-10-23); see
// design-intent/nav-exploration/NOTES.md.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Chapter = { id: string; title: string }

export default function ChapterSheet({ chapters, labels, active }: { chapters: Chapter[]; labels: string[]; active: string }) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const chip = useRef<HTMLButtonElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const i = Math.max(0, chapters.findIndex((c) => c.id === active))

  // The chip waits until the first chapter is well up the screen, so it never sits on the intro.
  useEffect(() => {
    const first = document.getElementById(chapters[0].id)
    const onScroll = () => setShown(!!first && first.getBoundingClientRect().top < 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [chapters])

  useEffect(() => {
    if (!open) return
    sheet.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function close(to?: string) {
    setOpen(false)
    const el = to && document.getElementById(to)
    if (!el) return chip.current?.focus()
    // The section's scroll-margin keeps its label clear of the phone bar.
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${to}`)
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
        className="cs-chip"
      >
        <span className="tabular-nums opacity-60">{labels[i] || '00'}</span>
        <span>{chapters[i].title}</span>
        <svg viewBox="0 0 12 12" aria-hidden="true" className="ml-1 size-3"><path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
        <span className="sr-only">, open chapters</span>
      </button>

      <div className="cs-scrim" data-open={open ? '' : undefined} onClick={() => close()} aria-hidden="true" />
      <div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Chapters" inert={!open} data-open={open ? '' : undefined} className="cs-sheet">
        <div className="cs-frame cs-sheet-frame">
          <ol className="cs-chalk cs-chalk-roomy">
            <li><Link href="/works" className="cs-chalk-back">Back to More Work</Link></li>
            <li className="cs-chalk-rule" aria-hidden="true" />
            {chapters.map((c, j) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={c.id === active ? 'location' : undefined} onClick={(e) => { e.preventDefault(); close(c.id) }}>
                  <span className="tabular-nums">{labels[j] || '00'}</span>
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
