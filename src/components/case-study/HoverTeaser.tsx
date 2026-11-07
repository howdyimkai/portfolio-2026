'use client'

// A still that plays a muted loop only while its host is hovered or keyboard focused (Kai,
// 2026-11-07). The host is the nearest ancestor marked data-teaser-host, so a whole card or a play
// button can drive it. Not Loop, which plays whenever it's on screen. preload="none": nothing
// downloads until the first hover. The still stays up until the video is actually playing, so a
// slow connection never shows a blank box. Leaving or blurring pauses and rewinds, and the still
// returns. Touch and reduced motion never play it. `alt` labels the still; pass '' where an
// adjacent control already names it.
import { useEffect, useRef, useState } from 'react'

export default function HoverTeaser({
  webm,
  mp4,
  still,
  alt,
  className = '',
}: {
  webm: string
  mp4: string
  still: string
  alt: string
  className?: string
}) {
  const wrap = useRef<HTMLSpanElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const host = wrap.current?.closest<HTMLElement>('[data-teaser-host]')
    const v = video.current
    if (!host || !v) return
    const can = () => !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover) and (pointer: fine)').matches
    const start = () => {
      if (can()) v.play().catch(() => {})
    }
    const stop = () => {
      v.pause()
      v.currentTime = 0
      setPlaying(false)
    }
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') start()
    }
    const leave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') stop()
    }
    const focus = (e: FocusEvent) => {
      if ((e.target as HTMLElement).matches(':focus-visible')) start()
    }
    host.addEventListener('pointerenter', enter)
    host.addEventListener('pointerleave', leave)
    host.addEventListener('focusin', focus)
    host.addEventListener('focusout', stop)
    return () => {
      host.removeEventListener('pointerenter', enter)
      host.removeEventListener('pointerleave', leave)
      host.removeEventListener('focusin', focus)
      host.removeEventListener('focusout', stop)
    }
  }, [])

  return (
    <span ref={wrap} className={`relative block overflow-hidden ${className}`}>
      <img src={still} alt={alt} draggable={false} className="block h-full w-full object-cover" />
      <video
        ref={video}
        muted
        loop
        playsInline
        disableRemotePlayback
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: playing ? 1 : 0 }}
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </span>
  )
}
