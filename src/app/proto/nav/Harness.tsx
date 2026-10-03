'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Slide from './Slide'
import Rail from './Rail'
import Graphite from './Graphite'
import './proto.css'

const VARIANTS: { name: string; render: (p: P) => React.ReactNode; pickerTop?: boolean; mainClass?: string }[] = [
  { name: 'Slide', render: (p) => <Slide {...p} /> },
  { name: 'Rail', render: (p) => <Rail {...p} />, pickerTop: true, mainClass: 'pb-20 md:pb-6 md:pl-44 min-[1500px]:pl-10' },
  { name: 'Graphite', render: (p) => <Graphite {...p} />, mainClass: 'pt-6 md:pt-10' },
]
type P = { active: string; onSelect: (k: string) => void }

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [nonce, setNonce] = useState(0)
  const [active, setActive] = useState('works')
  const [ready, setReady] = useState(false)
  const pickerRef = useRef<HTMLElement>(null)
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
      <div key={`${current}-${nonce}`}>{VARIANTS[current].render({ active, onSelect: setActive })}</div>
      <main className={`relative min-h-0 flex-1 px-6 pb-6 pt-4 md:px-10 ${VARIANTS[current].mainClass ?? ''}`}>
        <div className="relative mx-auto h-full max-w-[900px] overflow-hidden rounded-[22px] md:rounded-[34px]">
          <Image src="/garden/sand.webp" alt="" fill sizes="900px" className="object-cover" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <Image src="/hero/kai-hero-title.webp" alt="" width={520} height={200} className="h-auto w-[70%] max-w-[520px]" draggable={false} />
          </div>
        </div>
      </main>

      <nav ref={pickerRef} className="proto-picker" data-position={VARIANTS[current].pickerTop ? 'top' : undefined} data-ready={ready ? '' : undefined} aria-label="Prototype variants">
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
