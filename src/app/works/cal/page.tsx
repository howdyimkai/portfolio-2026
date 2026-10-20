import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { cal } from '@/content/case-studies/cal'

// Linked from the Tallo card on /works (2026-10-20), but still kept out of search until Tallo OKs
// public use.
export const metadata: Metadata = {
  title: "Cal's Career Quiz",
  description: cal.hook,
  robots: { index: false, follow: false },
}

export default function CalPage() {
  return <CaseStudyPage study={cal} />
}
