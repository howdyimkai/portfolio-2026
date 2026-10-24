'use client'

// A product flow you step through by tapping (the Cal quiz hero, reused for chapter 5's result to
// hub). Screens are images with hotspots over their buttons: a browser frame with desktop captures
// from md up, a phone frame with mobile captures under md, sharing one step so a resize keeps it.
// Nothing autoplays. Plan and measurements: Claude-Workspace .../2026-10-PortfolioSprint/HERO-PLAN.md
// and hero-build/HERO-MEASUREMENTS.md (measured off the Paper artboards, 2026-10-22).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import BrowserFrame from './BrowserFrame'
import type { Box, Flow, ScreenSet } from './types'
import './step-frame.css'

const place = ([left, top, width, height]: Box): CSSProperties => ({
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}%`,
  height: `${height}%`,
})

export default function StepFrame({ flow }: { flow: Flow }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const refocus = useRef(false)
  const last = flow.mobile.screens.length - 1

  const go = (i: number) => {
    // The tapped button goes inert with its screen, so focus follows to the next screen.
    refocus.current = !!root.current?.contains(document.activeElement)
    setStep(i)
    setPicked(null)
  }

  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    // Both frames are in the DOM; only one is displayed (offsetParent is null under display: none).
    const screen = [...(root.current?.querySelectorAll<HTMLElement>(`[data-step="${step}"]`) ?? [])].find((el) => el.offsetParent)
    const next = screen?.querySelector('button') ?? root.current?.querySelector<HTMLElement>('[data-start-over]')
    next?.focus({ preventScroll: true })
  }, [step])

  const screens = (set: ScreenSet) => (
    <Screens set={set} step={step} picked={picked} onNext={() => go(Math.min(step + 1, last))} onPick={setPicked} />
  )

  return (
    <div ref={root} className="rounded-[14px] bg-tag px-5 pb-5 pt-6 md:px-10 md:pb-7 md:pt-10">
      <BrowserFrame className="hidden md:block">{screens(flow.desktop)}</BrowserFrame>
      <div className="mx-auto max-w-[320px] rounded-[44px] bg-[#211e1a] p-2 shadow-[0_8px_24px_rgba(58,50,38,0.18)] md:hidden">
        <div className="overflow-hidden rounded-[36px]">{screens(flow.mobile)}</div>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {last + 1}: {flow.mobile.screens[step].name}
      </p>
      <div className="mt-4 flex min-h-6 flex-wrap items-center justify-between gap-x-4 gap-y-3 font-mono text-[12px] leading-[1.5] md:mt-5">
        {step < last && <span className="text-ink-faint">{flow.note ?? (step === 0 ? 'Tap to try it' : '')}</span>}
        {step === last && (
          <button type="button" data-start-over onClick={() => go(0)} className="sf-link press-scale text-ink-primary">
            Start over
          </button>
        )}
        {flow.link && (
          <a href={flow.link.href} target="_blank" rel="noopener noreferrer" className="sf-link press-scale shrink-0 text-ink-primary">
            {flow.link.label} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  )
}

// Every screen is stacked in one box so a step is a cross-fade with no layout shift, and the whole
// set is fetched up front (the frame for the other breakpoint is display: none, and its lazy images
// never load). Inactive screens are inert, so their hotspots can't be tabbed to.
function Screens({ set, step, picked, onNext, onPick }: {
  set: ScreenSet
  step: number
  picked: number | null
  onNext: () => void
  onPick: (i: number) => void
}) {
  const vars = {
    aspectRatio: `${set.width} / ${set.height}`,
    '--sf-w': set.width,
    '--sf-radius': set.select?.radius ?? 0,
    '--sf-radio-right': set.select?.radio.right ?? 0,
    '--sf-radio-size': set.select?.radio.size ?? 0,
  } as CSSProperties
  return (
    <div className="sf-screens relative" style={vars}>
      {set.screens.map((s, i) => (
        <div key={i} data-step={i} data-active={i === step} inert={i !== step} className="sf-screen absolute inset-0">
          <img src={s.src} alt={s.alt} loading="lazy" draggable={false} className="absolute inset-0 block h-full w-full" />
          {s.float && <img src={s.float.src} alt="" loading="lazy" draggable={false} className="sf-float absolute" style={place(s.float.box)} />}
          {s.targets?.map((t, j) => (
            <button
              key={j}
              type="button"
              aria-label={t.label}
              aria-pressed={t.does === 'select' ? picked === j : undefined}
              data-does={t.does}
              className="sf-hot absolute"
              style={place(t.box)}
              onClick={() => (t.does === 'next' ? onNext() : onPick(j))}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
