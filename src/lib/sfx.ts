// Sound effects: earshot bank renders picked on /proto/sfx (2026-11-02, decision record in
// design-intent/sfx-exploration/NOTES.md), plus the rake's sand, which is synthesized live.
// Sound only follows things a visitor chooses to do. Nothing loads or plays until their first
// click (browsers keep audio silent until a gesture anyway), and the mute choice is remembered.
import { useSyncExternalStore } from 'react'

const FILES = {
  tool: 'tool',
  reveal: 'reveal',
  broom: 'broom',
  bookmark: 'bookmark',
  copy: 'copy',
  'blossom-C5': 'blossom-C5',
  'blossom-D5': 'blossom-D5',
  'blossom-E5': 'blossom-E5',
  'blossom-G5': 'blossom-G5',
  'blossom-A5': 'blossom-A5',
} as const
export type Sfx = keyof typeof FILES

// Per sound level under the master. The bank renders everything to -1 dBFS peak.
const GAIN: Partial<Record<Sfx, number>> = { reveal: 0.7, broom: 0.8, tool: 0.9 }
const MASTER = 0.5
const STORE = 'sfx-muted'

let ctx: AudioContext | null = null
let master: GainNode | null = null
const buffers = new Map<Sfx, Promise<AudioBuffer | null>>()

// ---- Mute (shared by every toggle on the page) ----

let muted: boolean | null = null
const listeners = new Set<() => void>()

function isMuted() {
  if (muted === null) {
    try {
      muted = localStorage.getItem(STORE) === '1'
    } catch {
      muted = false
    }
  }
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  try {
    localStorage.setItem(STORE, next ? '1' : '0')
  } catch {}
  if (ctx && master) master.gain.setTargetAtTime(next ? 0 : MASTER, ctx.currentTime, 0.03)
  listeners.forEach((l) => l())
}

export function useSoundOn() {
  return !useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    isMuted,
    () => false,
  )
}

// ---- Playback ----

// Call from a click or key handler: the first one creates the context and fetches every sound.
function wake() {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = isMuted() ? 0 : MASTER
    master.connect(ctx.destination)
    for (const k of Object.keys(FILES) as Sfx[]) load(k)
  }
  // iOS parks the context as 'interrupted' (not 'suspended') after the phone locks, a call comes in
  // or Safari goes to the background, and it stays silent until resumed from a tap.
  if (ctx.state !== 'running') void ctx.resume()
  return ctx
}

function load(name: Sfx) {
  let p = buffers.get(name)
  if (!p && ctx) {
    const c = ctx
    p = fetch(`/sfx/${FILES[name]}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((b) => c.decodeAudioData(b))
      .catch(() => null)
    buffers.set(name, p)
  }
  return p
}

// fromGesture: false for sounds that follow a timer (the reveal), which may not start the audio.
export async function play(name: Sfx, { rate = 1, fromGesture = true } = {}) {
  const c = fromGesture ? wake() : ctx
  if (!c || !master || isMuted()) return
  const buf = await load(name)
  if (!buf) return
  const src = c.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = rate
  const g = c.createGain()
  g.gain.value = GAIN[name] ?? 1
  src.connect(g).connect(master)
  src.start()
}

// The blossom stamp walks C pentatonic, one note per stamp, so a few stamps make a tune.
const NOTES = ['C5', 'D5', 'E5', 'G5', 'A5'] as const
let note = 0
export function playBlossom() {
  void play(`blossom-${NOTES[note]}`)
  note = (note + 1) % NOTES.length
}

// ---- Sand (the rake) ----

// Looping white noise through a band pass ("Hiss" on /proto/sfx). Its level and brightness follow
// the head's speed, and it rests at silence whenever the head stops. The eraser smooths the sand
// rather than combing it, so its hiss is quieter and lower (Kai, 2026-11-02).
const SAND = {
  rake: { level: 0.35, f: 3800 },
  eraser: { level: 0.2, f: 2200 },
}
const SAND_TOP_SPEED = 1.6 // px/ms of head travel that reaches full level

export type SandVoice = { move: (speed: number, x: number) => void; rest: () => void; stop: () => void }

export function sandVoice(tool: keyof typeof SAND): SandVoice | null {
  const { level, f } = SAND[tool]
  const c = wake()
  if (!c || !master) return null
  const len = c.sampleRate * 2
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = f
  filter.Q.value = 0.8
  const pan = c.createStereoPanner()
  const g = c.createGain()
  g.gain.value = 0
  src.connect(filter).connect(pan).connect(g).connect(master)
  src.start()
  return {
    move(speed, x) {
      const t = c.currentTime
      const s = Math.min(1, speed / SAND_TOP_SPEED)
      g.gain.setTargetAtTime(s * level, t, 0.04)
      filter.frequency.setTargetAtTime(f * (0.8 + s * 0.4), t, 0.05)
      src.playbackRate.setTargetAtTime(0.75 + s * 0.5, t, 0.05)
      pan.pan.setTargetAtTime((x - 0.5) * 0.6, t, 0.05)
    },
    rest() {
      g.gain.setTargetAtTime(0, c.currentTime, 0.08)
    },
    stop() {
      g.gain.setTargetAtTime(0, c.currentTime, 0.05)
      src.stop(c.currentTime + 0.3)
    },
  }
}
