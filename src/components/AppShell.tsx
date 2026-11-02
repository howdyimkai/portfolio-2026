'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ShelfNav from '@/components/shelf/ShelfNav'
import PhoneMenu from '@/components/shelf/PhoneMenu'
import { playPageEnter } from '@/components/pageEnter'
import ResumeBookmark from '@/components/resume/ResumeBookmark'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Page changes fade the new page in (playPageEnter) while the shelf, phone bar and bookmark stay
  // put. Not on the first page, since what's there when the site opens just sits there. WAAPI rather
  // than a keyed remount, which left the old page mounted under the new one.
  const firstPath = useRef(pathname)
  useLayoutEffect(() => {
    if (pathname === firstPath.current) return
    firstPath.current = ''
    playPageEnter()
  }, [pathname])

  // /pieces/* show one part of the site on its own, so no site chrome around it.
  if (pathname.startsWith('/pieces/')) return <main data-page-enter="">{children}</main>

  // The case study password page sits alone on white grid paper (src/proxy.ts sends people here).
  if (pathname === '/unlock') return <main data-page-enter="" className="grid-sheet">{children}</main>

  if (isHome) {
    return (
      // The sandbox fills the screen and brings its own floating shelf nav (SandboxHome). The résumé
      // bookmark hangs beside the shelf on every shelf page (2026-10-27). Phones get the paper bar and
      // hamburger the other pages use instead of the shelf, which was too crowded there (Kai, 2026-11-01).
      <>
        <PhoneMenu />
        <main data-page-enter="" className="h-[100dvh] overflow-hidden">{children}</main>
        <ResumeBookmark />
      </>
    )
  }

  // /works, its case studies, /about and /play share the homepage's shelf nav, on white grid paper
  // (Kai, 2026-10-16; /about joined 2026-10-18, /play 2026-11-02). The wordmark and broom are inked like the homepage's:
  // black at 85%. On phones the shelf gives way to a paper bar whose hamburger opens it as one
  // column (PhoneMenu, 2026-10-23).
  if (pathname === '/works' || pathname.startsWith('/works/') || pathname === '/about' || pathname === '/play') {
    return (
      <div className="grid-sheet flex min-h-screen flex-col">
        <PhoneMenu />
        <div className="max-md:hidden [&_.shelf-wordmark]:opacity-[0.85] [&_.shelf-broom]:text-black/85! [&_.shelf-wordmark_img]:[filter:brightness(0)]!">
          <ShelfNav />
        </div>
        <main data-page-enter="" className="flex-grow max-md:pt-14">{children}</main>
        <Footer />
        <ResumeBookmark />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main data-page-enter="" className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
