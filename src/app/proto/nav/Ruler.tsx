'use client'

import { useEffect, useRef, useState } from 'react'
import { ITEMS, type NavProps } from './items'

// Concept: ticks hang from the top edge at quarter points, half-mark tallest.
const CELL_TICKS = [
  { at: '26%', h: 10 },
  { at: '51%', h: 20 },
  { at: '77%', h: 10 },
]

const PITCH = 9
const SIGMA = 46
const GAIN = 0.95
const SPAN_SCALE = 1.5

export type Span = { x: number; w: number } | null

export function Brand({ onHome }: { onHome: () => void }) {
  return (
    <a
      href="#"
      aria-label="Kai Tran, home"
      onClick={(e) => {
        e.preventDefault()
        onHome()
      }}
      className="brand flex items-center gap-3 pr-4 md:gap-5 md:pr-6"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/proto/stamp.webp" alt="" draggable={false} className="brand-stamp h-9 w-auto md:h-[70px]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/proto/wordmark.webp" alt="howdy im Kai" draggable={false} className="h-7 w-auto md:h-[54px]" />
    </a>
  )
}

/**
 * Continuous ruler scale. Ticks swell near the pointer (transform only, applied
 * straight to the DOM in a rAF so React never re-renders on pointermove).
 * axis 'x' hangs ticks down from the top edge; 'y' pushes them right from the left edge.
 * `span` (wrap-relative px) holds the ticks inside it at a taller resting scale.
 */
export function LiveTicks({
  wrapRef,
  axis = 'x',
  span = null,
}: {
  wrapRef: React.RefObject<HTMLDivElement | null>
  axis?: 'x' | 'y'
  span?: Span
}) {
  const [count, setCount] = useState(0)
  const ticks = useRef<(HTMLSpanElement | null)[]>([])
  const spanRef = useRef<Span>(span)
  const pos = useRef<number | null>(null)
  const draw = useRef<() => void>(() => {})
  const fn = axis === 'x' ? 'scaleY' : 'scaleX'

  useEffect(() => {
    spanRef.current = span
    draw.current()
  }, [span])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => setCount(Math.floor((axis === 'x' ? wrap.offsetWidth : wrap.offsetHeight) / PITCH) + 1)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const base = (i: number) => {
      const s = spanRef.current
      const p = i * PITCH
      return s && p >= s.x && p <= s.x + s.w ? SPAN_SCALE : 1
    }
    draw.current = () => {
      raf = 0
      ticks.current.forEach((el, i) => {
        if (!el) return
        const m = pos.current === null ? 0 : GAIN * Math.exp(-(((i * PITCH - pos.current) / SIGMA) ** 2))
        const v = base(i) + m
        el.style.transform = v === 1 ? '' : `${fn}(${v})`
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw.current)
    }
    const move = (e: PointerEvent) => {
      if (reduce || e.pointerType !== 'mouse') return
      const r = wrap.getBoundingClientRect()
      pos.current = axis === 'x' ? e.clientX - r.left : e.clientY - r.top
      schedule()
    }
    const leave = () => {
      pos.current = null
      schedule()
    }
    wrap.addEventListener('pointermove', move)
    wrap.addEventListener('pointerleave', leave)
    draw.current()
    return () => {
      ro.disconnect()
      wrap.removeEventListener('pointermove', move)
      wrap.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [wrapRef, axis, fn])

  // Re-apply resting scales once new ticks mount.
  useEffect(() => {
    draw.current()
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: count }, (_, i) => {
        const len = i % 10 === 0 ? 13 : i % 5 === 0 ? 9 : 5
        return (
          <span
            key={i}
            ref={(el) => {
              ticks.current[i] = el
            }}
            className="ruler-tick ruler-tick-live"
            style={
              axis === 'x'
                ? { left: i * PITCH, height: len }
                : { top: i * PITCH, left: 0, width: len, height: 1, transformOrigin: 'left' }
            }
          />
        )
      })}
    </div>
  )
}

export default function Ruler({ active, onSelect, live }: NavProps & { live: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  return (
    <header className="relative z-20">
      <nav aria-label="Main" className="mx-auto flex max-w-[1440px] flex-col md:flex-row md:items-stretch md:justify-center">
        <div className="flex h-[52px] items-center px-4 md:h-[72px] md:px-0">
          <Brand onHome={() => onSelect('home')} />
        </div>
        <div ref={wrapRef} className="relative">
          <ul className="grid h-14 grid-cols-4 md:flex md:h-[72px]">
            {ITEMS.map((item) => (
              <li key={item.key} className="flex md:contents">
                <a
                  href="#"
                  aria-current={active === item.key ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    onSelect(item.key)
                  }}
                  className="ruler-cell flex-1 px-3 font-mono text-[11px] uppercase leading-[1.4] tracking-[0.1em] min-[400px]:text-xs md:px-5 md:text-[15px] md:pr-9"
                >
                  {!live &&
                    CELL_TICKS.map((t) => (
                      <span key={t.at} aria-hidden className="ruler-tick" style={{ left: t.at, height: t.h }} />
                    ))}
                  <span className="ruler-label">
                    <span className="block">{item.lines[0]}</span>
                    <span className="block">{item.lines[1]}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {live && <LiveTicks wrapRef={wrapRef} />}
        </div>
      </nav>
    </header>
  )
}
