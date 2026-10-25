import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { brandSystem } from '@/content/case-studies/brand-system'

// Kept out of search like Cal, until Tallo OKs public use (the testimonial and the inherited
// swatch page are still waiting on approval).
export const metadata: Metadata = {
  title: 'Tallo Brand System',
  description: brandSystem.hook,
  robots: { index: false, follow: false },
}

export default function BrandSystemPage() {
  return <CaseStudyPage study={brandSystem} />
}
