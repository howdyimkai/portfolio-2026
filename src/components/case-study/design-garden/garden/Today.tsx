'use client'

// The "before": today's check in, ported from DesignGardenTool TetrisGarden.tsx +
// CanvasRitualBar.tsx + CheckinPlant.tsx (2026-10-31) with its own colors, copy and motion.
// Unchanged on purpose, so the after is measured against the real thing.
import { useState } from 'react'
import { EARLIER, LENGTHS, OBSTACLE, BEE, PARTNER, PROMPT, SAND, SECTION, TAKEAWAY_CONSEQUENCE, WARMUP, WEEK, clock, useSecsLeft, type Ritual, type Piece } from './ritual'
import { enriqueta } from './fonts'
import { useExpand } from './ExpandableFrame'

const PILL = {
  win: { background: '#d9f0a3', color: '#2d5a00' },
  blocker: { background: '#e0dbd4', color: '#5a4a3a' },
  takeaway: { background: '#fde9c8', color: '#92400e' },
}

function Pieces({ pieces }: { pieces: Piece[] }) {
  return (
    <>
      {pieces.map((p) => (
        <img
          key={p.id}
          src={p.img}
          alt=""
          draggable={false}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: 'clamp(30px, 6.8cqw, 60px)', transform: 'translate(-50%, -50%)', zIndex: 1 }}
        />
      ))}
    </>
  )
}

