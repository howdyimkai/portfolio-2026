import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import localFont from 'next/font/local'
import '../styles/globals.css'
import AppShell from '@/components/AppShell'

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
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
  title: {
    default: 'Kai Tran | Designer and tinkerer',
    template: '%s | Kai Tran'
  },
  description: 'Designer and tinkerer. I make learning feel like play.',
  keywords: ['product design', 'UX', 'UI', 'design', 'learning', 'play'],
  openGraph: {
    title: 'Kai Tran | Designer and tinkerer',
    description: 'Designer and tinkerer. I make learning feel like play.',
    url: 'https://www.kaitran.design',
    siteName: 'Kai Tran Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kai Tran | Designer and tinkerer',
    description: 'Designer and tinkerer. I make learning feel like play.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Font variables live on <html> so the @theme tokens (resolved at :root) can see them.
    <html lang="en" className={`${bricolage.variable} ${commitMono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
