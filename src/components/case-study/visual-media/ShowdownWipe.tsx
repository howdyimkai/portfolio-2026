'use client'

// Section 03's main piece: one post, before and after the social palette refresh, behind a drag
// wipe. The two covers differ only in the purple box and its label text, so they line up exactly;
// the handle sits low so it never covers the title. Pointer (mouse, touch, pen) drags the line,
// vertical swipes on a phone still scroll the page, and the line is a slider for the keyboard
// (arrows nudge, shift or page keys jump, Home and End go to the ends). Nothing animates, so there
// is no motion to reduce.
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Visual } from '../types'

const BEFORE = '/works/visual-media/showdown-before.webp'
const AFTER = '/works/visual-media/showdown-after.webp'
const clamp = (n: number) => Math.min(100, Math.max(0, n))

export default function ShowdownWipe(_: { visual: Visual }) {
  const frame = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)

  const fromPointer = (e: PointerEvent) => {
    const r = frame.current?.getBoundingClientRect()
    if (r) setPos(clamp(((e.clientX - r.left) / r.width) * 100))
  }
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5
    const next: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 20,
      PageUp: pos + 20,
      Home: 0,
      End: 100,
    }
    if (e.key in next) {
      e.preventDefault()
      setPos(clamp(next[e.key]))
    }
  }

  return (
    <div className="rounded-[14px] bg-tag px-5 pb-5 pt-5 md:px-10 md:pb-8 md:pt-8">
      <div
        ref={frame}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          fromPointer(e)
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e)
        }}
        className="relative mx-auto aspect-[9/16] w-full max-w-[340px] cursor-ew-resize select-none overflow-hidden rounded-[10px] border border-hairline bg-white [touch-action:pan-y]"
      >
        <img
          src={AFTER}
          alt="The Showdown cover after the refresh: the same layout, with the box behind “Who knows you better” in the richer Social Purple, #7C3AED."
          draggable={false}
          className="absolute inset-0 block h-full w-full"
        />
        {/* The before image sits on top and is cut to everything left of the line. */}
        <img
          src={BEFORE}
          alt="The Showdown cover before the refresh, with a lighter purple box behind “Who knows you better”."
          draggable={false}
          className="absolute inset-0 block h-full w-full"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(33_30_26/0.25)]" style={{ left: `${pos}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after wipe"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`Before on the left of the line, after on the right. The line is ${Math.round(pos)} percent across.`}
          onKeyDown={onKey}
          className="absolute top-[86%] grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#211e1a] shadow-[0_2px_10px_rgb(33_30_26/0.3)] outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#211e1a]"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-[340px] justify-between font-mono text-[12px] leading-[1.5] text-ink-body" aria-hidden="true">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  )
}
