'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import StrayPage from '@/components/stray/StrayPage'

// A page that throws while rendering: the cassette with its tape pulled out, and a retry. It renders
// inside AppShell, so the shelf and footer stay.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StrayPage
      toy={{ src: '/about/cassette-open.webp', w: 454, h: 366, width: 156 }}
      title="Something got tangled."
      line="This page hit a snag while loading. Try it again, and if it keeps happening, say howdy."
    >
      <button type="button" onClick={() => reset()} className="sp-btn sp-btn-primary">Try again</button>
      <Link href="/" className="sp-btn">Back home</Link>
    </StrayPage>
  )
}
