'use client'
// Contents in flow: the chalk frame sits in the page itself, right before the TL;DR, like a book's
// contents page. No chrome follows you; once you're past it, one small chalk button brings you back.
// Axis: nothing persistent, the page stays calm.
import { useEffect, useState } from 'react'
// @ts-expect-error the repo has no @types/react-dom; throwaway prototype
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { CHAPTERS, goTo, useActive, usePast } from './shared'

const card = () => document.getElementById('pn-contents')

export default function InFlow() {
  const active = useActive()
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const past = usePast(card, -320)

  // Prototype only: drop a slot in front of the first chapter (the real template would render it).
  useEffect(() => {
    const first = document.getElementById(CHAPTERS[0].id)
    if (!first) return
    const el = document.createElement('div')
    el.className = 'lg:hidden'
    first.before(el)
    setSlot(el)
    return () => el.remove()
  }, [])

  return (
    <>
      {slot && createPortal(
        <nav id="pn-contents" aria-label="Chapters" className="mt-[77px] scroll-mt-6">
          <div className="cs-frame mx-auto max-w-[340px]">
            <ol className="cs-chalk pn-chalk">
              <li className="pn-chalk-label" aria-hidden="true">Chapters</li>
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={(e) => { e.preventDefault(); goTo(c.id) }}>
                    <span className="tabular-nums">{c.num || '··'}</span>
                    <span>{c.title}</span>
                  </a>
                </li>
              ))}
              <li className="cs-chalk-rule" aria-hidden="true" />
              <li><Link href="/works" className="cs-chalk-back">Back to More Work</Link></li>
            </ol>
          </div>
        </nav>,
        slot,
      )}
      <div className="lg:hidden">
      <button
        type="button"
        inert={!past}
        data-shown={past ? '' : undefined}
        onClick={() => goTo('pn-contents')}
        className="pn-back"
        aria-label={`Back to chapters (now reading ${CHAPTERS.find((c) => c.id === active)!.title})`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
          <path d="M5.5 4.5h7M5.5 8h7M5.5 11.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="3" cy="4.5" r=".8" fill="currentColor" /><circle cx="3" cy="8" r=".8" fill="currentColor" /><circle cx="3" cy="11.5" r=".8" fill="currentColor" />
        </svg>
      </button>
      </div>
    </>
  )
}
