'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { ITEMS, type NavProps } from './items'
import { Brand, LiveTicks, type Span } from './Ruler'

export default function Slide({ active, onSelect }: NavProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cells = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [hover, setHover] = useState<string | null>(null)
  const [span, setSpan] = useState<Span>(null)
  const [ready, setReady] = useState(false)
  const target = hover ?? active

  useLayoutEffect(() => {
    const place = () => {
      const el = cells.current[target]
      if (el) setSpan({ x: el.offsetLeft, w: el.offsetWidth })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [target])

  // Slide only after first paint, so load doesn't animate.
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <header className="relative z-20">
      <nav aria-label="Main" className="mx-auto flex max-w-[1440px] flex-col md:flex-row md:items-stretch md:justify-center">
        <div className="flex h-[52px] items-center px-4 md:h-[72px] md:px-0">
          <Brand onHome={() => onSelect('home')} />
        </div>
        <div ref={wrapRef} className="slide relative" onPointerLeave={() => setHover(null)}>
          <span
            aria-hidden
            className="slide-span"
            data-ready={ready ? '' : undefined}
            style={span ? { width: span.w, transform: `translateX(${span.x}px)` } : { opacity: 0 }}
          />
          <ul className="relative grid h-14 grid-cols-4 md:flex md:h-[72px]">
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
                  className="ruler-cell flex-1 px-3 font-mono text-[11px] uppercase leading-[1.4] tracking-[0.1em] min-[400px]:text-xs md:px-5 md:text-[15px] md:pr-9"
                >
                  <span className="ruler-label">
                    <span className="block">{item.lines[0]}</span>
                    <span className="block">{item.lines[1]}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <LiveTicks wrapRef={wrapRef} span={span} />
        </div>
      </nav>
    </header>
  )
}
