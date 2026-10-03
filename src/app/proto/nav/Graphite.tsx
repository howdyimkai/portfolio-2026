'use client'

import { useRef, useState } from 'react'
import type { NavProps } from './items'
import { drop, type Motion } from './graphiteMotion'

// Green-graphite graph-paper sheet (design-intent/nav-exploration/Nav-greengraphite.png).
// Felt icons from design-intent/nav-exploration/rodeo/ pop up over a label on hover
// and stay up for the active page; the hat always sits over the wordmark.
const LEFT = [
  { key: 'works', label: 'selected works', icon: 'selectedworks' },
  { key: 'play', label: 'playground', icon: 'playground' },
]
const RIGHT = [
  { key: 'notes', label: 'writing', icon: 'writing' },
  { key: 'about', label: 'about me', icon: 'about-me' },
]

type Item = (typeof LEFT)[number]

function GraphiteItem({ it, isActive, hovered, motion, onHover, onSelect }: {
  it: Item
  isActive: boolean
  hovered: boolean
  motion: Motion
  onHover: (k: string | null) => void
  onSelect: (k: string) => void
}) {
  const imgRef = useRef<HTMLImageElement>(null)

  const enter = () => {
    onHover(it.key)
    if (motion === 'drop' && !isActive && imgRef.current) drop(imgRef.current)
  }
  const leave = () => onHover(null)

  return (
    <li className="graphite-slot" data-slot={it.key}>
      <a
        href="#"
        className="graphite-item"
        aria-current={isActive ? 'page' : undefined}
        data-up={isActive || hovered ? '' : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && enter()}
        onPointerLeave={leave}
        onFocus={enter}
        onBlur={leave}
        onClick={(e) => {
          e.preventDefault()
          onSelect(it.key)
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={`/proto/rodeo/${it.icon}.webp`} alt="" draggable={false} className="graphite-icon" />
        <span className="graphite-label">{it.label}</span>
      </a>
    </li>
  )
}

export default function Graphite({ active, onSelect, motion = 'pop' }: NavProps & { motion?: Motion }) {
  const [hover, setHover] = useState<string | null>(null)

  const item = (it: Item) => (
    <GraphiteItem
      key={it.key}
      it={it}
      isActive={active === it.key}
      hovered={hover === it.key}
      motion={motion}
      onHover={setHover}
      onSelect={onSelect}
    />
  )

  return (
    <header className="relative z-20 flex justify-center">
      <nav aria-label="Main" className="graphite-sheet" data-motion={motion}>
        <ul className="graphite-row">
          {LEFT.map(item)}
          <li className="graphite-slot" data-slot="brand">
            <a
              href="#"
              aria-label="Kai Tran, home"
              className="graphite-brand"
              onClick={(e) => {
                e.preventDefault()
                onSelect('home')
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/proto/rodeo/howdyimkai.webp" alt="" draggable={false} className="graphite-hat" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/proto/wordmark.webp" alt="" draggable={false} className="graphite-wordmark" />
            </a>
          </li>
          {RIGHT.map(item)}
        </ul>
      </nav>
    </header>
  )
}
