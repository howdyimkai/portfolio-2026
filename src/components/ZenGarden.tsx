'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Tool = 'rake' | 'eraser' | 'blossom'

type Point = { x: number; y: number }
type TinePath = { light: Path2D; dark: Path2D; lastLight: Point | null; lastDark: Point | null }
// A gesture is one continuous rake hover (pointerenter to pointerleave, or until the
// tool switches away). It owns the hold/fade clock: while `active` is true every chunk
// belonging to it renders at full alpha no matter how long the hover lasts; the clock
// starts only when the gesture ends, at which point every chunk born under it holds and
// fades together (see HOLD_MS/FADE_MS below).
type Gesture = { active: boolean; born: number }
// A stroke is one chunk of a rake gesture: per-tine groove paths plus a center path
// used to carve (erase) older chunks it crosses before its own grooves are drawn. Raw
// points and accumulated path length drive the rolling chunk split; every chunk of a
// gesture shares that gesture's alpha/aging state by reference.
type Stroke = {
  tines: TinePath[]
  center: Path2D
  lastCenter: Point | null
  points: Point[]
  length: number
  gesture: Gesture
}
type Blossom = { id: number; x: number; y: number; rotation: number; scale: number }
type Rect = { left: number; top: number; width: number; height: number }

// Groove anatomy: one dark stroke and one light stroke per tine, each offset ±1px
// diagonally (light toward top-left, dark toward bottom-right) so the pair reads as a
// thin embossed pinstripe rather than a hard outline — the subtle pre-video mark,
// restored from the last committed version (884bd59) in place of the heavier
// trench+ridge stack built while chasing GardenRakeStudy.mov realism.
//
// TINES/TINE_PITCH/CARVE_WIDTH stay from that carve-over iteration: the mark must look
// like it was made by the ~40px 4-prong cursor asset (design-intent/Teethrake4prongs-2x.png,
// 198x348 @2x). That asset has 4 prongs; at the cursor's 40x40 object-contain box
// (scale ≈ 40/348 ≈ 0.115) the outer prong centers land ≈13.4px apart, hence 4 tines at
// a 4.4px pitch (3 * 4.4 ≈ 13.2px outer span). Values are fixed CSS px at every
// breakpoint because the cursor is too.
const TINES = 4
const TINE_PITCH = 4.4 // outer tine centers ≈ 3 * 4.4 = 13.2px apart, matching the asset
const GROOVE_OFFSET = 1 // light shifts -x/-y, dark shifts +x/+y (884bd59 emboss offset)
const DARK_COLOR = 'rgba(70,55,38,0.32)'
// 884bd59 used 2.2/1.8 at a 7px (desktop) tine pitch. At this scale's tighter 4.4px
// pitch those widths bridge clear across the gap between tines under a real drag — a
// pixel cross-section of a drawn stroke showed the 4 ribs fused into one solid band
// with no dips back to zero alpha. Narrowed here (colors/alphas unchanged) until a
// cross-section shows 4 distinct peaks separated by near-zero valleys.
const DARK_WIDTH = 1.5
const LIGHT_COLOR = 'rgba(255,248,232,0.5)'
const LIGHT_WIDTH = 1.2
// The rake head flattens a band slightly wider than the tine span as it carves,
// erasing whatever pattern it crosses (the carve-over moment in the study video).
const CARVE_WIDTH = (TINES - 1) * TINE_PITCH + 4

// Hold/fade timing (884bd59): a finished gesture holds at full strength, then fades
// linearly to nothing. Aging is per GESTURE, not per chunk — see the Gesture type.
const HOLD_MS = 10000
const FADE_MS = 3000

// Rolling chunk split: a long gesture is cut into ~120px chunks so raking over an
// *earlier part of the same gesture* still carves it away (hover raking makes a single
// gesture arbitrarily long, so self-crossing is the common case). The next chunk starts
// exactly at the previous chunk's last point with its direction preserved, so the seam
// is a butt joint of identical geometry — and butt caps on the carve pass keep a
// chunk's erase from reaching backward past that seam. Bonus: per-frame draw cost is
// bounded by the live population (everything fades out within HOLD_MS + FADE_MS)
// instead of growing with how long the page has been open.
const CHUNK_COMMIT_LEN = 120

const ERASE_RADIUS = 28
const BLOSSOM_ERASE_RADIUS = 34
// Cursor rotation eases toward its target each frame instead of snapping (0-1, higher = snappier).
const CURSOR_ANGLE_LERP = 0.35

// --- Towed-head rake mechanic (2026-07-13 feel experiment) ---
// A real rake is pulled, not pushed: the hand leads, the head drags behind on a fixed
// leash, and grooves flow out from under the trailing head. The rake/eraser head is
// modeled as a towed point — a caster/tractrix follow, the same math as a trailer
// behind a car — recomputed every pointer sample (including coalesced ones). Grooves
// come from the HEAD's path, not the raw pointer path, so a fast zigzag hand motion
// sweeps into arcs instead of snapping to sharp corners. Isolated here (constants +
// stepHead + the towed branch in handlePointerMove) so it's trivially revertible/tunable
// without touching the groove rendering system below, which is unchanged.
const RAKE_FOLLOW_DIST = 24 // px the head trails behind the pointer, once it's moving
// The head starts coincident with the pointer on every (re)arm and only begins moving
// once the pointer has pulled farther than RAKE_FOLLOW_DIST away — that alone prevents
// most entry dots. HEAD_MIN_TRAVEL is a second, explicit gate: no groove point is pushed
// until the head has accumulated this much of its own travel, so the very first sliver
// of head movement can't stamp a short stub either.
const HEAD_MIN_TRAVEL = 6
// Cursor renders at the HEAD position, rotated so the handle points from the head
// toward the pointer (handle toward the hand, head trailing). Verified visually in the
// browser against the actual asset — see iteration-5-report.md. The old push-mode
// offset was +90 (tines lead, in the direction of travel); pulling needs the opposite
// tines/handle assignment for the same on-screen angle, hence -90 here, not +90.
const CURSOR_HANDLE_OFFSET_DEG = -90

