'use client'

// PROTOTYPE — broom-tidy variants on the Tic shelf. Delete with src/app/proto/nav-shelf-tidy.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import TidyShelf, { type Variant } from './TidyShelf'
import { cfg, DEFAULTS } from '../nav-shelf/motion'
import '../nav/proto.css'
import '../nav-shelf/shelf.css'
import './tidy.css'

const VARIANTS: { name: string; variant: Variant }[] = [
  { name: 'Sweep', variant: 'sweep' },
  { name: 'Chalk line', variant: 'chalk' },
  { name: 'Unboxed', variant: 'unboxed' },
  { name: 'Elevator', variant: 'elevator' },
]

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [tidy, setTidy] = useState(false)
  const [ready, setReady] = useState(false)
  const hlRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const moveHighlight = useCallback(() => {
    const el = itemRefs.current[current]
    const hl = hlRef.current
    if (!el || !hl) return
    hl.style.width = el.offsetWidth + 'px'
    hl.style.transform = `translateX(${el.offsetLeft}px)`
  }, [current])

  const setActiveVariant = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return
    setCurrent(i)
    setTidy(false)
    const url = new URL(location.href)
    url.searchParams.set('v', String(i + 1))
    history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    Object.assign(cfg, DEFAULTS.tic)
    const v = parseInt(new URLSearchParams(location.search).get('v') || '', 10)
    if (v >= 1 && v <= VARIANTS.length) setCurrent(v - 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [])

  useLayoutEffect(() => {
    moveHighlight()
    window.addEventListener('resize', moveHighlight)
    return () => window.removeEventListener('resize', moveHighlight)
  }, [moveHighlight])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= VARIANTS.length) setActiveVariant(n - 1)
      else if (e.key === 'ArrowRight') setActiveVariant((current + 1) % VARIANTS.length)
      else if (e.key === 'ArrowLeft') setActiveVariant((current - 1 + VARIANTS.length) % VARIANTS.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [current, setActiveVariant])

  return (
    <div className="proto-stage shelf-stage bg-page">
      <div className="shelf-frame">
        <TidyShelf key={current} variant={VARIANTS[current].variant} tidy={tidy} onToggle={() => setTidy((t) => !t)} />
      </div>

      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
        <span ref={hlRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="proto-picker-item"
            data-active={i === current ? '' : undefined}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => setActiveVariant(i)}
          >
            {v.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
