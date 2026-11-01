'use client'

// Design Garden's upgraded check in for the case study's garden chapter (decision record:
// design-intent/garden-checkin-exploration/NOTES.md): the check in card (one prompt at a time, who
// leads, the gate that moves both screens), the garden beside it, and the garden after (drag a
// piece, tap it to read). Seeded demo pair only, scored by ritual.ts.
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { EARLIER, PARTNER, PROMPT, WARMUP, withBloom, type Entry, type Piece, type Ritual, type Tag } from './ritual'
import { Composer, GREEN, INK, INK_SOFT, NEXT_LABEL, Pieces, Plot, Primary, Prompt, Quiet, Sand, Stepper, Typing, Week } from './kit'
import { enriqueta } from './fonts'

const TAG_NOW = { wins: 'win', obstacles: 'blocker', takeaway: 'takeaway' } as const
const CHIP: Record<Tag, string> = { win: '#e4f2c4', blocker: '#ece6de', takeaway: '#fbeacb' }

function nextOf(r: Ritual) {
  if (r.section === 'wins') return { go: () => r.enter('obstacles'), label: NEXT_LABEL.wins }
  if (r.section === 'obstacles') return { go: () => r.enter('takeaway'), label: NEXT_LABEL.obstacles }
  return null
}

export function Done({ r, className = '' }: { r: Ritual; className?: string }) {
  return (
    <div className={`gc-rise flex items-center justify-center gap-3 ${className}`}>
      <p className="text-[13px] font-medium" style={{ color: INK }}>You both showed up for each other this week 🌼</p>
      <Quiet onClick={r.reset}>Replay</Quiet>
    </div>
  )
}

function Avatar({ who, size = 22 }: { who: 'you' | 'partner'; size?: number }) {
  return (
    <span
      aria-hidden
      className={`${enriqueta.className} inline-flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold`}
      style={{ width: size, height: size, background: who === 'you' ? GREEN : '#c26a3d', color: '#fff' }}
    >
      {who === 'you' ? 'Y' : PARTNER[0]}
    </span>
  )
}

// ---------------------------------------------------------------------------------------------
// The check in card — the conversation leads, the garden answers. One prompt at a time on a card,
// the whole thread under it, and the garden beside it filling in as you talk. The card says who
// leads, and the way on to the next section opens for the leader only once both have shared, so
// the two screens move together. At the end the garden is yours to play with.
// ---------------------------------------------------------------------------------------------
const SECTION_NAME = { wins: 'Obstacles', obstacles: 'Takeaway', takeaway: '' } as const
const FOLLOW_HINT = { wins: 'add your wins as you go', obstacles: 'add your obstacles as you go', takeaway: 'add your takeaway and place it' } as const

// Who has shared this section: a check on each avatar once they have.
function SharedMarks({ r }: { r: Ritual }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`You ${r.shared.you ? 'have shared' : "haven’t shared yet"}. ${PARTNER} ${r.shared.partner ? 'has shared' : "hasn’t shared yet"}.`}>
      {(['you', 'partner'] as const).map((who) => (
        <span key={who} className="relative transition-opacity duration-200" style={{ opacity: r.shared[who] ? 1 : 0.35 }}>
          <Avatar who={who} size={20} />
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 flex size-[11px] items-center justify-center rounded-full bg-white text-[8px] font-bold transition-[opacity,scale] duration-200"
            style={{ color: '#2e8f5e', opacity: r.shared[who] ? 1 : 0, scale: r.shared[who] ? '1' : '0.6' }}
          >
            ✓
          </span>
        </span>
      ))}
    </span>
  )
}

// Beside the field's label, for the leader: who has shared, and who you're waiting on.
function SharedStatus({ r }: { r: Ritual }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-[12px]" style={{ color: INK_SOFT }}>
      {!r.bothShared && <span className="truncate">Waiting for {r.shared.partner ? 'you' : PARTNER} to share</span>}
      <SharedMarks r={r} />
    </span>
  )
}

