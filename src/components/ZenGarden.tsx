'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Tool = 'rake' | 'eraser' | 'blossom'

type Point = { x: number; y: number }
type TinePath = { light: Path2D; dark: Path2D; lastLight: Point | null; lastDark: Point | null }
// A stroke is one chunk of a rake gesture: per-tine groove paths plus a center path
// used to carve (flatten) the sand under the rake head before the grooves are drawn.
// Raw points and accumulated path length drive the rolling chunk bake.
type Stroke = {
  tines: TinePath[]
  center: Path2D
  lastCenter: Point | null
  points: Point[]
  length: number
}
type Blossom = { id: number; x: number; y: number; rotation: number; scale: number }
type Rect = { left: number; top: number; width: number; height: number }

// Groove anatomy. Two calibration sources, reconciled: GardenRakeStudy.mov gives the
// mark its CHARACTER (each tine displaces sand into a bright soft ridge beside a dark
// trench; tines packed so the band reads as ribbed sand; marks persist and new passes
// carve over old ones), while the teeth-rake TOOL sets the SCALE — the band must look
// like it was made by the ~40px cursor asset in the user's hand. That asset
// (design-intent/teethrake@2x.png, 174x304, 9 teeth spanning ~68% of its width)
// renders 22.9px wide at the cursor's 40px box, giving a ~16px tooth span / ~23px
// head. Values are fixed CSS px at every breakpoint because the cursor is too.
const TINES = 7
const TINE_PITCH = 3.2
const RIDGE_WIDTH = 2.2
const TRENCH_SOFT_WIDTH = 3.2
const TRENCH_CORE_WIDTH = 1.7
const EMBOSS_OFFSET = 0.7 // light from top-left: ridge shifts -x/-y, trench +x/+y
// The rake head flattens a band slightly wider than the tine span as it carves,
// erasing whatever pattern it crosses (the carve-over moment in the study video).
const CARVE_WIDTH = (TINES - 1) * TINE_PITCH + 4

const RIDGE_COLOR = 'rgba(255,250,238,0.55)'
const TRENCH_SOFT_COLOR = 'rgba(80,62,44,0.22)'
const TRENCH_CORE_COLOR = 'rgba(80,62,44,0.42)'
// Displaced sand piles up brightest along the outside edges of the band in the study
// video; a wide soft light pass along the two outer tines reads as that spill.
const EDGE_RIDGE_WIDTH = 5.5
const EDGE_RIDGE_COLOR = 'rgba(255,250,238,0.28)'

// Rolling bake: the active gesture is committed to the persistent layer in chunks so
// that raking over an *earlier part of the same gesture* still carves it away (hover
// raking makes a single gesture arbitrarily long, so self-crossing is the common
// case, and it is the signature realism moment in the study video). The next chunk
// starts exactly at the previous chunk's last point with its direction preserved, so
// the seam is a butt joint of identical geometry — and butt line caps keep a chunk's
// carve from reaching backward and eating the previous chunk's baked tail. Bonus:
// per-frame live drawing cost is bounded by chunk length instead of growing with the
// whole gesture.
const CHUNK_COMMIT_LEN = 120

const ERASE_RADIUS = 16
const BLOSSOM_ERASE_RADIUS = 30
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
  { key: 'rake', label: 'TEETH RAKE', icon: '/garden/tool-teethrake.webp', ratio: 198 / 348 },
  { key: 'eraser', label: 'ERASER RAKE', icon: '/garden/tool-eraserrake.webp', ratio: 174 / 304 },
  { key: 'blossom', label: 'BLOSSOM', icon: '/garden/tool-blossom.webp', ratio: 336 / 356 },
]

let blossomIdCounter = 0

function createStroke(): Stroke {
  return {
    tines: Array.from({ length: TINES }, () => ({
      light: new Path2D(),
      dark: new Path2D(),
      lastLight: null,
      lastDark: null,
    })),
    center: new Path2D(),
    lastCenter: null,
    points: [],
    length: 0,
  }
}

