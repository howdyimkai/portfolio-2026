'use client'

// My career rodeo: four eras pinned along a rope, ridden by the cowboy hat ("Reel", picked from
// /proto/career-rodeo 2026-10-30; design-intent/career-rodeo-exploration/NOTES.md). It sits in a
// sheet over /about (CareerRodeo.tsx). The rope, pins and chalk era labels show from the start; each
// photo and line appear when the hat reaches its pin. The sheet never scrolls by itself: the hat holds
// a line about 40% down and the rope reels up past it, whether you drag the hat, scroll or swipe, so
// the two never fight. Tapping a pin or a waiting card sends the hat there.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import SayHowdy from '@/components/resume/SayHowdy'
import { ERAS, RODEO_CLOSING, RODEO_HAT, RODEO_TITLE, STAMP, type Era } from './data'

type Box = { x: number; y: number; w: number }
type Placed = Box & { ax: number; ay: number } // card + where the rope pins it
type Layout = {
  head: Box
  start: { x: number; y: number }
  cards: Placed[]
  end: { x: number; y: number }
  closing: Box & { align: 'center' | 'left' }
  lasso: boolean
  height: number
}
// A plan gets the layer width, the head's height and each card's measured height, and returns where
// everything goes. The rope is built from it, so it always meets the cards.
type Plan = (w: number, headH: number, heights: number[]) => Layout

const LINE = 0.42 // where the hat holds, down the sheet
const HAT_ROOM = 44 // under the title, for the hat to sit on the rope's start

// One loose S between each pair of stops: vertical tangents, so the rope swings side to side. On
// desktop a lasso finishes it: the rope leaves the last S heading straight down, swings out into a
// roomy loop, crosses itself and trails a long tail, so the hat at the end sits clear of the loop.
// Each join keeps its two control points in line, so there's no corner.
function ropePath(l: Layout) {
  const pts = [l.start, ...l.cards.map((c) => ({ x: c.ax, y: c.ay })), l.end]
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const k = (b.y - a.y) * 0.55
    d += ` C${a.x},${a.y + k} ${b.x},${b.y - k} ${b.x},${b.y}`
  }
  if (!l.lasso) return d
  const { x, y } = l.end
  const P = (dx: number, dy: number) => `${x + dx},${y + dy}`
  d += ` C${P(0, 30)} ${P(-40, 52)} ${P(-75, 62)}`
  d += ` C${P(-89, 66)} ${P(-97, 76)} ${P(-108, 76)}`
  d += ` C${P(-126, 76)} ${P(-140, 63)} ${P(-140, 45)}`
  d += ` C${P(-140, 27)} ${P(-126, 14)} ${P(-107, 14)}`
  d += ` C${P(-90, 14)} ${P(-76, 27)} ${P(-76, 45)}`
  d += ` C${P(-76, 120)} ${P(-30, 180)} ${P(-40, 270)}`
  return d
}

// Cards alternate left and right of a rope that wanders down the middle.
const wanderPlan: Plan = (w, headH, heights) => {
  const headW = Math.min(300, w * 0.46)
  const head = { x: (w - headW) / 2, y: 0, w: headW }
  const start = { x: w / 2, y: headH + 6 }
  const cw = Math.min(300, w * 0.42)
  const cards: Placed[] = []
  let y = headH + 70
  heights.forEach((h, i) => {
    const left = i % 2 === 0
    const x = left ? w * 0.02 : w * 0.98 - cw
    // Same-side cards leave room for the next card's chalk tag, which stands ~22px above it; across
    // the rope they stagger by about half a card.
    const prevSame = cards[i - 2]
    if (prevSame) y = Math.max(y, prevSame.y + heights[i - 2] + 72)
    cards.push({ x, y, w: cw, ax: left ? x + cw - 14 : x + 14, ay: y + 22 })
    y += Math.max(h * 0.55, 180)
  })
  const bottom = Math.max(...cards.map((c, i) => c.y + heights[i]))
  const end = { x: w / 2 - 18, y: bottom + 50 }
  const closing = { x: (w - Math.min(440, w)) / 2, y: end.y + 300, w: Math.min(440, w), align: 'center' as const }
  return { head, start, cards, end, closing, lasso: true, height: closing.y + 80 }
}

