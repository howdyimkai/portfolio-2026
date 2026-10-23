'use client'

// Phone nav (< 768px), in place of the shelf header: a paper bar with the wordmark and a
// hamburger that opens Kai's birch shelf as one column, one cubby per toy, with a way to say
// howdy under it. Picked from /works/proto-phone-menu (Split, 2026-10-23); decision record in
// design-intent/nav-exploration/NOTES.md.
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TOYS } from './ShelfNav'
import './phone-menu.css'

const EMAIL = 'uxdesignerkaitran@gmail.com'
// Central Icons' filled brand marks (Cal-Visuals/icon-svg.md). Contra left out for now (Kai, 2026-10-23).
const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/uxdesignerkai/', d: 'M19.65 3H4.35C3.99196 3 3.64858 3.14223 3.39541 3.39541C3.14223 3.64858 3 3.99196 3 4.35V19.65C3 20.008 3.14223 20.3514 3.39541 20.6046C3.64858 20.8578 3.99196 21 4.35 21H19.65C20.008 21 20.3514 20.8578 20.6046 20.6046C20.8578 20.3514 21 20.008 21 19.65V4.35C21 3.99196 20.8578 3.64858 20.6046 3.39541C20.3514 3.14223 20.008 3 19.65 3ZM8.4 18.3H5.7V10.2H8.4V18.3ZM7.05 8.625C6.74056 8.61616 6.4406 8.51632 6.18758 8.33797C5.93456 8.15962 5.7397 7.91066 5.62737 7.6222C5.51503 7.33374 5.49019 7.01857 5.55595 6.71607C5.6217 6.41358 5.77515 6.13716 5.9971 5.92138C6.21906 5.70559 6.49968 5.55999 6.80391 5.50278C7.10814 5.44556 7.42248 5.47927 7.70766 5.59969C7.99284 5.7201 8.23622 5.92189 8.40737 6.17983C8.57853 6.43778 8.66987 6.74044 8.67 7.05C8.66289 7.47331 8.4885 7.8766 8.18495 8.17173C7.88139 8.46685 7.47335 8.62982 7.05 8.625ZM18.3 18.3H15.6V14.034C15.6 12.756 15.06 12.297 14.358 12.297C14.1522 12.3107 13.9511 12.3649 13.7663 12.4566C13.5815 12.5482 13.4166 12.6755 13.2811 12.831C13.1457 12.9866 13.0422 13.1674 12.9768 13.363C12.9114 13.5586 12.8853 13.7652 12.9 13.971C12.8955 14.0129 12.8955 14.0551 12.9 14.097V18.3H10.2V10.2H12.81V11.37C13.0733 10.9695 13.435 10.6433 13.8605 10.4227C14.286 10.2021 14.761 10.0944 15.24 10.11C16.635 10.11 18.264 10.884 18.264 13.404L18.3 18.3Z' },
  { label: 'GitHub', href: 'https://github.com/howdyimkai', d: 'M12 1.95068C17.525 1.95068 22 6.42568 22 11.9507C21.9995 14.0459 21.3419 16.0883 20.1198 17.7902C18.8977 19.4922 17.1727 20.768 15.1875 21.4382C14.6875 21.5382 14.5 21.2257 14.5 20.9632C14.5 20.6257 14.5125 19.5507 14.5125 18.2132C14.5125 17.2757 14.2 16.6757 13.8375 16.3632C16.0625 16.1132 18.4 15.2632 18.4 11.4257C18.4 10.3257 18.0125 9.43818 17.375 8.73818C17.475 8.48818 17.825 7.46318 17.275 6.08818C17.275 6.08818 16.4375 5.81318 14.525 7.11318C13.725 6.88818 12.875 6.77568 12.025 6.77568C11.175 6.77568 10.325 6.88818 9.525 7.11318C7.6125 5.82568 6.775 6.08818 6.775 6.08818C6.225 7.46318 6.575 8.48818 6.675 8.73818C6.0375 9.43818 5.65 10.3382 5.65 11.4257C5.65 15.2507 7.975 16.1132 10.2 16.3632C9.9125 16.6132 9.65 17.0507 9.5625 17.7007C8.9875 17.9632 7.55 18.3882 6.65 16.8757C6.4625 16.5757 5.9 15.8382 5.1125 15.8507C4.275 15.8632 4.775 16.3257 5.125 16.5132C5.55 16.7507 6.0375 17.6382 6.15 17.9257C6.35 18.4882 7 19.5632 9.5125 19.1007C9.5125 19.9382 9.525 20.7257 9.525 20.9632C9.525 21.2257 9.3375 21.5257 8.8375 21.4382C6.8458 20.7752 5.11342 19.502 3.88611 17.799C2.65881 16.096 1.9989 14.0498 2 11.9507C2 6.42568 6.475 1.95068 12 1.95068Z' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@uxbykai', d: 'M20.7153 10.2134C18.9357 10.2134 17.288 9.64796 15.9425 8.68698V15.6726C15.9425 19.1671 13.1082 22 9.61201 22C8.30752 22 7.09504 21.6058 6.08784 20.9298C4.39549 19.7941 3.28125 17.863 3.28125 15.6726C3.28125 12.1783 6.11561 9.34543 9.61211 9.3455C9.90268 9.34536 10.1929 9.36509 10.4807 9.40441V10.18L10.4806 12.904C10.2035 12.8161 9.90816 12.7684 9.60172 12.7684C8.00229 12.7684 6.70594 14.0643 6.70594 15.6627C6.70594 16.7928 7.35394 17.7714 8.29887 18.2481C8.69067 18.4456 9.13316 18.5569 9.60174 18.5569C11.1979 18.5569 12.492 17.2663 12.4975 15.6726V2H15.9425V2.44029C15.9546 2.57192 15.9721 2.70305 15.995 2.83332C16.234 4.19637 17.0495 5.36094 18.1813 6.06685C18.9413 6.54103 19.8196 6.79171 20.7154 6.79035L20.7153 10.2134Z' },
  { label: 'X', href: 'https://twitter.com/uxbykai', d: 'M17.5652 3.25H20.5319L14.0505 10.6628L21.6753 20.75H15.7052L11.0291 14.6322L5.67867 20.75H2.71017L9.64264 12.8212L2.32812 3.25H8.44986L12.6766 8.84192L17.5652 3.25ZM16.524 18.9731H18.1679L7.55662 4.93359H5.79256L16.524 18.9731Z' },
]

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
        <button ref={burger} type="button" className="pm-burger" aria-expanded={open} aria-haspopup="dialog" aria-label="Menu" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16M4 12h16M4 16.5h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
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
          <Link key={t.label} href={t.href} onClick={onPick} aria-current={isHere(t.href, pathname) ? 'page' : undefined} className="pm-cubby" style={rowStyle(i)}>
            <span className="pm-group">
              <span className="pm-slot" aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
                <span className="pm-toy" style={{ width: w }}>
                  <Image src={t.src} alt="" width={t.w} height={t.h} draggable={false} unoptimized />
                </span>
                <span className="pm-shadow" style={{ width: w * 0.8 }} />
              </span>
              <span className="pm-cubby-label">{t.label}</span>
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
