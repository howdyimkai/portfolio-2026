'use client'

// The garden chapter's before and after (custom visual 'garden-compare'): the template's compare
// (Toggle.tsx's panel and Before / After switch) with live demos instead of captures. Before is the
// app's dashboard row today; after is the upgrade. After opens mid check in, on the wins with both
// answers in, so the space change lands for a reader who never touches it. Its three captions are
// numbered, and each one's label takes the demo to the moment it describes. Copy: Kai, 2026-10-31.
// Seeded demo pair only (you and Robin). Decision record: design-intent/garden-checkin-exploration/NOTES.md.
import { useLayoutEffect, useState } from 'react'
import type { Visual } from '../types'
import '../step-frame.css'
import { useRitual } from './garden/ritual'
import { Swap, TodayDashboard } from './garden/Dashboard'
import { ShowLeadTip } from './garden/Checkin'
import ExpandableFrame from './garden/ExpandableFrame'
import { inter } from './garden/fonts'
import './garden/garden.css'

// 5:4 from tablet up (about 640px tall in the 880px column): at 16:10 the before's garden got
// ~290px and its warm-up questions piled on each other. The app's own canvas minimum is 420px.
const SIZE = 'h-[720px] sm:h-auto sm:aspect-[5/4]'

const BEFORE = 'The garden took most of the screen. The questions were small text squeezed into a bar under it.'
const AFTER = [
  {
    key: 'space',
    label: 'Space',
    to: 'wins',
    text: 'The garden is smaller and the question card gets about half the screen. Questions are bigger and both answers have room. The garden still sits beside it, so you watch your plant grow as you share.',
  },
  {
    key: 'leads',
    label: 'Who leads',
    to: 'obstacles',
    text: 'The card says who leads. Only the leader moves you both to the next step, and only after you both share. An info button explains the role when you need it and stays out of the way when you don’t.',
  },
  {
    key: 'tasks',
    label: 'Tasks',
    to: 'takeaway',
    text: 'At the last step, your task list takes the garden’s place, so you plan next week with your tasks right there.',
  },
] as const

export default function GardenCompare({ visual }: { visual: Visual }) {
  const [on, setOn] = useState<'before' | 'after'>('after')
  const [moment, setMoment] = useState<(typeof AFTER)[number]['key']>('space')
  const before = useRitual('you', true)
  const after = useRitual('you')

  // Each side starts fresh when it's shown: before at rest, after on the wins. Before paint, so the
  // after never flashes its warm-up first.
  useLayoutEffect(() => {
    if (on === 'after') {
      after.jumpTo('wins')
      setMoment('space')
    } else before.reset()
  }, [on])

  // "Who leads" also opens the leader's info tooltip, so the guidance it talks about is on screen.
  const [leadTip, setLeadTip] = useState(0)
  const go = (m: (typeof AFTER)[number]) => {
    setMoment(m.key)
    after.jumpTo(m.to)
    if (m.key === 'leads') setLeadTip((n) => n + 1)
  }

  return (
    <div role="group" aria-label={visual.label} className={`${inter.className} rounded-[14px] bg-tag px-3 pb-4 pt-4 md:px-10 md:pb-10 md:pt-8`}>
      <div role="group" aria-label="Show" className="mb-4 inline-flex rounded-full border border-hairline bg-white p-0.5 md:mb-5">
        {(['before', 'after'] as const).map((k) => (
          <button key={k} type="button" aria-pressed={on === k} onClick={() => setOn(k)} className="tg-seg press-scale rounded-full px-3.5 py-1.5 font-mono text-[12px] leading-none">
            {k === 'before' ? 'Before' : 'After'}
          </button>
        ))}
      </div>

      <ExpandableFrame key={on} size={SIZE} label={on === 'before' ? 'Check in before' : 'Check in after'}>
        {on === 'before' ? (
          <TodayDashboard r={before} />
        ) : (
          <ShowLeadTip.Provider value={leadTip}>
            <Swap r={after} />
          </ShowLeadTip.Provider>
        )}
      </ExpandableFrame>

      {/* Both captions share one grid cell, so the panel keeps the taller one's height and doesn't
          jump when the switch flips. Only the current one shows. */}
      <div aria-live="polite" className="mt-4 grid font-mono text-[12px] leading-[1.6] text-ink-body md:mt-5">
        <p aria-hidden={on !== 'before'} className={`col-start-1 row-start-1 ${on === 'before' ? '' : 'invisible'}`}>
          {BEFORE}
        </p>
        <ol aria-hidden={on !== 'after'} className={`col-start-1 row-start-1 flex flex-col gap-3 ${on === 'after' ? '' : 'invisible'}`}>
          {AFTER.map((m, i) => (
            <li key={m.key} className="flex flex-col gap-1 md:flex-row md:gap-4">
              <button
                type="button"
                aria-pressed={moment === m.key}
                onClick={() => go(m)}
                tabIndex={on === 'after' ? 0 : -1}
                className="tg-seg press-scale inline-flex h-7 shrink-0 items-center gap-1.5 self-start rounded-full border border-hairline bg-white px-3 font-mono text-[12px] leading-none md:w-[112px]"
              >
                <span className="tabular-nums">{i + 1}</span>
                {m.label}
              </button>
              <span className="[text-wrap:pretty]">{m.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