// The way on. The leader gets the button, shut until you've both shared; the other partner sees
// who's leading and what to do meanwhile.
function Gate({ r }: { r: Ritual }) {
  // Pressing on while Robin is mid sentence would pull the screen out from under them, so the
  // leader is asked first. The question goes away by itself once Robin stops typing.
  const [asking, setAsking] = useState(false)
  if (!r.section || r.section === 'takeaway') return null
  const next = nextOf(r)!
  const to = SECTION_NAME[r.section]
  if (r.leader === 'you') {
    if (asking && r.partnerTyping) {
      return (
        <div className="gc-rise mt-1 flex items-center justify-between gap-2" role="alert">
          <span className="min-w-0 truncate text-[12px] font-medium" style={{ color: INK }}>{PARTNER} is still typing.</span>
          <span className="flex shrink-0 items-center">
            <Quiet onClick={() => setAsking(false)}>Wait</Quiet>
            <button type="button" onClick={next.go} className="gc-press gc-focus h-11 whitespace-nowrap rounded-[10px] px-3 text-[13px] font-semibold enabled:hover:bg-black/[0.04]" style={{ color: GREEN }}>
              Move on anyway
            </button>
          </span>
        </div>
      )
    }
    return (
      <div className="mt-1 flex justify-end">
        {/* Says what it does: it moves Robin's screen too, not just yours. */}
        <button
          type="button"
          onClick={() => (r.partnerTyping ? setAsking(true) : next.go())}
          disabled={!r.bothShared}
          className="gc-press gc-focus h-11 shrink-0 whitespace-nowrap rounded-[10px] px-3 text-[13px] font-semibold transition-colors enabled:hover:bg-black/[0.04] disabled:cursor-default"
          style={{ color: r.bothShared ? GREEN : 'rgba(107,90,71,.45)' }}
        >
          Move us both to {to} →
        </button>
      </div>
    )
  }
  return (
    <div className="mt-1 flex h-11 items-center gap-2 text-[12px]" style={{ color: INK_SOFT }} aria-live="polite">
      <SharedMarks r={r} />
      <span key={String(r.moving)} className="gc-rise truncate">
        {r.moving ? `${PARTNER} is moving you both to ${SECTION_NAME[r.section]}` : `${PARTNER} is leading: ${FOLLOW_HINT[r.section]}`}
      </span>
    </div>
  )
}

// Kai's info glyph, filled with the text color.
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.91956 3C6.38541 2.99999 5.93956 2.99998 5.57533 3.02974C5.19545 3.06078 4.83879 3.12789 4.50153 3.29973C3.98408 3.56338 3.56338 3.98408 3.29973 4.50153C3.12789 4.83879 3.06078 5.19545 3.02974 5.57533C2.99998 5.93956 2.99999 6.38541 3 6.91956V17.0804C2.99999 17.6146 2.99998 18.0604 3.02974 18.4247C3.06078 18.8046 3.12789 19.1612 3.29973 19.4985C3.56338 20.0159 3.98408 20.4366 4.50153 20.7003C4.83879 20.8721 5.19545 20.9392 5.57533 20.9703C5.93956 21 6.3854 21 6.91955 21H17.0805C17.6146 21 18.0604 21 18.4247 20.9703C18.8046 20.9392 19.1612 20.8721 19.4985 20.7003C20.0159 20.4366 20.4366 20.0159 20.7003 19.4985C20.8721 19.1612 20.9392 18.8046 20.9703 18.4247C21 18.0604 21 17.6146 21 17.0805V6.91955C21 6.3854 21 5.93956 20.9703 5.57533C20.9392 5.19545 20.8721 4.83879 20.7003 4.50153C20.4366 3.98408 20.0159 3.56338 19.4985 3.29973C19.1612 3.12789 18.8046 3.06078 18.4247 3.02974C18.0604 2.99998 17.6146 2.99999 17.0804 3H6.91956ZM10 11C10 10.5858 10.3358 10.25 10.75 10.25H12C12.4142 10.25 12.75 10.5858 12.75 11L12.75 16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25L11.25 11.75H10.75C10.3358 11.75 10 11.4142 10 11ZM12 7.25C11.5858 7.25 11.25 7.58579 11.25 8C11.25 8.41421 11.5858 8.75 12 8.75C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