// Phones: the rope runs down the left edge, nearly straight, with the cards to its right, and just
// ends (no lasso, to keep it simple).
const columnPlan: Plan = (w, headH, heights) => {
  const ropeX = 24
  const head = { x: 0, y: 0, w: Math.min(240, w) }
  const start = { x: ropeX, y: headH + 10 }
  const cx = 50
  const cw = Math.min(380, w - cx)
  const cards: Placed[] = []
  let y = headH + 48
  heights.forEach((h, i) => {
    cards.push({ x: cx, y, w: cw, ax: ropeX + (i % 2 ? 4 : -3), ay: y + 26 })
    y += h + 72 // the next card's tag stands ~29px above it, so this leaves ~40px clear
  })
  const end = { x: ropeX, y: y - 4 }
  const closing = { x: cx, y: end.y + 30, w: cw, align: 'left' as const }
  return { head, start, cards, end, closing, lasso: false, height: closing.y + 96 }
}

const plan: Plan = (w, headH, heights) => (w >= 560 ? wanderPlan : columnPlan)(w, headH, heights)

function Art({ era }: { era: Era }) {
  const a = era.art
  if (a.kind === 'pair') {
    return (
      <div className="rodeo-pair">
        <img className="rodeo-pair-back" src={a.back.src} alt={a.back.alt} width={a.back.w} height={a.back.h} draggable={false} />
        <img className="rodeo-pair-front" src={a.front.src} alt={a.front.alt} width={a.front.w} height={a.front.h} draggable={false} />
      </div>
    )
  }
  if (a.kind === 'video') return <Loop art={a} />
  return <img className="rodeo-img" src={a.src} alt={a.alt} width={a.w} height={a.h} draggable={false} />
}

// The Story card's 6s loop: muted, no controls, plays only while on screen. Reduced motion gets the still.
function Loop({ art }: { art: Extract<Era['art'], { kind: 'video' }> }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still, setStill] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    setStill(mq.matches)
    const on = () => setStill(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const v = ref.current
    if (!v || still) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [still])
  if (still) return <img className="rodeo-img" src={art.poster} alt={art.alt} width={art.w} height={art.h} draggable={false} />
  return (
    <video ref={ref} className="rodeo-img" poster={art.poster} width={art.w} height={art.h} muted loop playsInline disableRemotePlayback preload="metadata" aria-label={art.alt}>
      <source src={art.webm} type="video/webm" />
      <source src={art.mp4} type="video/mp4" />
    </video>
  )
}

