// PROTOTYPE — shadow-box nav hover motion. Delete with src/app/proto/nav-shelf.
// One static image per toy; everything here is transforms on that image's wrappers.

export type Mode = 'hop' | 'float' | 'tic'
export type Ease = 'spring' | 'snappy' | 'soft'
export type Tic = 'puff' | 'prance' | 'tip' | 'waddle' | 'spin'

export type Cfg = {
  lift: number // px the toy rises (1× shelf units)
  liftDeg: number // tilt at the top of the lift (−° = counter-clockwise, nose up for the pony)
  settleDeg: number // tilt on landing, should oppose liftDeg
  liftMs: number
  hangMs: number // hop only: pause at the top
  fallMs: number
  swingMs: number // each settle swing
  swings: number // 1 = settles once, 2+ = ping-pongs
  decay: number // each swing's angle × this
  ease: Ease
  bounce: number // spring only
  speed: number // duration multiplier denominator — 0.25 plays at quarter speed
}

export const DEFAULTS: Record<Mode, Cfg> = {
  hop: { lift: 16, liftDeg: -10, settleDeg: 5, liftMs: 300, hangMs: 40, fallMs: 220, swingMs: 130, swings: 2, decay: 0.5, ease: 'spring', bounce: 0.3, speed: 1 },
  float: { lift: 11, liftDeg: -6, settleDeg: 3, liftMs: 520, hangMs: 0, fallMs: 420, swingMs: 280, swings: 1, decay: 0.5, ease: 'soft', bounce: 0.3, speed: 1 },
  tic: { lift: 13, liftDeg: -8, settleDeg: 4, liftMs: 280, hangMs: 0, fallMs: 240, swingMs: 150, swings: 1, decay: 0.5, ease: 'snappy', bounce: 0.3, speed: 1 },
}

// Mutable live config, read at animation time so sliders never re-render the shelf.
export const cfg: Cfg = { ...DEFAULTS.hop }

const FALL = 'cubic-bezier(0.55, 0, 1, 0.45)' // gravity ease-in
const SWING = 'cubic-bezier(0.37, 0, 0.63, 1)' // even sine-like in-out

// Underdamped spring step response sampled into CSS linear(). bounce 0 = critically damped.
function springCurve(bounce: number) {
  const zeta = Math.max(0.05, 1 - bounce)
  const w = 6.9 / zeta // settles (to 0.1%) by t = 1
  const pts: string[] = []
  for (let i = 0; i <= 48; i++) {
    const t = i / 48
    let x: number
    if (zeta >= 1) x = 1 - Math.exp(-w * t) * (1 + w * t)
    else {
      const wd = w * Math.sqrt(1 - zeta * zeta)
      x = 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t))
    }
    pts.push(x.toFixed(3))
  }
  pts[pts.length - 1] = '1'
  return `linear(${pts.join(', ')})`
}

export function easeCss(c: Cfg) {
  if (c.ease === 'spring') return springCurve(c.bounce)
  if (c.ease === 'snappy') return 'cubic-bezier(0.23, 1, 0.32, 1)'
  return 'cubic-bezier(0.45, 0, 0.25, 1)'
}

type Pose = { ms: number; ty: number; r: number; easing?: string }

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const tf = (p: Pose) => `translateY(${p.ty}px) rotate(${p.r}deg)`
function shadowOf(ty: number, lift: number) {
  const k = lift > 0 ? Math.min(1, Math.max(0, -ty / lift)) : 0
  return { transform: `translateX(-50%) scale(${1 - 0.45 * k})`, opacity: 0.85 - 0.55 * k }
}

export type Rig = { toy: HTMLElement; inner: HTMLElement; shadow: HTMLElement; tic: Tic }

function play(rig: Rig, poses: Pose[], hold: boolean) {
  const total = poses[poses.length - 1].ms || 1
  // Start from wherever the toy is right now, so interrupting mid-hop never snaps.
  const fromToy = getComputedStyle(rig.toy).transform
  const fromShadow = getComputedStyle(rig.shadow)
  const toyFrames: Keyframe[] = poses.map((p, i) => ({
    offset: p.ms / total,
    transform: i === 0 && fromToy !== 'none' ? fromToy : tf(p),
    easing: p.easing ?? 'linear',
  }))
  const shFrames: Keyframe[] = poses.map((p, i) => ({
    offset: p.ms / total,
    ...(i === 0 ? { transform: fromShadow.transform, opacity: Number(fromShadow.opacity) } : shadowOf(p.ty, cfg.lift)),
    easing: p.easing ?? 'linear',
  }))
  rig.toy.getAnimations().forEach((a) => a.cancel())
  rig.shadow.getAnimations().forEach((a) => a.cancel())
  const opts: KeyframeAnimationOptions = { duration: total, fill: hold ? 'forwards' : 'none' }
  return [rig.toy.animate(toyFrames, opts), rig.shadow.animate(shFrames, opts)]
}

const sp = (ms: number) => ms / cfg.speed

