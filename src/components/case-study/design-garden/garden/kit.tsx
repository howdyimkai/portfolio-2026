'use client'

// The upgraded check in's parts: sand, plot, plant, pieces, composer, stepper. Design Garden's own
// colors and type, with the craft pass applied: no dim over the garden, no text shadows, one
// primary per view, 44px targets, one landing curve.
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { BEE, OBSTACLE, PARTNER, SAND, SECTION, WEEK, clock, useSecsLeft, type Piece, type Ritual } from './ritual'
import { enriqueta } from './fonts'

export const INK = '#3b2a1a'
export const INK_SOFT = '#6b5a47'
export const GREEN = '#003912'
export const SOIL = '#c4a07a'

export function Sand({ children, className = '', vignette = true }: { children: ReactNode; className?: string; vignette?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      // The sand texture multiplied by a soil brown: a shade darker than raw sand, so the felt
      // pieces and white labels stand off it and the ground reads as dirt.
      style={{ containerType: 'inline-size', backgroundImage: `url(${SAND})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: SOIL, backgroundBlendMode: 'multiply' }}
    >
      {vignette && (
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(74,40,12,0.16) 100%)', zIndex: 1 }} />
      )}
      {children}
    </div>
  )
}

// Garden pieces. Fresh ones (this week) land; earlier ones are just there.
export function Pieces({ pieces, size = 'clamp(28px, 6.4cqw, 56px)', labels = false }: { pieces: Piece[]; size?: string; labels?: boolean }) {
  return (
    <>
      {pieces.map((p, i) => (
        <div
          key={p.id}
          className={`absolute flex flex-col items-center ${p.fresh ? 'gc-land' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', zIndex: 2, animationDelay: p.fresh ? `${(i % 9) * 40}ms` : undefined }}
        >
          <img src={p.img} alt="" draggable={false} style={{ width: size, filter: 'drop-shadow(0 3px 3px rgba(74,40,12,.22))' }} />
          {labels && p.text && (
            <span className="mt-0.5 hidden max-w-[16ch] truncate rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium md:block" style={{ color: INK }}>
              {p.text}
            </span>
          )}
        </div>
      ))}
    </>
  )
}

// The tilled bed and what sits on it: the plant during wins, pumpkin for obstacles, bee for takeaway.
export function Plot({ r, size = 'clamp(64px, 13cqw, 112px)', top = '52%', phoneLabel = true }: { r: Ritual; size?: string; top?: string; phoneLabel?: boolean }) {
  const piece = r.section === 'obstacles' ? OBSTACLE : r.section === 'takeaway' ? BEE : null
  return (
    <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ top, zIndex: 3 }}>
      <div className="relative flex items-end justify-center" style={{ width: `calc(${size} * 2.1)`, height: size }}>
        <div aria-hidden className="absolute bottom-0 left-0 right-0 rounded-[50%]" style={{ height: '34%', background: 'radial-gradient(closest-side, #8f6339, #a9794c 70%, rgba(169,121,76,0))', boxShadow: 'inset 0 4px 8px rgba(0,0,0,.18)' }} />
        {piece ? (
          <img key={piece} src={piece} alt={r.section === 'obstacles' ? 'Obstacle' : 'Takeaway'} draggable={false} className="gc-grow relative" style={{ width: `calc(${size} * 0.86)`, marginBottom: '8%' }} />
        ) : (
          <img key={r.plant.stage} src={r.plant.img} alt={r.plant.label} draggable={false} className={`relative ${r.landed ? 'gc-grow' : ''}`} style={{ width: size, marginBottom: '6%' }} />
        )}
      </div>
      {!piece && (
        <p className={`mt-1 whitespace-nowrap rounded-full bg-white/75 px-2.5 py-0.5 text-[11px] font-medium md:text-[12px] ${phoneLabel ? '' : 'hidden md:block'}`} style={{ color: INK_SOFT }} aria-live="polite">
          {r.plant.label}
        </p>
      )}
    </div>
  )
}

export function Week() {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] font-medium" style={{ color: INK_SOFT }}>
      Week {WEEK} of 4
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-1.5 rounded-full" style={{ background: i < WEEK ? '#4a8c5c' : 'rgba(107,90,71,.28)' }} />
        ))}
      </span>
    </span>
  )
}

const STEPS = [
  { s: 'warmup', label: 'Warm-up' },
  { s: 'wins', label: 'Wins' },
  { s: 'obstacles', label: 'Obstacles' },
  { s: 'takeaway', label: 'Takeaway' },
] as const

