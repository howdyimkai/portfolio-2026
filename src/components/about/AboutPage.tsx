'use client'

// The About page ("Shadow box", picked from /proto/about 2026-10-18; design-intent/about-exploration/NOTES.md).
// The bio panel sits on the left and starts as the about statement, so the page reads without
// touching anything; picking an object swaps the panel to that card in place, and the shelf stays
// in view. The principles frame hangs on the wall beside the shelves.
import { useRef, useState } from 'react'
import Image from 'next/image'
import AboutShelf from './AboutShelf'
import AboutCard from './AboutCard'
import { BIO, HERO, INTRO, PHOTO, PRINCIPLES, YOUNG_PHOTO } from './data'
import './about.css'

// The five principles, chalked on the birch frame. Real text, sized to the frame with container units.
function PrinciplesFrame({ className = '' }: { className?: string }) {
  return (
    <div className={`about-frame relative ${className}`}>
      <Image src="/about/frame.webp" alt="" width={722} height={923} draggable={false} />
      <div className="about-chalk">
        <h2>how I work</h2>
        <ol>
          {PRINCIPLES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [active, setActive] = useState<string | undefined>()
  const panel = useRef<HTMLElement>(null)

  const pick = (id: string) => {
    setActive((cur) => (cur === id ? undefined : id))
    // On phones the panel sits above the shelves: bring it back only when it's scrolled away.
    const el = panel.current
    const top = el?.getBoundingClientRect().top ?? 0
    if (el && (top < 0 || top > innerHeight - 120)) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
    }
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 md:px-10 md:pt-10">
      <h1 className="sr-only">About Kai</h1>
      <div className="grid items-start gap-12 lg:grid-cols-[420px_auto] lg:justify-center lg:gap-14 xl:grid-cols-[460px_auto] xl:gap-16">
        <aside ref={panel} className="about-panel scroll-mt-6 p-6 md:p-7 lg:sticky lg:top-8" aria-live="polite">
          {active ? (
            <div key={active} className="about-swap">
              <button className="about-link mb-5 font-mono text-xs" onClick={() => setActive(undefined)}>
                ← back to about me
              </button>
              <AboutCard id={active} />
            </div>
          ) : (
            <div key="about" className="about-swap flex flex-col gap-6">
              {/* Today's photo and the childhood one as taped and pinned prints, with Kai's stamp
                  and a blossom from the garden. */}
              <div className="about-collage mx-auto max-w-[300px] lg:max-w-none">
                <figure className="about-print about-print-main">
                  <Image src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.w} height={PHOTO.h} draggable={false} priority />
                  <span className="about-tape" aria-hidden="true" />
                </figure>
                <figure className="about-print about-print-young is-old">
                  <Image src={YOUNG_PHOTO.src} alt={YOUNG_PHOTO.alt} width={YOUNG_PHOTO.w} height={YOUNG_PHOTO.h} draggable={false} />
                  <span className="about-pin" aria-hidden="true" />
                </figure>
                <Image className="about-blossom" src="/about/blossom.webp" alt="" width={200} height={194} draggable={false} />
                <Image className="about-stamp" src="/about/stamp.webp" alt="" width={188} height={201} draggable={false} />
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[13px] leading-[1.6] text-ink-muted">
                  {INTRO[0]}
                  <br />
                  {INTRO[1]}
                </p>
                <p className="font-display text-[26px] leading-[1.15] tracking-[-0.015em] text-ink-primary [text-wrap:balance] lg:text-[32px]">{HERO}</p>
              </div>
              <div className="flex flex-col gap-[1.6em] font-mono text-[13px] leading-[1.6] text-ink-primary [text-wrap:pretty]">
                {BIO.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Shelves sized to their objects, frame on the wall beside them at md. On desktop (lg+) the
            frame hangs above the shelves, and the bigger bio photo balances the taller column. */}
        <div className="grid items-center justify-center gap-12 md:grid-cols-[auto_280px] md:gap-10 lg:grid-cols-1 lg:gap-14">
          {/* The lead is a stand-in until Kai's handwritten "what I'm into right now" asset lands. */}
          <AboutShelf
            className="justify-self-center [--zoom:1] sm:[--zoom:1.2] xl:[--zoom:1.35]"
            activeCard={active}
            onPick={pick}
            lead={<p className="font-mono text-[11px] leading-[1.4] text-ink-muted">what I&apos;m into right now. pick anything up</p>}
          />
          <PrinciplesFrame className="mx-auto w-full max-w-[320px] md:max-w-none lg:order-first lg:max-w-[340px] xl:max-w-[370px]" />
        </div>
      </div>
    </div>
  )
}
