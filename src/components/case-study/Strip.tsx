'use client'

// A row of pieces on one baseline, a caption under each, and tap to see one larger. Three looks:
// character art (Cal chapter 3's Calvolution), on white, so it multiplies onto the page instead of
// sitting in white boxes; product screens (chapter 5's rewrite strip), each a rounded screen with
// a hairline edge, where a mark can ring the part to look at; and devices (chapter 10), screens that
// bring their own bezel on a transparent ground, drawn as they are, in a narrower row (left
// aligned with the text) so a pair of phones doesn't stand taller than the screen. For art the blend is on the button, not the <img>:
// the hover lift's transform isolates the button, and a blended child would then show its white.
// Larger opens in a native <dialog>: Escape, a tap anywhere, or the button closes it.
import { useRef, useState, type CSSProperties } from 'react'
import type { Box, Visual } from './types'
import './step-frame.css'

type Item = NonNullable<Visual['strip']>[number]

export type Look = 'art' | 'screen' | 'device'

export default function Strip({ items, aspect, cols, look = 'art' }: { items: Item[]; aspect: string; cols: [number, number]; look?: Look }) {
  const blend = look === 'art' ? 'mix-blend-multiply' : ''
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(0)
  const show = (i: number) => {
    setOpen(i)
    dialog.current?.showModal()
  }
  const item = items[open]

  return (
    <>
      <ol className={`cs-tiles grid items-start gap-x-3 gap-y-6 md:gap-x-4 ${look === 'device' ? 'max-w-[600px]' : ''}`} style={{ '--cols': cols[0], '--cols-md': cols[1] } as CSSProperties}>
        {items.map((it, i) => (
          <li key={it.src}>
            <button type="button" onClick={() => show(i)} className={`st-tile block w-full ${blend}`}>
              <Piece item={it} aspect={aspect} look={look} className="w-full" />
              <span className="sr-only">, enlarge</span>
            </button>
            <p className="mt-2 text-center font-mono text-[12px] leading-[1.5] text-ink-muted [text-wrap:balance]">{it.caption}</p>
            {it.note && <p className="text-center font-mono text-[11px] leading-[1.5] text-ink-faint [text-wrap:balance]">{it.note}</p>}
          </li>
        ))}
      </ol>
      <dialog ref={dialog} onClick={() => dialog.current?.close()} aria-label={item.caption} className="st-dialog">
        <figure className="flex flex-col items-center gap-4 px-6 pb-6 pt-14">
          <Piece item={item} aspect={aspect} look={look} className={`max-h-[72dvh] w-auto max-w-full ${blend}`} />
          <figcaption className="text-center font-mono text-[13px] text-ink-muted">
            {item.caption}
            {item.note && <span className="block text-[12px] text-ink-faint">{item.note}</span>}
          </figcaption>
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

// The image, plus its mark for a screen. The wrapper shrinks to the image, so the mark's % box lands
// on the same spot at any size.
function Piece({ item, aspect, look, className }: { item: Item; aspect: string; look: Look; className: string }) {
  const img = <img src={item.src} alt={item.alt} draggable={false} className={`block ${className}`} style={{ aspectRatio: aspect }} />
  if (look !== 'screen') return img
  return (
    <span className="relative mx-auto block w-fit overflow-hidden rounded-[12px] border border-hairline">
      {img}
      {item.mark && <span className="st-mark absolute" style={place(item.mark)} aria-hidden="true" />}
    </span>
  )
}

const place = ([left, top, width, height]: Box): CSSProperties => ({ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` })
