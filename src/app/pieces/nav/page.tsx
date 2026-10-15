import type { Metadata } from 'next'
import NavPiece from './NavPiece'
import './piece.css'

// One piece of the portfolio on its own: the shelf nav, centered on bare page,
// no garden or footer around it. AppShell renders /pieces/* without site chrome.
export const metadata: Metadata = {
  title: 'Shelf nav',
  robots: { index: false },
}

export default function Page() {
  return (
    <div className="piece-stage">
      <NavPiece />
    </div>
  )
}
