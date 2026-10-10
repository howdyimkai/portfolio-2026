'use client'

// Homepage nav: a shadow-box shelf of felt toys (Tic hover), with a broom that sweeps the
// toys off and leaves a plain text row behind. Picked from /proto/nav-shelf-tidy (Sweep).
// Coordinates are 1× shelf units (394×104, measured off design-intent/pony-test/
// Chalk inside shelf@2x.png); .shelf-nav scales the whole drawing by --zoom.
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { enter, leave, tap, type Rig, type Tic } from './shelfMotion'
import './shelf-nav.css'

type Toy = { label: string; href: string; src: string; w: number; h: number; x0: number; x1: number; floor: number; width: number; tic: Tic }

const TOYS: Toy[] = [
  { label: 'selected works', href: '/works', src: '/nav/shelf/cloud.webp', w: 183, h: 111, x0: 25.5, x1: 81.5, floor: 85, width: 50, tic: 'puff' },
  { label: 'play ground', href: '/play', src: '/nav/shelf/pony.webp', w: 385, h: 395, x0: 95.5, x1: 157, floor: 87, width: 38, tic: 'prance' },
  { label: 'humble abode', href: '/', src: '/nav/shelf/hat.webp', w: 139, h: 84, x0: 164, x1: 230, floor: 82, width: 50, tic: 'tip' },
  // No field notes page yet.
  { label: 'field notes', href: '#', src: '/nav/shelf/pencil.webp', w: 146, h: 80, x0: 237, x1: 298.5, floor: 84, width: 50, tic: 'waddle' },
  { label: 'about me', href: '/about', src: '/nav/shelf/star.webp', w: 89, h: 87, x0: 312.5, x1: 369, floor: 76, width: 32, tic: 'spin' },
]

function Cubby({ toy, i, active }: { toy: Toy; i: number; active: boolean }) {
  const toyRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)
  const rig = (): Rig | null =>
    toyRef.current && innerRef.current && shadowRef.current
      ? { toy: toyRef.current, inner: innerRef.current, shadow: shadowRef.current, tic: toy.tic }
      : null
  const cx = (toy.x0 + toy.x1) / 2
  const [first, ...rest] = toy.label.split(' ')

  return (
    <Link
      href={toy.href}
      className="shelf-cubby"
      aria-current={active ? 'page' : undefined}
      style={{ left: toy.x0, width: toy.x1 - toy.x0, '--i': i } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === 'mouse' && rig() && enter(rig()!)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && rig() && leave(rig()!)}
      onPointerDown={(e) => e.pointerType !== 'mouse' && rig() && tap(rig()!)}
      onFocus={(e) => e.currentTarget.matches(':focus-visible') && rig() && enter(rig()!)}
      onBlur={() => rig() && leave(rig()!)}
    >
      <span className="shelf-label">
        {first}
        <br />
        {rest.join(' ')}
      </span>
      <span ref={shadowRef} className="shelf-shadow" style={{ left: cx - toy.x0, top: toy.floor - 10, width: toy.width * 0.8 }} aria-hidden />
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
    </Link>
  )
}

