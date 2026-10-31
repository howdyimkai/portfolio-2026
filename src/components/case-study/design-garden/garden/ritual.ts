'use client'

// The scripted check in behind the garden chapter's before and after. One seeded demo pair (you
// and Robin, never crew goals); Robin answers a beat after you, the way a partner on the call
// would. Strings are the app's own (CanvasRitualBar, TetrisGarden).
import { useCallback, useEffect, useRef, useState } from 'react'

export const ART = '/works/design-garden/garden'
export const SEEDS = [`${ART}/seed-1.webp`, `${ART}/seed-2.webp`, `${ART}/seed-3.webp`, `${ART}/seed-4.webp`]
export const FLOWERS = [`${ART}/aster.webp`, `${ART}/coneflower.webp`, `${ART}/marigold.webp`, `${ART}/leaf.webp`]
export const OBSTACLE = `${ART}/pumpkin.webp`
export const BEE = `${ART}/ghost-bee.webp`
export const SAND = `${ART}/sand.webp`

export const PARTNER = 'Robin'
export const WEEK = 3

export type Stage = 'warmup' | 'wins' | 'obstacles' | 'takeaway' | 'done'
export type Tag = 'win' | 'blocker' | 'takeaway'
export type Who = 'you' | 'partner'
export type Entry = { id: number; who: Who; tag: Tag; text: string }
// A piece on the garden, in % of the canvas so it sits right at any size.
export type Piece = { id: string; img: string; x: number; y: number; who: Who; tag: Tag; text?: string; fresh?: boolean }

export const STAGES: Stage[] = ['warmup', 'wins', 'obstacles', 'takeaway', 'done']

export const WARMUP = [
  'What surprised you this week?',
  "What’s one thing you’re proud of that isn’t on your task list?",
  'Take turns sharing your screen so your partner can see what you shipped this week.',
]

export const PROMPT: Record<Exclude<Stage, 'warmup' | 'done'>, string> = {
  wins: "What’s a big win for you this week?",
  obstacles: 'What got in the way this week?',
  takeaway: "What’s one thing you’re carrying into next week?",
}

export const SECTION = {
  wins: { label: 'Wins', inputLabel: 'Your win', placeholder: 'e.g. Shipped the onboarding redesign', cta: 'Plant' },
  obstacles: { label: 'Obstacles', inputLabel: 'Your obstacle', placeholder: 'e.g. Got stuck on the API integration', cta: 'Add' },
  takeaway: { label: 'Takeaway', inputLabel: 'Your takeaway', placeholder: "What’s one thing you’re carrying into next week?", cta: 'Place my takeaway' },
} as const

export const TAKEAWAY_CONSEQUENCE =
  "Placing your takeaway closes your side of the check-in. It’s done for the week once you both place yours."

// What the input starts filled with, so a reader can plant with one tap instead of typing.
const YOUR_DRAFTS: Record<Tag, string[]> = {
  win: [
    'Wrote the problem section of my case study',
    'Got feedback from two designers on my hero',
  ],
  blocker: ['Lost two evenings to a launch at my day job'],
  takeaway: ['Ship the outcomes section before Sunday'],
}
const PARTNER_SAYS: Record<Tag, string[]> = {
  win: ['Finished the outline for my design systems study', 'Picked the three screens that tell the story'],
  blocker: ["Kept rewriting the intro instead of moving on"],
  takeaway: ['Draft the process section, ugly first'],
}

const TAG_OF: Record<'wins' | 'obstacles' | 'takeaway', Tag> = { wins: 'win', obstacles: 'blocker', takeaway: 'takeaway' }

// Weeks 1 and 2, already in the garden, with what each piece was planted for (demo words).
export const EARLIER: Piece[] = [
  { id: 'e1', img: FLOWERS[0], x: 12, y: 18, who: 'you', tag: 'win', text: 'Picked the project for this sprint' },
  { id: 'e2', img: FLOWERS[2], x: 80, y: 14, who: 'partner', tag: 'win', text: 'Audited every button in the old file' },
  { id: 'e3', img: OBSTACLE, x: 86, y: 70, who: 'partner', tag: 'blocker', text: 'A cold took out most of week 2' },
  { id: 'e4', img: FLOWERS[1], x: 18, y: 74, who: 'partner', tag: 'win', text: 'Wrote the first draft of the brief' },
  { id: 'e5', img: BEE, x: 70, y: 82, who: 'you', tag: 'takeaway', text: 'Show work before it feels ready' },
  { id: 'e6', img: FLOWERS[3], x: 6, y: 46, who: 'you', tag: 'win', text: 'Sketched the case study structure' },
]

// Where this week's pieces settle once the check in closes: open ground around the plot.
// Kept out of the bottom middle, where the done card sits.
const SETTLE: [number, number][] = [
  [32, 30], [66, 28], [90, 42], [26, 58], [74, 60], [8, 70], [44, 22], [58, 64], [40, 62],
]

