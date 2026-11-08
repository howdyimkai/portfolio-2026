'use client'

// Phone nav (< 768px), in place of the shelf header: a paper bar with the wordmark and a
// hamburger that opens Kai's birch shelf as one column, one cubby per toy, with a way to say
// howdy under it. Picked from /works/proto-phone-menu (Split, 2026-10-23); decision record in
// design-intent/nav-exploration/NOTES.md.
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NewTabNote, TOYS, newTab } from './ShelfNav'
import { SOCIALS } from './socials'
import SoundToggle from '@/components/SoundToggle'
import { play } from '@/lib/sfx'
import './phone-menu.css'

const EMAIL = 'uxdesignerkaitran@gmail.com'

export default function PhoneMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const burger = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  useEffect(close, [pathname, close])

  return (
    <>
      <div className="pm-bar">
        <Link href="/" className="pm-mark" aria-label="howdy im Kai, home">
          <Image src="/nav/shelf/wordmark.webp" alt="" width={309} height={130} draggable={false} unoptimized />
        </Link>
        <div className="pm-bar-end">
          {/* Sound sits left of the menu, the phone's version of the shelf's chip (Kai, 2026-11-07). */}
          <SoundToggle iconOnly className="pm-sound" />
          <button ref={burger} type="button" className="pm-burger" aria-expanded={open} aria-haspopup="dialog" aria-label="Menu" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16M4 12h16M4 16.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>
      <Overlay open={open} onClose={close} trigger={burger}>
        <ToyColumn pathname={pathname} onPick={close} />
        <Contact />
      </Overlay>
    </>
  )
}

// Full screen on paper. Locks the page behind it, Escape closes, focus goes in and comes back.
// iOS Safari ignores overflow: hidden for touch scrolling, so the body is pinned in place at its
// scroll offset instead and put back on close. Safari doesn't focus a button on tap either, so
// focus returns to the hamburger by ref, not to whatever was focused.
function Overlay({ open, onClose, trigger, children }: { open: boolean; onClose: () => void; trigger: RefObject<HTMLElement | null>; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    ref.current?.querySelector<HTMLElement>('.pm-close')?.focus()
    const body = document.body
    const y = window.scrollY
    const prev = body.style.cssText
    body.style.cssText += `;position:fixed;top:${-y}px;left:0;right:0;overflow:hidden`
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      body.style.cssText = prev
      window.scrollTo({ top: y, behavior: 'instant' })
      document.removeEventListener('keydown', onKey)
      trigger.current?.focus({ preventScroll: true })
    }
  }, [open, onClose, trigger])
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" inert={!open} data-open={open ? '' : undefined} className="pm-overlay grid-sheet">
      <div className="pm-overlay-top">
        <Image src="/nav/shelf/wordmark.webp" alt="howdy im Kai" width={309} height={130} className="pm-mark-img" draggable={false} unoptimized />
        <button type="button" className="pm-close" aria-label="Close menu" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="pm-overlay-body">{children}</div>
    </div>
  )
}

// Kai's one-column shelf (Cal-Visuals/11-navigation, 2026-10-23), sliced into a top board and
// one image per cubby (public/nav/shelf-column): each cubby is chalk with the board under it.
// Rows stretch only vertically through their chalk; walls, boards and the inner shadow keep
// their drawn size. Row 4 is row 2 mirrored, and the last row closes on a regular board in
// place of the export's thick base. Values are source px; S scales them to a ~361px column.
const S = 0.44
const ROWS = [
  { f: 'a', b: 26 },
  { f: 'b', b: 25 },
  { f: 'c', b: 31 },
  { f: 'd', b: 25 },
  { f: 'end', b: 21 },
]
const rowStyle = (i: number) => {
  const { f, b } = ROWS[i]
  const w = `${6 * S}px ${51 * S}px ${b * S}px ${51 * S}px`
  return { borderWidth: w, borderImage: `url('/nav/shelf-column/${f}.webp') 6 51 ${b} 51 fill / ${w} stretch` }
}
// A case study counts as being on its toy's page (/works/cal → selected works).
const isHere = (href: string, pathname: string) => pathname === href || (href.length > 1 && pathname.startsWith(href + '/'))

function ToyColumn({ pathname, onPick }: { pathname: string; onPick: () => void }) {
  return (
    <nav aria-label="Main" className="pm-column">
      <span className="pm-column-top" aria-hidden="true" />
      {TOYS.map((t, i) => {
        const w = t.width * 1.7
        return (
          <Link key={t.label} href={t.href} {...newTab(t)} onClick={onPick} aria-current={isHere(t.href, pathname) ? 'page' : undefined} className="pm-cubby" style={rowStyle(i)}>
            <span className="pm-group">
              <span className="pm-slot" aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
                <span className="pm-toy" style={{ width: w }}>
                  <Image src={t.src} alt="" width={t.w} height={t.h} draggable={false} unoptimized />
                </span>
                <span className="pm-shadow" style={{ width: w * 0.8 }} />
              </span>
              <span className="pm-cubby-label">
                {t.label}
                <NewTabNote t={t} />
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

// Say howdy: the address itself copies (most people write from their own mail app or webmail),
// with a small "open in mail" for those who want mailto. Socials sit under it as chalk chips.
function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    void play('copy')
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      const t = document.createElement('textarea')
      t.value = EMAIL
      document.body.append(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }
  return (
    <section aria-label="Contact" className="pm-contact">
      <p className="pm-contact-cta">Come play. Say howdy.</p>
      <div className="pm-email">
        <button type="button" className="pm-email-copy" onClick={copy}>
          <span className="pm-email-addr">{EMAIL}</span>
          <span className="pm-email-act" aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
          <span className="sr-only">, copy email address</span>
        </button>
        <a href={`mailto:${EMAIL}`} className="pm-email-open">Open in mail</a>
        <span role="status" aria-live="polite" className="sr-only">{copied ? 'Email address copied' : ''}</span>
      </div>
      <ul className="pm-socials">
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="pm-social" aria-label={`${s.label}, opens in a new tab`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.d} fill="currentColor" /></svg>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
