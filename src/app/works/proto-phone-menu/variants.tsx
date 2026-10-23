'use client'
import { useCallback, useRef, useState } from 'react'
import ShelfNav from '@/components/shelf/ShelfNav'
import ChalkSheet from '../proto-chapter-nav/ChalkSheet'
import { CHAPTERS, useActive } from '../proto-chapter-nav/shared'
import { Bar, Burger, ChapterBoard, Contact, Overlay, ToyColumn } from './parts'

// 1 · Two menus: the hamburger opens the one-column toy shelf (site only). Chapters stay their
// own thing, the chalk chip from the last round. Axis: separate jobs, separate controls.
export function TwoMenus() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const burger = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Bar right={<Burger ref={burger} open={open} onClick={() => setOpen(true)} />} />
      <Overlay open={open} onClose={close} label="Menu" trigger={burger}>
        <ToyColumn fill />
        <Contact />
      </Overlay>
      <ChalkSheet />
    </>
  )
}

// 2 · One menu: on a case study the same hamburger opens a shelf whose top board is this page's
// chapters, with the toy column under it. Axis: one button, one place to look.
export function OneMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const active = useActive()
  return (
    <>
      <Bar right={<Burger open={open} onClick={() => setOpen(true)} />} />
      <Overlay open={open} onClose={close} label="Menu">
        <div className="pm-frame"><ChapterBoard active={active} onPick={close} title="Cal’s Career Quiz" /></div>
        <p className="pm-section">Around the site</p>
        <ToyColumn compact />
      </Overlay>
    </>
  )
}

// 3 · Where you are: the bar names the chapter you're in, and that's the button. It opens the
// chapters first, with the original five-across toy shelf under them as the way out.
// Axis: context first, and Kai's shelf art stays as drawn.
export function WhereYouAre() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const active = useActive()
  const cur = CHAPTERS.find((c) => c.id === active)!
  return (
    <>
      <Bar
        right={<Burger open={open} onClick={() => setOpen(true)} label="Menu and chapters" />}
      >
        <button type="button" className="pm-where" aria-expanded={open} onClick={() => setOpen(true)}>
          <span className="tabular-nums opacity-60">{cur.num || '··'}</span>
          <span className="truncate">{cur.title}</span>
          <svg viewBox="0 0 12 12" aria-hidden="true" className="size-3 shrink-0"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>
          <span className="sr-only">, open chapters</span>
        </button>
      </Bar>
      <Overlay open={open} onClose={close} label="Chapters and menu">
        <div className="pm-frame"><ChapterBoard active={active} onPick={close} title="Cal’s Career Quiz" /></div>
        <p className="pm-section">Around the site</p>
        <div className="pm-shelf-row"><ShelfNav activeHref="/works" /></div>
      </Overlay>
    </>
  )
}
