'use client'

// Homepage nav: a shadow-box shelf of felt toys (Tic hover), with a broom that sweeps the
// toys off and leaves a plain text row behind. Picked from /proto/nav-shelf-tidy (Sweep).
// Coordinates are 1× shelf units (394×104, measured off design-intent/pony-test/
// Chalk inside shelf@2x.png); .shelf-nav scales the whole drawing by --zoom.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { enter, leave, tap, type Rig, type Tic } from './shelfMotion'
import './shelf-nav.css'

type Toy = { label: string; href: string; src: string; w: number; h: number; x0: number; x1: number; floor: number; width: number; tic: Tic }

const TOYS: Toy[] = [
  { label: 'selected works', href: '/works', src: '/nav/shelf/cloud.webp', w: 183, h: 111, x0: 25.5, x1: 81.5, floor: 85, width: 50, tic: 'puff' },
  { label: 'play ground', href: '/play', src: '/nav/shelf/pony.webp', w: 385, h: 395, x0: 95.5, x1: 157, floor: 87, width: 38, tic: 'prance' },
  { label: 'humble abode', href: '/', src: '/nav/shelf/hat.webp', w: 139, h: 84, x0: 164, x1: 230, floor: 82, width: 50, tic: 'tip' },
  // No field notes page yet.
  { label: 'field notes', href: '#', src: '/nav/shelf/pencil.webp', w: 146, h: 80, x0: 237, x1: 298.5, floor: 84, width: 50, tic: 'waddle' },
  { label: 'about me', href: '/about', src: '/nav/shelf/star.webp', w: 89, h: 87, x0: 312.5, x1: 369, floor: 76, width: 32, tic: 'spin' },
]

function Cubby({ toy, i, active, landing, onSelect }: { toy: Toy; i: number; active: boolean; landing: boolean; onSelect?: (href: string) => void }) {
  const toyRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const rig = (): Rig | null =>
    toyRef.current && innerRef.current && shadowRef.current
      ? { toy: toyRef.current, inner: innerRef.current, shadow: shadowRef.current, tic: toy.tic }
      : null
  const cx = (toy.x0 + toy.x1) / 2
  const [first, ...rest] = toy.label.split(' ')

  return (
    <Link
      href={toy.href}
      className="shelf-cubby"
      aria-current={active ? 'page' : undefined}
      data-landing={landing ? '' : undefined}
      style={{ left: toy.x0, width: toy.x1 - toy.x0, '--i': i } as React.CSSProperties}
      onClick={(e) => {
        if (!onSelect) return
        e.preventDefault()
        onSelect(toy.href)
      }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && rig() && enter(rig()!)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && rig() && leave(rig()!)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && rig() && tap(rig()!)}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && rig() && enter(rig()!)}
      onBlur={() => rig() && leave(rig()!)}
    >
      <span className="shelf-label">
        {first}
        <br />
        {rest.join(' ')}
      </span>
      <span ref={shadowRef} className="shelf-shadow" style={{ left: cx - toy.x0, top: toy.floor - 10, width: toy.width * 0.8 }} aria-hidden />
      <span
        ref={toyRef}
        className="shelf-toy"
        style={{ left: cx - toy.x0 - toy.width / 2, top: toy.floor - 8 - (toy.width * toy.h) / toy.w, width: toy.width }}
        aria-hidden
      >
        <span ref={innerRef} className="shelf-toy-inner">
          <Image src={toy.src} alt="" width={toy.w} height={toy.h} draggable={false} unoptimized />
        </span>
      </span>
    </Link>
  )
}

