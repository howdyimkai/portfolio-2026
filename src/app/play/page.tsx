import type { Metadata } from 'next'
import PlayGrid from '@/components/play/PlayGrid'

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Interactions, concept roasts and illustrations by Kai Tran.',
}

// White grid paper and the shelf nav like /works (AppShell), then the title and the tiles.
export default function PlayPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
      <PlayGrid />
    </div>
  )
}
