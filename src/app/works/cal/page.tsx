import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { cal } from '@/content/case-studies/cal'

// Unlisted until Tallo OKs public use (sprint plan, 2026-10-20): not linked from /works and kept
// out of search, so it can go to reviewers as a private link.
export const metadata: Metadata = {
  title: "Cal's Career Quiz",
  description: cal.hook,
  robots: { index: false, follow: false },
}

export default function CalPage() {
  return <CaseStudyPage study={cal} />
}
