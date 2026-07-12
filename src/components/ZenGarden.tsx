'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Tool = 'rake' | 'eraser' | 'blossom'

type Point = { x: number; y: number }
type TinePath = { dark: Path2D; light: Path2D; lastDark: Point | null; lastLight: Point | null }
type Stroke = { tines: Point[][]; paths: TinePath[]; born: number }
type Blossom = { id: number; x: number; y: number; rotation: number; scale: number }
type Rect = { left: number; top: number; width: number; height: number }

const HOLD_MS = 6000
const FADE_MS = 3000
const TINES = 5
const ERASE_RADIUS = 28
const BLOSSOM_ERASE_RADIUS = 34
// Cursor rotation eases toward its target each frame instead of snapping (0-1, higher = snappier).
const CURSOR_ANGLE_LERP = 0.35

const ROCKS = [
  {
    src: '/garden/rock-1.webp',
    ratio: 378 / 304,
    className: 'left-[2%] top-[53%] w-[34%] md:left-[4%] md:top-[68%] md:w-[17%]',
  },
  {
    src: '/garden/rock-2.webp',
    ratio: 346 / 296,
    className: 'hidden md:block md:left-[77%] md:top-[13%] md:w-[14%]',
  },
  {
    src: '/garden/rock-3.webp',
    ratio: 356 / 394,
    className: 'left-[20%] top-[30%] w-[17%] md:left-[26%] md:top-[81%] md:w-[9%]',
  },
]

const BAMBOO = [
  { src: '/garden/bamboo-1.webp', ratio: 292 / 574, style: { left: '-4%', top: '10%', width: '7%' } },
  { src: '/garden/bamboo-2.webp', ratio: 298 / 566, style: { left: '-2%', top: '62%', width: '6%' } },
  { src: '/garden/bamboo-3.webp', ratio: 274 / 552, style: { right: '-4%', top: '2%', width: '7%' } },
  { src: '/garden/bamboo-4.webp', ratio: 244 / 420, style: { right: '-2%', top: '58%', width: '5%' } },
]

const TOOLS: { key: Tool; label: string; icon: string; ratio: number }[] = [
  { key: 'rake', label: 'TEETH RAKE', icon: '/garden/tool-teethrake.webp', ratio: 174 / 304 },
  { key: 'eraser', label: 'ERASER RAKE', icon: '/garden/tool-eraserrake.webp', ratio: 174 / 304 },
  { key: 'blossom', label: 'BLOSSOM', icon: '/garden/tool-blossom.webp', ratio: 166 / 144 },
]

let blossomIdCounter = 0

function createStroke(): Stroke {
  return {
    tines: Array.from({ length: TINES }, () => []),
    paths: Array.from({ length: TINES }, () => ({
      dark: new Path2D(),
      light: new Path2D(),
      lastDark: null,
      lastLight: null,
    })),
    born: Date.now(),
  }
}

// Appends one raking sample to a stroke's hit-test points and its per-tine Path2D.
// Uses the midpoint-quadratic technique (control point = previous raw sample, endpoint =
// midpoint to the new sample) so fast, angular pointer motion still reads as a calm curve,
// without ever rebuilding path history from scratch.
function pushRakePoint(stroke: Stroke, p: Point, prev: Point, spacing: number) {
  const dx = p.x - prev.x
  const dy = p.y - prev.y
  const len = Math.hypot(dx, dy) || 1
  const perpx = -dy / len
  const perpy = dx / len

  for (let i = 0; i < TINES; i++) {
    const off = (i - (TINES - 1) / 2) * spacing
    const cx = p.x + perpx * off
    const cy = p.y + perpy * off
    const darkPt = { x: cx + 1, y: cy + 1 }
    const lightPt = { x: cx - 1, y: cy - 1 }

    stroke.tines[i].push({ x: cx, y: cy })

    const pair = stroke.paths[i]
    if (!pair.lastDark || !pair.lastLight) {
      pair.dark.moveTo(darkPt.x, darkPt.y)
      pair.light.moveTo(lightPt.x, lightPt.y)
    } else {
      const midDark = { x: (pair.lastDark.x + darkPt.x) / 2, y: (pair.lastDark.y + darkPt.y) / 2 }
      const midLight = { x: (pair.lastLight.x + lightPt.x) / 2, y: (pair.lastLight.y + lightPt.y) / 2 }
      pair.dark.quadraticCurveTo(pair.lastDark.x, pair.lastDark.y, midDark.x, midDark.y)
      pair.light.quadraticCurveTo(pair.lastLight.x, pair.lastLight.y, midLight.x, midLight.y)
    }
    pair.lastDark = darkPt
    pair.lastLight = lightPt
  }
}

