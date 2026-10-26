'use client'

// A row of pieces on one baseline, a caption under each, and tap to see one larger. Three looks:
// character art (Cal chapter 3's Calvolution), on white, so it multiplies onto the page instead of
// sitting in white boxes; product screens (chapter 5's rewrite strip), each a rounded screen with
// a hairline edge, where a mark can ring the part to look at; and devices (chapter 10), screens that
// bring their own bezel on a transparent ground, drawn as they are, in a narrower row (left
// aligned with the text) so a pair of phones doesn't stand taller than the screen. For art the blend is on the button, not the <img>:
// the hover lift's transform isolates the button, and a blended child would then show its white.
// Larger opens in a native <dialog>: Escape, a tap anywhere, or the button closes it.
// feature (Brand System's outputs): from md the first piece fills the left column, as tall as the
// two stacked on the right, so the three read as one rectangle.
// panel: the strip sits on the tag panel, where ink-muted and ink-faint drop under AA at 12px, so
// the caption steps up to ink-primary and the note to ink-body.
import { useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import type { Box, Visual } from './types'
import './step-frame.css'

export type Item = NonNullable<Visual['strip']>[number]

export type Look = 'art' | 'screen' | 'device'

export default function Strip({
  items,
  aspect,
  cols,
  look = 'art',
  feature = false,
  panel = false,
}: {
  items: Item[]
  aspect: string
  cols: [number, number]
  look?: Look
  feature?: boolean
  panel?: boolean
}) {
  const blend = look === 'art' ? 'mix-blend-multiply' : ''
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(0)
  const show = (i: number) => {
    setOpen(i)
    dialog.current?.showModal()
  }

  return (
    <>
      <ol
        className={`cs-tiles grid items-start gap-x-3 gap-y-6 md:gap-x-4 ${look === 'device' ? 'max-w-[600px]' : ''} ${feature ? 'st-feature' : ''}`}
        style={{ '--cols': cols[0], '--cols-md': cols[1] } as CSSProperties}
      >
        {items.map((it, i) => (
          <li key={it.src}>
            {it.href ? (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className={`st-tile st-tile-link block w-full ${blend}`}>
                <Piece item={it} aspect={aspect} look={look} className="w-full">
                  <PlayBadge />
                </Piece>
                <span className="sr-only">, opens on YouTube in a new tab</span>
              </a>
            ) : (
              <button type="button" onClick={() => show(i)} className={`st-tile block w-full ${blend}`}>
                <Piece item={it} aspect={aspect} look={look} className="w-full" />
                <span className="sr-only">, enlarge</span>
              </button>
            )}
            <p className={`mt-2 text-center font-mono text-[12px] leading-[1.5] ${panel ? 'text-ink-primary' : 'text-ink-muted'} [text-wrap:balance]`}>{it.caption}</p>
            {it.note && <p className={`text-center font-mono text-[12px] leading-[1.5] ${panel ? 'text-ink-body' : 'text-ink-faint'} [text-wrap:balance]`}>{it.note}</p>}
          </li>
        ))}
      </ol>
      <Viewer dialog={dialog} item={items[open]} aspect={aspect} look={look} />
    </>
  )
}

// The larger view. The caller opens it with showModal(); Escape, a tap anywhere, or the button
// closes it.
function Viewer({ dialog, item, aspect, look }: { dialog: RefObject<HTMLDialogElement | null>; item: Item; aspect: string; look: Look }) {
  const blend = look === 'art' ? 'mix-blend-multiply' : ''
  return (
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
  )
}

// The image, plus its mark (or a play badge) for a screen. The wrapper shrinks to the image, so the
// mark's % box lands on the same spot at any size.
function Piece({ item, aspect, look, className, children }: { item: Item; aspect: string; look: Look; className: string; children?: ReactNode }) {
  const img = <img src={item.src} alt={item.alt} draggable={false} className={`block ${className}`} style={{ aspectRatio: item.aspect ?? aspect }} />
  if (look !== 'screen') return img
  return (
    <span className="st-piece relative mx-auto block w-fit overflow-hidden rounded-[12px] border border-hairline" style={{ background: item.fill }}>
      {img}
      {item.mark && <span className="st-mark absolute" style={place(item.mark)} aria-hidden="true" />}
      {children}
    </span>
  )
}

// YouTube's play button, small, so a cover reads as a video before anyone taps it.
function PlayBadge() {
  return (
    <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#211e1a] shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <svg viewBox="0 0 24 24" className="ml-0.5 size-5" fill="currentColor">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
      </svg>
    </span>
  )
}

const place = ([left, top, width, height]: Box): CSSProperties => ({ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` })