// CheckinPlant's growth model: seeds 1 to 4, then this session's flower at 4 wins.
export function plantFor(wins: number): { img: string; label: string; stage: number } {
  if (wins >= 4) return { img: FLOWERS[1], label: 'In full bloom.', stage: 4 }
  const labels = ['Seedling — ready to grow.', 'Growing — keep going!', "Growing — you’re making progress.", 'Almost there — one more win to bloom.']
  return { img: SEEDS[wins], label: labels[wins], stage: wins }
}

// The leader moves the pair from section to section; the other partner follows. Whoever leads
// lets the other share first each round (the app's rule), and the way on opens once both have
// shared. So "you lead" means Robin talks first and you advance; "Robin leads" means you talk
// first and Robin advances once you've both shared.
// `startsIdle`: the dashboards open between check ins, so the check in waits until someone
// starts it (`begin`). Nothing runs while idle, including Robin's warm-up hand off.
// Upgraded rule (Kai, 2026-10-31): finishing the check in is what makes this week's plant bloom.
// The app blooms it at 4 combined wins, so a light week ended on a seedling. Wins still grow it
// stage by stage during the call; closing it out turns it into the flower. "Today" keeps the
// app's rule and doesn't use this.
export function withBloom(dealt: Piece[]): Piece[] {
  return dealt.map((p) => (p.id === 'plant' ? { ...p, img: FLOWERS[1], text: 'In full bloom.' } : p))
}