function settlePoses(start: number): Pose[] {
  const out: Pose[] = []
  let t = start
  for (let i = 1; i < cfg.swings; i++) {
    t += sp(cfg.swingMs)
    out.push({ ms: t, ty: 0, r: cfg.settleDeg * Math.pow(-cfg.decay, i), easing: SWING })
  }
  out.push({ ms: t + sp(cfg.swingMs), ty: 0, r: 0 })
  return out
}

function hop(rig: Rig) {
  const lift = sp(cfg.liftMs)
  const hang = lift + sp(cfg.hangMs)
  const land = hang + sp(cfg.fallMs)
  play(
    rig,
    [
      { ms: 0, ty: 0, r: 0, easing: easeCss(cfg) },
      { ms: lift, ty: -cfg.lift, r: cfg.liftDeg },
      ...(cfg.hangMs > 0 ? [{ ms: hang, ty: -cfg.lift, r: cfg.liftDeg }] : []),
      { ms: land, ty: 0, r: cfg.settleDeg, easing: SWING },
      ...settlePoses(land),
    ].map((p, i, a) => (i > 0 && i < a.length - 1 && !p.easing ? { ...p, easing: FALL } : p)),
    false,
  )
}

// Idle loop while the toy is held up — a gentle bob, or the toy's own tic.
function idle(rig: Rig, mode: Mode) {
  const delay = sp(cfg.liftMs)
  const it: KeyframeAnimationOptions = { delay, iterations: Infinity }
  if (mode === 'float') {
    rig.inner.animate(
      [
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-2px) rotate(0.8deg)' },
        { transform: 'translateY(0) rotate(0)' },
      ],
      { ...it, duration: sp(1800), easing: SWING },
    )
    return
  }
  const T = {
    // cloud: breathes in and out like it's puffing up
    puff: { d: 1400, k: [{ transform: 'scale(1, 1)' }, { transform: 'scale(1.07, 0.95)', offset: 0.35 }, { transform: 'scale(0.97, 1.04)', offset: 0.65 }, { transform: 'scale(1, 1)' }] },
    // pony: two quick prancing hops, then a beat
    prance: {
      d: 1300,
      k: [
        { transform: 'translateY(0) rotate(0)', offset: 0 },
        { transform: 'translateY(-3px) rotate(-4deg)', offset: 0.12 },
        { transform: 'translateY(0) rotate(1deg)', offset: 0.24 },
        { transform: 'translateY(-3px) rotate(-4deg)', offset: 0.36 },
        { transform: 'translateY(0) rotate(0)', offset: 0.5 },
        { transform: 'translateY(0) rotate(0)', offset: 1 },
      ],
    },
    // hat: tips its brim, holds, rights itself
    tip: { d: 1700, k: [{ transform: 'rotate(0)', offset: 0 }, { transform: 'translateY(-2px) rotate(-14deg)', offset: 0.2 }, { transform: 'translateY(-2px) rotate(-14deg)', offset: 0.45 }, { transform: 'rotate(0)', offset: 0.65 }, { transform: 'rotate(0)', offset: 1 }] },
    // pencil: waddles on its little legs
    waddle: { d: 520, k: [{ transform: 'rotate(0) translateX(0)' }, { transform: 'rotate(-5deg) translateX(-1px)', offset: 0.25 }, { transform: 'rotate(0) translateX(0)', offset: 0.5 }, { transform: 'rotate(5deg) translateX(1px)', offset: 0.75 }, { transform: 'rotate(0) translateX(0)' }] },
    // star: coin-flip spin, then a twinkle pause
    spin: { d: 1600, k: [{ transform: 'rotateY(0deg)', offset: 0 }, { transform: 'rotateY(360deg)', offset: 0.5 }, { transform: 'rotateY(360deg)', offset: 1 }] },
  }[rig.tic]
  rig.inner.animate(T.k, { ...it, duration: sp(T.d), easing: rig.tic === 'spin' ? 'cubic-bezier(0.45, 0, 0.25, 1)' : SWING })
}

function stopIdle(rig: Rig) {
  const from = getComputedStyle(rig.inner).transform
  rig.inner.getAnimations().forEach((a) => a.cancel())
  if (from !== 'none') rig.inner.animate([{ transform: from }, { transform: 'none' }], { duration: 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
}

export function enter(rig: Rig, mode: Mode) {
  if (reduced()) {
    rig.toy.style.transform = `translateY(${-cfg.lift / 2}px)`
    return
  }
  if (mode === 'hop') return hop(rig)
  play(rig, [{ ms: 0, ty: 0, r: 0, easing: easeCss(cfg) }, { ms: sp(cfg.liftMs), ty: -cfg.lift, r: cfg.liftDeg }], true)
  idle(rig, mode)
}

export function leave(rig: Rig, mode: Mode) {
  if (reduced()) {
    rig.toy.style.transform = ''
    return
  }
  if (mode === 'hop') return // the hop finishes on its own
  stopIdle(rig)
  const land = sp(cfg.fallMs)
  play(rig, [{ ms: 0, ty: -cfg.lift, r: cfg.liftDeg, easing: FALL }, { ms: land, ty: 0, r: cfg.settleDeg, easing: SWING }, ...settlePoses(land)], false)
}

// Touch has no hover: a tap plays one full hop in every variant.
export const tap = (rig: Rig) => (reduced() ? undefined : hop(rig))