function extendPath(path: Path2D, last: Point | null, next: Point): Point {
  if (!last) {
    path.moveTo(next.x, next.y)
  } else {
    // Midpoint-quadratic smoothing: control point = previous raw sample, endpoint =
    // midpoint to the new sample, so fast angular motion still reads as a calm curve.
    path.quadraticCurveTo(last.x, last.y, (last.x + next.x) / 2, (last.y + next.y) / 2)
  }
  return next
}

// Appends one raking sample to the stroke's per-tine groove paths and its carve path.
// Incremental (points are appended once, never rebuilt), so per-frame draw cost does
// not grow with how long the pattern has existed — only with the current chunk.
function pushRakePoint(stroke: Stroke, p: Point, prev: Point) {
  const dx = p.x - prev.x
  const dy = p.y - prev.y
  const dist = Math.hypot(dx, dy)
  const len = dist || 1
  const perpx = -dy / len
  const perpy = dx / len

  for (let i = 0; i < TINES; i++) {
    const tineOff = (i - (TINES - 1) / 2) * TINE_PITCH
    const cx = p.x + perpx * tineOff
    const cy = p.y + perpy * tineOff
    const tine = stroke.tines[i]
    tine.lastLight = extendPath(tine.light, tine.lastLight, { x: cx - EMBOSS_OFFSET, y: cy - EMBOSS_OFFSET })
    tine.lastDark = extendPath(tine.dark, tine.lastDark, { x: cx + EMBOSS_OFFSET, y: cy + EMBOSS_OFFSET })
  }
  stroke.lastCenter = extendPath(stroke.center, stroke.lastCenter, p)
  stroke.points.push(p)
  stroke.length += dist
}

// The quadratic-midpoint technique always stops half a segment short of the last real
// sample. Cap each path with a final line to its true last position so a stroke doesn't
// visibly stop short when the gesture ends (pointer leaves, or the tool switches away).
function finalizeStroke(stroke: Stroke) {
  stroke.tines.forEach((tine) => {
    if (tine.lastLight) tine.light.lineTo(tine.lastLight.x, tine.lastLight.y)
    if (tine.lastDark) tine.dark.lineTo(tine.lastDark.x, tine.lastDark.y)
  })
  if (stroke.lastCenter) stroke.center.lineTo(stroke.lastCenter.x, stroke.lastCenter.y)
}

// Carve-over + grooves. First flattens the sand under the rake head (destination-out
// along the center path), erasing any older pattern the chunk crosses, then draws
// each tine's trench+ridge pair. Used both for the live active chunk (every frame on
// the visible canvas) and to bake a finished chunk into the persistent layer once.
// Butt caps everywhere: chunk seams butt-joint cleanly against identical re-seeded
// geometry with no double-composited beads, and the carve never reaches backward
// past a seam the way a round cap's half-disc would.
function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  ctx.save()
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'round'

  ctx.globalCompositeOperation = 'destination-out'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = CARVE_WIDTH
  ctx.stroke(stroke.center)
  ctx.globalCompositeOperation = 'source-over'

  // Soft spill of displaced sand along the outside edges of the band.
  ctx.strokeStyle = EDGE_RIDGE_COLOR
  ctx.lineWidth = EDGE_RIDGE_WIDTH
  ctx.stroke(stroke.tines[0].light)
  ctx.stroke(stroke.tines[TINES - 1].light)

  stroke.tines.forEach((tine) => {
    ctx.strokeStyle = RIDGE_COLOR
    ctx.lineWidth = RIDGE_WIDTH
    ctx.stroke(tine.light)

    ctx.strokeStyle = TRENCH_SOFT_COLOR
    ctx.lineWidth = TRENCH_SOFT_WIDTH
    ctx.stroke(tine.dark)

    ctx.strokeStyle = TRENCH_CORE_COLOR
    ctx.lineWidth = TRENCH_CORE_WIDTH
    ctx.stroke(tine.dark)
  })
  ctx.restore()
}

