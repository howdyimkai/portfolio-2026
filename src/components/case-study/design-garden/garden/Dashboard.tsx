'use client'

// The dashboard row the garden chapter compares: after (Swap) and before (TodayDashboard). The
// task card is the app's, unchanged (tasks.tsx); only how it sits with the check in changes.
import { useState } from 'react'
import { EARLIER, PARTNER, type Ritual } from './ritual'
import { INK, INK_SOFT, Pieces, Primary, Sand, Week } from './kit'
import { CheckinCard, GardenPane } from './Checkin'
import { TaskEditor, TaskPanel, WeekCard, useTasks } from './tasks'
import Today from './Today'

// The garden between check ins: last weeks' pieces and the way in.
// The garden between check ins: last weeks' pieces and the way in. When Robin leads, Robin is the
// one who started it (the app's host is whoever starts), so you join.
function IdleGarden({ onStart, leader = 'you', className = '' }: { onStart: () => void; leader?: 'you' | 'partner'; className?: string }) {
  return (
    <Sand className={`min-h-0 rounded-[14px] ${className}`}>
      <div className="absolute right-3 top-3 z-[4] rounded-full bg-white/75 px-2.5 py-1"><Week /></div>
      <Pieces pieces={EARLIER} />
      <div className="absolute inset-x-3 bottom-3 z-[5] mx-auto flex max-w-[420px] flex-col items-center gap-2 rounded-[14px] bg-white/85 p-3 shadow-[0_0_0_1px_rgba(74,40,12,.08),0_12px_28px_rgba(74,40,12,.14)] backdrop-blur-md">
        <p className="text-[13px] font-medium" style={{ color: leader === 'you' ? INK_SOFT : INK }}>{leader === 'you' ? 'Look how far you’ve grown together.' : `${PARTNER} started your check-in.`}</p>
        <Primary onClick={onStart} className="w-full">{leader === 'you' ? 'Start check-in' : 'Join check-in'}</Primary>
      </div>
    </Sand>
  )
}

// ---------------------------------------------------------------------------------------------
// After — one thing at a time. Starting the check in swaps the task card for the check in card;
// the garden keeps the right. At the takeaway your tasks take the garden's place, editable, and
// when the check in is done the task card and the garden come back. The garden is 20% narrower than the
// dashboard's two thirds (47 / 53, Kai 2026-10-31) to give the card room.
// ---------------------------------------------------------------------------------------------
export function Swap({ r }: { r: Ritual }) {
  const t = useTasks()
  const started = !r.idle
  const inRitual = started && r.stage !== 'done'
  // The takeaway is when the app asks you to review your tasks, and nothing grows in the garden
  // then, so the tasks take the garden's place, editable. The garden comes back for the close.
  const review = inRitual && r.section === 'takeaway'
  return (
    <div className={`flex h-full flex-col gap-2 overflow-y-auto md:grid md:gap-3 md:overflow-visible ${review ? 'md:grid-cols-2' : 'md:grid-cols-[47%_1fr]'}`}>
      {inRitual ? (
        <CheckinCard key="card" r={r} className={`gc-rise min-h-[380px] md:order-none md:min-h-0 ${review ? 'order-1' : 'order-2'}`} />
      ) : (
        <TaskPanel key="tasks" tab="tasks" className="gc-rise order-2 md:order-none">
          <WeekCard t={t} />
        </TaskPanel>
      )}
      {review ? (
        <TaskEditor key="editor" t={t} className="gc-rise order-2 min-h-[360px] md:order-none md:min-h-0" />
      ) : !started ? (
        <IdleGarden onStart={() => r.begin()} leader={r.leader} className="order-1 min-h-[300px] md:order-none md:min-h-0" />
      ) : (
        <GardenPane key="garden" r={r} className="gc-rise order-1 min-h-[300px] md:order-none md:min-h-0" />
      )}
    </div>
  )
}

// The "before" at the same scope as the after: the app's dashboard row as it is today, the task
// card left and today's garden right (Dashboard.tsx, lg:grid-cols-[1fr_2fr]).
export function TodayDashboard({ r }: { r: Ritual }) {
  const t = useTasks()
  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto md:grid md:grid-cols-[1fr_2fr] md:gap-3 md:overflow-visible">
      <TaskPanel tab="tasks" className="min-h-[300px] md:min-h-0">
        <WeekCard t={t} />
      </TaskPanel>
      <div className="min-h-[560px] md:min-h-0">
        <Today r={r} />
      </div>
    </div>
  )
}
