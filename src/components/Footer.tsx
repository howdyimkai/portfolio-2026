'use client'

import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname === '/') return null

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-2 px-6 py-8 font-mono text-xs text-ink-muted sm:flex-row sm:justify-between md:px-10">
        <div>© {currentYear} Kai Tran. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="press-scale">
            LinkedIn
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="press-scale">
            GitHub
          </a>
          <a href="mailto:uxdesignerkaitran@gmail.com" className="press-scale">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
