'use client'

// Turns the site's sound effects on and off (src/lib/sfx.ts). The same choice is shared by every
// copy: the chip beside the shelf's broom, the phone bar and the footer (moved off the garden's
// tool rail and the bottom of the phone menu, Kai, 2026-11-07).
import { setMuted, useSoundOn } from '@/lib/sfx'

export default function SoundToggle({ className = '', iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  const on = useSoundOn()
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={iconOnly ? 'Sound effects' : undefined}
      title={iconOnly ? `Sound ${on ? 'on' : 'off'}` : undefined}
      onClick={() => setMuted(on)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3l4-3.5v12l-4-3.5H4z" />
        {on ? <path d="M15 9.2a4 4 0 0 1 0 5.6M17.6 6.8a7.5 7.5 0 0 1 0 10.4" /> : <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />}
      </svg>
      {!iconOnly && <span>sound {on ? 'on' : 'off'}</span>}
    </button>
  )
}
