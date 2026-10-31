'use client'

// The dashboard's left card, ported as is from DesignGardenTool
// SprintOverviewCard.tsx (tab bar) + goals/WeeklyGoalCard.tsx (the Tasks tab, current week),
// 2026-10-31. The app's own grays (tailwind secondary scale) and lime active tab. Demo tasks.
import { useRef, useState, type ReactNode } from 'react'

const S = { 50: '#F8F9FA', 100: '#E9ECEF', 200: '#DEE2E6', 300: '#CED4DA', 400: '#ADB5BD', 500: '#6C757D', 600: '#5A6268', 700: '#495057', 900: '#212529' }
const PRIMARY = '#003912'
const PRIMARY_50 = '#E6F2EB'
const PRIMARY_100 = '#C2DFD0'

export type Task = { id: string; text: string; done: boolean }

const WEEK3: Task[] = [
  { id: 't1', text: 'Draft the outcomes section', done: true },
  { id: 't2', text: 'Get two people to read the hero', done: true },
  { id: 't3', text: 'Pick the final cover image', done: false },
  { id: 't4', text: 'Record a 60 second walkthrough', done: false },
  { id: 't5', text: 'Send the case study to Robin for a read', done: false },
]

export function useTasks() {
  const [tasks, setTasks] = useState(WEEK3)
  const toggle = (id: string) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const rename = (id: string, text: string) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, text } : t)))
  const remove = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id))
  const add = (text: string) => setTasks((ts) => [...ts, { id: `t${Date.now()}`, text, done: false }])
  return { tasks, toggle, rename, remove, add, doneCount: tasks.filter((t) => t.done).length }
}
export type Tasks = ReturnType<typeof useTasks>

// The checklist rows, as WeeklyGoalCard draws them. Used whole in the card and alone in Swap's takeaway.
export function Checklist({ t, compact = false }: { t: Tasks; compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-col gap-1' : 'flex flex-col gap-2'}>
      {t.tasks.map((d) => (
        <label key={d.id} className={`flex cursor-pointer items-start gap-3 ${compact ? 'min-h-8 py-1' : ''}`}>
          <input type="checkbox" checked={d.done} onChange={() => t.toggle(d.id)} className="mt-0.5 size-4 shrink-0 rounded accent-[#003912]" />
          <span className="text-sm" style={d.done ? { color: S[500], textDecoration: 'line-through' } : { color: S[700] }}>
            {d.text}
          </span>
        </label>
      ))}
    </div>
  )
}

// WeeklyGoalCard, status "current", not collapsible.
export function WeekCard({ t }: { t: Tasks }) {
  return (
    <div className="rounded-xl border border-l-4 p-4" style={{ borderColor: S[200], borderLeftColor: PRIMARY, background: `color-mix(in srgb, ${PRIMARY_50} 30%, white)` }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: S[900] }}>Week 3</span>
          <span className="text-xs" style={{ color: S[500] }}>Oct 19 – Oct 25</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums" style={{ color: S[500] }}>{t.doneCount}/{t.tasks.length}</span>
          {t.doneCount === t.tasks.length ? (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Complete</span>
          ) : (
            <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: PRIMARY_100, color: PRIMARY }}>Current</span>
          )}
        </div>
      </div>
      <Checklist t={t} />
      <div className="mt-3 border-t pt-3" style={{ borderColor: S[200] }}>
        <p className="mb-1 text-xs" style={{ color: S[500] }}>What might get in the way:</p>
        <p className="text-sm" style={{ color: S[600] }}>Launch week at my day job</p>
      </div>
    </div>
  )
}

type Tab = 'sprint' | 'tasks' | 'checkin' | 'crew'
const TABS: { id: Tab; label: string }[] = [
  { id: 'sprint', label: 'Sprint' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'crew', label: 'Crew' },
]

