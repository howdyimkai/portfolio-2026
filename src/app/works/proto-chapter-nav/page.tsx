import type { Metadata } from 'next'
import Harness from './Harness'

// Throwaway: phone chapter nav directions for the case study (2026-10-23). Delete after the pick.
export const metadata: Metadata = { title: 'Proto: phone chapter nav', robots: { index: false, follow: false } }

export default function Page() {
  return <Harness />
}
