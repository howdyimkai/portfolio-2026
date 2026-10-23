'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { cal } from '@/content/case-studies/cal'
import ChalkSheet from './ChalkSheet'
import InFlow from './InFlow'
import TrailRail from './TrailRail'
import './proto.css'
import './picker.css'

// position: where the picker sits so it never covers the variant's own chrome.
const VARIANTS = [
  { name: 'Sheet', C: ChalkSheet, position: 'top' },
  { name: 'Rail', C: TrailRail, position: 'bottom' },
  { name: 'Contents', C: InFlow, position: 'top' },
] as const

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [key, setKey] = useState(0)
  const [ready, setReady] = useState(false)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const hl = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const v = parseInt(new URLSearchParams(location.search).get('v') ?? '', 10)
    if (v >= 1 && v <= VARIANTS.length) setCurrent(v - 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [])

  const move = () => {
    const el = items.current[current]
    if (!el || !hl.current) return
    hl.current.style.width = el.offsetWidth + 'px'
    hl.current.style.transform = `translateX(${el.offsetLeft}px)`
  }
  useLayoutEffect(move)
  useEffect(() => {
    window.addEventListener('resize', move)
    return () => window.removeEventListener('resize', move)
  })

  const set = (i: number) => {
    if (i < 0 || i >= VARIANTS.length) return
    setCurrent(i)
    setKey((k) => k + 1)
    const url = new URL(location.href)
    url.searchParams.set('v', String(i + 1))
    history.replaceState(null, '', url)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= VARIANTS.length) set(num - 1)
      else if (e.key === 'ArrowRight') set((current + 1) % VARIANTS.length)
      else if (e.key === 'ArrowLeft') set((current - 1 + VARIANTS.length) % VARIANTS.length)
      else if (e.key === 'r' || e.key === 'R') setKey((k) => k + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const { C, position } = VARIANTS[current]
  return (
    <>
      <CaseStudyPage study={cal} />
      <C key={key} />
      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined} data-position={position === 'top' ? 'top' : undefined}>
        <span ref={hl} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => { items.current[i] = el }}
            className="proto-picker-item"
            data-active={i === current ? '' : undefined}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => set(i)}
          >
            {v.name}
          </button>
        ))}
      </nav>
    </>
  )
}
