'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Tool = 'rake' | 'eraser' | 'blossom'

type Point = { x: number; y: number }
type Stroke = { tines: Point[][]; born: number }
type Blossom = { id: number; x: number; y: number; rotation: number; scale: number }

const HOLD_MS = 6000
const FADE_MS = 3000
const TINES = 5
const ERASE_RADIUS = 28
const BLOSSOM_ERASE_RADIUS = 34

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

const TOOLS: { key: Tool; label: string; icon: string }[] = [
  { key: 'rake', label: 'TEETH RAKE', icon: '/garden/tool-teethrake.webp' },
  { key: 'eraser', label: 'ERASER RAKE', icon: '/garden/tool-eraserrake.webp' },
  { key: 'blossom', label: 'BLOSSOM', icon: '/garden/tool-blossom.webp' },
]

let blossomIdCounter = 0

export default function ZenGarden() {
  const [tool, setTool] = useState<Tool>('rake')
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const strokesRef = useRef<Stroke[]>([])
  const activeStrokeRef = useRef<Stroke | null>(null)
  const draggingRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  const toolRef = useRef<Tool>(tool)
  const blossomImgRef = useRef<HTMLImageElement | null>(null)
  const [blossoms, setBlossoms] = useState<Blossom[]>([])
  const blossomsRef = useRef<Blossom[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    toolRef.current = tool
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
      const wrap = wrapRef.current
      if (canvas && ctx && wrap) {
        const rect = wrap.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)

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
          s.tines.forEach((pts) => {
            if (pts.length < 2) return
            ctx.beginPath()
            ctx.moveTo(pts[0].x + 1, pts[0].y + 1)
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x + 1, pts[i].y + 1)
            ctx.strokeStyle = 'rgba(70,55,38,0.32)'
            ctx.lineWidth = 2.2
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(pts[0].x - 1, pts[0].y - 1)
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x - 1, pts[i].y - 1)
            ctx.strokeStyle = 'rgba(255,248,232,0.5)'
            ctx.lineWidth = 1.8
            ctx.stroke()
          })
          ctx.restore()
        })
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const getPoint = (e: React.PointerEvent): Point | null => {
    const wrap = wrapRef.current
    if (!wrap) return null
    const rect = wrap.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const moveCursor = (p: Point, angleDeg?: number) => {
    const el = cursorRef.current
    if (!el) return
    el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${angleDeg ?? 0}deg)`
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    const p = getPoint(e)
    if (!p) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    draggingRef.current = true
    lastPointRef.current = p

    if (toolRef.current === 'rake') {
      const stroke: Stroke = { tines: Array.from({ length: TINES }, () => []), born: Date.now() }
      strokesRef.current.push(stroke)
      activeStrokeRef.current = stroke
    } else if (toolRef.current === 'eraser') {
      eraseAt(p)
    } else if (toolRef.current === 'blossom') {
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
    setBlossoms((prev) => prev.filter((b) => Math.hypot(b.x - p.x, b.y - p.y) >= BLOSSOM_ERASE_RADIUS))
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
    const p = getPoint(e)
    if (!p) return

    const last = lastPointRef.current
    let angleDeg: number | undefined
    if (last) {
      const dx = p.x - last.x
      const dy = p.y - last.y
      if (Math.hypot(dx, dy) > 0.5) {
        angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90
      }
    }
    moveCursor(p, angleDeg)

    if (!draggingRef.current) {
      lastPointRef.current = p
      return
    }

    if (toolRef.current === 'rake') {
      const wrap = wrapRef.current
      const isMobile = (wrap?.getBoundingClientRect().width ?? 800) < 520
      const spacing = isMobile ? 5 : 7
      const stroke = activeStrokeRef.current
      const prev = last ?? p
      const dx = p.x - prev.x
      const dy = p.y - prev.y
      const len = Math.hypot(dx, dy) || 1
      const perpx = -dy / len
      const perpy = dx / len
      if (stroke) {
        for (let i = 0; i < TINES; i++) {
          const off = (i - (TINES - 1) / 2) * spacing
          stroke.tines[i].push({ x: p.x + perpx * off, y: p.y + perpy * off })
        }
      }
    } else if (toolRef.current === 'eraser') {
      eraseAt(p)
    }

    lastPointRef.current = p
  }

  const endDrag = () => {
    draggingRef.current = false
    activeStrokeRef.current = null
  }

  const handlePointerEnter = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = '1'
  }

  const handlePointerLeave = () => {
    if (cursorRef.current) cursorRef.current.style.opacity = '0'
    endDrag()
  }

  const cursorIcon = TOOLS.find((t) => t.key === tool)!.icon

  return (
    <div className="w-full">
      {/* Mobile: title sits above the plot as its own block (see 00-KaiMobileHERO frame) */}
      <div className="relative mx-auto mb-6 aspect-[806/310] w-[78%] max-w-[320px] md:hidden">
        <Image src="/hero/kai-hero-title.webp" alt="Kai Tran — Design Engineer" fill sizes="320px" className="object-contain" priority />
      </div>

      <div
        ref={wrapRef}
        className="garden-plot relative aspect-[592/926] touch-none overflow-visible rounded-[22px] md:aspect-[803/517] md:rounded-[34px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
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

        <div
          ref={cursorRef}
          aria-hidden
          className="garden-cursor pointer-events-none absolute left-0 top-0 z-30 h-10 w-10 opacity-0"
          style={{ transition: 'opacity 150ms ease' }}
        >
          <Image src={cursorIcon} alt="" fill draggable={false} sizes="40px" className="object-contain" />
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6 md:gap-8">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            aria-pressed={tool === t.key}
            className={`tool-card press-scale flex w-24 flex-col items-center gap-2 rounded-2xl border border-hairline bg-page px-3 py-4 font-mono text-[11px] text-ink-body md:w-28 ${
              tool === t.key ? 'is-selected' : ''
            }`}
          >
            <span className="relative h-10 w-10">
              <Image src={t.icon} alt="" fill sizes="40px" className="object-contain" />
            </span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
