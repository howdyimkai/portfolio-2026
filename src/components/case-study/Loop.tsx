'use client'

import { useEffect, useRef, useState } from 'react'

// A muted loop with no controls that plays only while on screen (RodeoTrail's pattern). Reduced
// motion gets the still.
export default function Loop({ webm, mp4, still, alt }: { webm: string; mp4: string; still: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])
  if (reduce) return <img src={still} alt={alt} draggable={false} className="block h-full w-full object-cover" />
  return (
    <video
      ref={ref}
      poster={still}
      muted
      loop
      playsInline
      disableRemotePlayback
      preload="metadata"
      aria-label={alt}
      className="block h-full w-full object-cover"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  )
}
