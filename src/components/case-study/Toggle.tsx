'use client'

// Two (or more) captures of one page that swap in place, like a before and after (Cal chapter 2's
// homepage). Starts on the first. The captures share one canvas size, so nothing jumps when you
// switch. framed draws the code browser frame around them; leave it off for captures that bring
// their own window.
import { useState } from 'react'
import BrowserFrame from './BrowserFrame'
import type { Visual } from './types'
import './step-frame.css'

export default function Toggle({ views, aspect, framed }: { views: NonNullable<Visual['compare']>; aspect: string; framed: boolean }) {
  const [on, setOn] = useState(0)
  const stack = (
    <div className="relative" style={{ aspectRatio: aspect }}>
      {views.map((v, i) => (
        <img
          key={v.src}
          src={v.src}
          alt={v.alt}
          draggable={false}
          data-active={i === on}
          aria-hidden={i !== on}
          className="tg-view absolute inset-0 block h-full w-full"
        />
      ))}
    </div>
  )
  return (
    <div className="rounded-[14px] bg-tag px-5 pb-5 pt-5 md:px-10 md:pb-10 md:pt-8">
      <div role="group" aria-label="Show" className="mb-4 inline-flex rounded-full border border-hairline bg-white p-0.5 md:mb-5">
        {views.map((v, i) => (
          <button
            key={v.label}
            type="button"
            aria-pressed={i === on}
            onClick={() => setOn(i)}
            className="tg-seg press-scale rounded-full px-3.5 py-1.5 font-mono text-[12px] leading-none"
          >
            {v.label}
          </button>
        ))}
      </div>
      {framed ? <BrowserFrame>{stack}</BrowserFrame> : stack}
    </div>
  )
}
