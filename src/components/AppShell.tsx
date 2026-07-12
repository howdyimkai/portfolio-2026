'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  if (isHome) {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden">
        <Navigation />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
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
