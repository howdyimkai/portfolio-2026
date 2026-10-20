'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ShelfNav from '@/components/shelf/ShelfNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  // /pieces/* show one part of the site on its own, so no site chrome around it.
  if (pathname.startsWith('/pieces/')) return <main>{children}</main>

  if (isHome) {
    return (
      // The sandbox fills the screen and brings its own floating shelf nav (SandboxHome).
      <main className="h-[100dvh] overflow-hidden">{children}</main>
    )
  }

  // /works and its case studies share the homepage's shelf nav, on white grid paper (Kai, 2026-10-16). The wordmark
  // and broom are inked like the homepage's: black at 85%.
  if (pathname === '/works' || pathname.startsWith('/works/')) {
    return (
      <div className="grid-sheet flex min-h-screen flex-col">
        <div className="[&_.shelf-wordmark]:opacity-[0.85] [&_.shelf-broom]:text-black/85! [&_.shelf-wordmark]:[filter:brightness(0)]!">
          <ShelfNav />
        </div>
        <main className="flex-grow">{children}</main>
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
