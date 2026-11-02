import type { Metadata } from 'next'

// Design exploration pages. Reachable by URL for review, but kept out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  return children
}
