'use client'

import { useEffect, useRef, useState } from 'react'

// The homepage's first load (2026-11-07, after the "rug reveal" reference in the sprint's
// inspiration folder): the garden develops out of the grid paper instead of popping in. The
// paper clears outward from the hero title in soft, blotchy clumps, so the title lands first and
// the edges of the screen arrive last. Only on a fresh load of `/`; a click back home from
// another page gets AppShell's usual page fade. Nothing under reduced motion.
//
// How it draws: a coarse mask (one cell per CELL px) holds how much paper is left at each spot,
// from distance to the title plus fractal noise, and is stretched over the screen with smoothing,
// which is what gives the clumps their smeared, slightly blocky edge. The paper drawn through
// that mask is the same texture as the page's .grid-paper, pinned to the window, so it lines up
// with the paper underneath and only the garden appears to change.

const DURATION = 1500
const CELL = 12
const EDGE = 0.09 // how soft the frontier is, in reveal units
const NOISE = 0.42 // noise share of the reveal order; the rest is distance from the title
const GRID_SRC = '/textures/grid-paper.webp'
const GRID_WIDTH = 336 // matches .grid-paper's background-size
// No JS by then (slow hydration, an error): the CSS fallback has already faded the paper, so don't cover it again.
const LATE_MS = 2600
// Share of the window cleared when the résumé bookmark starts its enter.
const RB_AT = 0.8

// Seen the first load already in this document: client navigations back home skip the fog.
let firstLoad = true

// The résumé bookmark waits hidden under the paper and plays its enter (resume.css, `rb-enter`)
// once most of the garden is showing (RB_AT), so the motion is seen instead of spent under the fog.
// `<html data-rb-enter>`: 'wait', then 'go'; the bookmark
// clears it when its animation ends, so a later remount doesn't replay it.
const setBookmark = (v?: 'wait' | 'go') => {
  if (v) document.documentElement.dataset.rbEnter = v
  else delete document.documentElement.dataset.rbEnter
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)

function makeNoise(cols: number, rows: number) {
  const out = new Float32Array(cols * rows)
  const octaves: [number, number][] = [
    [9, 0.55],
    [4, 0.3],
    [2, 0.15],
  ]
  for (const [period, weight] of octaves) {
    const gw = Math.ceil(cols / period) + 2
    const gh = Math.ceil(rows / period) + 2
    const g = new Float32Array(gw * gh).map(() => Math.random())
    for (let y = 0; y < rows; y++) {
      const fy = y / period
      const y0 = Math.floor(fy)
      const ty = fy - y0
      const sy = ty * ty * (3 - 2 * ty)
      for (let x = 0; x < cols; x++) {
        const fx = x / period
        const x0 = Math.floor(fx)
        const tx = fx - x0
        const sx = tx * tx * (3 - 2 * tx)
        const a = g[y0 * gw + x0]
        const b = g[y0 * gw + x0 + 1]
        const c = g[(y0 + 1) * gw + x0]
        const d = g[(y0 + 1) * gw + x0 + 1]
        out[y * cols + x] += weight * (a + (b - a) * sx + (c - a + (a - b - c + d) * sx) * sy)
      }
    }
  }
  return out
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Wait for the garden's own images so the paper clears onto sand, not onto blanks. Capped, so a
// slow image never holds the page behind paper.
function gardenPainted(cap: number) {
  // Lazy images (and the hidden other breakpoint's) may never load, so only the eager ones count.
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('main img:not([loading="lazy"])')).filter(
    (img) => img.offsetParent !== null,
  )
  const all = Promise.all(imgs.map((img) => img.decode().catch(() => {})))
  return Promise.race([all, new Promise((r) => setTimeout(r, cap))])
}