export default function RodeoTrail({ scroller }: { scroller: React.RefObject<HTMLElement | null> }) {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const closing = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const mask = useRef<SVGPathElement>(null)
  const rope = useRef<SVGPathElement>(null)
  const hat = useRef<HTMLDivElement>(null)
  const hatAt = useRef(0) // the hat's place along the rope, 0 to 1, kept across re-plans
  const [layout, setLayout] = useState<Layout | null>(null)
  const [armed, setArmed] = useState(false)
  const id = useId().replace(/:/g, '')
  const titleId = `${id}-title`

  // Plan, measure the cards at their planned widths, plan again with their heights.
  const replan = useCallback(() => {
    const el = root.current
    if (!el) return
    // The stage is display: none until armed, so arm it now or every card measures 0 tall.
    el.setAttribute('data-armed', '')
    const w = el.clientWidth
    const first = plan(w, 0, ERAS.map(() => 0))
    if (head.current) head.current.style.width = `${first.head.w}px`
    cards.current.forEach((c, i) => c && (c.style.width = `${first.cards[i].w}px`))
    const headH = (head.current?.offsetHeight ?? 0) + HAT_ROOM
    const heights = cards.current.map((c) => c?.offsetHeight ?? 0)
    // The closing (line, stamp and Copy email) is measured too, so the sheet always fits it.
    if (closing.current) closing.current.style.width = `${first.closing.w}px`
    const next = plan(w, headH, heights)
    next.height = Math.max(next.height, next.closing.y + (closing.current?.offsetHeight ?? 0) + 56)
    setLayout(next)
  }, [])

  useLayoutEffect(() => {
    setArmed(true)
    replan()
    const ro = new ResizeObserver(() => replan())
    if (root.current) ro.observe(root.current)
    return () => ro.disconnect()
  }, [replan])

  useEffect(() => {
    const path = rope.current
    const sc = scroller.current
    const el = root.current
    const h = hat.current
    if (!layout || !path || !sc || !el || !h) return
    const total = path.getTotalLength()
    const samples: { s: number; x: number; y: number }[] = []
    for (let s = 0; s <= total; s += 4) {
      const p = path.getPointAtLength(s)
      samples.push({ s, x: p.x, y: p.y })
    }
    // Where each card's pin sits along the rope.
    const stops = layout.cards.map((c) => {
      let best = 0
      let bd = Infinity
      for (const p of samples) {
        const d = (p.x - c.ax) ** 2 + (p.y - c.ay) ** 2
        if (d < bd) {
          bd = d
          best = p.s
        }
      }
      return best
    })
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    cards.current.forEach((c) => c?.removeAttribute('data-shown'))
    mask.current?.setAttribute('stroke-dasharray', `${total} ${total + 10}`)

    // The camera eases the sheet toward keeping the hat on the line. Only ever moved from here.
    let cam = 0
    const camera = () => {
      cam = 0
      const p = path.getPointAtLength(cur)
      const y = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop + p.y
      const target = Math.max(0, Math.min(sc.scrollHeight - sc.clientHeight, y - sc.clientHeight * LINE))
      const diff = target - sc.scrollTop
      if (reduce.matches || Math.abs(diff) < 0.5) sc.scrollTop = target
      else {
        sc.scrollTop += diff * 0.2
        cam = requestAnimationFrame(camera)
      }
    }

    let cur = hatAt.current * total
    const place = (len: number) => {
      cur = Math.max(0, Math.min(total, len))
      hatAt.current = cur / total
      const p = path.getPointAtLength(cur)
      const q = path.getPointAtLength(Math.min(total, cur + 6))
      // A small lean into the rope's direction, so it reads as riding it.
      const lean = Math.max(-14, Math.min(14, ((q.x - p.x) / 6) * 14))
      h.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -78%) rotate(${lean}deg)`
      mask.current?.setAttribute('stroke-dashoffset', String(total - cur))
      let reached = -1
      stops.forEach((s, i) => {
        if (cur >= s - 2) {
          cards.current[i]?.setAttribute('data-shown', '')
          reached = i
        }
      })
      const done = cur >= total - 2
      el.toggleAttribute('data-done', done)
      h.setAttribute('aria-valuenow', String(Math.round((cur / total) * 100)))
      h.setAttribute('aria-valuetext', done ? 'End of the rope' : reached < 0 ? 'Start' : ERAS[reached].name)
      if (!cam) cam = requestAnimationFrame(camera)
    }
    place(cur)

    // Sending the hat to a pin: it travels the rope (ease in and out, longer for longer trips).
    let tween = 0
    let glide = 0 // a swipe's coast after the finger lifts
    const stopMotion = () => {
      cancelAnimationFrame(tween)
      cancelAnimationFrame(glide)
      tween = glide = 0
    }
    const send = (to: number) => {
      stopMotion()
      el.setAttribute('data-moved', '')
      if (reduce.matches) return place(to)
      const from = cur
      const dur = Math.min(900, 380 + Math.abs(to - from) * 0.3)
      const t0 = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur)
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
        place(from + (to - from) * e)
        tween = t < 1 ? requestAnimationFrame(step) : 0
      }
      tween = requestAnimationFrame(step)
    }
    const onClick = (e: MouseEvent) => {
      const t = (e.target as Element).closest<HTMLElement>('[data-stop]')
      if (t && el.contains(t)) send(stops[Number(t.dataset.stop)])
    }

    // Dragging the hat. The pointer is tracked in rope coordinates (screen movement added up), so the
    // camera moving the rope can't feed back into where the hat goes. Each frame the hat moves to the
    // rope point nearest that pointer, searching only a short way either side of where it is, so it
    // can't jump across a bend to another stretch.
    const local = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect()
      return { x: cx - r.left, y: cy - r.top }
    }
    let pointer: { x: number; y: number } | null = null
    let virt = { x: 0, y: 0 }
    let raf = 0
    const tick = () => {
      raf = 0
      if (!pointer) return
      let best = cur
      let bd = Infinity
      for (const p of samples) {
        if (Math.abs(p.s - cur) > 220) continue
        const d = (p.x - virt.x) ** 2 + (p.y - virt.y) ** 2
        if (d < bd) {
          bd = d
          best = p.s
        }
      }
      place(best)
      raf = requestAnimationFrame(tick)
    }
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      stopMotion()
      try {
        h.setPointerCapture(e.pointerId)
      } catch {}
      el.setAttribute('data-moved', '')
      h.setAttribute('data-dragging', '')
      pointer = { x: e.clientX, y: e.clientY }
      virt = local(e.clientX, e.clientY)
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const up = () => {
      pointer = null
      h.removeAttribute('data-dragging')
    }
    const move = (e: PointerEvent) => {
      if (!pointer) return
      if (e.pointerType === 'mouse' && e.buttons === 0) return up() // released somewhere we didn't hear
      virt = { x: virt.x + e.clientX - pointer.x, y: virt.y + e.clientY - pointer.y }
      pointer = { x: e.clientX, y: e.clientY }
    }

    // The wheel and a swipe anywhere on the sheet move the hat along the rope.
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      stopMotion()
      el.setAttribute('data-moved', '')
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? sc.clientHeight : 1
      place(cur + e.deltaY * k)
    }
    let swipe: { y: number; v: number; id: number } | null = null
    const swipeDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || h.contains(e.target as Node)) return
      stopMotion()
      swipe = { y: e.clientY, v: 0, id: e.pointerId }
    }
    const swipeMove = (e: PointerEvent) => {
      if (!swipe || e.pointerId !== swipe.id) return
      const dy = swipe.y - e.clientY
      swipe = { ...swipe, y: e.clientY, v: dy }
      if (dy) el.setAttribute('data-moved', '')
      place(cur + dy)
    }
    const swipeUp = (e: PointerEvent) => {
      if (!swipe || e.pointerId !== swipe.id) return
      let v = Math.max(-30, Math.min(30, swipe.v))
      swipe = null
      if (reduce.matches) return
      const coast = () => {
        v *= 0.9
        if (Math.abs(v) < 0.3) return (glide = 0)
        place(cur + v)
        glide = requestAnimationFrame(coast)
      }
      glide = requestAnimationFrame(coast)
    }

    // Keyboard: arrows nudge it along, Page keys jump pin to pin, Home and End go to either end.
    const key = (e: KeyboardEvent) => {
      const next = stops.find((s) => s > cur + 2) ?? total
      const prev = [...stops].reverse().find((s) => s < cur - 2) ?? 0
      const to =
        e.key === 'ArrowDown' || e.key === 'ArrowRight' ? cur + 40
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? cur - 40
        : e.key === 'PageDown' ? next
        : e.key === 'PageUp' ? prev
        : e.key === 'Home' ? 0
        : e.key === 'End' ? total
        : null
      if (to === null) return
      e.preventDefault()
      e.stopPropagation()
      stopMotion()
      el.setAttribute('data-moved', '')
      place(to)
    }

    h.addEventListener('pointerdown', down)
    h.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    h.addEventListener('keydown', key)
    el.addEventListener('click', onClick)
    sc.addEventListener('wheel', wheel, { passive: false })
    sc.addEventListener('pointerdown', swipeDown)
    sc.addEventListener('pointermove', swipeMove)
    sc.addEventListener('pointerup', swipeUp)
    sc.addEventListener('pointercancel', swipeUp)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(cam)
      stopMotion()
      h.removeEventListener('pointerdown', down)
      h.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      h.removeEventListener('keydown', key)
      el.removeEventListener('click', onClick)
      sc.removeEventListener('wheel', wheel)
      sc.removeEventListener('pointerdown', swipeDown)
      sc.removeEventListener('pointermove', swipeMove)
      sc.removeEventListener('pointerup', swipeUp)
      sc.removeEventListener('pointercancel', swipeUp)
    }
  }, [layout, scroller])

  const d = layout ? ropePath(layout) : ''
  // Column: the phone layout, rope down the left with every card to its right.
  const column = !!layout && !layout.lasso

  return (
    <section
      ref={root}
      className="rodeo"
      data-armed={armed ? '' : undefined}
      data-layout={column ? 'column' : 'wander'}
      aria-labelledby={titleId}
      style={{ height: layout?.height }}
    >
      <h2 id={titleId} className="sr-only">
        My career rodeo
      </h2>

      {/* No JS and print: the four eras as a plain numbered list, same copy. */}
      <ol className="rodeo-plain">
        {ERAS.map((e) => (
          <li key={e.id}>
            <strong>{e.name}.</strong> {e.line}
          </li>
        ))}
        <li className="rodeo-plain-close">{RODEO_CLOSING}</li>
      </ol>

      <div className="rodeo-stage" aria-hidden={!layout || undefined}>
        <div ref={head} className="rodeo-head" style={layout ? { left: layout.head.x, top: layout.head.y, width: layout.head.w } : undefined}>
          <img className="rodeo-title" src={RODEO_TITLE.src} alt="" width={RODEO_TITLE.w} height={RODEO_TITLE.h} draggable={false} />
        </div>

        {layout && (
          <svg className="rodeo-svg" width="100%" height={layout.height} aria-hidden="true">
            <defs>
              <mask id={`${id}-draw`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="10000" height={layout.height + 200}>
                <path ref={mask} d={d} fill="none" stroke="#fff" strokeWidth={48} strokeLinecap="round" />
              </mask>
            </defs>
            {/* STANDIN rope: a dark outline under a dashed tan twist, after the Cowboy Rope "regular"
                style. The whole rope shows faintly; the stretch the hat has ridden is solid. */}
            <g className="rodeo-ghost">
              <path className="rodeo-rope-outline" d={d} />
              <path className="rodeo-rope-twist" d={d} />
            </g>
            <g mask={`url(#${id}-draw)`}>
              <path ref={rope} className="rodeo-rope-outline" d={d} />
              <path className="rodeo-rope-twist" d={d} />
            </g>
          </svg>
        )}

        <ol className="rodeo-cards">
          {ERAS.map((e, i) => {
            const c = layout?.cards[i]
            return (
              <li
                key={e.id}
                ref={(el) => {
                  cards.current[i] = el
                }}
                className="rodeo-card"
                data-era={e.id}
                data-stop={i}
                data-side={c && c.ax > c.x + c.w / 2 ? 'left' : 'right'}
                style={c ? { left: c.x, top: c.y, width: c.w } : undefined}
              >
                <figure className="rodeo-print">
                  <div className="rodeo-photo">
                    <Art era={e} />
                    <h3 className="rodeo-tag">
                      <img src={e.label.src} alt={e.name} width={e.label.w} height={e.label.h} draggable={false} />
                    </h3>
                  </div>
                  <figcaption className="rodeo-line">{e.line}</figcaption>
                </figure>
              </li>
            )
          })}
        </ol>

        {/* Brass pins sit over the cards, where the rope ties each one on. */}
        {layout && (
          <svg className="rodeo-svg" width="100%" height={layout.height} aria-hidden="true">
            {layout.cards.map((c, i) => (
              <g key={i}>
                <circle cx={c.ax} cy={c.ay + 1.5} r={6.5} fill="rgba(58,40,20,0.25)" />
                <circle cx={c.ax} cy={c.ay} r={6} fill="#c79a45" stroke="#7a5a24" strokeWidth={1.2} />
                <circle cx={c.ax - 1.8} cy={c.ay - 1.8} r={1.8} fill="#f3dca4" />
              </g>
            ))}
          </svg>
        )}

        {layout && (
          <>
            {/* STANDIN hat, the shelf nav's. */}
            <div
              ref={hat}
              className="rodeo-hat"
              role="slider"
              tabIndex={0}
              aria-label="Hat on the rope. Drag it down to visit each era"
              aria-orientation="vertical"
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <img src={RODEO_HAT.src} alt="" width={RODEO_HAT.w} height={RODEO_HAT.h} draggable={false} />
            </div>
            <p
              className="rodeo-hint"
              // Phones: right under the title, above the hat, where the cards can't crowd it.
              style={column ? { left: layout.head.x + 2, top: layout.start.y - 56 } : { left: layout.start.x + 46, top: layout.start.y - 6 }}
              aria-hidden="true"
            >
              drag the hat or scroll to ride the rope
              <svg viewBox="0 0 16 24" aria-hidden="true">
                <path d="M8 2v18M2 14l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
            {/* Every pin is a button that sends the hat to it. */}
            {layout.cards.map((c, i) => (
              <button
                key={i}
                type="button"
                className="rodeo-pin-hit"
                data-stop={i}
                style={{ left: c.ax, top: c.ay }}
                aria-label={`Send the hat to ${ERAS[i].name}`}
              />
            ))}
          </>
        )}
        {/* The closing line, then Kai's stamp beside a Copy email button (2026-11-02). It shows when the
            hat reaches the end of the rope. */}
        <div
          ref={closing}
          className="rodeo-closing"
          data-align={layout?.closing.align ?? 'center'}
          style={layout ? { left: layout.closing.x, top: layout.closing.y, width: layout.closing.w } : undefined}
        >
          <p>{RODEO_CLOSING}</p>
          <div className="rodeo-howdy">
            <img className="rodeo-stamp" src={STAMP.src} alt={STAMP.alt} width={STAMP.w} height={STAMP.h} draggable={false} />
            <SayHowdy className="rodeo-email" />
          </div>
        </div>
      </div>
    </section>
  )
}
