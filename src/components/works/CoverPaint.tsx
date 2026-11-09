'use client'

// The blue that gets painted behind a works card's cover on hover or keyboard focus (decision
// record: design-intent/works-layout-exploration/NOTES.md). The texture is the painted frame of the
// sprint's inspiration/Paintloop.mp4, shown through a mask of six hand-drawn strokes. Each stroke is
// a path drawn on by its dash offset, with its own width and wobble, and a noise filter frays the
// edges like bristles. A last thin coat fills whatever the strokes missed. Timing is in
// project-card.css.
import { useId, type CSSProperties } from 'react'

// [path, width]. Alternating direction, starting and ending well outside the card: a hidden
// stroke still has an end, and the fray filter would drag it into view.
const STROKES: [string, number][] = [
  ['M-30,11 C 22,3 58,18 130,8', 25],
  ['M130,29 C 74,36 38,19 -30,30', 21],
  ['M-30,47 C 30,39 66,55 130,43', 27],
  ['M130,62 C 62,71 34,56 -30,67', 22],
  ['M-30,83 C 36,75 72,90 130,79', 26],
  ['M130,96 C 70,102 32,92 -30,99', 17],
]

export default function CoverPaint() {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="wk-paint" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        {/* Noise that changes fast down the card and slowly across it, so it pushes each stroke's
            leading edge into uneven bristle lengths and leaves its long edges a little wavy. */}
        <filter id={`${id}-fray`} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.55" numOctaves="1" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <g filter={`url(#${id}-fray)`} fill="none" stroke="#fff">
            {STROKES.map(([d, w], i) => (
              <path key={i} className="wk-stroke" d={d} pathLength={1} style={{ '--sw': w } as CSSProperties} />
            ))}
          </g>
          <rect className="wk-coat" x="0" y="0" width="100" height="100" fill="#fff" />
        </mask>
      </defs>
      <image href="/works/cover-paint.webp" x="0" y="0" width="100" height="100" preserveAspectRatio="none" mask={`url(#${id}-mask)`} />
    </svg>
  )
}
