'use client'

// PROTOTYPE — shadow-box nav hover comparison. Delete with src/app/proto/nav-shelf.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Shelf from './Shelf'
import { cfg, DEFAULTS, easeCss, type Cfg, type Ease, type Mode } from './motion'
import '../nav/proto.css'
import './shelf.css'

const VARIANTS: { name: string; mode: Mode }[] = [
  { name: 'Hop', mode: 'hop' },
  { name: 'Float', mode: 'float' },
  { name: 'Tic', mode: 'tic' },
]

type Dial = { key: keyof Cfg; label: string; min: number; max: number; step: number; unit: string; only?: Mode[] }
const DIALS: { group: string; dials: Dial[] }[] = [
  {
    group: 'Lift',
    dials: [
      { key: 'lift', label: 'Lift height', min: 0, max: 40, step: 1, unit: 'px' },
      { key: 'liftDeg', label: 'Tilt on lift', min: -25, max: 25, step: 0.5, unit: '°' },
      { key: 'liftMs', label: 'Lift duration', min: 80, max: 900, step: 10, unit: 'ms' },
      { key: 'hangMs', label: 'Hang at top', min: 0, max: 400, step: 10, unit: 'ms', only: ['hop'] },
    ],
  },
  {
    group: 'Settle',
    dials: [
      { key: 'settleDeg', label: 'Tilt on settle', min: -15, max: 15, step: 0.5, unit: '°' },
      { key: 'fallMs', label: 'Fall duration', min: 80, max: 700, step: 10, unit: 'ms' },
      { key: 'swings', label: 'Settle swings', min: 1, max: 5, step: 1, unit: '' },
      { key: 'swingMs', label: 'Swing duration', min: 60, max: 500, step: 10, unit: 'ms' },
      { key: 'decay', label: 'Swing decay', min: 0.2, max: 0.9, step: 0.05, unit: '×' },
    ],
  },
  {
    group: 'Star',
    dials: [{ key: 'starGlint', label: 'Glint', min: 0, max: 1, step: 0.05, unit: '', only: ['tic'] }],
  },
]

