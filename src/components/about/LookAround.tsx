'use client'

// Kai's handwritten "plz have a look around" over the shelves (2026-10-30). The two o's of "look" are
// eyes: a pupil in each follows the pointer, so the note watches you look around.
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { LOOK_ART } from './data'

// The o holes, measured off look-around.webp (600×322) with a flood fill: center and how far a pupil
// can travel before it touches the ink, in art pixels.
const EYES = [
  { x: 92.5, y: 254, rx: 9, ry: 10 },
  { x: 170, y: 247, rx: 12, ry: 15 },
]
const PUPIL = 16 // art px across
// At rest the eyes glance down at the shelves.
const REST = { x: 0, y: 0.6 }
// Past this distance the pupils sit at the edge of the o; closer in they drift toward center.
const REACH = 160

export default function LookAround({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pupils = Array.from(el.querySelectorAll<HTMLElement>('.look-pupil'))

    const look = (px: number, py: number) => {
      const box = el.getBoundingClientRect()
      const s = box.width / LOOK_ART.w
      EYES.forEach((e, i) => {
        const dx = px - (box.left + e.x * s)
        const dy = py - (box.top + e.y * s)
        const d = Math.hypot(dx, dy) || 1
        const t = Math.min(1, d / REACH)
        pupils[i].style.translate = `${(dx / d) * t * e.rx * s}px ${(dy / d) * t * e.ry * s}px`
      })
    }
    const rest = () =>
      pupils.forEach((p, i) => {
        const s = el.getBoundingClientRect().width / LOOK_ART.w
        p.style.translate = `${REST.x * EYES[i].rx * s}px ${REST.y * EYES[i].ry * s}px`
      })

    const onMove = (e: PointerEvent) => look(e.clientX, e.clientY)
    const onOut = (e: MouseEvent) => !e.relatedTarget && rest()
    rest()
    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('mouseout', onOut)
    return () => {
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onMove)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <div ref={root} className={`relative ${className}`}>
      <Image src={LOOK_ART.src} alt={LOOK_ART.alt} width={LOOK_ART.w} height={LOOK_ART.h} draggable={false} className="block h-auto w-full" />
      {EYES.map((e) => (
        <span
          key={e.x}
          className="look-pupil"
          aria-hidden="true"
          style={{ left: `${((e.x - PUPIL / 2) / LOOK_ART.w) * 100}%`, top: `${((e.y - PUPIL / 2) / LOOK_ART.h) * 100}%`, width: `${(PUPIL / LOOK_ART.w) * 100}%` }}
        />
      ))}
    </div>
  )
}
