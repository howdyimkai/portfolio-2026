'use client'

// PROTOTYPE — full-screen sandbox comparison. Delete with src/app/proto/garden-full.
// Covers the /proto page chrome with a fixed layer that mimics AppShell's homepage branch.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ShelfNav from '@/components/shelf/ShelfNav'
import Hero from '@/components/Hero'
import Garden from './Garden'
import './picker.css'
import './bleed.css'

function Current() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ShelfNav activeHref="/" />
      <main className="min-h-0 flex-1">
        <Hero />
      </main>
    </div>
  )
}

// Sand is the page: the shelf and tools float on top of it.
function FullBleed() {
  return (
    <div className="bleed-shelf relative h-full overflow-hidden">
      <Garden layout="bleed" />
      {/* Wordmark and broom inked dark like the hero title: black at 85% over the sand
          (Kai, 2026-10-13), so the sand's warmth shows through. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 [&_.shelf-broom]:pointer-events-auto [&_.shelf-wordmark]:opacity-[0.85] [&_.shelf-broom]:text-black/85! [&_.shelf-wordmark]:[filter:brightness(0)]!">
        <ShelfNav activeHref="/" />
      </div>
    </div>
  )
}

// A framed tray that fills what the shelf leaves, tools on the page beside it.
function Tray() {
  return (
    <div className="flex h-full flex-col overflow-hidden md:[--shelf-zoom:1]">
      <ShelfNav activeHref="/" />
      <main className="min-h-0 flex-1 pt-4 md:pt-5">
        <Garden layout="tray" />
      </main>
    </div>
  )
}

// Today's page until a tool is picked; then the garden grows to fill the screen.
function Expand() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ShelfNav activeHref="/" />
      <main className="min-h-0 flex-1">
        <section className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-6 md:px-10 md:pt-5">
          <div data-home-hero className="relative mx-auto max-w-[900px] md:max-w-[var(--home-garden-w)]">
            <Garden layout="expand" />
          </div>
        </section>
      </main>
    </div>
  )
}

const VARIANTS = [
  { name: 'Current', C: Current },
  { name: 'Full bleed', C: FullBleed },
  { name: 'Tray', C: Tray },
  { name: 'Expand', C: Expand },
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

  // The /proto page underneath still scrolls; lock it so its scrollbars don't eat the viewport.
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
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
    <div className="fixed inset-0 z-[100] bg-page">
      <C key={current} />
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
