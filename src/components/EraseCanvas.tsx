'use client'

// Picked from /proto/eraser-reveal (2026-10-28 review: "erase the text where the eraser hits it";
// design-intent/eraser-reveal-exploration/NOTES.md). Kai's hand-drawn art in a canvas, so the eraser can wipe the pixels it actually passes over
// instead of fading the whole thing by coverage. Used for the hero title and the principles.
// - Title: the still paints until the 7 cell boil strip loads, then the strip's cells step at the
//   GIF's 140ms while `boiling`. Ink is the asset's alpha.
// - Principle: its final-frame still, dark ink on white (the wrapper multiplies it onto the sand,
//   so wiped pixels go transparent and show sand). Ink is darkness.
// Erased strokes live on their own layer and are cut out of whichever drawing is up, so the wiped
// part stays wiped while the rest keeps boiling.
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'

type Point = { x: number; y: number }

export type EraseHandle = {
  // Wipe along the segment prev → p (box-local CSS px). Returns the share of the ink erased so
  // far, 0..1.
  erase: (prev: Point, p: Point, radius: number) => number
  reset: () => void
}

const FRAME_MS = 140
// Ink is measured on a small copy: plenty to tell 80% from 70%, and cheap to read every sample.
const MEASURE_LONG_SIDE = 96

// Decoded images by src, so a canvas that mounts after a preload can paint on its first frame.
const loaded = new Map<string, HTMLImageElement>()
const pending = new Map<string, Promise<HTMLImageElement>>()
export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = loaded.get(src)
  if (hit) return Promise.resolve(hit)
  let p = pending.get(src)
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        loaded.set(src, img)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
    pending.set(src, p)
  }
  return p
}

// One soft, grainy dab, made once per radius: a radial falloff broken up by per-pixel noise,
// so the wiped edge reads as sand smoothed over the ink rather than a clean airbrush. Dabs
// overlap ~5x along a stroke, so one pass clears the middle and leaves a ragged, partial edge
// that a second pass cleans up.
function makeDab(r: number): HTMLCanvasElement {
  const size = Math.ceil(r * 2)
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + 0.5 - r, y + 0.5 - r) / r
      if (d >= 1) continue
      const fall = d < 0.45 ? 1 : 1 - (d - 0.45) / 0.55
      const grain = 0.45 + 0.55 * Math.random()
      img.data[(y * size + x) * 4 + 3] = Math.round(255 * 0.55 * fall * fall * grain)
    }
  }
  ctx.putImageData(img, 0, 0)
  return c
}

type Props = {
  stillSrc: string
  stripSrc?: string
  frames?: number
  ink: 'alpha' | 'dark'
  boiling?: boolean
  className?: string
}

