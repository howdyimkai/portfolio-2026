import type { Metadata } from 'next'
import Link from 'next/link'
import StrayPage from '@/components/stray/StrayPage'

export const metadata: Metadata = { title: 'Page not found' }

// Any unknown path: the shelf's pony, wandered off.
export default function NotFound() {
  return (
    <StrayPage
      toy={{ src: '/nav/shelf/pony.webp', w: 385, h: 395, width: 132 }}
      title="This page wandered off."
      line="The link might be old, or the page moved to a new spot on the shelf."
    >
      <Link href="/" className="sp-btn sp-btn-primary">Back home</Link>
      <Link href="/works" className="sp-btn">See selected works</Link>
    </StrayPage>
  )
}
