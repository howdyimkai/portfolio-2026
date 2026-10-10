// Shelf nav toy motion — the "Tic" variant picked from /proto/nav-shelf (2026-10-10).
// One static image per toy; everything here is WAAPI transforms on that image's wrappers.
// Hover lifts the toy and holds it while it plays its own tic; leave drops it with an
// opposite-tilt settle. Touch has no hover, so a tap plays one hop.

export type Tic = 'puff' | 'prance' | 'tip' | 'waddle' | 'spin'

export type Rig = { toy: HTMLElement; inner: HTMLElement; shadow: HTMLElement; tic: Tic }

const LIFT = 13 // px (1× shelf units)
const LIFT_DEG = -8
const SETTLE_DEG = 4
const LIFT_MS = 280
const FALL_MS = 240
const SWING_MS = 150
const STAR_GLINT = 0.35 // brightness flash as the star lands face-on

const LIFT_EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'
const FALL = 'cubic-bezier(0.55, 0, 1, 0.45)' // gravity ease-in
const SWING = 'cubic-bezier(0.37, 0, 0.63, 1)' // even sine-like in-out

type Pose = { ms: number; ty: number; r: number; easing?: string }

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const tf = (p: Pose) => `translateY(${p.ty}px) rotate(${p.r}deg)`
function shadowOf(ty: number) {
  const k = Math.min(1, Math.max(0, -ty / LIFT))
  return { transform: `translateX(-50%) scale(${1 - 0.45 * k})`, opacity: 0.85 - 0.55 * k }
}

function play(rig: Rig, poses: Pose[], hold: boolean) {
  const total = poses[poses.length - 1].ms || 1
  // Start from wherever the toy is right now, so interrupting mid-move never snaps.
  const fromToy = getComputedStyle(rig.toy).transform
  const fromShadow = getComputedStyle(rig.shadow)
  const toyFrames: Keyframe[] = poses.map((p, i) => ({
    offset: p.ms / total,
    transform: i === 0 && fromToy !== 'none' ? fromToy : tf(p),
    easing: p.easing ?? 'linear',
  }))
  const shFrames: Keyframe[] = poses.map((p, i) => ({
    offset: p.ms / total,
    ...(i === 0 ? { transform: fromShadow.transform, opacity: Number(fromShadow.opacity) } : shadowOf(p.ty)),
    easing: p.easing ?? 'linear',
  }))
  rig.toy.getAnimations().forEach((a) => a.cancel())
  rig.shadow.getAnimations().forEach((a) => a.cancel())
  const opts: KeyframeAnimationOptions = { duration: total, fill: hold ? 'forwards' : 'none' }
  rig.toy.animate(toyFrames, opts)
  rig.shadow.animate(shFrames, opts)
}

const settle = (land: number): Pose => ({ ms: land + SWING_MS, ty: 0, r: 0 })

const TICS: Record<Tic, { d: number; k: Keyframe[]; easing: string }> = {
  // cloud: breathes in and out like it's puffing up
  puff: {
    d: 1400,
    easing: SWING,
    k: [{ transform: 'scale(1, 1)' }, { transform: 'scale(1.07, 0.95)', offset: 0.35 }, { transform: 'scale(0.97, 1.04)', offset: 0.65 }, { transform: 'scale(1, 1)' }],
  },
  // pony: two quick prancing hops, then a beat
  prance: {
    d: 1300,
    easing: SWING,
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
  tip: {
    d: 1700,
    easing: SWING,
    k: [
      { transform: 'rotate(0)', offset: 0 },
      { transform: 'translateY(-2px) rotate(-14deg)', offset: 0.2 },
      { transform: 'translateY(-2px) rotate(-14deg)', offset: 0.45 },
      { transform: 'rotate(0)', offset: 0.65 },
      { transform: 'rotate(0)', offset: 1 },
    ],
  },
  // pencil: waddles on its little legs
  waddle: {
    d: 520,
    easing: SWING,
    k: [
      { transform: 'rotate(0) translateX(0)' },
      { transform: 'rotate(-5deg) translateX(-1px)', offset: 0.25 },
      { transform: 'rotate(0) translateX(0)', offset: 0.5 },
      { transform: 'rotate(5deg) translateX(1px)', offset: 0.75 },
      { transform: 'rotate(0) translateX(0)' },
    ],
  },
  // star: coin-flip spin, then a twinkle pause
  spin: {
    d: 1600,
    easing: 'cubic-bezier(0.45, 0, 0.25, 1)',
    k: [{ transform: 'rotateY(0deg)', offset: 0 }, { transform: 'rotateY(360deg)', offset: 0.5 }, { transform: 'rotateY(360deg)', offset: 1 }],
  },
}

// Idle loop while the toy is held up.
function idle(rig: Rig) {
  const T = TICS[rig.tic]
  const it: KeyframeAnimationOptions = { delay: LIFT_MS, iterations: Infinity, duration: T.d }
  rig.inner.animate(T.k, { ...it, easing: T.easing })
  // star: a shine flash as it lands face-on after the spin
  if (rig.tic === 'spin')
    rig.inner.firstElementChild?.animate(
      [
        { filter: 'brightness(1)', offset: 0 },
        { filter: 'brightness(1)', offset: 0.47 },
        { filter: `brightness(${1 + STAR_GLINT})`, offset: 0.53 },
        { filter: 'brightness(1)', offset: 0.66 },
        { filter: 'brightness(1)', offset: 1 },
      ],
      it,
    )
}

function stopIdle(rig: Rig) {
  const from = getComputedStyle(rig.inner).transform
  rig.inner.getAnimations({ subtree: true }).forEach((a) => a.cancel())
  if (from !== 'none') rig.inner.animate([{ transform: from }, { transform: 'none' }], { duration: 160, easing: LIFT_EASE })
}

export function enter(rig: Rig) {
  if (reduced()) return
  play(rig, [{ ms: 0, ty: 0, r: 0, easing: LIFT_EASE }, { ms: LIFT_MS, ty: -LIFT, r: LIFT_DEG }], true)
  idle(rig)
}

export function leave(rig: Rig) {
  if (reduced()) return
  stopIdle(rig)
  play(rig, [{ ms: 0, ty: -LIFT, r: LIFT_DEG, easing: FALL }, { ms: FALL_MS, ty: 0, r: SETTLE_DEG, easing: SWING }, settle(FALL_MS)], false)
}

// Touch has no hover: a tap plays one lift-and-drop.
export function tap(rig: Rig) {
  if (reduced()) return
  play(
    rig,
    [
      { ms: 0, ty: 0, r: 0, easing: LIFT_EASE },
      { ms: LIFT_MS, ty: -LIFT, r: LIFT_DEG, easing: FALL },
      { ms: LIFT_MS + FALL_MS, ty: 0, r: SETTLE_DEG, easing: SWING },
      settle(LIFT_MS + FALL_MS),
    ],
    false,
  )
}
