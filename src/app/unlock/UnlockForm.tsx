'use client'

import { useActionState } from 'react'
import { unlock, type UnlockState } from './actions'

const INITIAL: UnlockState = { error: null }

export default function UnlockForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(unlock, INITIAL)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="unlock-password" className="text-[13px] text-ink-primary">
        Password
      </label>
      {/* 16px so iOS Safari doesn't zoom the page on focus. */}
      <input
        id="unlock-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? 'unlock-error' : undefined}
        className="h-11 rounded-lg border border-chip-line bg-white px-3 text-[16px] text-ink-primary outline-none transition-[border-color] duration-150 focus:border-accent-washi-blue"
      />
      <p id="unlock-error" role="alert" className="min-h-[1.25rem] text-[13px] text-accent-orange">
        {state.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="press-scale h-11 rounded-lg bg-ink-primary text-[14px] text-white disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Come in'}
      </button>
    </form>
  )
}