// Moves `head` toward `pointer` along the head->pointer line so it ends up exactly
// `follow` behind. If the pointer is already within `follow`, the head doesn't move at
// all (this is what makes it fall behind naturally instead of snapping to a fixed lag).
function stepHead(head: Point, pointer: Point, follow: number): Point {
  const dx = pointer.x - head.x
  const dy = pointer.y - head.y
  const dist = Math.hypot(dx, dy)
  if (dist <= follow) return head
  const t = (dist - follow) / dist
  return { x: head.x + dx * t, y: head.y + dy * t }
}

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

// --- Erase-the-name reveal (desktop only, 2026-07-19) ---
// Kai's hand-written principles (same asset-not-CSS-type rule as the hero title):
// write-on videos from design-intent/principles-v2/ (bolder brush, two lines; 2026-10-08),
// background levelled to pure white and cropped at native scale to a shared 1440x540 frame
// centered on each ink bbox, so the handwriting scale matches across all five. They sit on the sand via mix-blend-mode: multiply, so white
// drops out and only ink shows. The .webp is each video's final frame — the poster, and
// the whole reveal under prefers-reduced-motion (the video is never played there).
const PRINCIPLES = [
  { text: 'learning should feel like discovery, and discovery should be delightful', src: '/principles/delight' },
  { text: 'the best designs remove friction rather than add', src: '/principles/removefriction' },
  { text: 'great designs can be both genius and stupid simple', src: '/principles/simple' },
  { text: 'solid systems should be practical and save time', src: '/principles/solidsystems' },
  { text: 'i design interfaces to fade, so content can shimmer and shine', src: '/principles/content' },
]

// Coverage grid over the title's bounding box: erasing is tracked as swept cells, not a
// single hit-test, so the title's opacity can fade continuously with progress instead of
// snapping at a threshold. Desktop-only — the title lives inside the interactive plot only
// at md+ (see the md:flex title block below); on mobile it's a separate static block above
// the plot entirely, so this whole mechanic is gated behind an explicit viewport check
// rather than relying on a hidden element's (unreliable) getBoundingClientRect.
//
// Only cells that actually hold title ink count (INK_CELL_MIN of the cell's pixels,
// read from the title asset's alpha once on mount). The bounding box has a lot of bare
// sand around the letterforms; counting those cells meant you could wipe every visible
// stroke and still sit under the threshold, hunting for invisible corners. Inked cells
// count equally rather than by ink amount, so thin strokes weigh as much as dense ones.
//
// The title is Kai's October hero (design-intent/Kai-October-Hero.GIF, 2026-10-08), a
// line-boil loop. The GIF ping-pongs 7 drawings (1-7-2); here they're a sprite strip in
// a scrambled order (1-4-2-6-3-7-5) so the boil reads as redrawn rather than as a
// wobble, stepped by a CSS animation whose play state we own: an animated image can't
// be paused or restarted. The still is frame 1 — painted first (the strip is ~4x the
// bytes), the ink-grid source, and what rests underneath until the strip has loaded.
const TITLE_STILL_SRC = '/hero/kai-hero-october-still.webp'
const TITLE_BOIL_SRC = '/hero/kai-hero-october-boil.webp'
const TITLE_BOIL_FRAMES = 7
const TITLE_ALT = 'Kai Tran, designer and tinkerer. I make learning feel like play.'
const TITLE_GRID_COLS = 16
const TITLE_GRID_ROWS = 6

// The title rests and wiggles (boils) only while the pointer is over it — Kai, 2026-10-08:
// boiling on load / whenever the garden was entered "feels kinda abrupt". It finishes one
// loop after the pointer leaves rather than stopping dead. Pausing freezes on whatever
// drawing is up — every frame is a whole title, so there's no snap back to frame 1.
// One loop = 7 frames at the GIF's 140ms (matches .title-boil in globals.css).
const BOIL_LOOP_MS = 980
const BOIL_TAIL_MS = BOIL_LOOP_MS
const INK_CELL_MIN = 0.03
const TITLE_ERASE_THRESHOLD = 0.8

// Sequence timings. The reading clock starts when the write-on video FINISHES, not when
// the reveal starts — a fixed hold from the start ate 1.3-2.1s of it on the writing and
// left ~2.5s to read (Kai, 2026-09-29: "snaps back too fast"). The return is a slow
// settle with a beat of empty sand between principle and title, not a swap.
const REVEAL_DELAY_MS = 1000
const PRINCIPLE_ENTER_MS = 380
const PRINCIPLE_READ_MS = 4000
const PRINCIPLE_EXIT_MS = 600
const TITLE_RETURN_GAP_MS = 300
const TITLE_ENTER_MS = 900
// The returns use an even ease-in-out, not the shared ease-out: a strong ease-out
// front-loads the change (the title hit 90% opacity ~250ms into a 900ms transition),
// which reads as a snap no matter how long the duration is.
const SETTLE_EASE = 'cubic-bezier(0.45, 0, 0.55, 1)'

// The principle erases like the title (Kai, 2026-09-29): same swept-segment coverage over
// an ink-only grid, same scrubbed opacity + blur. Its box is ~4.4:1, hence the wider grid
// (cells land ~30x27px on screen, close to the title's). Once erasing starts, the read
// timer is replaced by PRINCIPLE_IDLE_MS of inactivity, so a half-erased principle
// finishes its return on its own instead of sitting there partly wiped.
const PRINCIPLE_GRID_COLS = 20
const PRINCIPLE_GRID_ROWS = 8
const PRINCIPLE_ERASE_THRESHOLD = 0.8
const PRINCIPLE_IDLE_MS = 2500

type InkGrid = { mask: boolean[]; total: number; cols: number; rows: number }