const EraseCanvas = forwardRef<EraseHandle, Props>(function EraseCanvas({ stillSrc, stripSrc, frames = 1, ink, boiling = false, className = '' }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const eraseRef = useRef<HTMLCanvasElement | null>(null)
  const measureRef = useRef<HTMLCanvasElement | null>(null)
  const stillRef = useRef<HTMLImageElement | null>(null)
  const stripRef = useRef<HTMLImageElement | null>(null)
  const inkRef = useRef<{ amount: Uint8ClampedArray; total: number } | null>(null)
  const frameRef = useRef(0)
  const dprRef = useRef(1)
  const dabRef = useRef<{ r: number; c: HTMLCanvasElement } | null>(null)
  const rafRef = useRef<number | null>(null)

  const draw = useCallback(() => {
    rafRef.current = null
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { width: W, height: H } = canvas
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, W, H)
    const strip = stripRef.current
    if (strip) {
      const cw = strip.naturalWidth / frames
      ctx.drawImage(strip, frameRef.current * cw, 0, cw, strip.naturalHeight, 0, 0, W, H)
    } else if (stillRef.current) {
      ctx.drawImage(stillRef.current, 0, 0, W, H)
    }
    if (eraseRef.current) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.drawImage(eraseRef.current, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
    }
  }, [frames])

  const requestDraw = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw)
  }, [draw])

  // Size the canvas (and the erase layer) to the box at device resolution. Layout size, not the
  // bounding rect: the principle's wrapper rests at scale 0.98. A resize clears the erase layer;
  // the garden resets the whole reveal on resize anyway.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      dprRef.current = dpr
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      const erase = document.createElement('canvas')
      erase.width = canvas.width
      erase.height = canvas.height
      erase.getContext('2d', { willReadFrequently: true })
      eraseRef.current = erase
      dabRef.current = null
      draw()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [draw])

  // The still gives the ink baseline. Already decoded (preloaded) → it paints this frame.
  useLayoutEffect(() => {
    let cancelled = false
    const takeStill = (img: HTMLImageElement) => {
      if (cancelled) return
      stillRef.current = img
      const aspect = img.naturalWidth / img.naturalHeight
      const m = document.createElement('canvas')
      m.width = aspect >= 1 ? MEASURE_LONG_SIDE : Math.round(MEASURE_LONG_SIDE * aspect)
      m.height = aspect >= 1 ? Math.round(MEASURE_LONG_SIDE / aspect) : MEASURE_LONG_SIDE
      const mctx = m.getContext('2d', { willReadFrequently: true })!
      mctx.drawImage(img, 0, 0, m.width, m.height)
      const d = mctx.getImageData(0, 0, m.width, m.height).data
      const amount = new Uint8ClampedArray(m.width * m.height)
      for (let i = 0; i < amount.length; i++) {
        amount[i] = ink === 'alpha' ? d[i * 4 + 3] : 255 - (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3
      }
      inkRef.current = { amount, total: amount.reduce((a, b) => a + b, 0) }
      measureRef.current = m
      draw()
    }
    const cached = loaded.get(stillSrc)
    if (cached) takeStill(cached)
    else loadImage(stillSrc).then(takeStill, () => {})
    if (stripSrc)
      loadImage(stripSrc).then((img) => {
        if (cancelled) return
        stripRef.current = img
        draw()
      }, () => {})
    return () => {
      cancelled = true
    }
  }, [stillSrc, stripSrc, ink, draw])

  // The boil: step the strip's cells while boiling, rest on whatever drawing is up otherwise
  // (every cell is a whole title, so stopping anywhere is fine). Reduced motion rests on cell 1.
  useEffect(() => {
    if (!boiling || frames < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      frameRef.current = (frameRef.current + 1) % frames
      requestDraw()
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [boiling, frames, requestDraw])

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

  const measure = useCallback(() => {
    const inkMap = inkRef.current
    const m = measureRef.current
    const erase = eraseRef.current
    if (!inkMap || !m || !erase || inkMap.total === 0) return 0
    const mctx = m.getContext('2d', { willReadFrequently: true })!
    mctx.clearRect(0, 0, m.width, m.height)
    mctx.drawImage(erase, 0, 0, m.width, m.height)
    const d = mctx.getImageData(0, 0, m.width, m.height).data
    let gone = 0
    for (let i = 0; i < inkMap.amount.length; i++) gone += inkMap.amount[i] * d[i * 4 + 3]
    return gone / 255 / inkMap.total
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      erase(prev, p, radius) {
        const erase = eraseRef.current
        const ctx = erase?.getContext('2d', { willReadFrequently: true })
        if (!erase || !ctx) return 0
        const dpr = dprRef.current
        const r = radius * dpr
        if (!dabRef.current || dabRef.current.r !== r) dabRef.current = { r, c: makeDab(r) }
        const dab = dabRef.current.c
        const ax = prev.x * dpr
        const ay = prev.y * dpr
        const dx = p.x * dpr - ax
        const dy = p.y * dpr - ay
        // Skip segments nowhere near the box.
        if (Math.max(ax, ax + dx) < -r || Math.min(ax, ax + dx) > erase.width + r || Math.max(ay, ay + dy) < -r || Math.min(ay, ay + dy) > erase.height + r) return measure()
        const len = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.ceil(len / (r * 0.2)))
        for (let i = len === 0 ? 0 : 1; i <= steps; i++) {
          const t = i / steps
          // A random turn per dab, so the grain never lines up into a visible pattern.
          ctx.save()
          ctx.translate(ax + dx * t, ay + dy * t)
          ctx.rotate(Math.random() * Math.PI * 2)
          ctx.drawImage(dab, -r, -r)
          ctx.restore()
        }
        requestDraw()
        return measure()
      },
      reset() {
        const erase = eraseRef.current
        erase?.getContext('2d', { willReadFrequently: true })?.clearRect(0, 0, erase.width, erase.height)
        requestDraw()
      },
    }),
    [measure, requestDraw]
  )

  return <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />
})

export default EraseCanvas