// What leading means, for whichever side you're on. Points at the leader guide; nothing to click.
const LEAD_TIP = {
  you: ['You keep the check-in moving.', `Let ${PARTNER} share first each round.`, "When you move on, both screens move. Wait until you’ve both shared."],
  partner: [`${PARTNER} keeps the check-in moving.`, `Share first each round. ${PARTNER} moves you both on once you’ve both shared.`],
}

// Hover or focus shows it; a tap toggles it on touch, where there's no hover. Escape closes it.
// Opens the leader tooltip from outside the card (the case study's "Who leads" caption). Each new
// number opens it once; it then closes the usual ways.
export const ShowLeadTip = createContext(0)

function LeadInfo({ who }: { who: 'you' | 'partner' }) {
  const [open, setOpen] = useState(false)
  const show = useContext(ShowLeadTip)
  useEffect(() => {
    if (show > 0) setOpen(true)
  }, [show])
  const hoverTimer = useRef<number | null>(null)
  const pointer = useRef<string>('')
  const wrap = useRef<HTMLSpanElement>(null)
  const id = `gc-lead-tip-${who}`
  // A tap anywhere else closes it (iOS doesn't focus a tapped button, so blur alone won't), and so
  // does Escape, even when it was opened from outside and never had focus.
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  const hover = (on: boolean) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setOpen(on), on ? 120 : 80)
  }
  return (
    <span ref={wrap} className="inline-flex" onPointerEnter={(e) => e.pointerType === 'mouse' && hover(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && hover(false)}>
      <button
        type="button"
        aria-label="What leading means"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={() => (pointer.current === 'mouse' ? setOpen(true) : setOpen((o) => !o))}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className="gc-focus relative flex size-5 items-center justify-center rounded-full transition-colors duration-150 before:absolute before:-inset-3 hover:text-[#3b2a1a]"
        style={{ color: open ? INK : 'rgba(107,90,71,.7)' }}
      >
        <InfoIcon />
      </button>
      <span
        id={id}
        role="tooltip"
        className={`gc-tip absolute left-0 top-[calc(100%+8px)] z-20 w-[min(260px,100%)] rounded-[10px] px-3 py-2.5 text-left text-[12px] font-normal leading-[1.45] shadow-[0_0_0_1px_rgba(255,255,255,.06),0_8px_24px_rgba(28,20,12,.24)] ${open ? 'gc-tip-open' : ''}`}
        style={{ background: INK, color: '#f6f1e7' }}
      >
        <span className="block font-semibold">Leading the check-in</span>
        {LEAD_TIP[who].map((line) => (
          <span key={line} className="mt-1 block">{line}</span>
        ))}
        <span className="mt-2 block border-t border-white/10 pt-2 opacity-70">More in the leader guide.</span>
      </span>
    </span>
  )
}

function Leading({ r }: { r: Ritual }) {
  return (
    <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[12px] font-medium" style={{ color: INK_SOFT }}>
      <Avatar who={r.leader} size={16} />
      {r.leader === 'you' ? "You’re leading today." : `${PARTNER} is leading today.`}
      <LeadInfo who={r.leader} />
    </div>
  )
}

const TAG_LABEL: Record<Tag, string> = { win: 'Win', blocker: 'Obstacle', takeaway: 'Takeaway' }

