// PROTOTYPE — one high level case study card, second round. Delete with src/app/proto/project-card.
import Image from 'next/image'

const P = {
  name: 'design garden',
  hook: 'Most online courses never get finished. These sprints do.',
  body: 'A four week sprint platform I built and run. Designers pair up, check in weekly, and end on showcase night with real progress on their next move.',
  role: 'founder',
  year: '2026',
  // Stand-in cropped from Kai's mock screenshot (333px); swap for the real export.
  cover: '/proto/project-card/design-garden-cover.webp',
  href: '#',
}

// The white frosted card from the reference: name and number up top, the app window on its own,
// hook and arrow below. Hover grows the grass out from behind the window and the header and
// footer turn into the garden tray's frosted chips over it.
function FrostedCard() {
  return (
    <div className="pc-frost relative aspect-[333/328] overflow-hidden rounded-[22px]">
      <Image
        src={P.cover}
        alt="Design Garden: two designers' shared garden board for the week"
        fill
        sizes="440px"
        draggable={false}
        className="pc-grow object-cover"
      />
      {/* Two chips, not one bar: the cover's drawn title sits between them on hover. */}
      <span className="pc-chip absolute left-2 top-2 rounded-[14px] px-3 py-2.5 font-mono text-[13px] text-ink-primary">{P.name}</span>
      <span className="pc-chip absolute right-2 top-2 rounded-[14px] px-3 py-2.5 font-mono text-[13px] text-ink-faint tabular-nums">01</span>
      <div className="pc-chip absolute inset-x-2 bottom-2 flex items-center justify-between gap-4 rounded-[14px] px-3 py-2.5 font-mono text-[13px] text-ink-primary">
        <span className="[text-wrap:balance]">{P.hook}</span>
        <svg className="pc-arrow shrink-0" width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
          <path d="M1 7h18M14 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

// 1 — Kai's two tone: the same white card, with the butter panel carrying the story under it.
export function FrostedStory() {
  return (
    <a href={P.href} className="pc-card group block w-full max-w-[440px] rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-primary" aria-label="Design Garden case study">
      <FrostedCard />
      <div className="pc-raised mt-1.5 rounded-[22px] bg-[#F1DCB6] px-6 py-5">
        <p className="font-display text-[15px] leading-[1.45] text-ink-primary [text-wrap:pretty]">{P.body}</p>
      </div>
    </a>
  )
}

// Specimen's bottom (meta row on a hairline, the story, a quiet link) as the panel under the card,
// drawn on chalk. The hook stays in the card's footer, so the panel doesn't repeat it.
function ChalkStory({ tone }: { tone: 'board' | 'dust' }) {
  const board = tone === 'board'
  return (
    <div className={`pc-raised mt-1.5 rounded-[22px] px-6 pb-6 pt-5 ${board ? 'pc-chalkboard' : 'pc-chalkdust'}`}>
      <div className={`flex items-baseline justify-between border-b pb-2 font-mono text-[11px] tracking-[0.04em] ${board ? 'border-[rgb(240_236_226/0.22)] text-[rgb(240_236_226/0.6)]' : 'border-hairline text-ink-faint'}`}>
        <span>the story</span>
        <span>
          {P.role} · {P.year}
        </span>
      </div>
      <p className={`mt-4 font-mono text-[13px] leading-[1.6] [text-wrap:pretty] ${board ? 'pc-chalk-ink' : 'text-ink-body'}`}>{P.body}</p>
      <span className={`pc-link mt-4 inline-block font-mono text-[13px] ${board ? 'pc-chalk-ink' : 'text-ink-primary'}`}>see how it grew</span>
    </div>
  )
}

function ChalkCard({ tone }: { tone: 'board' | 'dust' }) {
  return (
    <a href={P.href} className="pc-card group block w-full max-w-[440px] rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-primary" aria-label="Design Garden case study">
      <FrostedCard />
      <ChalkStory tone={tone} />
    </a>
  )
}

// 2 — Chalkboard: deep green slate that picks up the grass, story written in chalk.
export function Chalkboard() {
  return <ChalkCard tone="board" />
}

// 3 — Chalk dust: a pale matte chalk ground, closer to the page, ink type.
export function ChalkDust() {
  return <ChalkCard tone="dust" />
}