export default function HomeFog() {
  // Only when this document opened on `/`. Hydrating `/` reads true, matching the server HTML; a
  // click home from another page mounts with false.
  const [on, setOn] = useState(() => {
    if (typeof window === 'undefined') return true
    const entry = performance.getEntriesByType('navigation')[0]
    return firstLoad && new URL(entry?.name ?? location.href).pathname === '/'
  })
  const [handoff, setHandoff] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!on || !firstLoad) return
    firstLoad = false
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || performance.now() > LATE_MS) {
      setOn(false)
      return
    }

    let raf = 0
    let cancelled = false
    let finished = false
    ;(async () => {
      const [grid] = await Promise.all([loadImage(GRID_SRC), gardenPainted(1200)])
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (cancelled) return
      if (!canvas || !ctx || performance.now() > LATE_MS) return setOn(false)

      const W = window.innerWidth
      const H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(W / CELL) + 1
      const rows = Math.ceil(H / CELL) + 1
      const mask = document.createElement('canvas')
      mask.width = cols
      mask.height = rows
      const mctx = mask.getContext('2d')!
      const data = mctx.createImageData(cols, rows)
      for (let i = 0; i < cols * rows; i++) {
        data.data[i * 4] = data.data[i * 4 + 1] = data.data[i * 4 + 2] = 255
      }

      // Reveal order per cell: 0 clears first, 1 last.
      const r = document.querySelector('[data-fog-origin]')?.getBoundingClientRect()
      const ox = r && r.width ? r.left + r.width / 2 : W / 2
      const oy = r && r.width ? r.top + r.height / 2 : H / 2
      const far = Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy))
      const noise = makeNoise(cols, rows)
      let lo = Infinity
      let hi = -Infinity
      for (const n of noise) {
        lo = Math.min(lo, n)
        hi = Math.max(hi, n)
      }
      const order = new Float32Array(cols * rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const d = Math.hypot(x * CELL - ox, y * CELL - oy) / far
          order[i] = (1 - NOISE) * d + NOISE * ((noise[i] - lo) / (hi - lo))
        }
      }

      // The bookmark enters once 80% of the window has cleared (Kai, 2026-11-08): the cell order
      // that 80% of cells sit under is where the frontier is at that moment.
      let rbAt = -1
      if (document.querySelector('.rb')) {
        const sorted = Float32Array.from(order).sort()
        rbAt = sorted[Math.floor(sorted.length * RB_AT)]
        setBookmark('wait')
      }

      const pattern = grid ? ctx.createPattern(grid, 'repeat') : null
      pattern?.setTransform(new DOMMatrix().scale(GRID_WIDTH / grid!.naturalWidth))

      const draw = (p: number) => {
        // p runs from just before the first cell to just past the last, so the frontier enters and leaves whole.
        const front = -EDGE + p * (1 + 2 * EDGE)
        if (rbAt >= 0 && front >= rbAt) {
          rbAt = -1
          setBookmark('go')
        }
        for (let i = 0; i < order.length; i++) {
          const a = (order[i] - front) / EDGE
          data.data[i * 4 + 3] = a <= 0 ? 0 : a >= 1 ? 255 : a * 255
        }
        mctx.putImageData(data, 0, 0)
        ctx.globalCompositeOperation = 'copy'
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(mask, 0, 0, cols * CELL, rows * CELL)
        ctx.globalCompositeOperation = 'source-in'
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, W, H)
        if (pattern) {
          ctx.globalCompositeOperation = 'source-atop'
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, W, H)
        }
      }

      draw(0)
      setHandoff(true)
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        draw(easeOut(t))
        if (t < 1) raf = requestAnimationFrame(tick)
        else {
          finished = true
          setOn(false)
        }
      }
      raf = requestAnimationFrame(tick)
    })()

    return () => {
      // Strict mode reruns effects at once in dev: let that rerun pick the fog back up, but a real
      // unmount (leaving home mid reveal) still counts as the first load having happened.
      if (!finished) {
        setBookmark()
        firstLoad = true
        queueMicrotask(() => (firstLoad = false))
      }
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!on) return null
  return (
    <div aria-hidden className="home-fog">
      {/* In the server HTML, so the paper is there from the first paint; the canvas takes over once it has drawn. */}
      {!handoff && <div className="home-fog-paper grid-paper" />}
      <canvas ref={canvasRef} className="home-fog-canvas" />
    </div>
  )
}
