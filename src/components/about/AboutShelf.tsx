'use client'

// The About shelf: floating birch planks, felt objects resting on them, one hover moment per object.
// Objects are <button>s; the page decides what a pick does.
import { useState } from 'react'
import Image from 'next/image'
import { OBJECTS, cardById, type ShelfObject } from './data'

function Note({ i }: { i: number }) {
  return (
    <svg className="about-note" data-i={i} viewBox="0 0 12 16" aria-hidden="true">
      <path d="M4 13a2.2 2 0 1 1-1.6-1.9V2.5l7-1.5v9.6a2.2 2 0 1 1-1.4-1.9V4L4 5.2Z" fill="currentColor" />
    </svg>
  )
}

function ShelfItem({
  o,
  active,
  onPick,
}: {
  o: ShelfObject
  active: boolean
  onPick: (card: string, el: HTMLButtonElement) => void
}) {
  const card = cardById(o.card)
  // data-on drives every hover moment: a real mouse hover or keyboard focus, never a touch tap.
  const [on, setOn] = useState(false)
  const width = (o.height * o.w) / o.h
  return (
    <button
      type="button"
      className="about-obj"
      data-hover={o.hover}
      data-active={active ? '' : undefined}
      data-on={on ? '' : undefined}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOn(true)}
      onBlur={() => setOn(false)}
      aria-label={`${o.alt}. Open ${card.category} card`}
      aria-pressed={active}
      onClick={(e) => onPick(o.card, e.currentTarget)}
      style={{ ['--w' as string]: width, ['--h' as string]: o.height, ['--lift' as string]: o.lift ?? 0 }}
    >
      <span className="about-light" aria-hidden="true" />
      <span className="about-contact" aria-hidden="true" />
      <span className="about-art">
        {o.hover === 'swing' ? (
          <span className="about-book">
            <span className="about-pages" aria-hidden="true">
              <span>currently reading →</span>
            </span>
            <span className="about-cover">
              <Image src={o.src} alt="" width={o.w} height={o.h} draggable={false} />
            </span>
          </span>
        ) : (
          <Image src={o.src} alt="" width={o.w} height={o.h} draggable={false} />
        )}
        {o.hover === 'flicker' && <span className="about-screen" aria-hidden="true" />}
        {o.hover === 'lamp' && <span className="about-bulb" aria-hidden="true" />}
        {o.hover === 'bounce-notes' && [0, 1, 2].map((i) => <Note key={i} i={i} />)}
      </span>
    </button>
  )
}

export default function AboutShelf({
  shelves = [0, 1, 2],
  zoom,
  activeCard,
  onPick,
  lead,
  className = '',
}: {
  shelves?: number[]
  // Sits on the top shelf to the left of its objects (the "what I'm into" label).
  lead?: React.ReactNode
  zoom?: number // or set --zoom per breakpoint through className
  activeCard?: string
  onPick: (card: string, el: HTMLButtonElement) => void
  className?: string
}) {
  return (
    <div className={`about-shelves ${className}`} style={zoom ? { ['--zoom' as string]: zoom } : undefined}>
      {shelves.map((s) => (
        <div key={s} className="about-shelf">
          <div className={`about-row ${lead && s === shelves[0] ? 'has-lead' : ''}`}>
            {lead && s === shelves[0] && <div className="about-lead">{lead}</div>}
            {OBJECTS.filter((o) => o.shelf === s).map((o) => (
              <ShelfItem key={o.id} o={o} active={activeCard === o.card} onPick={onPick} />
            ))}
          </div>
          <Image className="about-plank" src="/about/plank.webp" alt="" width={1333} height={66} draggable={false} />
        </div>
      ))}
    </div>
  )
}
