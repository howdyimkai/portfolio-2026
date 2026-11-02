'use client'

// PROTOTYPE: sound effects for the site, auditioned before any of them touch a real component.
// Sounds are earshot bank renders (design-intent/sfx-exploration/render.sh); the sand is live
// Web Audio. Pick one per moment, then copy the picks back. Delete with src/app/proto/sfx and
// public/proto/sfx once the picks are promoted.
import { useEffect, useRef, useState } from 'react'
import { play, preload, sandVoice, setVolume, wake, type SandKind } from './audio'

const NOTES = ['C5', 'D5', 'E5', 'G5', 'A5']
const PUT_DOWN_RATE = 0.8 // putting a tool down plays the pick up take a little lower

type Option = { key: string; label: string; id: string; files: string[] }
type Moment = { key: string; title: string; when: string; options: Option[]; kind?: 'tool' | 'notes' }

const one = (key: string, label: string, id: string, file: string): Option => ({ key, label, id, files: [file] })
const notes = (key: string, label: string, id: string, prefix: string): Option => ({
  key,
  label,
  id,
  files: NOTES.map((n) => `${prefix}-${n}`),
})

const MOMENTS: Moment[] = [
  {
    key: 'tool',
    title: 'Pick up and put down a tool',
    when: 'Garden: clicking the rake, eraser or blossom, and putting it back',
    kind: 'tool',
    options: [
      one('knock', 'Wood knock', 'knock/wood', 'pickup-knock'),
      one('finger', 'Finger on wood', 'fit/land.light/finger_wood', 'pickup-finger'),
      one('bamboo', 'Bamboo tok', 'fit/hit/bamboo_tok', 'pickup-bamboo'),
    ],
  },
  {
    key: 'blossom',
    title: 'Stamp a blossom',
    when: 'Garden: each stamp plays the next note, so a few stamps make a tune',
    kind: 'notes',
    options: [
      notes('kalimba', 'Kalimba', 'pluck/kalimba_soft', 'blossom-kalimba'),
      notes('celesta', 'Celesta', 'mallet/celesta', 'blossom-celesta'),
      notes('pop', 'Soft pop', 'ui_pop/soft', 'blossom-pop'),
    ],
  },
  {
    key: 'reveal',
    title: 'A principle writes on',
    when: 'Garden: after the name is erased and the handwriting starts',
    options: [
      one('flourish', 'Chime flourish', 'mallet/flourish', 'reveal-flourish'),
      one('up4', 'Four notes up', 'mallet/up4', 'reveal-up4'),
      one('shimmer', 'Shimmer', 'pro_shimmer/m1', 'reveal-shimmer'),
    ],
  },
  {
    key: 'broom',
    title: 'Sweep the shelf',
    when: 'Shelf: the broom pushing the toys off',
    options: [
      one('soft', 'Soft swish', 'swish/soft', 'broom-soft'),
      one('cloth', 'Cloth swipe', 'swipe/cloth', 'broom-cloth'),
      one('bamboo', 'Bamboo swish', 'fit/whoosh.short/bamboo_swish', 'broom-bamboo'),
    ],
  },
  {
    key: 'bookmark',
    title: 'Tug the résumé bookmark',
    when: 'Every shelf page: the ribbon pulls the résumé down',
    options: [
      one('paper', 'Paper slide', 'swipe/paper', 'bookmark-paper'),
      one('glide', 'Glide', 'swipe/glide', 'bookmark-glide'),
      one('flip', 'Little flip', 'fit/snap/switch_flip', 'bookmark-flip'),
    ],
  },
  {
    key: 'copy',
    title: 'Copy email',
    when: 'Footer, résumé and rodeo: the email lands on the clipboard',
    options: [
      one('wood', 'Wood ding', 'notify/mid_wood', 'copy-wood'),
      one('ding', 'Bright ding', 'pro_notify/ding_1822', 'copy-ding'),
      one('kalimba', 'Kalimba C6', 'pluck/kalimba_soft', 'copy-kalimba'),
    ],
  },
]

const SANDS: { key: SandKind; label: string; note: string }[] = [
  { key: 'hiss', label: 'Hiss', note: 'fine, airy' },
  { key: 'grain', label: 'Grain', note: 'tiny ticks of sand' },
  { key: 'brush', label: 'Brush', note: 'low and soft' },
]

