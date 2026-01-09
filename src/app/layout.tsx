import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Kai | Interdisciplinary Product Designer',
  description: 'Making learning feel like play',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-terminal-bg text-terminal-text font-sans">
        {children}
      </body>
    </html>
  )
}