function Panel({ mode, onZoom, zoom }: { mode: Mode; zoom: number; onZoom: (z: number) => void }) {
  const [, force] = useState(0)
  const set = (k: keyof Cfg, v: number | string) => {
    ;(cfg as Record<string, unknown>)[k] = v
    force((n) => n + 1)
  }
  const summary = [
    ...DIALS.flatMap((g) => g.dials.filter((d) => !d.only || d.only.includes(mode)).map((d) => `${d.key}: ${cfg[d.key]}${d.unit}`)),
    `ease: ${cfg.ease === 'spring' ? `spring(bounce ${cfg.bounce})` : easeCss(cfg)}`,
  ].join(' · ')

  return (
    <div className="proto-controls" aria-label="Motion controls">
      <p className="hint">
        {mode === 'hop' ? 'Hover a cubby — the toy hops once.' : 'Hover to hold the toy up; leave to drop it.'} Pony is the reference.
      </p>
      <label>
        <span>Zoom</span>
        <output>{zoom}×</output>
        <input type="range" min={1} max={3} step={0.5} value={zoom} onChange={(e) => onZoom(Number(e.target.value))} />
      </label>
      <label>
        <span>Speed</span>
        <output>{cfg.speed}×</output>
        <select value={cfg.speed} onChange={(e) => set('speed', Number(e.target.value))}>
          <option value={1}>1×</option>
          <option value={0.5}>0.5×</option>
          <option value={0.25}>0.25×</option>
          <option value={0.1}>0.1×</option>
        </select>
      </label>
      <label>
        <span>Lift easing</span>
        <output>{cfg.ease}</output>
        <select value={cfg.ease} onChange={(e) => set('ease', e.target.value as Ease)}>
          <option value="spring">Spring (overshoots)</option>
          <option value="snappy">Snappy ease-out</option>
          <option value="soft">Soft ease-in-out</option>
        </select>
      </label>
      {cfg.ease === 'spring' && (
        <label>
          <span>Spring bounce</span>
          <output>{cfg.bounce}</output>
          <input type="range" min={0} max={0.7} step={0.05} value={cfg.bounce} onChange={(e) => set('bounce', Number(e.target.value))} />
        </label>
      )}
      {DIALS.filter((g) => g.dials.some((d) => !d.only || d.only.includes(mode))).map((g) => (
        <div key={g.group}>
          <p className="group">{g.group}</p>
          {g.dials
            .filter((d) => !d.only || d.only.includes(mode))
            .map((d) => (
              <label key={d.key}>
                <span>
                  {d.label}
                  {d.key === 'swings' && <> ({cfg.swings === 1 ? 'once' : 'ping-pong'})</>}
                </span>
                <output>
                  {cfg[d.key]}
                  {d.unit}
                </output>
                <input type="range" min={d.min} max={d.max} step={d.step} value={cfg[d.key] as number} onChange={(e) => set(d.key, Number(e.target.value))} />
              </label>
            ))}
        </div>
      ))}
      <div className="row">
        <button onClick={() => navigator.clipboard?.writeText(summary)}>Copy values</button>
        <button
          onClick={() => {
            Object.assign(cfg, DEFAULTS[mode])
            force((n) => n + 1)
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default function Harness() {
  const [current, setCurrent] = useState(0)
  const [nonce, setNonce] = useState(0)
  const [ready, setReady] = useState(false)
  const [zoom, setZoom] = useState(2)
  const hlRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const moveHighlight = useCallback(() => {
    const el = itemRefs.current[current]
    const hl = hlRef.current
    if (!el || !hl) return
    hl.style.width = el.offsetWidth + 'px'
    hl.style.transform = `translateX(${el.offsetLeft}px)`
  }, [current])

  const setActiveVariant = useCallback((i: number) => {
    if (i < 0 || i >= VARIANTS.length) return
    Object.assign(cfg, DEFAULTS[VARIANTS[i].mode])
    setCurrent(i)
    const url = new URL(location.href)
    url.searchParams.set('v', String(i + 1))
    history.replaceState(null, '', url)
    setNonce((n) => n + 1)
  }, [])

  useEffect(() => {
    const v = parseInt(new URLSearchParams(location.search).get('v') || '', 10)
    const i = v >= 1 && v <= VARIANTS.length ? v - 1 : 0
    Object.assign(cfg, DEFAULTS[VARIANTS[i].mode])
    setCurrent(i)
    setNonce((n) => n + 1)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [])

  useLayoutEffect(() => {
    moveHighlight()
    window.addEventListener('resize', moveHighlight)
    return () => window.removeEventListener('resize', moveHighlight)
  }, [moveHighlight])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = parseInt(e.key, 10)
      if (n >= 1 && n <= VARIANTS.length) setActiveVariant(n - 1)
      else if (e.key === 'ArrowRight') setActiveVariant((current + 1) % VARIANTS.length)
      else if (e.key === 'ArrowLeft') setActiveVariant((current - 1 + VARIANTS.length) % VARIANTS.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [current, setActiveVariant])

  const mode = VARIANTS[current].mode
  return (
    <div className="proto-stage shelf-stage bg-page" style={{ '--zoom': zoom } as React.CSSProperties}>
      <div className="shelf-frame">
        <Shelf key={`${current}-${nonce}`} mode={mode} />
      </div>

      <Panel key={`${current}-${nonce}`} mode={mode} zoom={zoom} onZoom={setZoom} />

      <nav className="proto-picker" aria-label="Prototype variants" data-ready={ready ? '' : undefined}>
        <span ref={hlRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="proto-picker-item"
            data-active={i === current ? '' : undefined}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => setActiveVariant(i)}
          >
            {v.name}
          </button>
        ))}
      </nav>
    </div>
  )
}
