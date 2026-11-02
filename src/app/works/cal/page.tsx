import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { cal } from '@/content/case-studies/cal'

// Linked from the Tallo card on /works (2026-10-20). Public and indexed since 2026-11-02 (Kai).
export const metadata: Metadata = {
  title: "Cal's Career Quiz",
  description: cal.hook,
}

export default function CalPage() {
  return <CaseStudyPage study={cal} />
}
