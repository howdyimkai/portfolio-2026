import type { Metadata } from 'next'
import Harness from './Harness'

// Throwaway: phone menu shelf + how it holds case study chapters (2026-10-23). Delete after the pick.
export const metadata: Metadata = { title: 'Proto: phone menu', robots: { index: false, follow: false } }

export default function Page() {
  return <Harness />
}
