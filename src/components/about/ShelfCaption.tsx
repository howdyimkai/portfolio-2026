'use client'

// One "currently into" card, opened as a drawer under the plank of the object you picked, with a
// notch pointing up at it ("Shelf drawer", picked from /proto/about-detail 2026-11-02;
// design-intent/about-exploration/NOTES.md). Every shelf has one; only the picked object's shelf opens.
import { useLayoutEffect, useRef, useState } from 'react'
import { OBJECTS, cardById, type Card } from './data'

// Cards in shelf order (top shelf first), so ← → walks the shelf the way you read it.
const ORDER: Card[] = [...new Set(OBJECTS.map((o) => o.card))].map(cardById)

function Cross() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function ShelfCaption({
  objId,
  onClose,
  onStep,
}: {
  objId?: string // the picked object, when it sits on this shelf
  onClose: () => void
  onStep: (objId: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [notch, setNotch] = useState(50)
  // Keep the last card while the drawer closes, so it doesn't empty mid-collapse.
  const [shown, setShown] = useState(objId)
  if (objId && objId !== shown) setShown(objId)
  const o = OBJECTS.find((x) => x.id === shown)
  const i = o ? ORDER.findIndex((c) => c.id === o.card) : -1
  const c = ORDER[i]
  const open = !!objId

  // Point the notch at the object that was clicked (both cats share a card).
  useLayoutEffect(() => {
    const el = ref.current
    const target = objId && el?.parentElement?.querySelector<HTMLElement>(`[data-obj="${objId}"]`)
    if (!el || !target) return
    const a = el.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    setNotch(((b.left + b.width / 2 - a.left) / a.width) * 100)
  }, [objId])

  const step = (d: number) => {
    const next = ORDER[(i + d + ORDER.length) % ORDER.length]
    onStep(OBJECTS.find((x) => x.card === next.id)!.id)
  }

  return (
    <div ref={ref} className="about-drawer" data-open={open ? '' : undefined} inert={!open}>
      <div className="about-drawer-clip">
        {c && (
          <div className="about-caption" style={{ ['--notch' as string]: `${notch}%` }} role="region" aria-label={c.category} aria-live="polite">
            <div key={c.id} className="about-caption-swap flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-ink-muted">{c.category}</p>
                  <h2 className="font-display text-[22px] leading-tight tracking-[-0.01em] text-ink-primary [text-wrap:balance]">{c.title}</h2>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {c.subtitle} · {c.date}
                  </p>
                </div>
                <button className="about-icon-btn -mr-2 -mt-1 flex-none" onClick={onClose} aria-label="Close">
                  <Cross />
                </button>
              </div>
              <p className="max-w-[56ch] text-[13px] leading-[1.6] text-ink-primary [text-wrap:pretty]">{c.note}</p>
              <div className="flex items-center gap-3">
                {c.cta && (
                  <a href={c.cta.href} target="_blank" rel="noopener noreferrer" className="about-link font-mono text-xs">
                    {c.cta.label} <span aria-hidden="true">↗</span>
                  </a>
                )}
                <div className="ml-auto flex items-center gap-1">
                  <button className="about-icon-btn" onClick={() => step(-1)} aria-label="Previous object">
                    ←
                  </button>
                  <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                    {i + 1}/{ORDER.length}
                  </span>
                  <button className="about-icon-btn" onClick={() => step(1)} aria-label="Next object">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
