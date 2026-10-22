'use client'

// A row of character art on one baseline, a caption under each, and tap to see one larger (Cal
// chapter 3's Calvolution). The art is on white, so it multiplies onto the page instead of sitting
// in white boxes. The blend is on the button, not the <img>: the hover lift's transform isolates the
// button, and a blended child would then show its white. Larger opens in a native <dialog>: Escape,
// a tap anywhere, or the button closes it.
import { useRef, useState, type CSSProperties } from 'react'
import type { Visual } from './types'
import './step-frame.css'

export default function Strip({ items, aspect, cols }: { items: NonNullable<Visual['strip']>; aspect: string; cols: [number, number] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(0)
  const show = (i: number) => {
    setOpen(i)
    dialog.current?.showModal()
  }
  const item = items[open]

  return (
    <>
      <ol className="cs-tiles grid items-start gap-x-3 gap-y-6 md:gap-x-4" style={{ '--cols': cols[0], '--cols-md': cols[1] } as CSSProperties}>
        {items.map((it, i) => (
          <li key={it.src}>
            <button type="button" onClick={() => show(i)} className="st-tile block w-full mix-blend-multiply">
              <img src={it.src} alt={it.alt} draggable={false} className="block w-full" style={{ aspectRatio: aspect }} />
              <span className="sr-only">, enlarge</span>
            </button>
            <p className="mt-2 text-center font-mono text-[12px] leading-[1.5] text-ink-muted [text-wrap:balance]">{it.caption}</p>
          </li>
        ))}
      </ol>
      <dialog ref={dialog} onClick={() => dialog.current?.close()} aria-label={item.caption} className="st-dialog">
        <figure className="flex flex-col items-center gap-4 px-6 pb-6 pt-14">
          <img src={item.src} alt={item.alt} draggable={false} className="max-h-[72dvh] w-auto max-w-full mix-blend-multiply" style={{ aspectRatio: aspect }} />
          <figcaption className="font-mono text-[13px] text-ink-muted">{item.caption}</figcaption>
        </figure>
        <button type="button" className="st-close press-scale" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </>
  )
}
