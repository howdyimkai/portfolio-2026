'use client'

import { useEffect, useRef, useState } from 'react'
import { play } from '@/lib/sfx'

// Copies the address, like the phone menu's contact block. No address on the page or in the markup:
// it's assembled on click so scrapers don't find it.
export default function SayHowdy({ className = 'rs-btn' }: { className?: string } = {}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    void play('copy')
    const email = ['uxdesignerkaitran', 'gmail.com'].join('@')
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const t = document.createElement('textarea')
      t.value = email
      document.body.append(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button type="button" className={className} onClick={copy}>
      {/* Both labels share one grid cell, so the button keeps its width when the text swaps. */}
      <span className="inline-grid text-center">
        <span className={`[grid-area:1/1] ${copied ? 'invisible' : ''}`}>Copy email</span>
        <span className={`[grid-area:1/1] ${copied ? '' : 'invisible'}`} aria-hidden="true">Copied</span>
      </span>
      <span role="status" aria-live="polite" className="sr-only">{copied ? 'Email address copied' : ''}</span>
    </button>
  )
}
