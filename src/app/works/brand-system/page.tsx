import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { brandSystem } from '@/content/case-studies/brand-system'

// Public and indexed since 2026-11-02 (Kai), like Cal.
export const metadata: Metadata = {
  title: 'Tallo Brand System',
  description: brandSystem.hook,
}

export default function BrandSystemPage() {
  return <CaseStudyPage study={brandSystem} />
}
