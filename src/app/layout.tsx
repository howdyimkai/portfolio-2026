import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import localFont from 'next/font/local'
import '../styles/globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const commitMono = localFont({
  src: '../../public/fonts/CommitMono-400-Regular.otf',
  variable: '--font-commit-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kai Tran | Interdisciplinary Product Designer',
    template: '%s | Kai Tran'
  },
  description: 'Making learning feel like play - A portfolio showcasing innovative design solutions',
  keywords: ['product design', 'UX', 'UI', 'design', 'learning', 'innovation'],
  openGraph: {
    title: 'Kai Tran - Interdisciplinary Product Designer',
    description: 'Making learning feel like play',
    url: 'https://www.kaitran.design',
    siteName: 'Kai Tran Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kai Tran - Interdisciplinary Product Designer',
    description: 'Making learning feel like play',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${commitMono.variable} font-sans min-h-screen flex flex-col`} style={{ backgroundColor: '#F8F8F8' }}>
        <div className="w-full mx-auto flex-grow">
          <Navigation />
          <main>
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