// The tabbed card. Sprint and Crew show but aren't part of this demo; Tasks always works, and
// Check-in works when the layout gives it something to show.
export function TaskPanel({
  tab,
  onTab,
  checkin,
  dot,
  className = '',
  children,
}: {
  tab: Tab
  onTab?: (t: Tab) => void
  checkin?: boolean
  dot?: Tab | null
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex min-h-0 flex-col rounded-xl border bg-white p-3 shadow-sm md:p-4 ${className}`} style={{ borderColor: S[200] }}>
      <div className="mb-3 flex gap-1 rounded-lg p-1" style={{ background: S[50] }}>
        {TABS.map((x) => {
          const live = x.id === 'tasks' || (x.id === 'checkin' && checkin)
          const on = tab === x.id
          const style = on ? { background: '#C7EF4E', color: '#1a2800' } : { color: live ? S[500] : S[400] }
          const inner = (
            <span className="relative leading-none">
              {x.label}
              {dot === x.id && <span aria-hidden className="absolute -right-2 -top-1 size-1.5 rounded-full bg-red-500" />}
            </span>
          )
          return live && onTab ? (
            <button key={x.id} type="button" aria-pressed={on} onClick={() => onTab(x.id)} className="flex h-9 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-md px-1 text-[11px] font-medium transition-colors duration-150 md:text-xs" style={style}>
              {inner}
            </button>
          ) : (
            <span key={x.id} className="flex h-9 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-md px-1 text-[11px] font-medium md:text-xs" style={style}>
              {inner}
            </span>
          )
        })}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------------------------
// The takeaway's task list (Swap): check off, rename in place, remove, and add, without leaving
// the check in. Return saves, Escape cancels; an emptied task goes back to what it was.
// ---------------------------------------------------------------------------------------------
const INK = '#3b2a1a'
const INK_SOFT = '#6b5a47'

function TaskRow({ t, d }: { t: Tasks; d: Task }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(d.text)
  const editBtn = useRef<HTMLButtonElement>(null)
  const save = () => {
    const text = draft.trim()
    if (text && text !== d.text) t.rename(d.id, text)
    else setDraft(d.text)
    setEditing(false)
    requestAnimationFrame(() => editBtn.current?.focus())
  }
  return (
    <li className="group flex min-h-11 items-center gap-3 rounded-[10px] px-2 transition-colors duration-150 focus-within:bg-black/[0.03] hover:bg-black/[0.03]">
      <input
        type="checkbox"
        checked={d.done}
        onChange={() => t.toggle(d.id)}
        aria-label={`${d.done ? 'Done' : 'Not done'}: ${d.text}`}
        className="size-4 shrink-0 rounded accent-[#003912]"
      />
      {editing ? (
        <input
          autoFocus
          // Opens with the whole name selected, like a file rename: type to replace, or arrow to keep.
          onFocus={(e) => e.currentTarget.select()}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setDraft(d.text)
              setEditing(false)
              requestAnimationFrame(() => editBtn.current?.focus())
            }
          }}
          aria-label="Task"
          className="gc-input h-9 min-w-0 flex-1 rounded-md border border-black/10 bg-white px-2 text-[16px] md:text-[14px]"
          style={{ color: INK }}
        />
      ) : (
        <button
          ref={editBtn}
          type="button"
          onClick={() => setEditing(true)}
          className="gc-focus min-w-0 flex-1 cursor-text rounded-md py-2 text-left text-[14px] leading-snug"
          style={d.done ? { color: S[500], textDecoration: 'line-through' } : { color: INK }}
          aria-label={`Edit task: ${d.text}`}
        >
          {d.text}
        </button>
      )}
      {!editing && (
        <button
          type="button"
          onClick={() => t.remove(d.id)}
          aria-label={`Remove task: ${d.text}`}
          className="gc-focus relative flex size-7 shrink-0 items-center justify-center rounded-md text-[13px] opacity-100 transition-opacity duration-150 before:absolute before:-inset-2 hover:bg-black/[0.05] focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0"
          style={{ color: INK_SOFT }}
        >
          ✕
        </button>
      )}
    </li>
  )
}

function AddTask({ t }: { t: Tasks }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const addBtn = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    setDraft('')
    requestAnimationFrame(() => addBtn.current?.focus())
  }
  if (!open) {
    return (
      <button ref={addBtn} type="button" onClick={() => setOpen(true)} className="gc-focus flex h-11 w-full items-center gap-3 rounded-[10px] px-2 text-left text-[14px] font-medium transition-colors duration-150 hover:bg-black/[0.03]" style={{ color: '#003912' }}>
        <span aria-hidden className="flex size-4 items-center justify-center text-[16px] leading-none">+</span>
        Add a task
      </button>
    )
  }
  return (
    <form
      className="flex min-h-11 items-center gap-3 px-2"
      onSubmit={(e) => {
        e.preventDefault()
        const text = draft.trim()
        if (text) t.add(text)
        setDraft('') // stays open for the next one
      }}
    >
      <span aria-hidden className="size-4 shrink-0 rounded border border-black/20" />
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => !draft.trim() && close()}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        placeholder="New task"
        aria-label="New task"
        className="gc-input h-9 min-w-0 flex-1 rounded-md border border-black/10 bg-white px-2 text-[16px] md:text-[14px]"
        style={{ color: INK }}
      />
      <button type="submit" disabled={!draft.trim()} className="gc-press gc-focus h-9 shrink-0 rounded-md px-3 text-[13px] font-semibold text-white disabled:bg-[#8a9a8d]" style={{ background: draft.trim() ? '#003912' : undefined }}>
        Add
      </button>
    </form>
  )
}

export function TaskEditor({ t, className = '' }: { t: Tasks; className?: string }) {
  return (
    <section aria-label="Your tasks this week" className={`flex min-h-0 flex-col rounded-[14px] bg-white p-4 shadow-[0_0_0_1px_rgba(74,40,12,.08),0_2px_6px_rgba(74,40,12,.06)] md:p-5 ${className}`}>
      <div className="flex items-baseline justify-between">
        <p className="text-[15px] font-semibold" style={{ color: INK }}>Your tasks this week</p>
        <span className="text-[12px] tabular-nums" style={{ color: INK_SOFT }}>Week 3 · {t.doneCount}/{t.tasks.length}</span>
      </div>
      <p className="mt-1 text-[12px] leading-snug" style={{ color: INK_SOFT }}>Check off what’s done and tidy the list before you close out.</p>
      <ul className="-mx-2 mt-3 min-h-0 flex-1 overflow-y-auto">
        {t.tasks.map((d) => <TaskRow key={d.id} t={t} d={d} />)}
        <li><AddTask t={t} /></li>
      </ul>
    </section>
  )
}
