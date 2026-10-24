import Image from 'next/image'
import { CARDS } from './data'

// One "currently into" card, shown in the docked panel beside the shelf.
export default function AboutCard({ id }: { id: string }) {
  const c = CARDS.find((x) => x.id === id)!
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="mb-2 text-[11px] tracking-[0.08em] text-ink-muted">{c.category}</p>
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em] text-ink-primary [text-wrap:balance]">{c.title}</h2>
        <p className="mt-1 text-xs text-ink-muted">{c.subtitle}</p>
      </div>
      <div className="grid h-[168px] place-items-center rounded-[14px] bg-[#f4ede1]">
        <Image src={c.image} alt="" width={240} height={240} className="h-[128px] w-auto drop-shadow-[0_8px_10px_rgba(64,42,18,0.18)]" draggable={false} />
      </div>
      <p className="rounded-[14px] bg-[#e6eef3] px-4 py-3.5 text-[13px] leading-[1.6] text-ink-primary [text-wrap:pretty]">{c.note}</p>
      <div className="flex flex-wrap items-center gap-2">
        {c.tags.map((t) => (
          <span key={t} className="about-tag">#{t}</span>
        ))}
        <span className="ml-auto text-[11px] text-ink-muted">{c.date}</span>
      </div>
      {c.cta && (
        <a href={c.cta.href} className="about-cta self-start">
          {c.cta.label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}