function Broom() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path className="shelf-spark" d="M4.18342 7.408C4.28018 7.35962 4.35864 7.28116 4.40702 7.18439L5.05194 5.89456C5.2362 5.52603 5.76211 5.52603 5.94637 5.89456L6.59128 7.18439C6.63967 7.28116 6.71813 7.35962 6.81489 7.408L8.10473 8.05292C8.47325 8.23718 8.47325 8.76308 8.10473 8.94734L6.81489 9.59226C6.71813 9.64064 6.63967 9.7191 6.59128 9.81587L5.94637 11.1057C5.7621 11.4742 5.2362 11.4742 5.05194 11.1057L4.40702 9.81587C4.35864 9.7191 4.28018 9.64064 4.18342 9.59226L2.89358 8.94734C2.52506 8.76308 2.52506 8.23718 2.89358 8.05292L4.18342 7.408Z" fill="currentColor" />
      <path className="shelf-spark" d="M9.55849 3.72046C9.62816 3.68563 9.68465 3.62913 9.71949 3.55947L10.1772 2.64412C10.3098 2.37878 10.6885 2.37878 10.8211 2.64412L11.2788 3.55946C11.3137 3.62913 11.3701 3.68563 11.4398 3.72046L12.3552 4.17814C12.6205 4.3108 12.6205 4.68945 12.3552 4.82212L11.4398 5.2798C11.3701 5.31463 11.3137 5.37112 11.2788 5.44079L10.8211 6.35614C10.6885 6.62148 10.3098 6.62148 10.1772 6.35614L9.71949 5.44079C9.68465 5.37112 9.62816 5.31463 9.55849 5.2798L8.64314 4.82212C8.3778 4.68946 8.3778 4.3108 8.64314 4.17814L9.55849 3.72046Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.9002 3.12245C21.1058 2.76288 20.9811 2.3047 20.6215 2.09907C20.2619 1.89344 19.8037 2.01824 19.5981 2.37781L14.4873 11.3149L13.6579 11.015C11.624 10.2795 9.58131 11.4042 8.53498 13.0396C7.59849 14.5033 6.35491 15.507 4.83501 16.5137C4.60424 16.6666 4.47642 16.9341 4.5025 17.2097C4.52859 17.4853 4.70434 17.7241 4.95969 17.8309L14.7859 21.942C15.0685 22.0602 15.3946 21.9947 15.6096 21.7766C17.532 19.826 18.552 18.1023 18.8891 15.7164C19.1292 14.0173 17.9752 12.5762 16.5027 12.0437L15.9191 11.8327L20.9002 3.12245ZM9.7985 13.848C10.5889 12.6127 11.9646 11.9977 13.1478 12.4256L15.9926 13.4543C16.9512 13.8009 17.5234 14.6602 17.4039 15.5065C17.1433 17.3505 16.4184 18.7294 14.891 20.36L11.0787 18.765L11.7561 16.7294C11.8326 16.4997 11.5705 16.3063 11.3736 16.4471L9.2192 17.987L6.79509 16.9728C7.9329 16.1233 8.96411 15.1521 9.7985 13.848Z" fill="currentColor" />
    </svg>
  )
}

// The header collapses once the swept box has faded (~500ms in), and re-expands
// after the text row has cleared (~150ms in) on the way back.
const COMPACT_AFTER_MS = 520
const EXPAND_AFTER_MS = 150
const GROW_MS = 460

