'use client'

// One playground tile's media: a loop, a still, or a roast's before and after.
import { useEffect, useRef, useState } from 'react'
import type { Loop, Piece as PieceT, Still } from './items'
import '@/components/case-study/step-frame.css'

const ar = (m: { w: number; h: number }) => m.w / m.h

// Muted, inline, looping, no controls. It plays only while on screen (and while its view is showing)
// and never under reduced motion, where the poster is the whole piece.
function LoopVideo({ loop, eager, hidden = false }: { loop: Loop; eager: boolean; hidden?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const hiddenRef = useRef(hidden)

  useEffect(() => {
    hiddenRef.current = hidden
    const v = ref.current
    if (!v) return
    if (hidden) v.pause()
    else if (!matchMedia('(prefers-reduced-motion: reduce)').matches && v.getBoundingClientRect().bottom > 0) v.play().catch(() => {})
  }, [hidden])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce.matches && !hiddenRef.current) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.25 },
    )
    io.observe(v)
    const onChange = () => reduce.matches && v.pause()
    reduce.addEventListener('change', onChange)
    return () => {
      io.disconnect()
      reduce.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="pl-media-el"
      muted
      loop
      playsInline
      preload={eager ? 'auto' : 'none'}
      poster={loop.poster}
      width={loop.w}
      height={loop.h}
      aria-label={loop.alt}
      aria-hidden={hidden || undefined}
    >
      <source src={`${loop.src}.webm`} type="video/webm" />
      <source src={`${loop.src}.mp4`} type="video/mp4" />
    </video>
  )
}

function Img({ still, eager }: { still: Still; eager: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="pl-media-el" src={still.src} alt={still.alt} width={still.w} height={still.h} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
  )
}

// The case study Toggle's control and swap (Toggle.tsx, step-frame.css), carrying a video and opening
// on after. Both captures share one canvas size, so nothing jumps when you switch.
function Compare({ name, before, after, eager }: { name: string; before: Still; after: Loop; eager: boolean }) {
  const [on, setOn] = useState(1)
  return (
    <div className="pl-compare">
      <div role="group" aria-label={`${name}: show`} className="inline-flex shrink-0 self-center rounded-full border border-hairline bg-white p-0.5">
        {['before', 'after'].map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={i === on}
            onClick={() => setOn(i)}
            className="tg-seg press-scale rounded-full px-3.5 py-1.5 font-mono text-[12px] leading-none"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pl-compare-canvas">
        <div className="pl-fit pl-screen" style={{ '--ar': ar(after) } as React.CSSProperties}>
          <span data-active={on === 0} aria-hidden={on !== 0} className="tg-view absolute inset-0">
            <Img still={before} eager={eager} />
          </span>
          <span data-active={on === 1} className="tg-view absolute inset-0">
            <LoopVideo loop={after} eager={eager} hidden={on !== 1} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Piece({ name, piece, eager }: { name: string; piece: PieceT; eager: boolean }) {
  if (piece.kind === 'compare') return <Compare name={name} before={piece.before} after={piece.after} eager={eager} />
  const m = piece.kind === 'loop' ? piece.loop : piece.still
  return (
    <div className={`pl-fit pl-${piece.fit}`} style={{ '--ar': ar(m) } as React.CSSProperties}>
      {piece.kind === 'loop' ? <LoopVideo loop={piece.loop} eager={eager} /> : <Img still={piece.still} eager={eager} />}
    </div>
  )
}
