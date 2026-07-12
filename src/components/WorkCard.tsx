'use client'

import { useEffect, useRef, useState } from 'react'

type Project = {
  title: string
  blurb: string
  tags: string[]
  year: string
}

export default function WorkCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="work-card group flex cursor-pointer flex-col gap-3"
      style={{ transitionDelay: visible ? `${index * 40}ms` : '0ms' }}
      data-visible={visible}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl md:rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,var(--color-placeholder-stripe-a),var(--color-placeholder-stripe-a)_10px,var(--color-placeholder-stripe-b)_10px,var(--color-placeholder-stripe-b)_20px)]">
          <span className="font-mono text-xs text-ink-faint">project cover — swap in real shot</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold text-ink-primary md:text-xl">{project.title}</h3>
        <span className="font-mono text-xs text-ink-faint">{project.year}</span>
      </div>
      <p className="font-mono text-sm text-ink-muted">{project.blurb}</p>
      <div className="flex gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-tag px-3 py-1 font-mono text-[11px] text-ink-body"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
