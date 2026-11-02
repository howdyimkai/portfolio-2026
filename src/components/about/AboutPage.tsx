'use client'

// The About page ("Shadow box", picked from /proto/about 2026-10-18; design-intent/about-exploration/NOTES.md).
// The bio panel sits on the left and never changes, so the page reads without touching anything;
// picking an object opens its card in a drawer under that object's plank, and the other objects step
// back ("Shelf drawer", 2026-11-02). The principles frame hangs on the wall beside the shelves. The cowboy hat on the top shelf
// opens my career rodeo over the page (CareerRodeo.tsx, 2026-10-30).
import { useState } from 'react'
import Image from 'next/image'
import AboutShelf from './AboutShelf'
import ShelfCaption from './ShelfCaption'
import LookAround from './LookAround'
import { RodeoHat, RodeoSheet, useCareerRodeo } from './CareerRodeo'
import { BIO, HERO, NAME_ART, OBJECTS, PHOTO, PRINCIPLES, YOUNG_PHOTO } from './data'
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
  // The picked object (not just its card), so the drawer's notch points at the cat you clicked.
  const [picked, setPicked] = useState<string>()
  const obj = OBJECTS.find((o) => o.id === picked)
  const rodeo = useCareerRodeo()

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 md:px-10 md:pt-10">
      <h1 className="sr-only">About Kai</h1>
      <div className="grid items-start gap-12 lg:grid-cols-[420px_auto] lg:justify-center lg:gap-14 xl:grid-cols-[460px_auto] xl:gap-16">
        <aside className="about-panel flex flex-col gap-6 p-6 md:p-7 lg:sticky lg:top-8">
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
            {/* Kai's handwritten name and cat, across the panel's text column (2026-10-30). */}
            <Image src={NAME_ART.src} alt={NAME_ART.alt} width={NAME_ART.w} height={NAME_ART.h} draggable={false} className="-mb-2 h-auto w-full max-w-[340px] lg:max-w-none" />
            <p className="font-display text-[26px] leading-[1.15] tracking-[-0.015em] text-ink-primary [text-wrap:balance] lg:text-[32px]">{HERO}</p>
          </div>
          <div className="flex flex-col gap-[1.6em] font-mono text-[13px] leading-[1.6] text-ink-primary [text-wrap:pretty]">
            {BIO.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </aside>

        {/* Shelves sized to their objects, frame on the wall beside them at md. On phones and on desktop
            (lg+) the frame hangs above the shelves (phones: Kai, 2026-11-02), and the bigger bio photo
            balances the taller column. The frame comes first in the DOM to match. */}
        <div className="grid items-center justify-center gap-12 md:grid-cols-[auto_280px] md:gap-10 lg:grid-cols-1 lg:gap-6">
          <PrinciplesFrame className="mx-auto w-full max-w-[320px] md:max-w-none md:max-lg:order-last lg:max-w-[400px] xl:max-w-[440px]" />
          {/* The lead is the cowboy hat, which opens my career rodeo (2026-10-30). Kai's handwritten
              note replaced the shelf's typed "what I'm into" label the same day. */}
          <div className="flex flex-col items-center gap-1 justify-self-center">
            {/* Kai's handwritten "plz have a look around" sits over the top shelf, eyes in the o's (2026-10-30). */}
            <LookAround className="w-[200px] lg:w-[240px]" />
            <AboutShelf
              className="[--zoom:1] sm:[--zoom:1.2] xl:[--zoom:1.35]"
              activeCard={obj?.card}
              onPick={(id) => setPicked((cur) => (cur === id ? undefined : id))}
              lead={<RodeoHat open={rodeo.open} onOpen={rodeo.openSheet} trigger={rodeo.trigger} />}
              after={(s) => (
                <ShelfCaption objId={obj?.shelf === s ? picked : undefined} onClose={() => setPicked(undefined)} onStep={setPicked} />
              )}
            />
          </div>
        </div>
      </div>
      <RodeoSheet open={rodeo.open} round={rodeo.round} close={rodeo.close} trigger={rodeo.trigger} />
    </div>
  )
}