// The magic moment: when the garden comes back after the check in, this week's plant gets a
// warm glow and a burst of eight four point stars, once. It waits for the plant to land first.
// Inside the plant's button, so it follows if someone grabs the plant mid burst. Reduced motion:
// none of it (garden.css).
const SPARKS = [
  { a: -90, r: 1.0, s: 1.0, d: 0 },
  { a: -35, r: 0.85, s: 0.7, d: 60 },
  { a: 20, r: 1.05, s: 0.9, d: 120 },
  { a: 70, r: 0.8, s: 0.6, d: 40 },
  { a: 125, r: 1.0, s: 0.85, d: 100 },
  { a: 175, r: 0.9, s: 0.65, d: 20 },
  { a: 220, r: 1.1, s: 1.0, d: 140 },
  { a: 265, r: 0.75, s: 0.55, d: 80 },
]

function Sparkle({ delay }: { delay: number }) {
  return (
    <span aria-hidden className="gc-sparkle pointer-events-none absolute left-1/2 top-1/2" style={{ '--gc-delay': `${delay}ms` } as React.CSSProperties}>
      <span className="gc-glow" />
      {SPARKS.map((k, i) => {
        const rad = (k.a * Math.PI) / 180
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="gc-spark"
            style={{ '--dx': `${Math.cos(rad) * 52 * k.r}px`, '--dy': `${Math.sin(rad) * 52 * k.r}px`, '--s': k.s, '--d': `${k.d}ms`, color: i % 3 === 0 ? '#fff6d8' : '#f4c24a' } as React.CSSProperties}
          >
            <path d="M12 1.5c.6 4.6 2.4 7.6 5 9 1.3.7 2.9 1.1 5.5 1.5-4.6.6-7.6 2.4-9 5-.7 1.3-1.1 2.9-1.5 5.5-.6-4.6-2.4-7.6-5-9-1.3-.7-2.9-1.1-5.5-1.5 4.6-.6 7.6-2.4 9-5 .7-1.3 1.1-2.9 1.5-5.5Z" fill="currentColor" stroke="#b8862b" strokeWidth="0.8" strokeLinejoin="round" />
          </svg>
        )
      })}
    </span>
  )
}

