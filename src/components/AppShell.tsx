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
      <div className="flex h-[100dvh] flex-col overflow-hidden">
        <ShelfNav />
        {/* No clip here: the outer div already crops at the fold, and clipping main's top edge
            would cut the garden while ShelfNav animates it across the header boundary. */}
        <main className="min-h-0 flex-1">{children}</main>
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