// Decode an image and mark which cells of a cols x rows grid hold ink, where isInk tests
// one pixel of the RGBA buffer at byte offset i.
async function readInkGrid(
  src: string,
  cols: number,
  rows: number,
  isInk: (data: Uint8ClampedArray, i: number) => boolean
): Promise<InkGrid> {
  const img = new window.Image()
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('no 2d context')
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, c.width, c.height)
  const mask: boolean[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = Math.floor((col * c.width) / cols)
      const x1 = Math.floor(((col + 1) * c.width) / cols)
      const y0 = Math.floor((row * c.height) / rows)
      const y1 = Math.floor(((row + 1) * c.height) / rows)
      let inked = 0
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) if (isInk(data, (y * c.width + x) * 4)) inked++
      }
      mask.push(inked / ((x1 - x0) * (y1 - y0)) >= INK_CELL_MIN)
    }
  }
  return { mask, total: mask.filter(Boolean).length, cols, rows }
}

// Mark every not-yet-covered inked cell whose center lies within radius of the segment
// prev -> p. Returns how many cells were newly covered.
function sweepInkCells(covered: boolean[], ink: InkGrid, rect: Rect, prev: Point, p: Point, radius: number): number {
  if (rect.width <= 0 || rect.height <= 0) return 0
  const cellW = rect.width / ink.cols
  const cellH = rect.height / ink.rows
  const sx = p.x - prev.x
  const sy = p.y - prev.y
  const segLenSq = sx * sx + sy * sy
  let added = 0
  for (let row = 0; row < ink.rows; row++) {
    for (let col = 0; col < ink.cols; col++) {
      const idx = row * ink.cols + col
      if (!ink.mask[idx] || covered[idx]) continue
      const cx = rect.left + (col + 0.5) * cellW
      const cy = rect.top + (row + 0.5) * cellH
      const t = segLenSq > 0 ? Math.max(0, Math.min(1, ((cx - prev.x) * sx + (cy - prev.y) * sy) / segLenSq)) : 0
      if (Math.hypot(cx - (prev.x + sx * t), cy - (prev.y + sy * t)) < radius) {
        covered[idx] = true
        added++
      }
    }
  }
  return added
}

// Still first, then the sprite strip over it once loaded (the still is hidden then, or its
// ink would show through the other frames). The strip is 7 cells wide, so one cell fills
// the box; title-boil steps it across them. Reduced motion: the strip rests on cell 1.
function TitleArt({ boiling }: { boiling: boolean }) {
  const [stripReady, setStripReady] = useState(false)
  const markReady = useCallback(() => setStripReady(true), [])
  return (
    <div role="img" aria-label={TITLE_ALT} className="absolute inset-0 overflow-hidden">
      <Image
        src={TITLE_STILL_SRC}
        alt=""
        fill
        unoptimized
        priority
        draggable={false}
        className={`object-contain ${stripReady ? 'invisible' : ''}`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        // A cached strip can finish before hydration attaches onLoad, so check on mount too.
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0 && !stripReady) markReady()
        }}
        src={TITLE_BOIL_SRC}
        alt=""
        draggable={false}
        onLoad={markReady}
        className={`title-boil absolute top-0 left-0 h-full max-w-none ${stripReady ? '' : 'invisible'}`}
        style={{ width: `${TITLE_BOIL_FRAMES * 100}%`, animationPlayState: boiling ? 'running' : 'paused' }}
      />
    </div>
  )
}

// Fisher-Yates shuffle of principle indices, with a guard so a fresh reshuffle never
// starts with the same principle that just finished — otherwise "shuffled bag" can still
// feel like a repeat right at the seam between bags.
function shuffledPrincipleIndices(avoid?: number): number[] {
  const arr = PRINCIPLES.map((_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (avoid !== undefined && arr[0] === avoid && arr.length > 1) {
    const swapWith = 1 + Math.floor(Math.random() * (arr.length - 1))
    ;[arr[0], arr[swapWith]] = [arr[swapWith], arr[0]]
  }
  return arr
}

type SequencePhase = 'idle' | 'principle-in' | 'principle-hold' | 'principle-out' | 'title-in'

let blossomIdCounter = 0

function createStroke(gesture: Gesture): Stroke {
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
    gesture,
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
// not grow with how long the gesture has been going — only with the current chunk.
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
    tine.lastLight = extendPath(tine.light, tine.lastLight, { x: cx - GROOVE_OFFSET, y: cy - GROOVE_OFFSET })
    tine.lastDark = extendPath(tine.dark, tine.lastDark, { x: cx + GROOVE_OFFSET, y: cy + GROOVE_OFFSET })
  }
  stroke.lastCenter = extendPath(stroke.center, stroke.lastCenter, p)
  stroke.points.push(p)
  stroke.length += dist
}

// The quadratic-midpoint technique always stops half a segment short of the last real
// sample. Cap each path with a final line to its true last position so a chunk doesn't
// visibly stop short when it's committed (chunk rollover, gesture end, or tool switch).
function finalizeStroke(stroke: Stroke) {
  stroke.tines.forEach((tine) => {
    if (tine.lastLight) tine.light.lineTo(tine.lastLight.x, tine.lastLight.y)
    if (tine.lastDark) tine.dark.lineTo(tine.lastDark.x, tine.lastDark.y)
  })
  if (stroke.lastCenter) stroke.center.lineTo(stroke.lastCenter.x, stroke.lastCenter.y)
}

// Carve-over + grooves for one chunk. First flattens the sand under the rake head
// (destination-out along the center path, butt cap so the erase can't reach backward
// past a chunk seam), erasing any older chunk it crosses, then draws each tine's paired
// dark/light stroke at the gesture's current alpha. The carve pass always runs at full
// strength regardless of alpha — every chunk only ever draws over strictly older chunks
// (strokesRef is chronological), so a fading chunk carving at full strength can never
// wipe something newer.
function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, alpha: number) {
  ctx.save()
  ctx.lineJoin = 'round'

  ctx.lineCap = 'butt'
  ctx.globalCompositeOperation = 'destination-out'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = CARVE_WIDTH
  ctx.stroke(stroke.center)
  ctx.globalCompositeOperation = 'source-over'

  ctx.lineCap = 'round'
  ctx.globalAlpha = alpha
  stroke.tines.forEach((tine) => {
    ctx.strokeStyle = DARK_COLOR
    ctx.lineWidth = DARK_WIDTH
    ctx.stroke(tine.dark)

    ctx.strokeStyle = LIGHT_COLOR
    ctx.lineWidth = LIGHT_WIDTH
    ctx.stroke(tine.light)
  })
  ctx.restore()
}

