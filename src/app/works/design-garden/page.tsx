import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { designGarden } from '@/content/case-studies/design-garden'

export const metadata: Metadata = {
  title: 'Design Garden',
  description: designGarden.hook,
}

export default function DesignGardenPage() {
  return <CaseStudyPage study={designGarden} />
}