export function Stepper({ r, className = '' }: { r: Ritual; className?: string }) {
  return (
    <ol className={`flex items-center gap-3 text-[12px] font-medium ${className}`} aria-label="Check-in steps">
      {STEPS.map((x, i) => {
        const on = r.step === i
        const done = r.step > i
        return (
          <li key={x.s} aria-current={on ? 'step' : undefined} className="flex items-center gap-1.5" style={{ color: on ? INK : done ? INK_SOFT : 'rgba(107,90,71,.55)' }}>
            <span aria-hidden className="size-1.5 rounded-full" style={{ background: on ? GREEN : done ? '#4a8c5c' : 'rgba(107,90,71,.3)' }} />
            <span className={on ? '' : 'hidden sm:inline'}>{x.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export function Typing({ show, className = '' }: { show: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] transition-opacity duration-150 ${show ? 'opacity-100' : 'opacity-0'} ${className}`} style={{ color: INK_SOFT }} aria-hidden={!show}>
      {PARTNER} is typing
      <span className="gc-dots inline-flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1 rounded-full" style={{ background: INK_SOFT }} />
        ))}
      </span>
    </span>
  )
}

// Primary button. One per view.
export function Primary({ children, onClick, disabled, className = '', submit = false }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string; submit?: boolean }) {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`gc-press gc-focus h-11 whitespace-nowrap rounded-[10px] px-4 text-[14px] font-semibold text-white disabled:bg-[#8a9a8d] ${className}`}
      style={{ background: disabled ? undefined : GREEN }}
    >
      {children}
    </button>
  )
}

export function Quiet({ children, onClick, className = '' }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`gc-press gc-focus h-11 whitespace-nowrap rounded-[10px] px-3 text-[13px] font-medium hover:bg-black/[0.04] ${className}`} style={{ color: INK_SOFT }}>
      {children}
    </button>
  )
}

// A text box that starts one line tall, like an input, and grows with what's written: up to three
// lines on a phone and five on desktop, then it scrolls. Return plants; Shift+Return is a new line.
// On touch keyboards Return is a new line, and the button plants.
function GrowField({ id, value, onChange, onSubmit, placeholder }: { id: string; value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px` // + the 1px border top and bottom
  }, [value])
  return (
    <textarea
      ref={ref}
      id={id}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return
        if (matchMedia('(pointer: coarse)').matches) return
        e.preventDefault()
        onSubmit()
      }}
      placeholder={placeholder}
      autoComplete="off"
      className="gc-input block max-h-[92px] min-h-11 min-w-0 flex-1 resize-none rounded-[10px] border border-black/10 bg-white px-3 py-[10px] text-[16px] leading-[22px] [scrollbar-width:thin] md:max-h-[134px] md:text-[14px]"
      style={{ color: INK }}
    />
  )
}

// The one input: label, field, plant button, and the way on to the next step.
export function Composer({ r, id, onNext, nextLabel, aside }: { r: Ritual; id: string; onNext?: () => void; nextLabel?: string; aside?: ReactNode }) {
  if (!r.section) return null
  const sec = SECTION[r.section]
  const youPlaced = r.section === 'takeaway' && r.entries.some((e) => e.who === 'you' && e.tag === 'takeaway')
  if (youPlaced) {
    return (
      <p className="gc-rise py-3 text-center text-[13px]" style={{ color: INK_SOFT }}>
        Takeaway placed. Waiting for {PARTNER} to place theirs. The check-in finishes once they do.
      </p>
    )
  }
  return (
    <form
      className="flex flex-col gap-1.5"
      onSubmit={(e) => {
        e.preventDefault()
        r.submit()
      }}
    >
      <div className="flex min-h-5 items-center justify-between gap-2">
        <label htmlFor={id} className="shrink-0 text-[12px] font-semibold" style={{ color: INK_SOFT }}>
          {sec.inputLabel}
          {r.section === 'takeaway' && <span className="font-normal"> (shared with {PARTNER})</span>}
        </label>
        {aside}
      </div>
      {/* "Place my takeaway" is too long to sit beside the field, and it closes your side of the
          check in, so it gets its own full width row, as in the app. */}
      <div className={r.section === 'takeaway' ? 'flex flex-col gap-2' : 'flex items-end gap-2'}>
        <GrowField id={id} value={r.draft} onChange={r.setDraft} onSubmit={r.submit} placeholder={sec.placeholder} />
        <Primary submit disabled={!r.draft.trim()} className={r.section === 'takeaway' ? 'w-full' : ''}>
          {sec.cta}
        </Primary>
      </div>
      {onNext && nextLabel && (
        <div className="flex justify-end">
          <Quiet onClick={onNext} className="-mr-3">
            {nextLabel} →
          </Quiet>
        </div>
      )}
    </form>
  )
}

export function Prompt({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`${enriqueta.className} gc-rise font-semibold [text-wrap:balance] ${className}`} style={{ color: INK }}>{children}</p>
}

export const NEXT_LABEL = { wins: 'Next: Obstacles', obstacles: 'Next: Takeaway' } as const

// The meeting's countdown, the one both partners watch. Ink while there's time, amber at zero; it
// stays at 00:00 rather than counting over, since the app's is a friendly countdown, not a hard stop.
export function Countdown({ r, className = '' }: { r: Ritual; className?: string }) {
  const secs = useSecsLeft(r.startedAt, r.minutes)
  if (secs === null) return null
  const up = secs <= 0
  return (
    <span
      role="timer"
      aria-label={up ? 'Check-in time is up' : `${clock(secs)} left in this check-in`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums ${className}`}
      style={up ? { background: '#fdebc8', color: '#92400e' } : { background: 'rgba(255,255,255,.8)', color: INK }}
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="9" r="5.5" />
        <path d="M8 6.2V9l1.8 1.2M6.5 1.8h3" />
      </svg>
      {clock(secs)}
    </span>
  )
}
