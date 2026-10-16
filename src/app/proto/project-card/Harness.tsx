'use client'

// PROTOTYPE — one high level case study card. Delete with src/app/proto/project-card and public/proto/project-card.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FrostedStory, Chalkboard, ChalkDust } from './Variants'
import './picker.css'
import './card.css'

const VARIANTS = [
  { name: 'Frosted + story', C: FrostedStory },
  { name: 'Chalkboard', C: Chalkboard },
  { name: 'Chalk dust', C: ChalkDust },
]

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [ready, setReady] = useState(false)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const highlightRef = useRef<HTMLSpanElement>(null)

  const setActive = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return
    setCurrent(i)
    const url = new URL(location.href)
    url.searchParams.set('v', String(i + 1))
    history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    const v = parseInt(new URLSearchParams(location.search).get('v') ?? '', 10)
    if (v >= 1 && v <= VARIANTS.length) setCurrent(v - 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [])

  const moveHighlight = useCallback(() => {
    const el = itemsRef.current[current]
    const hl = highlightRef.current
    if (!el || !hl) return
    hl.style.width = el.offsetWidth + 'px'
    hl.style.transform = `translateX(${el.offsetLeft}px)`
  }, [current])

  useLayoutEffect(moveHighlight, [moveHighlight])
  useEffect(() => {
    window.addEventListener('resize', moveHighlight)
    return () => window.removeEventListener('resize', moveHighlight)
  }, [moveHighlight])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= VARIANTS.length) setActive(num - 1)
      else if (e.key === 'ArrowRight') setActive((current + 1) % VARIANTS.length)
      else if (e.key === 'ArrowLeft') setActive((current - 1 + VARIANTS.length) % VARIANTS.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [current, setActive])

  const { C } = VARIANTS[current]

  return (
    <div className="grid-paper fixed inset-0 z-[100] overflow-y-auto bg-page">
      <div className="flex min-h-full items-center justify-center px-4 pb-32 pt-16">
        <C key={current} />
      </div>
      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemsRef.current[i] = el
            }}
            className="proto-picker-item"
            data-active={i === current ? '' : undefined}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => setActive(i)}
          >
            {v.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
