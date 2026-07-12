'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  key: string
  label: string
  href: string
  hover: string
  ratio: number
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'hello world', href: '/', hover: '/nav/hover-helloworld.webp', ratio: 500 / 112 },
  { key: 'works', label: 'selected works', href: '/works', hover: '/nav/hover-selectedworks.webp', ratio: 430 / 164 },
  { key: 'play', label: 'playground', href: '/play', hover: '/nav/hover-playground.webp', ratio: 500 / 130 },
  { key: 'about', label: 'about me', href: '/about', hover: '/nav/hover-aboutme.webp', ratio: 494 / 102 },
]

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="group relative inline-flex items-center px-1 py-2 font-mono text-sm text-ink-body"
    >
      <span
        aria-hidden
        className={`nav-brush pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${active ? 'is-active' : ''}`}
        style={{ width: `${item.ratio * 34}px`, height: '34px' }}
      >
        <Image src={item.hover} alt="" fill sizes="200px" className="object-contain" />
      </span>
      <span className="relative z-10">{item.label}</span>
    </Link>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href
  const secondaryItems = NAV_ITEMS.filter((i) => i.key !== 'home')

  return (
    <header className="relative z-20 border-b border-hairline">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        {isHome ? (
          <ul className="hidden w-full items-center justify-between md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <NavLink item={item} active={isActive(item.href)} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <Link href="/" className="press-scale font-display text-lg font-semibold text-ink-primary md:text-xl">
              Kai Tran
            </Link>
            <ul className="hidden items-center gap-8 md:flex lg:gap-10">
              {secondaryItems.map((item) => (
                <li key={item.key}>
                  <NavLink item={item} active={isActive(item.href)} />
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="press-scale font-mono text-xl text-ink-primary md:hidden"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div
        className={`nav-overlay fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-page md:hidden ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.key} item={item} active={isActive(item.href)} onClick={() => setMenuOpen(false)} />
        ))}
      </div>
    </header>
  )
}
