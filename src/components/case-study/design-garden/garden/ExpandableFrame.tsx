'use client'

// A browser frame with an Expand button that takes the same live demo full screen (only classes
// change, never the tree, so nothing restarts). The 880px case study column can't grow.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import BrowserFrame from '@/components/case-study/BrowserFrame'

export default function ExpandableFrame({ size, label, children }: { size: string; label: string; children: ReactNode }) {
  const [big, setBig] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Stop the page behind from scrolling: the nearest scroller (the proto sheet, or the page).
    const scroller = (wrap.current?.closest('.grid-sheet') as HTMLElement | null) ?? document.documentElement
    scroller.style.overflowY = big ? 'hidden' : ''
    if (!big) return
    btn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBig(false)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      scroller.style.overflowY = ''
    }
  }, [big])

  return (
    <div ref={wrap}>
      {big && <div aria-hidden className={`${size} rounded-[12px] border border-dashed border-hairline`} />}
      <div
        role={big ? 'dialog' : undefined}
        aria-modal={big || undefined}
        aria-label={big ? `${label}, full size` : undefined}
        className={big ? 'gc-overlay fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(28,20,12,.45)] p-3 md:p-8' : 'relative'}
        onPointerDown={(e) => big && e.target === e.currentTarget && setBig(false)}
      >
        <div className={big ? 'gc-overlay-frame relative h-full w-full max-w-[1480px] md:max-h-[920px]' : 'relative'}>
          <BrowserFrame className={big ? 'h-full' : ''}>
            <div className={`${big ? 'h-[calc(100%-32px)] overflow-y-auto md:overflow-visible' : size} bg-white p-2 md:p-3`}>{children}</div>
          </BrowserFrame>
          <button
            ref={btn}
            type="button"
            onClick={() => setBig((b) => !b)}
            aria-expanded={big}
            className="absolute right-1 top-0 flex h-8 items-center gap-1.5 rounded-md px-2.5 font-mono text-[12px] text-ink-faint transition-colors duration-150 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/40"
          >
            <span aria-hidden>{big ? '✕' : '⤢'}</span>
            {big ? 'Close' : 'Expand'}
          </button>
        </div>
      </div>
    </div>
  )
}
