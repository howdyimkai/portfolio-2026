'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

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

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
