// PROTOTYPE audio engine for /proto/sfx. One AudioContext, woken by the first click (browsers keep
// audio silent until a gesture), every sound decoded once and played as a one-shot buffer.
// The sand voice is synthesized live: looping noise through a filter, its level following speed.

let ctx: AudioContext | null = null
let master: GainNode | null = null
const buffers = new Map<string, Promise<AudioBuffer>>()

export function wake() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.6
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setVolume(v: number) {
  if (master && ctx) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02)
}

function load(name: string) {
  const c = wake()
  let p = buffers.get(name)
  if (!p) {
    p = fetch(`/proto/sfx/${name}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((b) => c.decodeAudioData(b))
    buffers.set(name, p)
  }
  return p
}

export function preload(names: string[]) {
  for (const n of names) void load(n)
}

export async function play(name: string, { rate = 1, gain = 1 } = {}) {
  const c = wake()
  const buf = await load(name)
  const src = c.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = rate
  const g = c.createGain()
  g.gain.value = gain
  src.connect(g).connect(master!)
  src.start()
}

// ---- Sand (the rake) ----

export type SandKind = 'hiss' | 'grain' | 'brush'

function noiseBuffer(c: AudioContext, kind: SandKind) {
  const len = c.sampleRate * 2
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  if (kind === 'grain') {
    // Sparse tiny clicks with short decays: grains of sand ticking past the tines.
    const perSec = 900
    for (let i = 0; i < perSec * 2; i++) {
      const at = Math.floor(Math.random() * len)
      const amp = 0.3 + Math.random() * 0.7
      const decay = 20 + Math.random() * 60
      for (let k = 0; k < 200 && at + k < len; k++) d[at + k] += amp * (Math.random() * 2 - 1) * Math.exp(-k / decay)
    }
    for (let i = 0; i < len; i++) d[i] = d[i] * 0.5 + (Math.random() * 2 - 1) * 0.05
  } else {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  }
  return buf
}

const SAND: Record<SandKind, { type: BiquadFilterType; f: number; q: number; level: number }> = {
  hiss: { type: 'bandpass', f: 3800, q: 0.8, level: 0.35 },
  grain: { type: 'bandpass', f: 2600, q: 0.9, level: 0.9 },
  brush: { type: 'bandpass', f: 900, q: 0.6, level: 0.55 },
}

export function sandVoice(kind: SandKind) {
  const c = wake()
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c, kind)
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = SAND[kind].type
  filter.frequency.value = SAND[kind].f
  filter.Q.value = SAND[kind].q
  const pan = c.createStereoPanner()
  const g = c.createGain()
  g.gain.value = 0
  src.connect(filter).connect(pan).connect(g).connect(master!)
  src.start()
  const base = SAND[kind]
  return {
    // speed in px/ms; x in 0..1 across the pad
    move(speed: number, x: number) {
      const t = c.currentTime
      const s = Math.min(1, speed / 1.6)
      g.gain.setTargetAtTime(s * base.level, t, 0.04)
      filter.frequency.setTargetAtTime(base.f * (0.8 + s * 0.4), t, 0.05)
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