// The quadratic-midpoint technique always stops half a segment short of the last real
// sample (the curve endpoint is a midpoint, never the raw point). Cap each tine with a
// final line to its true last position so a stroke doesn't visibly stop short when the
// gesture ends (pointer leaves, or the tool switches away mid-hover).
function finalizeStroke(stroke: Stroke) {
  stroke.paths.forEach((pair) => {
    if (pair.lastDark && pair.lastLight) {
      pair.dark.lineTo(pair.lastDark.x, pair.lastDark.y)
      pair.light.lineTo(pair.lastLight.x, pair.lastLight.y)
    }
  })
}

export default function ZenGarden() {
  const [tool, setTool] = useState<Tool | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const activeStrokeRef = useRef<Stroke | null>(null)
  const hoveringRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  const toolRef = useRef<Tool | null>(tool)
  const blossomImgRef = useRef<HTMLImageElement | null>(null)
  const [blossoms, setBlossoms] = useState<Blossom[]>([])
  const blossomsRef = useRef<Blossom[]>([])
  const rafRef = useRef<number>(0)
  // Cached plot geometry, refreshed only on resize — avoids forced layout reads
  // (getBoundingClientRect) in the pointermove/draw hot paths.
  const rectRef = useRef<Rect>({ left: 0, top: 0, width: 0, height: 0 })
  const isMobileRef = useRef(false)
  // Cursor position is applied immediately (translate); rotation eases toward its
  // target every animation frame so fast direction changes don't snap.
  const cursorPosRef = useRef<Point>({ x: 0, y: 0 })
  const cursorAngleRef = useRef(0)
  const cursorTargetAngleRef = useRef(0)

  useEffect(() => {
    const prevStroke = activeStrokeRef.current
    toolRef.current = tool
    if (prevStroke) finalizeStroke(prevStroke)
    // Switching tools mid-hover shouldn't reconnect a stale stroke to a new one.
    activeStrokeRef.current = null
    // Switching to rake while already hovering the plot should start drawing
    // immediately rather than waiting for the next pointer enter.
    if (tool === 'rake' && hoveringRef.current) {
      const stroke = createStroke()
      strokesRef.current.push(stroke)
      activeStrokeRef.current = stroke
    }
  }, [tool])

  useEffect(() => {
    blossomsRef.current = blossoms
  }, [blossoms])

  useEffect(() => {
    const img = new window.Image()
    img.src = '/garden/tool-blossom.webp'
    blossomImgRef.current = img
  }, [])

  const resize = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const rect = wrap.getBoundingClientRect()
    rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    isMobileRef.current = rect.width < 520
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [])

  useEffect(() => {
    resize()
    const ro = new ResizeObserver(resize)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [resize])

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        const { width, height } = rectRef.current
        ctx.clearRect(0, 0, width, height)

        const blossomImg = blossomImgRef.current
        if (blossomImg && blossomImg.complete) {
          blossomsRef.current.forEach((b) => {
            const w = 46 * b.scale
            const h = (blossomImg.naturalHeight / blossomImg.naturalWidth) * w
            ctx.save()
            ctx.translate(b.x, b.y)
            ctx.rotate(b.rotation)
            ctx.drawImage(blossomImg, -w / 2, -h / 2, w, h)
            ctx.restore()
          })
        }

        const now = Date.now()
        strokesRef.current = strokesRef.current.filter((s) => now - s.born < HOLD_MS + FADE_MS)
        strokesRef.current.forEach((s) => {
          const age = now - s.born
          const alpha = age < HOLD_MS ? 1 : Math.max(0, 1 - (age - HOLD_MS) / FADE_MS)
          if (alpha <= 0) return
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          s.paths.forEach((pair) => {
            ctx.strokeStyle = 'rgba(70,55,38,0.32)'
            ctx.lineWidth = 2.2
            ctx.stroke(pair.dark)

            ctx.strokeStyle = 'rgba(255,248,232,0.5)'
            ctx.lineWidth = 1.8
            ctx.stroke(pair.light)
          })
          ctx.restore()
        })

        const cursorEl = cursorRef.current
        if (cursorEl) {
          let diff = cursorTargetAngleRef.current - cursorAngleRef.current
          diff = ((diff + 180) % 360 + 360) % 360 - 180
          cursorAngleRef.current += diff * CURSOR_ANGLE_LERP
          const { x, y } = cursorPosRef.current
          cursorEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${cursorAngleRef.current}deg)`
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const getPoint = (e: { clientX: number; clientY: number }): Point => {
    const rect = rectRef.current
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!toolRef.current) return
    const p = getPoint(e)
    // Rake/eraser act on hover alone; only the blossom stamp is a discrete click.
    if (toolRef.current === 'blossom') {
      stampBlossom(p)
    }
  }

  const eraseAt = (p: Point) => {
    strokesRef.current = strokesRef.current.filter((s) => {
      for (const tine of s.tines) {
        for (const pt of tine) {
          if (Math.hypot(pt.x - p.x, pt.y - p.y) < ERASE_RADIUS) return false
        }
      }
      return true
    })
    // Only touch React state when a blossom is actually in range — avoids a
    // setState (and re-render) on every pointermove while erasing empty sand.
    const hasBlossomToRemove = blossomsRef.current.some(
      (b) => Math.hypot(b.x - p.x, b.y - p.y) < BLOSSOM_ERASE_RADIUS
    )
    if (hasBlossomToRemove) {
      setBlossoms((prev) => prev.filter((b) => Math.hypot(b.x - p.x, b.y - p.y) >= BLOSSOM_ERASE_RADIUS))
    }
  }

  const stampBlossom = (p: Point) => {
    blossomIdCounter += 1
    const next: Blossom = {
      id: blossomIdCounter,
      x: p.x,
      y: p.y,
      rotation: (Math.random() - 0.5) * 0.6,
      scale: 0.85 + Math.random() * 0.3,
    }
    setBlossoms((prev) => [...prev, next])
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!toolRef.current) return

    // Use getCoalescedEvents when available so fast strokes get every intermediate
    // sample the OS actually captured, instead of just one point per rendered frame.
    const native = e.nativeEvent as PointerEvent & { getCoalescedEvents?: () => PointerEvent[] }
    const samples = native.getCoalescedEvents?.() ?? [native]
    const events = samples.length > 0 ? samples : [native]

    let prev = lastPointRef.current
    let finalPoint: Point | null = null
    let finalAngle: number | undefined

    for (const ne of events) {
      const p = getPoint(ne)
      if (prev) {
        const dx = p.x - prev.x
        const dy = p.y - prev.y
        if (Math.hypot(dx, dy) > 0.5) {
          finalAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
        }
      }

      if (hoveringRef.current) {
        if (toolRef.current === 'rake') {
          const stroke = activeStrokeRef.current
          if (stroke) pushRakePoint(stroke, p, prev ?? p, isMobileRef.current ? 5 : 7)
        } else if (toolRef.current === 'eraser') {
          eraseAt(p)
        }
      }

      prev = p
      finalPoint = p
    }

    if (finalPoint) {
      cursorPosRef.current = finalPoint
      if (finalAngle !== undefined) cursorTargetAngleRef.current = finalAngle
    }

    lastPointRef.current = finalPoint
  }

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (!toolRef.current) return
    hoveringRef.current = true
    if (cursorRef.current) cursorRef.current.style.opacity = '1'

    const p = getPoint(e)
    cursorPosRef.current = p
    lastPointRef.current = p

    if (toolRef.current === 'rake') {
      const stroke = createStroke()
      strokesRef.current.push(stroke)
      activeStrokeRef.current = stroke
    }
  }

  const handlePointerLeave = () => {
    hoveringRef.current = false
    if (activeStrokeRef.current) finalizeStroke(activeStrokeRef.current)
    activeStrokeRef.current = null
    lastPointRef.current = null
    if (cursorRef.current) cursorRef.current.style.opacity = '0'
  }

  const activeToolIcon = tool ? TOOLS.find((t) => t.key === tool)?.icon : undefined

  return (
    <div className="w-full">
      {/* Mobile: title sits above the plot as its own block (see 00-KaiMobileHERO frame) */}
      <div className="relative mx-auto mb-6 aspect-[806/310] w-[78%] max-w-[320px] md:hidden">
        <Image src="/hero/kai-hero-title.webp" alt="Kai Tran — Design Engineer" fill sizes="320px" className="object-contain" priority />
      </div>

      <div
        ref={wrapRef}
        className={`garden-plot relative aspect-[592/926] touch-none overflow-visible rounded-[22px] md:aspect-[803/517] md:rounded-[34px] ${tool ? 'has-tool' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {BAMBOO.map((b, i) => (
          <div
            key={i}
            className="pointer-events-none absolute z-0 opacity-40"
            style={{ ...b.style, aspectRatio: b.ratio }}
          >
            <Image src={b.src} alt="" fill draggable={false} sizes="80px" className="object-contain" />
          </div>
        ))}

        <Image
          src="/garden/sand-portrait.webp"
          alt=""
          fill
          priority
          draggable={false}
          sizes="100vw"
          className="rounded-[22px] object-cover md:hidden"
        />
        <Image
          src="/garden/sand.webp"
          alt=""
          fill
          priority
          draggable={false}
          sizes="900px"
          className="hidden rounded-[34px] object-cover md:block"
        />

        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* Desktop: title embedded on the sand, centered in the plot */}
        <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center md:flex">
          <div className="relative aspect-[806/310] w-[46%] min-w-[220px]">
            <Image src="/hero/kai-hero-title.webp" alt="Kai Tran — Design Engineer" fill draggable={false} sizes="420px" className="object-contain" priority />
          </div>
        </div>

        <div
          className="pointer-events-none absolute z-10 left-[57%] top-[2%] w-[30%] md:left-[9%] md:top-[13%] md:w-[14%]"
          style={{ aspectRatio: 268 / 248 }}
        >
          <Image src="/garden/mossy-island-rock.webp" alt="" fill draggable={false} sizes="130px" className="object-contain" />
        </div>

        {ROCKS.map((r, i) => (
          <div
            key={i}
            className={`rock pointer-events-none absolute z-10 ${r.className}`}
            style={{ aspectRatio: r.ratio }}
          >
            <Image src={r.src} alt="" fill draggable={false} sizes="150px" className="object-contain" />
          </div>
        ))}

        <div
          className="pointer-events-none absolute z-20 left-[34%] top-[58%] w-[56%] md:left-[62%] md:w-[38%]"
          style={{ aspectRatio: 674 / 522 }}
        >
          <Image src="/garden/bonsai.webp" alt="" fill draggable={false} sizes="340px" className="object-contain" />
        </div>

        {tool && (
          <div
            ref={cursorRef}
            aria-hidden
            className="garden-cursor pointer-events-none absolute left-0 top-0 z-30 h-10 w-10 opacity-0"
            style={{ transition: 'opacity 150ms ease' }}
          >
            <Image src={activeToolIcon!} alt="" fill draggable={false} sizes="40px" className="object-contain" />
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center gap-6 md:gap-10">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            aria-pressed={tool === t.key}
            className={`tool-card press-scale flex w-32 flex-col items-center gap-4 overflow-hidden rounded-2xl border border-hairline bg-page px-4 pt-5 font-mono text-xs text-ink-body md:w-44 ${
              tool === t.key ? 'is-selected' : ''
            }`}
          >
            {t.label}
            <span className="relative w-20 md:w-28" style={{ aspectRatio: t.ratio }}>
              <Image src={t.icon} alt="" fill sizes="112px" className="object-contain" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
