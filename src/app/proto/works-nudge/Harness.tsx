'use client'

// PROTOTYPE — a way into /works from the homepage. Delete with src/app/proto/works-nudge.
// Decided 2026-11-02: Pill, promoted to components/WorksPill.tsx, so SandboxHome now carries it
// in every variant here and "Today" shows the pill too. Notes: design-intent/works-nudge-exploration/NOTES.md.
// Covers the /proto page chrome with a fixed layer that mimics AppShell's homepage branch.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import SandboxHome from '@/components/SandboxHome'
import PhoneMenu from '@/components/shelf/PhoneMenu'
import ResumeBookmark from '@/components/resume/ResumeBookmark'
import { tap } from '@/components/shelf/shelfMotion'
import '../garden-full/picker.css'

const NUDGE_AFTER_MS = 7000 // a few seconds after the eraser hint (4s), so they don't arrive together
const PUFF_GAP_MS = 700

// The "selected works" cloud does its tap Tic twice: once reads as an accident, twice as a wave.
function puffWorks() {
  const cubby = document.querySelector<HTMLElement>('.shelf-cubby[href="/works"]')
  const toy = cubby?.querySelector<HTMLElement>('.shelf-toy')
  const inner = cubby?.querySelector<HTMLElement>('.shelf-toy-inner')
  const shadow = cubby?.querySelector<HTMLElement>('.shelf-shadow')
  if (!toy || !inner || !shadow) return
  const rig = { toy, inner, shadow, tic: 'puff' as const }
  tap(rig)
  window.setTimeout(() => tap(rig), PUFF_GAP_MS)
}

// Once, if nobody has clicked or pressed a key yet. Desktop only: phones have no shelf.
function useShelfNudge(replay: number) {
  useEffect(() => {
    if (!matchMedia('(min-width: 768px)').matches) return
    let id = window.setTimeout(puffWorks, replay ? 300 : NUDGE_AFTER_MS)
    const cancel = (e: Event) => {
      if ((e.target as HTMLElement).closest?.('.proto-picker')) return
      window.clearTimeout(id)
      id = 0
    }
    window.addEventListener('pointerdown', cancel, true)
    window.addEventListener('keydown', cancel, true)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('pointerdown', cancel, true)
      window.removeEventListener('keydown', cancel, true)
    }
  }, [replay])
}

function Home({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <PhoneMenu />
      <main className="h-[100dvh] overflow-hidden">
        <SandboxHome />
      </main>
      {children}
      <ResumeBookmark />
    </>
  )
}

function Today() {
  return <Home />
}

function Pill() {
  return <Home />
}

function Nudge({ replay }: { replay: number }) {
  useShelfNudge(replay)
  return <Home />
}

function Both({ replay }: { replay: number }) {
  useShelfNudge(replay)
  return (
    <Home />
  )
}

const VARIANTS = [
  { name: 'Today', C: Today },
  { name: 'Pill', C: Pill },
  { name: 'Shelf nudge', C: Nudge },
  { name: 'Both', C: Both },
] as const

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [replay, setReplay] = useState(0)
  const [ready, setReady] = useState(false)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const highlightRef = useRef<HTMLSpanElement>(null)

  const setActive = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return
    setCurrent(i)
    setReplay(0)
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

  // Number keys only: arrows and letters belong to the garden (R, E, B pick tools).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= VARIANTS.length) setActive(num - 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setActive])

  const { C, name } = VARIANTS[current]
  const nudges = name === 'Shelf nudge' || name === 'Both'

  return (
    <div className="fixed inset-0 z-[100] bg-page">
      <C key={current} replay={replay} />
      <nav className="proto-picker" data-position="top" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
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
        {nudges && (
          <>
            <span className="proto-picker-divider" aria-hidden="true" />
            <button className="proto-picker-item proto-picker-replay" aria-label="Replay the nudge" onClick={() => setReplay((n) => n + 1)}>
              ↻
            </button>
          </>
        )}
      </nav>
    </div>
  )
}