export function useRitual(leader: Who = 'you', startsIdle = false) {
  const [stage, setStage] = useState<Stage>('warmup')
  const [idle, setIdle] = useState(startsIdle)
  // The meeting's length, picked when it starts (the app's 15 / 30 / 45, 30 by default), and when
  // it started. Advisory, like the app's: a friendly countdown, never a hard stop.
  const [minutes, setMinutes] = useState(30)
  const [startedAt, setStartedAt] = useState<number | null>(startsIdle ? null : Date.now())
  const [entries, setEntries] = useState<Entry[]>([])
  const [draft, setDraft] = useState('')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [landed, setLanded] = useState(0) // bumps on every new entry, for a landing beat
  const [moving, setMoving] = useState(false) // Robin, leading, is about to move you both on
  const nextId = useRef(1)
  const used = useRef<Record<string, number>>({})
  const timers = useRef<number[]>([])
  const leadTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      if (leadTimer.current) clearTimeout(leadTimer.current)
    },
    [],
  )

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const pick = (who: Who, tag: Tag) => {
    const bank = who === 'you' ? YOUR_DRAFTS[tag] : PARTNER_SAYS[tag]
    const k = who + tag
    const i = used.current[k] ?? 0
    if (i >= bank.length) return null
    used.current[k] = i + 1
    return bank[i]
  }

  const push = useCallback((who: Who, tag: Tag, text: string) => {
    setEntries((e) => [...e, { id: nextId.current++, who, tag, text }])
    setLanded((n) => n + 1)
  }, [])

  const partnerAnswers = (tag: Tag, delay = 700) => {
    const text = pick('partner', tag)
    if (!text) return
    later(() => setPartnerTyping(true), delay)
    later(() => {
      setPartnerTyping(false)
      push('partner', tag, text)
    }, delay + 1500)
  }

  const enter = (s: Stage) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPartnerTyping(false)
    setMoving(false)
    setStage(s)
    if (s === 'wins' || s === 'obstacles' || s === 'takeaway') {
      setDraft(pick('you', TAG_OF[s]) ?? '')
      // You lead: Robin shares first. Robin leads: Robin waits for you.
      if (leader === 'you') partnerAnswers(TAG_OF[s])
    } else setDraft('')
  }

  const submit = () => {
    if (stage !== 'wins' && stage !== 'obstacles' && stage !== 'takeaway') return
    const text = draft.trim()
    if (!text) return
    const tag = TAG_OF[stage]
    const mineBefore = entries.filter((e) => e.who === 'you' && e.tag === tag).length
    push('you', tag, text)
    setDraft(stage === 'takeaway' ? '' : pick('you', tag) ?? '')
    if (leader === 'partner' && mineBefore === 0) partnerAnswers(tag, 500)
    // A second win from Robin after your second one, so the plant can reach bloom.
    if (stage === 'wins' && mineBefore === 1) partnerAnswers('win', 500)
  }

  // Sets the check in up as if it had been played to `to`, with you leading, so the case study can
  // open on a moment instead of a start button (and a caption can take you to its moment). Robin
  // shares first each round, as the app asks of the leader, so Robin's answer is already in.
  const jumpTo = (to: 'wins' | 'obstacles' | 'takeaway') => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    used.current = {}
    const order: ('wins' | 'obstacles' | 'takeaway')[] = ['wins', 'obstacles', 'takeaway']
    const list: Entry[] = []
    let id = 1
    for (const sec of order.slice(0, order.indexOf(to) + 1)) {
      const tag = TAG_OF[sec]
      const theirs = pick('partner', tag)
      if (theirs) list.push({ id: id++, who: 'partner', tag, text: theirs })
      if (sec === to) break
      const mine = pick('you', tag)
      if (mine) list.push({ id: id++, who: 'you', tag, text: mine })
    }
    // On the landing moment you've shared too (except at the takeaway, which is yours to place).
    if (to !== 'takeaway') {
      const mine = pick('you', TAG_OF[to])
      if (mine) list.push({ id: id++, who: 'you', tag: TAG_OF[to], text: mine })
    }
    nextId.current = id
    setEntries(list)
    setDraft(pick('you', TAG_OF[to]) ?? '')
    setPartnerTyping(false)
    setMoving(false)
    setIdle(false)
    setStartedAt(Date.now())
    setStage(to)
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (leadTimer.current) clearTimeout(leadTimer.current)
    used.current = {}
    setEntries([])
    setDraft('')
    setPartnerTyping(false)
    setMoving(false)
    setStage('warmup')
    setIdle(startsIdle)
    setStartedAt(startsIdle ? null : Date.now())
  }

  const wins = entries.filter((e) => e.tag === 'win').length
  const section = stage === 'wins' || stage === 'obstacles' || stage === 'takeaway' ? stage : null
  const step = STAGES.indexOf(stage)
  const tagNow = section ? TAG_OF[section] : null
  const shared = {
    you: !!tagNow && entries.some((e) => e.who === 'you' && e.tag === tagNow),
    partner: !!tagNow && entries.some((e) => e.who === 'partner' && e.tag === tagNow),
  }
  const bothShared = shared.you && shared.partner

  // Both takeaways placed closes the check in, whoever leads.
  useEffect(() => {
    if (section !== 'takeaway' || !bothShared) return
    const t = window.setTimeout(() => setStage('done'), 1200)
    return () => clearTimeout(t)
  }, [section, bothShared])

  // Robin, leading, moves you both on: out of the warm-up after a beat, and out of a section
  // once you've both shared and the typing has settled.
  const enterRef = useRef(enter)
  enterRef.current = enter
  useEffect(() => {
    if (leader !== 'partner' || idle) return
    const go = stage === 'warmup' ? 'wins' : stage === 'wins' && bothShared && !partnerTyping ? 'obstacles' : stage === 'obstacles' && bothShared && !partnerTyping ? 'takeaway' : null
    if (!go) return
    const wait = stage === 'warmup' ? 5000 : 4500
    const warn = window.setTimeout(() => setMoving(true), wait - 1600)
    leadTimer.current = window.setTimeout(() => enterRef.current(go), wait)
    return () => {
      clearTimeout(warn)
      if (leadTimer.current) clearTimeout(leadTimer.current)
    }
  }, [leader, stage, bothShared, partnerTyping, landed, idle])

  // This week's pieces in the open garden, once they've been dealt out (the section is over).
  const dealt: Piece[] = entries
    .filter((e) => {
      const done = step > STAGES.indexOf(e.tag === 'win' ? 'wins' : e.tag === 'blocker' ? 'obstacles' : 'takeaway')
      return done
    })
    .map((e, i) => ({
      id: `n${e.id}`,
      img: e.tag === 'win' ? FLOWERS[(e.id + 1) % 4] : e.tag === 'blocker' ? OBSTACLE : BEE,
      x: SETTLE[i % SETTLE.length][0],
      y: SETTLE[i % SETTLE.length][1],
      who: e.who,
      tag: e.tag,
      text: e.text,
      fresh: true,
    }))

  // The session's plant stays in the middle of the garden once it's done.
  if (stage === 'done') dealt.push({ id: 'plant', img: plantFor(wins).img, x: 50, y: 46, who: 'you', tag: 'win', fresh: true })

  const begin = (mins = minutes) => {
    setMinutes(mins)
    setStartedAt(Date.now())
    setIdle(false)
  }

  return { idle, begin, jumpTo, minutes, startedAt, stage, step, section, entries, draft, setDraft, submit, enter, reset, partnerTyping, wins, plant: plantFor(wins), dealt, landed, leader, shared, bothShared, moving }
}

export type Ritual = ReturnType<typeof useRitual>

export function nextStage(s: Stage): Stage {
  return STAGES[Math.min(STAGES.indexOf(s) + 1, STAGES.length - 1)]
}

export const LENGTHS = [15, 30, 45] as const

// Seconds left in the check in, recomputed from when it started on every tick (as the app does,
// so a reload or the partner's screen agree). Negative once it's over.
export function useSecsLeft(startedAt: number | null, minutes: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (startedAt === null) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [startedAt])
  if (startedAt === null) return null
  return Math.floor((startedAt + minutes * 60000 - now) / 1000)
}

export const clock = (secs: number) => {
  const s = Math.max(0, secs)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
