'use client'

// Footer on every page but the homepage: a band of the /works chalkboard with its wooden ledge on
// top. Kai's stamp beside the invitation, Copy email and the phone menu's socials under it, the
// locked footer blurb with the broom on the right. "Chalkboard", picked from /works/proto-footer
// (2026-11-02); decision record in design-intent/footer-exploration/NOTES.md.
import { usePathname } from 'next/navigation'
import SayHowdy from '@/components/resume/SayHowdy'
import { STAMP } from '@/components/about/data'
import { Broom } from '@/components/shelf/ShelfNav'
import { SOCIALS } from '@/components/shelf/socials'
import './footer.css'

const BIO =
  "I'm a designer and tinkerer who sweeps the gap between marketing and product, with roots in film and games. I translate pixels, stories and code, and I tinker and wrestle with AI until ideas work. My specialty is making hard things feel easy, with a sprinkle of whimsy."

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null

  return (
    <footer className="ft">
      <span className="ft-ledge" aria-hidden="true" />
      <div className="ft-grid">
        <div className="ft-reach">
          <div className="ft-howdy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ft-stamp" src={STAMP.src} alt={STAMP.alt} width={STAMP.w} height={STAMP.h} draggable={false} />
            <p className="ft-cta">Come play.<br />Say howdy.</p>
          </div>
          <div className="ft-actions">
            <SayHowdy className="ft-copy" />
            <ul className="ft-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="ft-social" aria-label={`${s.label}, opens in a new tab`}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.d} fill="currentColor" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ft-side">
          <div className="ft-bio">
            <span className="ft-broom"><Broom /></span>
            <p>{BIO}</p>
          </div>
          <p className="ft-copyright">© {new Date().getFullYear()} Kai Tran</p>
        </div>
      </div>
    </footer>
  )
}