export default function Today({ r }: { r: Ritual }) {
  // Resting (before anyone starts): the garden undimmed, the start strip above it, no ritual bar.
  const resting = r.idle
  const [initiating, setInitiating] = useState(false)
  const expand = useExpand() // starting opens the full screen view (case study)
  const [length, setLength] = useState<number>(30)
  const secsLeft = useSecsLeft(r.startedAt, r.minutes)
  const active = !resting && r.stage !== 'done'
  const inWarmup = r.stage === 'warmup'
  const sectionIndex = r.section ? (['wins', 'obstacles', 'takeaway'] as const).indexOf(r.section) : -1
  const tagNow = r.section === 'wins' ? 'win' : r.section === 'obstacles' ? 'blocker' : null
  const yours = tagNow ? r.entries.filter((e) => e.who === 'you' && e.tag === tagNow).length : 0
  const theirs = tagNow ? r.entries.filter((e) => e.who === 'partner' && e.tag === tagNow).length : 0
  const myEntries = r.entries.filter((e) => e.who === 'you' && e.tag === tagNow)
  const youPlaced = r.entries.some((e) => e.who === 'you' && e.tag === 'takeaway')

  const prompt = inWarmup ? null : r.section ? PROMPT[r.section] : null

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{
        backgroundColor: '#c4a882',
        backgroundImage:
          'repeating-linear-gradient(0deg,rgba(108,72,40,.07) 0,rgba(108,72,40,.07) 1px,transparent 1px,transparent 7px), radial-gradient(rgba(90,58,32,.13) 1px,transparent 1.4px)',
        backgroundSize: 'auto, 9px 9px',
        border: '3px solid #8B5E3C',
        borderRadius: 16,
        padding: 12,
      }}
    >
      {/* Header, as TetrisGarden draws it: week checkpoint left, the pair's title centered, view
          toggle right (the app's Flower.svg, ☰ feed, 🌸 zen). The toggle is shown, not wired, here. */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex w-32 shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(245,240,232,.5)' }}>
          <span className="whitespace-nowrap text-xs font-medium text-[#6b5a47]">Week {WEEK}</span>
          <span className="flex items-center gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="inline-block size-2 rounded-full" style={i < WEEK ? { backgroundColor: '#4a8c5c' } : { border: '2px solid #8B5E3C', opacity: 0.3 }} />
            ))}
          </span>
        </div>
        <h3 className={`${enriqueta.className} min-w-0 text-center text-base font-semibold leading-tight text-[#4a3520] lg:text-xl`} style={{ textShadow: '0 1px 0 rgba(255,255,255,.25)' }}>
          You and {PARTNER}&apos;s Design Garden
        </h3>
        <div className="flex w-32 shrink-0 justify-end gap-1 rounded-lg p-0.5" style={{ background: 'rgba(245,240,232,.5)' }} aria-hidden>
          <span className="rounded-md bg-[#8B5E3C] px-2.5 py-1.5 text-base">
            <img src="/works/design-garden/garden/flower-icon.svg" alt="" className="size-4" style={{ filter: 'brightness(0) invert(1)' }} />
          </span>
          <span className="rounded-md px-2.5 py-1.5 text-base leading-4 text-[#8B5E3C]">☰</span>
          <span className="rounded-md px-2.5 py-1.5 text-base leading-4">🌸</span>
        </div>
      </div>

      {/* The strip above the garden, as TetrisGarden draws it: between check ins the tagline with
          "Check in solo" and the start button; during one, the session countdown (amber once it's
          up, never a hard stop); after, the week's tagline. "Check in solo" is shown, not wired. */}
      <div className="mb-2 flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: '#e8e2d6' }}>
        {active && secsLeft !== null ? (
          <span className={`${enriqueta.className} text-lg font-bold leading-none tabular-nums`} style={{ color: secsLeft <= 0 ? '#b45309' : '#4a3520' }} aria-label={`${clock(secsLeft)} left in this check-in`}>
            {clock(secsLeft)}
          </span>
        ) : (
          <span className={`${enriqueta.className} truncate text-[11px] italic text-[#6b5a47]`}>
            {resting ? "Look how far you've grown together." : 'You both showed up for each other this week 🌼'}
          </span>
        )}
        {resting && !initiating && (
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="whitespace-nowrap text-[11px] underline" style={{ color: '#6b5a47' }}>Check in solo</span>
            <button
              onClick={() => {
                expand()
                setInitiating(true)
              }}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-white"
              style={{ background: '#003912' }}
            >
              Start check-in 🌱
            </button>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden rounded-xl"
        style={{
          containerType: 'inline-size',
          background: `linear-gradient(rgba(196,168,130,0.28),rgba(196,168,130,0.28)), url(${SAND}) center/cover`,
          boxShadow: 'inset 0 10px 24px rgba(74,40,12,.18), inset 0 -8px 18px rgba(74,40,12,.10)',
        }}
      >
        <Pieces pieces={[...EARLIER, ...r.dealt]} />

        {active && (
          <>
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: '50%', width: 'min(236px, 46%)', height: 'min(104px, 26%)', clipPath: 'polygon(15% 0,85% 0,100% 100%,0 100%)', background: 'linear-gradient(#a9794c,#875b34)', boxShadow: 'inset 0 6px 12px rgba(0,0,0,.18)', zIndex: 0 }}
            />
            <div aria-hidden className="absolute inset-0" style={{ background: 'rgba(58,34,12,0.55)', zIndex: 2 }} />

            {/* Cinematic prompt */}
            <div className={`${enriqueta.className} absolute left-1/2 top-3 flex w-[94%] max-w-[420px] -translate-x-1/2 flex-col gap-1 text-center`} style={{ zIndex: 3 }}>
              {inWarmup ? (
                <>
                  <p className="font-sans text-[9px] font-semibold uppercase tracking-wide sm:text-[11px]" style={{ color: 'rgba(245,240,232,.75)', textShadow: '0 1px 3px rgba(0,0,0,.4)' }}>
                    Warm-up. Just talk, nothing to type yet.
                  </p>
                  {WARMUP.map((q) => (
                    <p key={q} className="text-xs font-semibold leading-tight sm:text-[17px] sm:leading-snug" style={{ color: '#f5f0e8', textShadow: '0 2px 6px rgba(0,0,0,.45)' }}>
                      {q}
                    </p>
                  ))}
                </>
              ) : prompt ? (
                <p className="text-base font-semibold leading-snug sm:text-lg" style={{ color: '#f5f0e8', textShadow: '0 2px 6px rgba(0,0,0,.45)' }}>
                  {prompt}
                </p>
              ) : null}
            </div>

            {/* Center stage: plant, pumpkin, then ghost bee. Each entry replays the flash. */}
            <div
              key={`${r.stage}-${r.landed}`}
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gc-today-flash"
              style={{ top: inWarmup ? '40%' : '34%', zIndex: 3 }}
            >
              {(inWarmup || r.section === 'wins') && (
                <>
                  <div key={r.plant.stage} className="gc-today-pop" style={{ width: 'clamp(56px, 11cqw, 104px)' }}>
                    <img src={r.plant.img} alt={r.plant.label} draggable={false} className="w-full drop-shadow-sm" />
                  </div>
                  <p className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs" style={{ background: 'rgba(245,240,232,0.92)', color: '#4a3520' }} aria-live="polite">
                    {r.plant.label}
                  </p>
                </>
              )}
              {r.section === 'obstacles' && <img src={OBSTACLE} alt="obstacle" draggable={false} style={{ width: 'clamp(52px, 10cqw, 92px)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.3))' }} />}
              {r.section === 'takeaway' && <img src={BEE} alt="takeaway" draggable={false} style={{ width: 'clamp(52px, 10cqw, 92px)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.3))' }} />}
            </div>

            {inWarmup && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center" style={{ zIndex: 3 }}>
                <button onClick={() => r.enter('wins')} className="rounded-lg px-4 py-2 text-xs font-medium text-white sm:text-sm" style={{ background: '#003912' }}>
                  Ok, let&apos;s start our wins
                </button>
                <span className="mt-1.5 block text-[11px] underline" style={{ color: 'rgba(245,240,232,.8)' }}>
                  Cancel this check-in
                </span>
              </div>
            )}

            {/* Compact per owner counts, top corners */}
            {tagNow && (
              <>
                <div className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ ...PILL[tagNow], zIndex: 3 }}>
                  You · {yours}
                </div>
                <div className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ ...PILL[tagNow], zIndex: 3 }}>
                  {PARTNER} · {theirs}
                </div>
              </>
            )}
          </>
        )}

        {/* Begin gate, as the app has it: dims the garden, the screen share note, the length, Begin. */}
        {resting && initiating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4" style={{ background: 'rgba(58,34,12,0.55)', zIndex: 6 }}>
            <div role="note" className="max-w-[320px] rounded-xl px-4 py-3 text-center text-sm leading-relaxed" style={{ background: '#f5f0e8', border: '1px solid #d4b896', color: '#495057' }}>
              It helps, but isn't required, for one person to share their screen. Tap Begin when you're ready to start growing your plant together.
            </div>
            <p className="max-w-[280px] text-center text-xs" style={{ color: 'rgba(245,240,232,.85)' }}>
              How long do you want this check-in to run? A friendly countdown, not a hard stop.
            </p>
            <div className="flex gap-2">
              {LENGTHS.map((d) => (
                <button key={d} onClick={() => setLength(d)} className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors" style={length === d ? { background: '#003912', color: '#fff' } : { background: 'rgba(245,240,232,.9)', color: '#4a3520' }}>
                  {d} min
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => r.begin(length)} className="rounded-lg px-7 py-2.5 text-sm font-semibold text-white" style={{ background: '#003912', boxShadow: '0 6px 16px rgba(0,57,18,.3)' }}>
                Begin
              </button>
              <button onClick={() => setInitiating(false)} className="text-sm" style={{ color: 'rgba(245,240,232,.85)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Under canvas ritual bar */}
      {resting ? null : active ? (
        <div className="mt-2 overflow-hidden rounded-xl" style={{ background: '#ede8df' }}>
          <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-center text-[11px] font-medium" style={{ background: 'rgba(0,57,18,.06)', color: '#6b5a47', borderBottom: '1px solid #c4b89a' }}>
            🎬 You&apos;re leading today. Let {PARTNER} share first each round. Tap the next number below when you&apos;re ready to move on.
          </div>
          <div className="flex" style={{ borderBottom: '1px solid #c4b89a', opacity: inWarmup ? 0.55 : 1 }}>
            {(['wins', 'obstacles', 'takeaway'] as const).map((s, i) => {
              const on = !inWarmup && sectionIndex === i
              const done = !inWarmup && sectionIndex > i
              return (
                <button
                  key={s}
                  disabled={inWarmup}
                  onClick={() => i > sectionIndex && r.enter(s)}
                  className="flex flex-1 items-center justify-center gap-1.5 px-1.5 py-2 transition-colors"
                  style={{ background: on ? '#003912' : 'rgba(74,53,32,.07)', color: on ? '#fff' : '#6b5a47', borderRight: i < 2 ? '1px solid #c4b89a' : 'none' }}
                >
                  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: on ? '#fff' : done ? '#003912' : 'rgba(107,90,71,.18)', color: on ? '#003912' : done ? '#fff' : '#6b5a47' }}>
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold">{SECTION[s].label}</span>
                </button>
              )
            })}
          </div>

          {r.section && r.section !== 'takeaway' && (
            <div className="p-2.5">
              <label htmlFor="gc-today-input" className="text-[11px] font-semibold uppercase tracking-wide text-[#6b5a47]">
                {SECTION[r.section].inputLabel}
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="gc-today-input"
                  value={r.draft}
                  onChange={(e) => r.setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && r.submit()}
                  placeholder={SECTION[r.section].placeholder}
                  className="flex-1 rounded-lg border border-[#c4b89a] bg-white px-2.5 py-2 text-[13px] text-[#4a3520] placeholder:text-[#8B5E3C]/50 focus:border-[#8B5E3C] focus:outline-none"
                />
                <button onClick={r.submit} disabled={!r.draft.trim()} className="whitespace-nowrap rounded-lg px-3 py-2 text-[12px] font-medium text-white disabled:opacity-40" style={{ background: '#003912' }}>
                  {SECTION[r.section].cta}
                </button>
              </div>
              {myEntries.length > 0 && (
                <div className="mt-2 hidden flex-col gap-1 md:flex">
                  {myEntries.map((e) => (
                    <div key={e.id} className="flex items-start gap-2 rounded-lg bg-white/60 px-2.5 py-1.5">
                      <p className="flex-1 break-words text-[12px] leading-snug text-[#4a3520]">{e.text}</p>
                      <span className="mt-0.5 shrink-0 text-[11px] leading-none text-[#8B5E3C]">✕</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {r.section === 'takeaway' && (
            <div className="flex flex-col gap-2 p-2.5">
              {youPlaced ? (
                <div className="text-center text-[13px] text-[#6b5a47]">Takeaway placed. Waiting for {PARTNER} to place theirs. The check-in finishes once they do.</div>
              ) : (
                <>
                  <label htmlFor="gc-today-take" className="text-[11px] font-semibold uppercase tracking-wide text-[#92400e]">
                    Your takeaway <span className="font-normal normal-case text-[#8B5E3C]/70">(shared with {PARTNER})</span>
                  </label>
                  <input
                    id="gc-today-take"
                    value={r.draft}
                    onChange={(e) => r.setDraft(e.target.value)}
                    placeholder={SECTION.takeaway.placeholder}
                    className="w-full rounded-lg border border-[#e0c089] bg-white px-2.5 py-2 text-[13px] text-[#4a3520] focus:border-[#92400e] focus:outline-none"
                  />
                  <p className="hidden text-center text-[11px] leading-snug text-[#6b5a47] md:block">{TAKEAWAY_CONSEQUENCE}</p>
                  <button onClick={r.submit} disabled={!r.draft.trim()} className="w-full rounded-lg py-2 text-[13px] font-medium text-white disabled:opacity-50" style={{ background: '#003912' }}>
                    Place my takeaway
                  </button>
                </>
              )}
            </div>
          )}
          {inWarmup && <div className="h-2" />}
        </div>
      ) : (
        <button onClick={r.reset} className="mt-2 self-center rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#4a3520]" style={{ background: 'rgba(245,240,232,.6)' }}>
          Replay the check-in
        </button>
      )}
    </div>
  )
}