// `activeHref` lets a prototype route light up the cubby it stands in for; with `onSelect`,
// picking a cubby moves the spotlight in place instead of navigating (/pieces/nav).
export default function ShelfNav({ activeHref, onSelect }: { activeHref?: string; onSelect?: (href: string) => void } = {}) {
  const route = usePathname()
  const pathname = activeHref ?? route
  // The cubby that just lost the spotlight sets its toy back down.
  const [shown, setShown] = useState(pathname)
  const [landing, setLanding] = useState<string | null>(null)
  if (shown !== pathname) {
    setLanding(shown)
    setShown(pathname)
  }
  const spot = TOYS.find((t) => t.href === pathname)
  const [tidy, setTidy] = useState(false)
  const [compact, setCompact] = useState(false)
  const broomRef = useRef<HTMLButtonElement>(null)
  const drawRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const before = useRef<{ plot: DOMRect; tools: DOMRect } | null>(null)
  const drawBefore = useRef<number | null>(null)
  const parts = () => {
    const plot = document.querySelector<HTMLElement>('[data-home-hero] .garden-plot')
    const tools = document.querySelector<HTMLElement>('[data-home-tools]')
    return plot && tools ? { plot, tools } : null
  }

  // Swap the layout in one step, then FLIP from the old boxes to the new ones: the garden
  // scales (its canvas re-measures once, not every frame); the tool cards keep their size
  // and only slide, so they never shrink-and-regrow.
  const setLayout = (next: boolean) => {
    const p = parts()
    before.current = p ? { plot: p.plot.getBoundingClientRect(), tools: p.tools.getBoundingClientRect() } : null
    drawBefore.current = drawRef.current?.getBoundingClientRect().top ?? null
    setCompact(next)
  }

  useLayoutEffect(() => {
    // Where the header re-centers (/pieces/nav), the wordmark floats down to its
    // new spot and sinks a hair past it, like a toy settling onto its hover height.
    const draw = drawRef.current
    const drawTop = drawBefore.current
    drawBefore.current = null
    if (draw && drawTop !== null && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw.getAnimations().filter((a) => !(a instanceof CSSAnimation)).forEach((a) => a.cancel())
      const dy = drawTop - draw.getBoundingClientRect().top
      if (Math.abs(dy) >= 0.5) {
        const sink = -Math.sign(dy) * Math.min(4, Math.abs(dy) * 0.08)
        const float = 'cubic-bezier(0.37, 0, 0.63, 1)'
        draw.animate(
          [
            { translate: `0 ${dy}px`, easing: float },
            { translate: `0 ${sink}px`, easing: float, offset: 0.72 },
            { translate: '0 0' },
          ],
          { duration: 720 },
        )
      }
    }

    const p = parts()
    const b = before.current
    before.current = null
    if (!p || !b || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    p.plot.getAnimations().forEach((a) => a.cancel())
    p.tools.getAnimations().forEach((a) => a.cancel())
    const plot = p.plot.getBoundingClientRect()
    const tools = p.tools.getBoundingClientRect()
    if (!plot.width) return
    const timing = { duration: GROW_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
    const dx = b.plot.left - plot.left + (b.plot.width - plot.width) / 2
    p.plot.animate(
      [
        { transformOrigin: '50% 0', transform: `translate(${dx}px, ${b.plot.top - plot.top}px) scale(${b.plot.width / plot.width})` },
        { transformOrigin: '50% 0', transform: 'none' },
      ],
      timing,
    )
    p.tools.animate([{ transform: `translateY(${b.tools.top - tools.top}px)` }, { transform: 'none' }], timing)
  }, [compact])

  const toggle = () => {
    // One-shot sweep flick on every press; it always runs to completion.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      broomRef.current?.querySelector('svg')?.animate(
        [{ rotate: '0deg' }, { rotate: '-22deg', offset: 0.35 }, { rotate: '10deg', offset: 0.7 }, { rotate: '0deg' }],
        { duration: 360, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
      )
    const next = !tidy
    setTidy(next)
    window.clearTimeout(timer.current)
    if (next !== compact) timer.current = window.setTimeout(() => setLayout(next), next ? COMPACT_AFTER_MS : EXPAND_AFTER_MS)
  }

  return (
    <header className="shelf-nav">
      <div ref={drawRef} className="shelf-nav-draw" data-tidy={tidy ? '' : undefined} data-compact={compact ? '' : undefined}>
        <Image src="/nav/shelf/wordmark.webp" alt="howdy im Kai" width={309} height={130} className="shelf-wordmark" draggable={false} priority unoptimized />

        <button ref={broomRef} type="button" className="shelf-broom" aria-pressed={tidy} aria-label="Tidy up navigation" onClick={toggle}>
          <Broom />
        </button>

        <div className="shelf-box">
          <Image src="/nav/shelf/shelf.webp" alt="" width={788} height={208} className="shelf-wood" draggable={false} priority unoptimized />
          <nav className="shelf-row" aria-label="Main" inert={tidy}>
            {/* One light for the whole shelf, so a new page slides it across rather than
                switching it off in one cubby and on in another. */}
            <span
              className="shelf-spot"
              data-on={spot ? '' : undefined}
              style={spot ? { left: spot.x0, width: spot.x1 - spot.x0 } : undefined}
              aria-hidden
            />
            {TOYS.map((t, i) => (
              <Cubby key={t.label} toy={t} i={i} active={pathname === t.href} landing={landing === t.href} onSelect={onSelect} />
            ))}
          </nav>
          {/* Left behind once the toys are swept off. */}
          <nav className="shelf-text" aria-label="Main" inert={!tidy}>
            {TOYS.map((t, i) => (
              <Link key={t.label} href={t.href} aria-current={pathname === t.href ? 'page' : undefined} style={{ '--i': i } as React.CSSProperties}>
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