// The garden after the check in: drag pieces to arrange them, tap one to read what it was for.
function PlayGarden({ pieces: start }: { pieces: Piece[] }) {
  const [pieces, setPieces] = useState(start)
  const [open, setOpen] = useState<string | null>(null)
  const [top, setTop] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; sx: number; sy: number; moved: boolean } | null>(null)

  const move = (id: string, x: number, y: number) =>
    setPieces((ps) => ps.map((p) => (p.id === id ? { ...p, x: Math.min(95, Math.max(5, x)), y: Math.min(92, Math.max(8, y)), fresh: false } : p)))

  const onDown = (e: React.PointerEvent, p: Piece) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: p.id, sx: e.clientX, sy: e.clientY, moved: false }
    setTop(p.id)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    const rect = box.current?.getBoundingClientRect()
    if (!d || !rect) return
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 4) return
    d.moved = true
    setOpen(null)
    move(d.id, ((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100)
  }
  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (d && !d.moved) setOpen((o) => (o === d.id ? null : d.id))
  }
  const onKey = (e: React.KeyboardEvent, p: Piece) => {
    const step = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key]
    if (step) {
      e.preventDefault()
      setTop(p.id)
      move(p.id, p.x + step[0], p.y + step[1])
    } else if (e.key === 'Escape') setOpen(null)
  }

  const note = pieces.find((p) => p.id === open)

  return (
    <div ref={box} className="absolute inset-0 z-[2]" onPointerDown={(e) => e.target === e.currentTarget && setOpen(null)}>
      {pieces.map((p, i) => (
        <button
          key={p.id}
          type="button"
          aria-label={p.text ? `${TAG_LABEL[p.tag]}, ${p.who === 'you' ? 'you' : PARTNER}: ${p.text}` : TAG_LABEL[p.tag]}
          aria-expanded={open === p.id}
          onPointerDown={(e) => onDown(e, p)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={(e) => onKey(e, p)}
          onClick={(e) => e.detail === 0 && setOpen((o) => (o === p.id ? null : p.id))}
          className={`gc-focus gc-piece absolute flex size-11 cursor-grab touch-none items-center justify-center rounded-full active:cursor-grabbing md:size-14 ${p.fresh ? 'gc-land' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', zIndex: top === p.id ? 3 : 2, animationDelay: p.fresh ? `${(i % 9) * 40}ms` : undefined }}
        >
          <img src={p.img} alt="" draggable={false} className="pointer-events-none" style={{ width: p.id === 'plant' ? 'clamp(44px, 9cqw, 76px)' : 'clamp(30px, 6.4cqw, 54px)', maxWidth: 'none', filter: 'drop-shadow(0 3px 3px rgba(74,40,12,.22))' }} />
          {p.id === 'plant' && p.fresh && <Sparkle delay={(i % 9) * 40 + 380} />}
        </button>
      ))}
      {note?.text && (
        <div
          role="status"
          className="gc-rise pointer-events-none absolute z-[6] w-max max-w-[min(240px,70%)] rounded-[10px] bg-white px-2.5 py-2 shadow-[0_0_0_1px_rgba(74,40,12,.08),0_8px_20px_rgba(74,40,12,.16)]"
          style={{ left: `${Math.min(80, Math.max(20, note.x))}%`, top: `${note.y}%`, transform: `translate(-50%, ${note.y > 45 ? 'calc(-100% - 34px)' : '34px'})` }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: INK_SOFT }}>
            <Avatar who={note.who} size={16} />
            {TAG_LABEL[note.tag]}
          </span>
          <span className="mt-1 block text-[13px] leading-snug" style={{ color: INK }}>{note.text}</span>
        </div>
      )}
    </div>
  )
}

// The warm-up keeps the app's words: "Warm-up. Just talk, nothing to type yet." is split into the
// step's name and its instruction.
const STEP_NAME = { warmup: 'Warm-up', wins: 'Wins', obstacles: 'Obstacles', takeaway: 'Takeaway', done: 'Done' } as const

// The check in card on its own, so the dashboard layouts can place it. `extra` sits under the
// thread (the takeaway's task list in the Swap layout).
export function CheckinCard({ r, className = '', extra, bare = false }: { r: Ritual; className?: string; extra?: ReactNode; bare?: boolean }) {
  const now = r.section ? r.entries.filter((e) => e.tag === TAG_NOW[r.section!]) : []
  // Keep the newest line of the thread in view when it outgrows the card (phones, long weeks).
  // Scrolls only as far as the newest entry, never past it, so anything under the thread (the
  // takeaway's task list) can't push the prompt out of view.
  const thread = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = thread.current
    const last = el?.querySelector<HTMLElement>('[data-entry]:last-of-type')
    if (!el || !last) return
    const bottom = last.offsetTop + last.offsetHeight + 28 // + the typing line under it
    if (bottom > el.scrollTop + el.clientHeight) el.scrollTop = bottom - el.clientHeight
  }, [now.length, r.partnerTyping])
  return (
    <section className={`flex min-h-0 flex-col ${bare ? '' : 'rounded-[14px] bg-white p-4 shadow-[0_0_0_1px_rgba(74,40,12,.08),0_2px_6px_rgba(74,40,12,.06)] md:p-5'} ${className}`}>
      {/* Every step names itself (the dots alone don't), with where it sits in the four. */}
      <div className="flex items-center justify-between gap-3">
        <span key={r.stage} className="gc-rise text-[13px] font-semibold" style={{ color: INK }}>{STEP_NAME[r.stage]}</span>
        <span className="flex items-center gap-2.5">
          <Stepper r={r} className="[&_li>span:last-child]:!hidden" />
          <span className="text-[12px] font-medium tabular-nums" style={{ color: INK_SOFT }}>{r.step + 1} of 4</span>
        </span>
      </div>
      <Leading r={r} />
      <div ref={thread} className="relative mt-3 min-h-0 flex-1 overflow-y-auto">
        {r.stage === 'warmup' ? (
          <>
            {/* Questions are set in the serif; instructions in the sans, so the two never read alike. */}
            <p className="text-[13px] leading-snug" style={{ color: INK_SOFT }}>Just talk, nothing to type yet.</p>
            <ol className="mt-2 flex flex-col gap-2">
              {WARMUP.slice(0, 2).map((q) => (
                <li key={q}><Prompt className="text-[17px] leading-[1.3] tracking-[-0.005em] md:text-[19px]">{q}</Prompt></li>
              ))}
            </ol>
            <p className="mt-3 text-[13px] leading-snug [text-wrap:pretty]" style={{ color: INK_SOFT }}>{WARMUP[2]}</p>
          </>
        ) : (
          r.section && (
            <>
              <Prompt key={r.section} className="text-[19px] leading-[1.25] tracking-[-0.01em] md:text-[22px]">{PROMPT[r.section]}</Prompt>
              <ul className="mt-3 flex flex-col gap-1.5" aria-live="polite">
                {now.map((e) => (
                  <li key={e.id} data-entry className="gc-rise flex items-start gap-2 text-[13px] leading-snug" style={{ color: INK }}>
                    <Avatar who={e.who} size={20} />
                    <span className="pt-px">{e.text}</span>
                  </li>
                ))}
                <li><Typing show={r.partnerTyping} className="pl-7" /></li>
              </ul>
              {extra}
            </>
          )
        )}
      </div>
      <div className="mt-3">
        {r.stage === 'warmup' ? (
          r.leader === 'you' ? (
            <Primary onClick={() => r.enter('wins')} className="w-full">Ok, let’s start our wins</Primary>
          ) : (
            <p key={String(r.moving)} className="gc-rise flex h-11 items-center justify-center text-center text-[13px]" style={{ color: INK_SOFT }} aria-live="polite">
              {r.moving ? `${PARTNER} is moving you both to Wins` : `${PARTNER} is leading today. Talk through the warm-up together.`}
            </p>
          )
        ) : (
          <>
            <Composer r={r} id="gc-card" aside={r.leader === 'you' && r.section !== 'takeaway' ? <SharedStatus r={r} /> : undefined} />
            <Gate key={r.section} r={r} />
          </>
        )}
      </div>
    </section>
  )
}

// The garden on its own: plot and plant during the check in, the play garden once it's done.
export function GardenPane({ r, className = '' }: { r: Ritual; className?: string }) {
  const done = r.stage === 'done'
  return (
    <Sand className={`min-h-0 rounded-[14px] ${className}`}>
      <div className="absolute right-3 top-3 z-[4] rounded-full bg-white/75 px-2.5 py-1"><Week /></div>
      {done ? (
        <PlayGarden pieces={[...EARLIER, ...withBloom(r.dealt)]} />
      ) : (
        <>
          <Pieces pieces={[...EARLIER, ...withBloom(r.dealt)]} />
          <Plot r={r} top="55%" size="clamp(52px, 13cqw, 112px)" phoneLabel={false} />
        </>
      )}
      {done && (
        <div className="absolute inset-x-3 bottom-3 z-[5] mx-auto max-w-[520px] rounded-[14px] bg-white/85 px-3 py-1 shadow-[0_0_0_1px_rgba(74,40,12,.08),0_12px_28px_rgba(74,40,12,.14)] backdrop-blur-md">
          <Done r={r} />
          <p className="-mt-1 pb-1 text-center text-[12px]" style={{ color: INK_SOFT }}>Drag pieces to arrange them.</p>
        </div>
      )}
    </Sand>
  )
}