export default function ZenGarden() {
  const [tool, setTool] = useState<Tool | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  // Persistent sand layer: finished strokes and eraser wipes are baked into this
  // offscreen canvas, so grooves persist indefinitely (no hold/fade — matching the
  // study video) while per-frame cost stays flat: one drawImage plus the active stroke.
  const layerRef = useRef<HTMLCanvasElement | null>(null)
  const layerCtxRef = useRef<CanvasRenderingContext2D | null>(null)
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
  // Cursor position is applied immediately (translate); rotation eases toward its
  // target every animation frame so fast direction changes don't snap.
  const cursorPosRef = useRef<Point>({ x: 0, y: 0 })
  const cursorAngleRef = useRef(0)
  const cursorTargetAngleRef = useRef(0)

  // Bake the active chunk into the persistent layer and drop it (gesture over).
  const commitActiveStroke = useCallback(() => {
    const stroke = activeStrokeRef.current
    if (!stroke) return
    finalizeStroke(stroke)
    const lctx = layerCtxRef.current
    if (lctx) drawStroke(lctx, stroke)
    activeStrokeRef.current = null
  }, [])

  // Mid-gesture chunk rollover: bake the current chunk, then start the next one at
  // the same point with the same direction, so the seam is a butt joint of identical
  // geometry (no gap, no double-composite).
  const rolloverActiveStroke = useCallback(() => {
    const stroke = activeStrokeRef.current
    if (!stroke || stroke.points.length < 2) return
    const pts = stroke.points
    const last = pts[pts.length - 1]
    const prev = pts[pts.length - 2]

    finalizeStroke(stroke)
    const lctx = layerCtxRef.current
    if (lctx) drawStroke(lctx, stroke)

    const next = createStroke()
    pushRakePoint(next, last, prev)
    next.length = 0
    activeStrokeRef.current = next
  }, [])

  useEffect(() => {
    commitActiveStroke()
    toolRef.current = tool
    // Switching to rake while already hovering the plot should start drawing
    // immediately rather than waiting for the next pointer enter.
    if (tool === 'rake' && hoveringRef.current) {
      activeStrokeRef.current = createStroke()
    }
  }, [tool, commitActiveStroke])

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
    const dpr = window.devicePixelRatio || 1
    const w = Math.round(rect.width * dpr)
    const h = Math.round(rect.height * dpr)
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Persistent layer follows the canvas size. Resizing a canvas clears it — that is
    // deliberate here: plot geometry changes across breakpoints (landscape sand on
    // desktop, portrait on mobile) and dpr changes, so scaling old pixels would distort
    // the pattern. The raked sand resets to smooth on resize instead of warping.
    let layer = layerRef.current
    if (!layer) {
      layer = document.createElement('canvas')
      layerRef.current = layer
    }
    if (layer.width !== w || layer.height !== h) {
      layer.width = w
      layer.height = h
    }
    const lctx = layer.getContext('2d')
    if (lctx) lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    layerCtxRef.current = lctx
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

        // Baked sand pattern (device-pixel layer drawn at CSS size — the context's
        // dpr transform maps it 1:1).
        const layer = layerRef.current
        if (layer && layer.width > 0) ctx.drawImage(layer, 0, 0, width, height)

        // Live gesture on top: carves over the baked pattern visually each frame;
        // the same carve is applied to the layer for real when the stroke commits.
        const active = activeStrokeRef.current
        if (active) drawStroke(ctx, active)

        // Blossoms rest on top of the sand; the rake carve passes beneath them.
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

  // Pixel-radius wipe on the persistent layer (partial erase — closer to smoothing
  // sand back flat than the old whole-stroke removal). Soft-edged so the wipe
  // boundary doesn't read as a hard punch-out. Blossoms stay object-based and are
  // removed whole when the eraser passes near enough.
  const eraseAt = (p: Point) => {
    const lctx = layerCtxRef.current
    if (lctx) {
      const r = ERASE_RADIUS
      const grad = lctx.createRadialGradient(p.x, p.y, r * 0.45, p.x, p.y, r)
      grad.addColorStop(0, 'rgba(0,0,0,1)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      lctx.save()
      lctx.globalCompositeOperation = 'destination-out'
      lctx.fillStyle = grad
      lctx.beginPath()
      lctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      lctx.fill()
      lctx.restore()
    }
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
          if (stroke) {
            pushRakePoint(stroke, p, prev ?? p)
            if (stroke.length > CHUNK_COMMIT_LEN) rolloverActiveStroke()
          }
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
      activeStrokeRef.current = createStroke()
    }
  }

  const handlePointerLeave = () => {
    hoveringRef.current = false
    commitActiveStroke()
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
