'use client'

import { useState } from 'react'
import ShelfNav from '@/components/shelf/ShelfNav'

// Starts lit on humble abode; picking a cubby swings the spotlight over without leaving the page.
export default function NavPiece() {
  const [active, setActive] = useState('/')
  return <ShelfNav activeHref={active} onSelect={setActive} />
}
