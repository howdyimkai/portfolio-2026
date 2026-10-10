'use client'

// PROTOTYPE — shadow-box nav. Coordinates are 1× shelf units (394×104), measured off
// design-intent/pony-test/Chalk inside shelf@2x.png; the stage scales the whole box.
import { useRef } from 'react'
import Image from 'next/image'
import { enter, leave, tap, type Mode, type Rig, type Tic } from './motion'

export type Toy = { label: [string, string]; src: string; w: number; h: number; x0: number; x1: number; floor: number; width: number; tic: Tic }

export const TOYS: Toy[] = [
  { label: ['selected', 'works'], src: '/proto/shelf/cloud.webp', w: 183, h: 111, x0: 25.5, x1: 81.5, floor: 85, width: 50, tic: 'puff' },
  { label: ['play', 'ground'], src: '/proto/shelf/pony.webp', w: 385, h: 395, x0: 95.5, x1: 157, floor: 87, width: 38, tic: 'prance' },
  { label: ['humble', 'abode'], src: '/proto/shelf/hat.webp', w: 139, h: 84, x0: 164, x1: 230, floor: 82, width: 50, tic: 'tip' },
  { label: ['field', 'notes'], src: '/proto/shelf/pencil.webp', w: 146, h: 80, x0: 237, x1: 298.5, floor: 84, width: 50, tic: 'waddle' },
  { label: ['about', 'me'], src: '/proto/shelf/star.webp', w: 89, h: 87, x0: 312.5, x1: 369, floor: 76, width: 32, tic: 'spin' },
]

export function Cubby({ toy, mode, i = 0 }: { toy: Toy; mode: Mode; i?: number }) {
  const toyRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const rig = (): Rig | null =>
    toyRef.current && innerRef.current && shadowRef.current
      ? { toy: toyRef.current, inner: innerRef.current, shadow: shadowRef.current, tic: toy.tic }
      : null
  const cx = (toy.x0 + toy.x1) / 2

  return (
    <a
      href="#"
      className="shelf-cubby"
      style={{ left: toy.x0, width: toy.x1 - toy.x0, '--i': i } as React.CSSProperties}
      onClick={(e) => e.preventDefault()}
      onPointerEnter={(e) => e.pointerType === 'mouse' && rig() && enter(rig()!, mode)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && rig() && leave(rig()!, mode)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && rig() && tap(rig()!)}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && rig() && enter(rig()!, mode)}
      onBlur={() => rig() && leave(rig()!, mode)}
    >
      <span className="shelf-label">
        {toy.label[0]}
        <br />
        {toy.label[1]}
      </span>
      <span ref={shadowRef} className="shelf-shadow" style={{ left: cx - toy.x0, top: toy.floor - 8 - 2, width: toy.width * 0.8 }} aria-hidden />
      <span
        ref={toyRef}
        className="shelf-toy"
        style={{ left: cx - toy.x0 - toy.width / 2, top: toy.floor - 8 - (toy.width * toy.h) / toy.w, width: toy.width }}
        aria-hidden
      >
        <span ref={innerRef} className="shelf-toy-inner">
          <Image src={toy.src} alt="" width={toy.w} height={toy.h} draggable={false} unoptimized />
        </span>
      </span>
    </a>
  )
}

export default function Shelf({ mode }: { mode: Mode }) {
  return (
    <div className="shelf" aria-label="Main">
      <Image src="/proto/wordmark.webp" alt="howdy im Kai" width={309} height={130} className="shelf-wordmark" draggable={false} priority unoptimized />
      <Image src="/proto/shelf/shelf.webp" alt="" width={788} height={208} className="shelf-wood" draggable={false} priority unoptimized />
      <nav className="shelf-row">
        {TOYS.map((t) => (
          <Cubby key={t.src} toy={t} mode={mode} />
        ))}
      </nav>
    </div>
  )
}