export default function ZenGarden() {
  const [tool, setTool] = useState<Tool | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  // Every live chunk (from any gesture, finished or in-progress-but-rolled-over) in
  // chronological insertion order. No persistent bake layer — the whole population is
  // redrawn from scratch every frame, oldest first, so later chunks' carve passes erase
  // earlier ones where they cross. Population stays bounded because every chunk expires
  // (filtered out) within HOLD_MS + FADE_MS of its gesture ending.
  const strokesRef = useRef<Stroke[]>([])
  const activeStrokeRef = useRef<Stroke | null>(null)
  const activeGestureRef = useRef<Gesture | null>(null)
  const hoveringRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)
  // Current towed-head position for rake/eraser, in the same plot-local coords as
  // everything else. `null` is the "(re)arm" signal: the next pointermove sample snaps
  // the head to the raw pointer instead of stepping it, so every arm starts coincident
  // and falls behind naturally. headTraveledRef accumulates the head's own path length
  // since the last (re)arm, for the HEAD_MIN_TRAVEL entry-dot guard.
  const headPosRef = useRef<Point | null>(null)
  const headTraveledRef = useRef(0)
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

  // Erase-the-name reveal state (desktop only — see PRINCIPLES block above).
  const titleElRef = useRef<HTMLDivElement>(null)

  // Title boil (see BOIL_* above). Tracked apart from hoveringRef, which only follows
  // hover while a tool is armed — the title wiggles under a bare pointer too.
  const [titleBoiling, setTitleBoiling] = useState(false)
  const boilTimerRef = useRef<number | null>(null)
  const overTitleRef = useRef(false)
  // Boil now; settle after `ms`, or keep going until told otherwise when null.
  const boilFor = useCallback((ms: number | null) => {
    if (boilTimerRef.current !== null) window.clearTimeout(boilTimerRef.current)
    boilTimerRef.current = ms === null ? null : window.setTimeout(() => setTitleBoiling(false), ms)
    setTitleBoiling(true)
  }, [])
  useEffect(
    () => () => {
      if (boilTimerRef.current !== null) window.clearTimeout(boilTimerRef.current)
    },
    []
  )
  const isDesktopRef = useRef(false)
  const titleRectRef = useRef<Rect>({ left: 0, top: 0, width: 0, height: 0 })
  // Desktop: the title sits in a pointer-events-none layer over the plot, so hover is a
  // hit-test of plot-local points against its box (titleRectRef is zeroed on mobile).
  const updateTitleHover = useCallback(
    (p: Point | null) => {
      const r = titleRectRef.current
      const over = p !== null && p.x >= r.left && p.x <= r.left + r.width && p.y >= r.top && p.y <= r.top + r.height
      if (over === overTitleRef.current) return
      overTitleRef.current = over
      boilFor(over ? null : BOIL_TAIL_MS)
    },
    [boilFor]
  )
  const titleGridRef = useRef<boolean[]>(new Array(TITLE_GRID_COLS * TITLE_GRID_ROWS).fill(false))
  const titleCoveredCountRef = useRef(0)
  // Which cells hold ink, and how many — null until the mask is read.
  const titleInkRef = useRef<InkGrid | null>(null)
  const prevEraseHeadRef = useRef<Point | null>(null)
  const sequenceActiveRef = useRef(false)
  const principleQueueRef = useRef<number[]>(shuffledPrincipleIndices())
  const lastPrincipleRef = useRef<number | undefined>(undefined)
  const sequenceTimeoutsRef = useRef<number[]>([])
  const autoReturnRef = useRef<number | null>(null)
  const [sequencePhase, setSequencePhase] = useState<SequencePhase>('idle')
  const [principleIndex, setPrincipleIndex] = useState(0)
  const principleVideoRefs = useRef<(HTMLVideoElement | null)[]>([])
  // The principle is erasable too, with the same scrubbed fade + blur as the title.
  const principleElRef = useRef<HTMLDivElement>(null)
  const principleRectRef = useRef<Rect>({ left: 0, top: 0, width: 0, height: 0 })
  const principleInksRef = useRef<(InkGrid | null)[]>(PRINCIPLES.map(() => null))
  const principleGridRef = useRef<boolean[]>(new Array(PRINCIPLE_GRID_COLS * PRINCIPLE_GRID_ROWS).fill(false))
  const principleCoveredCountRef = useRef(0)
  const principleErasableRef = useRef(false)
  // Once the write-on finishes, the video is swapped for its identical final-frame still.
  // Blur is only safe on the still — filter: blur over a <video> layer draws a dark frame
  // at its edges, which the multiply blend makes visible.
  const [principleStill, setPrincipleStill] = useState(false)
  const principleStillRef = useRef(false)

  const clearSequenceTimeouts = useCallback(() => {
    sequenceTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    sequenceTimeoutsRef.current = []
    if (autoReturnRef.current !== null) window.clearTimeout(autoReturnRef.current)
    autoReturnRef.current = null
  }, [])

  const showPrincipleStill = useCallback((still: boolean) => {
    principleStillRef.current = still
    setPrincipleStill(still)
  }, [])

  const clearPrincipleInline = useCallback(() => {
    const el = principleElRef.current
    if (el) {
      el.style.opacity = ''
      el.style.filter = ''
    }
  }, [])

  const resetTitleErase = useCallback(() => {
    clearSequenceTimeouts()
    titleGridRef.current.fill(false)
    titleCoveredCountRef.current = 0
    sequenceActiveRef.current = false
    principleErasableRef.current = false
    setSequencePhase('idle')
    clearPrincipleInline()
    if (titleElRef.current) {
      titleElRef.current.style.opacity = ''
      titleElRef.current.style.filter = ''
      titleElRef.current.style.transitionDuration = ''
      titleElRef.current.style.transitionTimingFunction = ''
    }
  }, [clearSequenceTimeouts, clearPrincipleInline])

  // principle-out -> (gap) -> title-in -> idle. Called by the auto-return timer when the
  // principle is left alone, or by the eraser once it's wiped away. \`erased\` skips the
  // exit wait, since the principle is already gone.
  const beginReturn = useCallback(
    (erased: boolean) => {
      clearSequenceTimeouts()
      principleErasableRef.current = false
      // Hand opacity/blur back to the phase classes so a half-erased principle fades out
      // from where it is rather than being pinned by its inline scrub values.
      if (!erased) clearPrincipleInline()
      setSequencePhase('principle-out')
      const titleAt = (erased ? 0 : PRINCIPLE_EXIT_MS) + TITLE_RETURN_GAP_MS
      sequenceTimeoutsRef.current.push(
        window.setTimeout(() => {
          // Coverage resets here, not at the end — by the time the title is visible again
          // it requires fresh erasing, so a cursor still lingering over it can't instantly
          // re-trigger the sequence.
          titleGridRef.current.fill(false)
          titleCoveredCountRef.current = 0
          clearPrincipleInline()
          const el = titleElRef.current
          if (el) {
            // Slow settle for the return only; the 320ms class duration stays for the
            // scrubbed fade while erasing, where it just smooths between samples.
            el.style.transitionDuration = `${TITLE_ENTER_MS}ms`
            el.style.transitionTimingFunction = SETTLE_EASE
            el.style.opacity = ''
            el.style.filter = ''
          }
          setSequencePhase('title-in')
        }, titleAt),
        window.setTimeout(() => {
          if (titleElRef.current) {
            titleElRef.current.style.transitionDuration = ''
            titleElRef.current.style.transitionTimingFunction = ''
          }
          sequenceActiveRef.current = false
          setSequencePhase('idle')
        }, titleAt + TITLE_ENTER_MS)
      )
    },
    [clearSequenceTimeouts, clearPrincipleInline]
  )

  const scheduleAutoReturn = useCallback(
    (ms: number) => {
      if (autoReturnRef.current !== null) window.clearTimeout(autoReturnRef.current)
      autoReturnRef.current = window.setTimeout(() => {
        autoReturnRef.current = null
        beginReturn(false)
      }, ms)
    },
    [beginReturn]
  )

  // Fires once title coverage crosses TITLE_ERASE_THRESHOLD: plays a principle, which then
  // either gets erased (see updateErase) or returns to the title on its own after the read.
  const triggerReveal = useCallback(() => {
    if (sequenceActiveRef.current) return
    sequenceActiveRef.current = true
    if (titleElRef.current) {
      titleElRef.current.style.opacity = '0'
      titleElRef.current.style.filter = 'blur(3px)'
    }

    // A beat of bare sand between the wiped title and the principle writing in (Kai,
    // 2026-10-08: it came in too soon after the erase). Queued with the other sequence
    // timeouts so a reset mid-beat cancels it.
    sequenceTimeoutsRef.current.push(
      window.setTimeout(() => {
        if (principleQueueRef.current.length === 0) {
          principleQueueRef.current = shuffledPrincipleIndices(lastPrincipleRef.current)
        }
        const nextIndex = principleQueueRef.current.shift()!
        lastPrincipleRef.current = nextIndex
        setPrincipleIndex(nextIndex)

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const video = principleVideoRefs.current[nextIndex]
        showPrincipleStill(reduceMotion)
        if (video && !reduceMotion) {
          video.currentTime = 0
          // Autoplay of a muted inline video can still be refused; the poster (final frame)
          // is already showing, so a rejected play() degrades to the static principle.
          video.play().catch(() => {
            showPrincipleStill(true)
            principleErasableRef.current = true
          })
        }
        setSequencePhase('principle-in')

        // Principle hit area: the wrapper's untransformed box (it rests at scale 0.98 while
        // hidden, so the bounding rect alone would be 2% small), centered on its layout center.
        // Not erasable yet: the wipe that erased the title is usually still moving over this
        // same spot, and would start wiping the principle the instant it appears. It opens
        // up once the writing is done (video 'ended', or the hold timer for a still).
        principleGridRef.current.fill(false)
        principleCoveredCountRef.current = 0
        principleErasableRef.current = false
        const pEl = principleElRef.current
        if (pEl) {
          const b = pEl.getBoundingClientRect()
          const w = pEl.offsetWidth
          const h = pEl.offsetHeight
          principleRectRef.current = {
            left: b.left + b.width / 2 - w / 2 - rectRef.current.left,
            top: b.top + b.height / 2 - h / 2 - rectRef.current.top,
            width: w,
            height: h,
          }
        }

        // The reading clock starts when the write-on video finishes.
        const writeMs = !reduceMotion && video && Number.isFinite(video.duration) ? video.duration * 1000 : 0
        sequenceTimeoutsRef.current.push(
          window.setTimeout(() => {
            setSequencePhase('principle-hold')
            if (principleStillRef.current) principleErasableRef.current = true
          }, PRINCIPLE_ENTER_MS)
        )
        scheduleAutoReturn(Math.max(PRINCIPLE_ENTER_MS, writeMs) + PRINCIPLE_READ_MS)
      }, REVEAL_DELAY_MS)
    )
  }, [showPrincipleStill, scheduleAutoReturn])

  // Coverage-driven fades for both the title and the principle: each towed-head step
  // marks any not-yet-swept inked cell within ERASE_RADIUS of the SEGMENT from the
  // previous head to the new one. Testing only the sample points made coverage
  // speed-dependent — a fast straight wipe moves ~30px between samples and slipped past
  // cells a slow, turning stroke would catch. Opacity maps 1:1 to coverage progress (a
  // scrubbed value, not a discrete state change) so things visibly erase as you rake.
  const updateErase = useCallback(
    (p: Point) => {
      const prev = prevEraseHeadRef.current ?? p
      prevEraseHeadRef.current = p
      if (!isDesktopRef.current) return

      if (!sequenceActiveRef.current) {
        const ink = titleInkRef.current
        if (!ink || ink.total === 0) return
        if (sweepInkCells(titleGridRef.current, ink, titleRectRef.current, prev, p, ERASE_RADIUS) === 0) return
        titleCoveredCountRef.current = titleGridRef.current.filter(Boolean).length
        const coverage = Math.min(1, titleCoveredCountRef.current / ink.total / TITLE_ERASE_THRESHOLD)
        const el = titleElRef.current
        if (el) {
          el.style.opacity = String(1 - coverage)
          el.style.filter = `blur(${coverage * 3}px)`
        }
        if (coverage >= 1) triggerReveal()
        return
      }

      if (!principleErasableRef.current) return
      const ink = principleInksRef.current[lastPrincipleRef.current ?? -1]
      if (!ink || ink.total === 0) return
      if (sweepInkCells(principleGridRef.current, ink, principleRectRef.current, prev, p, ERASE_RADIUS) === 0) return
      principleCoveredCountRef.current = principleGridRef.current.filter(Boolean).length
      const coverage = Math.min(1, principleCoveredCountRef.current / ink.total / PRINCIPLE_ERASE_THRESHOLD)
      const el = principleElRef.current
      if (el) {
        el.style.opacity = String(1 - coverage)
        if (principleStillRef.current) el.style.filter = `blur(${coverage * 3}px)`
      }
      if (coverage >= 1) {
        beginReturn(true)
      } else {
        // Erasing has started: the reveal is in the visitor's hands now. If they stop
        // partway, finish the return on its own rather than leaving it half-erased.
        scheduleAutoReturn(PRINCIPLE_IDLE_MS)
      }
    },
    [triggerReveal, beginReturn, scheduleAutoReturn]
  )

  // Read which grid cells hold ink, once: the title from its alpha, each principle from
  // its final-frame still (dark ink on white). Both are drawn in boxes of their own
  // aspect ratio, so asset cells map 1:1 onto the on-screen grid. Until these resolve,
  // erasing that target is a no-op.
  useEffect(() => {
    let cancelled = false
    readInkGrid(TITLE_STILL_SRC, TITLE_GRID_COLS, TITLE_GRID_ROWS, (d, i) => d[i + 3] > 64).then(
      (g) => {
        if (!cancelled) titleInkRef.current = g
      },
      () => {}
    )
    PRINCIPLES.forEach((pr, idx) => {
      readInkGrid(`${pr.src}.webp`, PRINCIPLE_GRID_COLS, PRINCIPLE_GRID_ROWS, (d, i) => d[i] + d[i + 1] + d[i + 2] < 3 * 140).then(
        (g) => {
          if (!cancelled) principleInksRef.current[idx] = g
        },
        () => {}
      )
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Finalize the active chunk, push it into the live list, and stamp the gesture's
  // aging clock (gesture over — every chunk it owns starts holding/fading together).
  const commitGesture = useCallback(() => {
    const stroke = activeStrokeRef.current
    const gesture = activeGestureRef.current
    if (stroke) {
      finalizeStroke(stroke)
      strokesRef.current.push(stroke)
    }
    if (gesture) {
      gesture.active = false
      gesture.born = Date.now()
    }
    activeStrokeRef.current = null
    activeGestureRef.current = null
  }, [])

  // Mid-gesture chunk rollover: finalize the current chunk into the live list, then
  // start the next one at the same point with the same direction, so the seam is a
  // butt joint of identical geometry (no gap, no double-composite). The new chunk keeps
  // the same gesture reference, so it stays exempt from aging until the gesture ends.
  const rolloverActiveStroke = useCallback(() => {
    const stroke = activeStrokeRef.current
    const gesture = activeGestureRef.current
    if (!stroke || !gesture || stroke.points.length < 2) return
    const pts = stroke.points
    const last = pts[pts.length - 1]
    const prev = pts[pts.length - 2]

    finalizeStroke(stroke)
    strokesRef.current.push(stroke)

    const next = createStroke(gesture)
    pushRakePoint(next, last, prev)
    next.length = 0
    activeStrokeRef.current = next
  }, [])

  useEffect(() => {
    commitGesture()
    toolRef.current = tool
    // Re-arm the towed head on every tool switch (rake<->eraser included) so it starts
    // coincident with the current pointer rather than carrying over a lag computed for
    // a different tool/gesture.
    headPosRef.current = null
    prevEraseHeadRef.current = null
    headTraveledRef.current = 0
    // Switching to rake while already hovering the plot should start drawing
    // immediately rather than waiting for the next pointer enter.
    if (tool === 'rake' && hoveringRef.current) {
      const gesture: Gesture = { active: true, born: Date.now() }
      activeGestureRef.current = gesture
      activeStrokeRef.current = createStroke(gesture)
    }
  }, [tool, commitGesture])

  useEffect(() => {
    blossomsRef.current = blossoms
  }, [blossoms])

  useEffect(() => {
    const img = new window.Image()
    img.src = '/garden/tool-blossom.webp'
    blossomImgRef.current = img
  }, [])

  const resizeRef = useRef<() => void>(() => {})
  const resize = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    // ShelfNav grows/shrinks the plot with a FLIP transform when its header collapses, and
    // the ResizeObserver fires on that animation's first frame — getBoundingClientRect would
    // report the in-between size. Measure once the transform has settled instead.
    const running = wrap.getAnimations()
    if (running.length) {
      const again = () => resizeRef.current()
      Promise.all(running.map((a) => a.finished)).then(again, again)
      return
    }
    const rect = wrap.getBoundingClientRect()
    rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Live chunks are vector paths in plot-local coordinates; a breakpoint change swaps
    // the sand image (landscape ↔ portrait) and its coordinate space entirely, so old
    // paths would land in the wrong place. Simplest correct behavior: drop them. They
    // would fade out within HOLD_MS + FADE_MS on their own anyway, so this is never a
    // jarring loss.
    strokesRef.current = []
    activeStrokeRef.current = null
    activeGestureRef.current = null
    // lastPointRef is in the same stale coordinate space — drop it so the next sample
    // starts a fresh segment instead of drawing a long streak from the old position.
    lastPointRef.current = null
    // Same reasoning for the towed head: null re-arms it, so the next sample snaps the
    // head to the pointer in the new coordinate space instead of stepping from a
    // position that belongs to the old plot geometry.
    headPosRef.current = null
    prevEraseHeadRef.current = null
    headTraveledRef.current = 0
    // If the pointer is already hovering with the rake selected when a resize lands
    // (e.g. a breakpoint change mid-gesture), no new pointerenter will ever fire — the
    // cursor never actually left the element — so without this, activeStrokeRef would
    // stay null and raking would silently stop until the pointer leaves and re-enters.
    // Re-arm immediately instead, exactly like the tool-switch effect does.
    if (hoveringRef.current && toolRef.current === 'rake') {
      const gesture: Gesture = { active: true, born: Date.now() }
      activeGestureRef.current = gesture
      activeStrokeRef.current = createStroke(gesture)
    }

    // Erase-the-name reveal is desktop-only: the title only lives inside the interactive
    // plot at md+ (see the md:flex title block in the JSX). A breakpoint change swaps
    // coordinate spaces same as the rake grooves above, so drop any in-progress sequence
    // rather than let it resolve against stale geometry.
    isDesktopRef.current = window.matchMedia('(min-width: 768px)').matches
    resetTitleErase()
    if (isDesktopRef.current && titleElRef.current) {
      const tRect = titleElRef.current.getBoundingClientRect()
      titleRectRef.current = {
        left: tRect.left - rect.left,
        top: tRect.top - rect.top,
        width: tRect.width,
        height: tRect.height,
      }
    } else {
      titleRectRef.current = { left: 0, top: 0, width: 0, height: 0 }
    }
  }, [resetTitleErase])

  useEffect(() => {
    resizeRef.current = resize
    resize()
    const ro = new ResizeObserver(resize)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => {
      ro.disconnect()
      clearSequenceTimeouts()
    }
  }, [resize, clearSequenceTimeouts])

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        const { width, height } = rectRef.current
        ctx.clearRect(0, 0, width, height)

        const now = Date.now()
        // A gesture's chunks never age while it's still active (gesture.active stays
        // true until the gesture ends), so a groove still being carved can't be
        // filtered out or start fading mid-draw no matter how long the hover lasts.
        strokesRef.current = strokesRef.current.filter((chunk) => {
          const g = chunk.gesture
          return g.active || now - g.born < HOLD_MS + FADE_MS
        })
        // Chronological order: every chunk's carve pass erases only chunks drawn
        // before it, so later (newer) chunks always carve over earlier ones —
        // including a gesture crossing its own earlier path.
        strokesRef.current.forEach((chunk) => {
          const g = chunk.gesture
          const age = g.active ? 0 : now - g.born
          const alpha = age < HOLD_MS ? 1 : Math.max(0, 1 - (age - HOLD_MS) / FADE_MS)
          if (alpha <= 0) return
          drawStroke(ctx, chunk, alpha)
        })
        const active = activeStrokeRef.current
        if (active) drawStroke(ctx, active, 1)

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

  // Whole-chunk removal (884bd59): hit-test each live chunk's raw points against the
  // eraser radius and drop any chunk that has a point in range. A per-frame full redraw
  // has no persistent layer to wipe into, so the eraser goes back to removing whole
  // chunks rather than a soft pixel-radius wipe. Blossoms stay object-based and are
  // removed whole when the eraser passes near enough.
  const eraseAt = (p: Point) => {
    strokesRef.current = strokesRef.current.filter((chunk) => {
      for (const pt of chunk.points) {
        if (Math.hypot(pt.x - p.x, pt.y - p.y) < ERASE_RADIUS) return false
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
    updateTitleHover(getPoint(e))
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
      const isTowedTool = toolRef.current === 'rake' || toolRef.current === 'eraser'

      if (isTowedTool) {
        // Towed-head physics. headPosRef.current === null is the (re)arm signal (set on
        // pointerenter, tool switch, and resize) — the head snaps to the raw pointer on
        // that first sample instead of stepping, so every arm starts coincident with the
        // pointer and only starts trailing once the pointer has pulled away.
        const head = headPosRef.current ?? p
        const newHead = stepHead(head, p, RAKE_FOLLOW_DIST)
        const moved = Math.hypot(newHead.x - head.x, newHead.y - head.y)
        headPosRef.current = newHead
        if (moved > 0) headTraveledRef.current += moved

        // Handle points from the head toward the pointer (toward the hand), recomputed
        // every sample so it stays live even while the head itself is anchored.
        const hdx = p.x - newHead.x
        const hdy = p.y - newHead.y
        if (Math.hypot(hdx, hdy) > 0.5) {
          finalAngle = (Math.atan2(hdy, hdx) * 180) / Math.PI + CURSOR_HANDLE_OFFSET_DEG
        }

        if (moved > 0 && hoveringRef.current) {
          if (toolRef.current === 'rake') {
            // HEAD_MIN_TRAVEL: don't push a groove point until the head has accumulated
            // real travel of its own, so the moment it starts pulling away doesn't stamp
            // a short stub at the arm point.
            if (headTraveledRef.current > HEAD_MIN_TRAVEL) {
              const stroke = activeStrokeRef.current
              if (stroke) {
                pushRakePoint(stroke, newHead, head)
                if (stroke.length > CHUNK_COMMIT_LEN) rolloverActiveStroke()
              }
            }
          } else {
            // Eraser is also a rake — it erases from the towed head, not the raw pointer.
            eraseAt(newHead)
            updateErase(newHead)
          }
        }

        finalPoint = newHead
      } else {
        // Blossom is untouched: cursor follows the raw pointer, travel-direction rotation.
        if (prev) {
          const dx = p.x - prev.x
          const dy = p.y - prev.y
          if (Math.hypot(dx, dy) > 0.5) {
            finalAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
          }
        }
        finalPoint = p
      }

      prev = p
    }

    if (finalPoint) {
      cursorPosRef.current = finalPoint
      if (finalAngle !== undefined) cursorTargetAngleRef.current = finalAngle
    }

    // lastPointRef always tracks the raw pointer (used by the blossom branch above),
    // independent of the towed head's position.
    lastPointRef.current = prev
  }

  const handlePointerEnter = (e: React.PointerEvent) => {
    updateTitleHover(getPoint(e))
    if (!toolRef.current) return
    hoveringRef.current = true
    if (cursorRef.current) cursorRef.current.style.opacity = '1'

    const p = getPoint(e)
    cursorPosRef.current = p
    lastPointRef.current = p
    // Re-arm the towed head: it snaps to this pointer position on the next sample.
    headPosRef.current = null
    prevEraseHeadRef.current = null
    headTraveledRef.current = 0

    if (toolRef.current === 'rake') {
      const gesture: Gesture = { active: true, born: Date.now() }
      activeGestureRef.current = gesture
      activeStrokeRef.current = createStroke(gesture)
    }
  }

  const handlePointerLeave = () => {
    updateTitleHover(null)
    hoveringRef.current = false
    commitGesture()
    lastPointRef.current = null
    // The head does not keep coasting toward a pointer that's no longer over the plot —
    // drop it too so the next entry re-arms cleanly.
    headPosRef.current = null
    prevEraseHeadRef.current = null
    headTraveledRef.current = 0
    if (cursorRef.current) cursorRef.current.style.opacity = '0'
  }

  const activeToolIcon = tool ? TOOLS.find((t) => t.key === tool)?.icon : undefined

  return (
    <div className="w-full">
      {/* Mobile: title sits above the plot as its own block (see 00-KaiMobileHERO frame) */}
      <div
        className="relative mx-auto mb-6 aspect-[900/436] w-[90%] max-w-[368px] md:hidden"
        onPointerEnter={() => boilFor(null)}
        onPointerLeave={() => boilFor(BOIL_TAIL_MS)}
      >
        <TitleArt boiling={titleBoiling} />
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

        {/* Desktop: title embedded on the sand, centered in the plot. Eraser rake wipes it
            away (coverage-driven fade, see updateErase) into a cycling design principle,
            which can itself be erased back to the title — see triggerReveal/beginReturn. */}
        <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center md:flex">
          <div
            ref={titleElRef}
            className="relative aspect-[900/436] w-[53%] min-w-[253px] transition-[opacity,filter] duration-[320ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          >
            <TitleArt boiling={titleBoiling} />
          </div>

          {/* mix-blend-multiply lives on this wrapper, not the videos: the wrapper's opacity
              makes it an isolated group, so a blend on a child would only multiply against
              the wrapper's own transparent backdrop and leave a white box. Blur (scrubbed
              while erasing, and on the exit) only applies once the still has replaced the
              video: filter: blur over a <video> pulls dark texels in at the layer's edges,
              which multiply turns into a visible dark frame. */}
          <div
            ref={principleElRef}
            role="img"
            aria-label={PRINCIPLES[principleIndex].text}
            aria-hidden={sequencePhase === 'idle'}
            className={`absolute aspect-[1440/540] w-[67%] mix-blend-multiply transition-[opacity,transform,filter] motion-reduce:scale-100 motion-reduce:blur-[0px] ${
              sequencePhase === 'principle-in' || sequencePhase === 'principle-hold'
                ? 'scale-100 opacity-100 blur-[0px] duration-[380ms] ease-[cubic-bezier(0.23,1,0.32,1)]'
                : `scale-[0.98] opacity-0 duration-[600ms] ease-[cubic-bezier(0.45,0,0.55,1)] ${principleStill ? 'blur-[3px]' : ''}`
            }`}
          >
            {PRINCIPLES.map((p, i) => (
              // Plain <img>, not next/image: it must be the exact bytes of the video's poster
              // (already cached) so the swap on 'ended' is seamless, with no lazy load.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${p.src}-still`}
                src={`${p.src}.webp`}
                alt=""
                draggable={false}
                className={`absolute inset-0 h-full w-full ${i === principleIndex && principleStill ? '' : 'invisible'}`}
              />
            ))}
            {PRINCIPLES.map((p, i) => (
              <video
                key={p.src}
                ref={(el) => {
                  principleVideoRefs.current[i] = el
                }}
                src={`${p.src}.mp4`}
                poster={`${p.src}.webp`}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onEnded={() => {
                  if (i !== lastPrincipleRef.current) return
                  showPrincipleStill(true)
                  // Still reading (the auto-return hasn't started the exit): open it to erasing.
                  if (sequenceActiveRef.current && autoReturnRef.current !== null) principleErasableRef.current = true
                }}
                className={`absolute inset-0 h-full w-full ${i === principleIndex && !principleStill ? '' : 'invisible'}`}
              />
            ))}
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

      <div data-home-tools className="mt-10 flex justify-center gap-6 md:gap-8">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            aria-pressed={tool === t.key}
            className={`tool-card press-scale flex w-32 flex-col items-center gap-4 overflow-hidden rounded-2xl border border-hairline bg-page px-4 pt-5 font-mono text-xs text-ink-body md:w-[140px] md:gap-3 md:pt-4 ${
              tool === t.key ? 'is-selected' : ''
            }`}
          >
            {t.label}
            <span className="relative w-20 md:w-[90px]" style={{ aspectRatio: t.ratio }}>
              <Image src={t.icon} alt="" fill sizes="112px" className="object-contain" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
