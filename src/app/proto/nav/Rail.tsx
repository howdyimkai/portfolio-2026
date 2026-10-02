'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ITEMS, type NavProps } from './items'
import { Brand, LiveTicks, type Span } from './Ruler'

function useDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setD(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return d
}

export default function Rail({ active, onSelect }: NavProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cells = useRef<Record<string, HTMLAnchorElement | null>>({})
  const desktop = useDesktop()
  const [hover, setHover] = useState<string | null>(null)
  const [span, setSpan] = useState<Span>(null)
  const [ready, setReady] = useState(false)
  const target = hover ?? active

  // Span position along the scale axis: vertical on the desktop rail, horizontal on the mobile bar.
  useLayoutEffect(() => {
    const place = () => {
      const el = cells.current[target]
      if (el) setSpan(desktop ? { x: el.offsetTop, w: el.offsetHeight } : { x: el.offsetLeft, w: el.offsetWidth })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [target, desktop])

  // Slide only after first paint, so load doesn't animate.
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <header className="relative z-20 md:fixed md:left-8 md:top-6 md:z-20">
      <div className="flex h-[52px] items-center px-4 md:h-auto md:px-0 md:pb-5">
        <Brand onHome={() => onSelect('home')} />
      </div>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-20 bg-page pb-[env(safe-area-inset-bottom)] md:static md:w-[168px] md:bg-transparent md:pb-0"
      >
        <div ref={wrapRef} className="rail slide relative" onPointerLeave={() => setHover(null)}>
          <span
            aria-hidden
            className="slide-span"
            data-axis={desktop ? 'y' : 'x'}
            data-ready={ready ? '' : undefined}
            style={
              span
                ? desktop
                  ? { height: span.w, transform: `translateY(${span.x}px)` }
                  : { width: span.w, transform: `translateX(${span.x}px)` }
                : { opacity: 0 }
            }
          />
          <ul className="relative grid h-14 grid-cols-4 md:flex md:h-auto md:flex-col">
            {ITEMS.map((item) => (
              <li key={item.key} className="flex md:contents">
                <a
                  ref={(el) => {
                    cells.current[item.key] = el
                  }}
                  href="#"
                  aria-current={active === item.key ? 'page' : undefined}
                  data-target={target === item.key ? '' : undefined}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(item.key)}
                  onClick={(e) => {
                    e.preventDefault()
                    onSelect(item.key)
                  }}
                  className="ruler-cell rail-cell flex-1 px-3 font-mono text-[11px] uppercase leading-[1.4] tracking-[0.1em] min-[400px]:text-xs md:h-[72px] md:flex-none md:pl-9 md:pr-4 md:text-[15px]"
                >
                  <span className="ruler-label">
                    <span className="block">{item.lines[0]}</span>
                    <span className="block">{item.lines[1]}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <LiveTicks wrapRef={wrapRef} axis={desktop ? 'y' : 'x'} span={span} key={desktop ? 'y' : 'x'} />
        </div>
      </nav>
    </header>
  )
}