function Broom() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path className="shelf-spark" d="M4.18342 7.408C4.28018 7.35962 4.35864 7.28116 4.40702 7.18439L5.05194 5.89456C5.2362 5.52603 5.76211 5.52603 5.94637 5.89456L6.59128 7.18439C6.63967 7.28116 6.71813 7.35962 6.81489 7.408L8.10473 8.05292C8.47325 8.23718 8.47325 8.76308 8.10473 8.94734L6.81489 9.59226C6.71813 9.64064 6.63967 9.7191 6.59128 9.81587L5.94637 11.1057C5.7621 11.4742 5.2362 11.4742 5.05194 11.1057L4.40702 9.81587C4.35864 9.7191 4.28018 9.64064 4.18342 9.59226L2.89358 8.94734C2.52506 8.76308 2.52506 8.23718 2.89358 8.05292L4.18342 7.408Z" fill="currentColor" />
      <path className="shelf-spark" d="M9.55849 3.72046C9.62816 3.68563 9.68465 3.62913 9.71949 3.55947L10.1772 2.64412C10.3098 2.37878 10.6885 2.37878 10.8211 2.64412L11.2788 3.55946C11.3137 3.62913 11.3701 3.68563 11.4398 3.72046L12.3552 4.17814C12.6205 4.3108 12.6205 4.68945 12.3552 4.82212L11.4398 5.2798C11.3701 5.31463 11.3137 5.37112 11.2788 5.44079L10.8211 6.35614C10.6885 6.62148 10.3098 6.62148 10.1772 6.35614L9.71949 5.44079C9.68465 5.37112 9.62816 5.31463 9.55849 5.2798L8.64314 4.82212C8.3778 4.68946 8.3778 4.3108 8.64314 4.17814L9.55849 3.72046Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.9002 3.12245C21.1058 2.76288 20.9811 2.3047 20.6215 2.09907C20.2619 1.89344 19.8037 2.01824 19.5981 2.37781L14.4873 11.3149L13.6579 11.015C11.624 10.2795 9.58131 11.4042 8.53498 13.0396C7.59849 14.5033 6.35491 15.507 4.83501 16.5137C4.60424 16.6666 4.47642 16.9341 4.5025 17.2097C4.52859 17.4853 4.70434 17.7241 4.95969 17.8309L14.7859 21.942C15.0685 22.0602 15.3946 21.9947 15.6096 21.7766C17.532 19.826 18.552 18.1023 18.8891 15.7164C19.1292 14.0173 17.9752 12.5762 16.5027 12.0437L15.9191 11.8327L20.9002 3.12245ZM9.7985 13.848C10.5889 12.6127 11.9646 11.9977 13.1478 12.4256L15.9926 13.4543C16.9512 13.8009 17.5234 14.6602 17.4039 15.5065C17.1433 17.3505 16.4184 18.7294 14.891 20.36L11.0787 18.765L11.7561 16.7294C11.8326 16.4997 11.5705 16.3063 11.3736 16.4471L9.2192 17.987L6.79509 16.9728C7.9329 16.1233 8.96411 15.1521 9.7985 13.848Z" fill="currentColor" />
    </svg>
  )
}

export default function ShelfNav() {
  const pathname = usePathname()
  const [tidy, setTidy] = useState(false)
  const broomRef = useRef<HTMLButtonElement>(null)

  const toggle = () => {
    // One-shot sweep flick on every press; it always runs to completion.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
      broomRef.current?.querySelector('svg')?.animate(
        [{ rotate: '0deg' }, { rotate: '-22deg', offset: 0.35 }, { rotate: '10deg', offset: 0.7 }, { rotate: '0deg' }],
        { duration: 360, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
      )
    setTidy((t) => !t)
  }

  return (
    <header className="shelf-nav">
      <div className="shelf-nav-draw" data-tidy={tidy ? '' : undefined}>
        <Image src="/nav/shelf/wordmark.webp" alt="howdy im Kai" width={309} height={130} className="shelf-wordmark" draggable={false} priority unoptimized />

        <button ref={broomRef} type="button" className="shelf-broom" aria-pressed={tidy} aria-label="Tidy up navigation" onClick={toggle}>
          <Broom />
        </button>

        <div className="shelf-box">
          <Image src="/nav/shelf/shelf.webp" alt="" width={788} height={208} className="shelf-wood" draggable={false} priority unoptimized />
          <nav className="shelf-row" aria-label="Main" inert={tidy}>
            {TOYS.map((t, i) => (
              <Cubby key={t.label} toy={t} i={i} active={pathname === t.href} />
            ))}
          </nav>
          {/* Left behind once the toys are swept off. */}
          <nav className="shelf-text" aria-label="Main" inert={!tidy}>
            {TOYS.map((t, i) => (
              <Link key={t.label} href={t.href} aria-current={pathname === t.href ? 'page' : undefined} style={{ '--i': i } as React.CSSProperties}>
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
