// PROTOTYPE — hover-motion variants for the Graphite felt icons (/proto/nav-hover).

export type Motion = 'pop' | 'drop' | 'sprout'

// Live-tuned from the control panel; read at the start of each drop, so no re-render.
export const dropCfg = {
  height: 72, // px above the resting spot it falls from
  gravity: 2600, // px/s²
  bounce: 0.32, // restitution: fraction of speed kept per bounce
  squash: 0.12, // scaleY loss at the hardest impact
  speed: 1, // playback multiplier (0.25 = quarter speed)
}

const reduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Simulate a ball drop with restitution and bake it into WAAPI keyframes. */
export function drop(el: HTMLElement) {
  if (reduced()) return
  const { height, gravity, bounce, squash, speed } = dropCfg
  const dt = 1 / 120
  let y = -height
  let v = 0
  let t = 0
  let lastImpact = -1
  let impactStrength = 0
  const vMax = Math.sqrt(2 * gravity * height)
  const frames: { t: number; y: number; s: number }[] = []
  for (let i = 0; i < 1200; i++) {
    v += gravity * dt
    y += v * dt
    if (y >= 0) {
      y = 0
      if (v < 60) {
        frames.push({ t, y: 0, s: 0 })
        break
      }
      impactStrength = v / vMax
      lastImpact = t
      v = -v * bounce
    }
    // Squash decays over ~70ms after each impact.
    const since = lastImpact < 0 ? Infinity : t - lastImpact
    const s = since < 0.07 ? squash * impactStrength * (1 - since / 0.07) : 0
    frames.push({ t, y, s })
    t += dt
  }
  const total = t
  el.getAnimations().forEach((a) => a.cancel())
  el.animate(
    frames.map((f) => ({
      offset: total ? f.t / total : 1,
      transform: `translateY(${f.y.toFixed(2)}px) scale(${(1 + f.s * 0.5).toFixed(3)}, ${(1 - f.s).toFixed(3)})`,
    })),
    { duration: (total * 1000) / speed, easing: 'linear' },
  )
}
