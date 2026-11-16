import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import AppShell from '@/components/AppShell'

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

// Body sans for the résumé on phones only (reviewer pass, 2026-11-16: mono at ~37 characters a line was
// hard to read). Not preloaded, and the sheet only asks for it once it's open. The variable file,
// the same one the case study kits use, so it's one download site-wide. The PDF uses Inter too.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

const commitMono = localFont({
  // 700 too, so font-semibold/bold on mono (case study labels and rule titles) is the drawn bold, not a faked one.
  src: [
    { path: '../../public/fonts/CommitMono-400-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/CommitMono-700-Regular.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-commit-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://howdyimkai.com'),
  title: {
    default: 'Kai Tran | Product designer and tinkerer',
    template: '%s | Kai Tran'
  },
  description: 'Product designer and tinkerer. I make learning feel like play.',
  keywords: ['product design', 'UX', 'UI', 'design', 'learning', 'play'],
  openGraph: {
    title: 'Kai Tran | Product designer and tinkerer',
    description: 'Product designer and tinkerer. I make learning feel like play.',
    url: 'https://howdyimkai.com',
    siteName: 'Kai Tran Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kai Tran | Product designer and tinkerer',
    description: 'Product designer and tinkerer. I make learning feel like play.',
  },
}

// viewport-fit=cover lets the phone bar and chapter chip pad themselves clear of the notch and
// home indicator (env(safe-area-inset-*) is 0 without it). The status bar takes the paper color.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F2EBE1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Font variables live on <html> so the @theme tokens (resolved at :root) can see them.
    <html lang="en" className={`${bricolage.variable} ${commitMono.variable} ${inter.variable} antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
        {/* Vercel Web Analytics: page views only, no cookies. Only sends on Vercel deployments. */}
        <Analytics />
      </body>
    </html>
  )
}
