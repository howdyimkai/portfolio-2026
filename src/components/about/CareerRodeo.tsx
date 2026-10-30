'use client'

// The cowboy hat on the About shelf and the sheet it opens: my career rodeo ("Reel", picked from
// /proto/career-rodeo 2026-10-30; design-intent/career-rodeo-exploration/NOTES.md). The sheet is the
// résumé's paper (ResumeBookmark), with the same scrim, under-sheet, motion and dialog rules.
import { useCallback, useEffect, useRef, useState } from 'react'
import RodeoTrail from './RodeoTrail'
import { RODEO_HAT } from './data'
import '@/components/resume/resume.css'
import './rodeo.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// The shelf's "what I'm into" label with the hat under it, on the top shelf. The hat is a shelf
// object like the others: same hover rules (mouse hover or keyboard focus, never a tap).
export function RodeoHat({ open, onOpen, trigger }: { open: boolean; onOpen: () => void; trigger: React.RefObject<HTMLButtonElement | null> }) {
  const [on, setOn] = useState(false)
  const h = 40
  return (
    <div className="rodeo-lead">
      <p className="font-mono text-[11px] leading-[1.4] text-ink-muted">what I&apos;m into right now. pick anything up</p>
      <button
        ref={trigger}
        type="button"
        className="about-obj"
        data-hover="hop"
        data-on={on ? '' : undefined}
        data-active={open ? '' : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(true)}
        onPointerLeave={() => setOn(false)}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOn(true)}
        onBlur={() => setOn(false)}
        aria-label="Open my career rodeo"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={onOpen}
        style={{ ['--w' as string]: (h * RODEO_HAT.w) / RODEO_HAT.h, ['--h' as string]: h, ['--lift' as string]: 0 }}
      >
        <span className="about-light" aria-hidden="true" />
        <span className="about-contact" aria-hidden="true" />
        <span className="about-art">
          {/* STANDIN: the shelf nav's hat. Kai's About shelf hat drops in 1:1. */}
          <img src={RODEO_HAT.src} alt="" width={RODEO_HAT.w} height={RODEO_HAT.h} draggable={false} />
        </span>
      </button>
    </div>
  )
}

export function useCareerRodeo() {
  const [open, setOpen] = useState(false)
  const [round, setRound] = useState(0) // re-mounts the trail, so every open starts at the hat
  const trigger = useRef<HTMLButtonElement>(null)
  const openSheet = useCallback(() => {
    setRound((r) => r + 1)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  return { open, round, trigger, openSheet, close }
}

export function RodeoSheet({
  open,
  round,
  close,
  trigger,
}: {
  open: boolean
  round: number
  close: () => void
  trigger: React.RefObject<HTMLButtonElement | null>
}) {
  const sheet = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)

  // The résumé sheet's dialog code: locks the page, Escape closes, Tab stays in the sheet, focus goes
  // in and comes back. iOS Safari ignores overflow: hidden for touch scrolling, so the body is pinned
  // at its scroll offset instead and put back on close.
  useEffect(() => {
    if (!open) return
    if (scroll.current) scroll.current.scrollTop = 0
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
  }, [open, close, trigger])

  return (
    <div className="rb-root">
      <div className="rs-scrim" data-open={open ? '' : undefined} onClick={close} aria-hidden="true" />
      <div className="rs-under" data-open={open ? '' : undefined} aria-hidden="true" />
      <div ref={sheet} role="dialog" aria-modal="true" aria-label="My career rodeo" className="rs-sheet" data-open={open ? '' : undefined} inert={!open}>
        <button type="button" className="rs-close" aria-label="Close my career rodeo" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div ref={scroll} className="rs-scroll rodeo-scroll">
          <RodeoTrail key={round} scroller={scroll} />
        </div>
      </div>
    </div>
  )
}
