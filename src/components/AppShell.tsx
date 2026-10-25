'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ShelfNav from '@/components/shelf/ShelfNav'
import PhoneMenu from '@/components/shelf/PhoneMenu'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  // /pieces/* show one part of the site on its own, so no site chrome around it.
  if (pathname.startsWith('/pieces/')) return <main>{children}</main>

  // The case study password page sits alone on white grid paper (src/proxy.ts sends people here).
  if (pathname === '/unlock') return <main className="grid-sheet">{children}</main>

  if (isHome) {
    return (
      // The sandbox fills the screen and brings its own floating shelf nav (SandboxHome).
      <main className="h-[100dvh] overflow-hidden">{children}</main>
    )
  }

  // /works, its case studies and /about share the homepage's shelf nav, on white grid paper (Kai,
  // 2026-10-16; /about joined 2026-10-18). The wordmark and broom are inked like the homepage's:
  // black at 85%. On phones the shelf gives way to a paper bar whose hamburger opens it as one
  // column (PhoneMenu, 2026-10-23).
  if (pathname === '/works' || pathname.startsWith('/works/') || pathname === '/about') {
    return (
      <div className="grid-sheet flex min-h-screen flex-col">
        <PhoneMenu />
        <div className="max-md:hidden [&_.shelf-wordmark]:opacity-[0.85] [&_.shelf-broom]:text-black/85! [&_.shelf-wordmark_img]:[filter:brightness(0)]!">
          <ShelfNav />
        </div>
        <main className="flex-grow max-md:pt-14">{children}</main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
