'use client'

// The résumé bookmark: a felt ribbon hanging from the top edge, right of the shelf, that opens the
// résumé on paper over the current page (no navigation, so closing leaves you where you were).
// Picked from /proto/resume-bookmark (Tug, 2026-10-27); decision record in
// design-intent/resume-bookmark-exploration/NOTES.md.
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Resume from './Resume'
import { play } from '@/lib/sfx'
import './resume.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ResumeBookmark() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const close = useCallback(() => setOpen(false), [])

  // Locks the page behind it, Escape closes, Tab stays in the sheet, focus goes in and comes back.
  // iOS Safari ignores overflow: hidden for touch scrolling, so the body is pinned at its scroll
  // offset instead and put back on close (same as PhoneMenu's overlay).
  useEffect(() => {
    if (!open) return
    sheet.current?.querySelector<HTMLElement>('.rs-close')?.focus({ preventScroll: true })
    const body = document.body
    const y = window.scrollY
    const prev = body.style.cssText
    body.style.cssText += `;position:fixed;top:${-y}px;left:0;right:0;overflow:hidden`
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab' || !sheet.current) return
      const els = [...sheet.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      body.style.cssText = prev
      window.scrollTo({ top: y, behavior: 'instant' })
      document.removeEventListener('keydown', onKey)
      trigger.current?.focus({ preventScroll: true })
    }
  }, [open, close])

  return (
    <div className="rb-root">
      {/* STANDIN: the three felt pieces are SVG stand-ins (public/resume-bookmark/*-standin.svg);
          Kai's Paper art drops in 1:1 as 2x WebP, drawn at the 80px maximum width,
          with the tail 40/56 as tall as it is wide. */}
      <button
        ref={trigger}
        type="button"
        className="rb"
        aria-label="Open résumé"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          void play('bookmark')
          setOpen(true)
        }}
      >
        <span className="rb-hang">
          <img className="rb-body" src="/resume-bookmark/ribbon-body-standin.svg" alt="" draggable={false} />
          {/* STANDIN label: Kai may letter this on the felt instead. */}
          <span className="rb-label" aria-hidden="true">résumé</span>
          <span className="rb-tail">
            <span className="rb-flip">
              <img className="rb-front" src="/resume-bookmark/ribbon-tail-front-standin.svg" alt="" draggable={false} />
              <img className="rb-back" src="/resume-bookmark/ribbon-tail-back-standin.svg" alt="" draggable={false} />
            </span>
          </span>
        </span>
      </button>

      <div className="rs-scrim" data-open={open ? '' : undefined} onClick={close} aria-hidden="true" />
      <div className="rs-under" data-open={open ? '' : undefined} aria-hidden="true" />
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="rs-sheet"
        data-open={open ? '' : undefined}
        inert={!open}
      >
        <button type="button" className="rs-close" aria-label="Close résumé" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div className="rs-scroll">
          <Resume titleId={titleId} online page={false} />
        </div>
      </div>
    </div>
  )
}
