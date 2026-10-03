'use client'

// PROTOTYPE — hover-motion options for the Graphite nav's felt icons. Delete with src/app/proto/.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Graphite from '../nav/Graphite'
import { dropCfg, type Motion } from '../nav/graphiteMotion'
import '../nav/proto.css'

const VARIANTS: { name: string; motion: Motion }[] = [
  { name: 'Pop', motion: 'pop' },
  { name: 'Drop', motion: 'drop' },
  { name: 'Sprout', motion: 'sprout' },
]

const DIALS: { key: keyof typeof dropCfg; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: 'height', label: 'Drop height', min: 16, max: 160, step: 1, unit: 'px' },
  { key: 'gravity', label: 'Gravity', min: 800, max: 6000, step: 50, unit: 'px/s²' },
  { key: 'bounce', label: 'Bounce', min: 0, max: 0.7, step: 0.01, unit: '' },
  { key: 'squash', label: 'Squash', min: 0, max: 0.3, step: 0.01, unit: '' },
  { key: 'speed', label: 'Speed', min: 0.1, max: 1, step: 0.05, unit: '×' },
]

function DropPanel() {
  const [, force] = useState(0)
  const summary = DIALS.map((d) => `${d.key}: ${dropCfg[d.key]}${d.unit}`).join(' · ')
  return (
    <div className="proto-controls" aria-label="Drop controls">
      <p className="hint">Hover a label to drop its icon.</p>
      {DIALS.map((d) => (
        <label key={d.key}>
          <span>{d.label}</span>
          <output>
            {dropCfg[d.key]}
            {d.unit}
          </output>
          <input
            type="range"
            min={d.min}
            max={d.max}
            step={d.step}
            defaultValue={dropCfg[d.key]}
            onChange={(e) => {
              dropCfg[d.key] = Number(e.target.value)
              force((n) => n + 1)
            }}
          />
        </label>
      ))}
      <button onClick={() => navigator.clipboard?.writeText(summary)}>Copy values</button>
    </div>
  )
}

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [nonce, setNonce] = useState(0)
  const [active, setActive] = useState('home')
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
    const url = new URL(location.href)
    url.searchParams.set('v', String(i + 1))
    history.replaceState(null, '', url)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
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
    <div className="proto-stage flex h-[100dvh] flex-col overflow-hidden bg-page">
      <Graphite key={`${current}-${nonce}`} motion={VARIANTS[current].motion} active={active} onSelect={setActive} />
      <main className="relative min-h-0 flex-1 px-6 pb-6 pt-6 md:px-10 md:pt-10">
        <div className="relative mx-auto h-full max-w-[900px] overflow-hidden rounded-[22px] md:rounded-[34px]">
          <Image src="/garden/sand.webp" alt="" fill sizes="900px" className="object-cover" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image src="/hero/kai-hero-title.webp" alt="" width={520} height={200} className="h-auto w-[70%] max-w-[520px]" draggable={false} />
          </div>
        </div>
      </main>

      {VARIANTS[current].motion === 'drop' && <DropPanel />}

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
