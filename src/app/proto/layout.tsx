import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Design exploration pages. Reachable by URL for review (locally and on Vercel previews), but kept
// out of search, and a 404 on the production deployment so the live site never serves them.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.VERCEL_ENV === 'production') notFound()
  return children
}
