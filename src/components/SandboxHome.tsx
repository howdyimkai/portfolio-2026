'use client'

import ShelfNav from '@/components/shelf/ShelfNav'
import SandGarden from '@/components/SandGarden'
import './sandbox-home.css'

// Homepage: sand is the page, and the shelf and tools float on top of it.
export default function SandboxHome() {
  return (
    <div className="bleed-shelf relative h-full overflow-hidden">
      <SandGarden layout="bleed" />
      {/* Wordmark and broom inked dark like the hero title: black at 85% over the sand
          (Kai, 2026-10-13), so the sand's warmth shows through. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 [&_.shelf-broom]:pointer-events-auto [&_.shelf-wordmark]:opacity-[0.85] [&_.shelf-broom]:text-black/85! [&_.shelf-wordmark]:[filter:brightness(0)]!">
        <ShelfNav activeHref="/" />
      </div>
    </div>
  )
}