const STORE = 'proto-sfx-picks'

export default function Soundboard() {
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [volume, setVol] = useState(0.6)
  const [copied, setCopied] = useState(false)
  const step = useRef<Record<string, number>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE)
      if (saved) setPicks(JSON.parse(saved))
    } catch {}
  }, [])

  const pick = (moment: string, option: string) => {
    setPicks((p) => {
      const next = { ...p, [moment]: option }
      try {
        localStorage.setItem(STORE, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const audition = (m: Moment, o: Option, putDown = false) => {
    wake()
    if (m.kind === 'notes') {
      const k = `${m.key}/${o.key}`
      const i = step.current[k] ?? 0
      step.current[k] = (i + 1) % o.files.length
      void play(o.files[i])
    } else {
      void play(o.files[0], { rate: putDown ? PUT_DOWN_RATE : 1 })
    }
  }

  const summary = [...MOMENTS.map((m) => `${m.key}: ${picks[m.key] ?? '?'}`), `sand: ${picks.sand ?? '?'}`].join(', ')

  return (
    <div className="mx-auto max-w-[880px] px-4 pb-32 pt-10 text-ink-body md:px-8 md:pt-16">
      <header className="mb-10">
        <p className="font-mono text-[12px] text-ink-faint">proto / sfx</p>
        <h1 className="mt-2 font-display text-[32px] leading-tight text-ink-primary md:text-[40px]">Sound check</h1>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed">
          Three takes for each moment, all made in code with earshot. Tap to hear, then pick one. Sound only plays on
          the things a visitor chooses to do; everything else stays quiet.
        </p>
        <label className="mt-6 flex max-w-[320px] items-center gap-3 text-[13px]">
          <span className="shrink-0">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => {
              const v = Number(e.target.value)
              setVol(v)
              wake()
              setVolume(v)
            }}
            className="w-full accent-[var(--color-accent-washi-blue)]"
          />
        </label>
      </header>

      <SandPad picked={picks.sand} onPick={(k) => pick('sand', k)} />

      {MOMENTS.map((m) => (
        <section key={m.key} className="mt-10" onPointerEnter={() => preload(m.options.flatMap((o) => o.files))}>
          <h2 className="font-display text-[20px] text-ink-primary">{m.title}</h2>
          <p className="mt-1 text-[13px] text-ink-muted">{m.when}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {m.options.map((o) => (
              <Card
                key={o.key}
                label={o.label}
                id={o.id}
                picked={picks[m.key] === o.key}
                onPick={() => pick(m.key, o.key)}
              >
                {m.kind === 'tool' ? (
                  <>
                    <PlayButton onPlay={() => audition(m, o)}>Pick up</PlayButton>
                    <PlayButton onPlay={() => audition(m, o, true)}>Put down</PlayButton>
                  </>
                ) : (
                  <PlayButton onPlay={() => audition(m, o)}>{m.kind === 'notes' ? 'Stamp' : 'Play'}</PlayButton>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14 rounded-[var(--radius-card)] border border-hairline bg-white p-5">
        <h2 className="font-display text-[20px] text-ink-primary">Your picks</h2>
        <p className="mt-2 font-mono text-[13px] leading-relaxed text-ink-primary">{summary}</p>
        <button
          type="button"
          className="sfx-press mt-4 rounded-full border border-chip-line px-4 py-2 text-[13px] text-ink-primary"
          onClick={() => {
            void navigator.clipboard.writeText(summary)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? 'Copied' : 'Copy picks'}
        </button>
      </section>

      <style>{`
        .sfx-press { transition: transform 160ms var(--ease-out-strong), background-color 150ms ease-out; }
        .sfx-press:active { transform: scale(0.97); }
        @media (hover: hover) and (pointer: fine) { .sfx-press:hover { background-color: var(--color-tag); } }
      `}</style>
    </div>
  )
}

function Card({
  label,
  id,
  picked,
  onPick,
  children,
}: {
  label: string
  id: string
  picked: boolean
  onPick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-[var(--radius-card)] border bg-white p-4"
      style={{ borderColor: picked ? 'var(--color-accent-washi-blue)' : 'var(--color-hairline)', boxShadow: picked ? '0 0 0 2px var(--color-accent-washi-blue)' : undefined }}
    >
      <div>
        <p className="text-[15px] text-ink-primary">{label}</p>
        <p className="font-mono text-[11px] text-ink-faint">{id}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
      <button
        type="button"
        aria-pressed={picked}
        onClick={onPick}
        className="sfx-press mt-auto self-start rounded-full px-3 py-1 text-[12px]"
        style={{
          background: picked ? 'var(--color-accent-washi-blue)' : 'transparent',
          color: picked ? 'var(--color-ink-primary)' : 'var(--color-ink-muted)',
          border: '1px solid var(--color-chip-line)',
        }}
      >
        {picked ? 'Picked' : 'Pick this one'}
      </button>
    </div>
  )
}

function PlayButton({ onPlay, children }: { onPlay: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="sfx-press flex items-center gap-1.5 rounded-full bg-ink-primary px-3.5 py-1.5 text-[13px] text-page"
    >
      <span aria-hidden="true">▶</span>
      {children}
    </button>
  )
}

// A strip of sand to rake across. Click once to wake the sound, then just move over it, like the
// garden's rake (hover alone draws). Level follows pointer speed; it goes quiet when you stop.
function SandPad({ picked, onPick }: { picked?: string; onPick: (k: SandKind) => void }) {
  const [kind, setKind] = useState<SandKind>('hiss')
  const [awake, setAwake] = useState(false)
  const voice = useRef<ReturnType<typeof sandVoice> | null>(null)
  const last = useRef<{ x: number; y: number; t: number } | null>(null)
  const idle = useRef(0)

  useEffect(() => {
    if (!awake) return
    voice.current = sandVoice(kind)
    return () => {
      voice.current?.stop()
      voice.current = null
    }
  }, [kind, awake])

  return (
    <section>
      <h2 className="font-display text-[20px] text-ink-primary">Rake the sand</h2>
      <p className="mt-1 text-[13px] text-ink-muted">
        Garden: a live sound while the rake moves, louder when you move faster. Not from the bank: made in the browser.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SANDS.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={kind === s.key}
            onClick={() => {
              setKind(s.key)
              setAwake(true)
              wake()
            }}
            className="sfx-press rounded-full border border-chip-line px-3.5 py-1.5 text-[13px]"
            style={{ background: kind === s.key ? 'var(--color-ink-primary)' : 'white', color: kind === s.key ? 'var(--color-page)' : 'var(--color-ink-primary)' }}
          >
            {s.label} <span className="opacity-60">· {s.note}</span>
          </button>
        ))}
        <button
          type="button"
          aria-pressed={picked === kind}
          onClick={() => onPick(kind)}
          className="sfx-press rounded-full px-3 py-1 text-[12px]"
          style={{
            background: picked === kind ? 'var(--color-accent-washi-blue)' : 'transparent',
            color: picked === kind ? 'var(--color-ink-primary)' : 'var(--color-ink-muted)',
            border: '1px solid var(--color-chip-line)',
          }}
        >
          {picked === kind ? 'Picked' : `Pick ${kind}`}
        </button>
      </div>
      <div
        className="mt-4 flex h-[180px] touch-none select-none items-center justify-center rounded-[var(--radius-plot-mobile)] text-[13px] text-ink-muted md:h-[220px] md:rounded-[var(--radius-plot)]"
        style={{ background: 'radial-gradient(ellipse at center, var(--color-sand-light), var(--color-sand-dark))', cursor: awake ? 'crosshair' : 'pointer' }}
        onPointerDown={() => {
          wake()
          setAwake(true)
        }}
        onPointerMove={(e) => {
          const v = voice.current
          if (!v) return
          const r = e.currentTarget.getBoundingClientRect()
          const now = e.timeStamp
          const p = last.current
          last.current = { x: e.clientX, y: e.clientY, t: now }
          if (!p || now - p.t > 120) return
          const speed = Math.hypot(e.clientX - p.x, e.clientY - p.y) / Math.max(1, now - p.t)
          v.move(speed, (e.clientX - r.left) / r.width)
          window.clearTimeout(idle.current)
          idle.current = window.setTimeout(() => v.rest(), 70)
        }}
        onPointerLeave={() => {
          last.current = null
          voice.current?.rest()
        }}
      >
        {awake ? 'Move across the sand' : 'Click to wake the sound, then move across'}
      </div>
    </section>
  )
}
