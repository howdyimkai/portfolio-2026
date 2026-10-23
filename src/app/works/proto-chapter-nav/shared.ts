'use client'
import { useEffect, useState } from 'react'
import { cal } from '@/content/case-studies/cal'
import { smartQuotes } from '@/components/case-study/smartQuotes'

let n = 0
export const CHAPTERS = cal.chapters.map((c) => ({
  id: c.id,
  num: c.unnumbered ? '' : String(++n).padStart(2, '0'),
  title: smartQuotes(c.title),
}))

export function useActive() {
  const [active, setActive] = useState(CHAPTERS[0].id)
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.3
      let cur = CHAPTERS[0].id
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id)
        if (el && el.getBoundingClientRect().top <= line) cur = c.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

// True once the given element's top has scrolled above `offset` px from the viewport top.
export function usePast(getEl: () => Element | null, offset = 0) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const el = getEl()
      setPast(!!el && el.getBoundingClientRect().top < offset)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [getEl, offset])
  return past
}

export function goTo(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = document.getElementById(id)
  // 72px clear of the top, so a chapter label never lands under the rail.
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: reduce ? 'auto' : 'smooth' })
  history.replaceState(null, '', `${location.search}#${id}`)
}
