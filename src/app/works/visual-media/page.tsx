import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { visualMedia } from '@/content/case-studies/visual-media'

export const metadata: Metadata = {
  title: 'Storytelling, video, motion',
  description: visualMedia.hook,
}

export default function VisualMediaPage() {
  return <CaseStudyPage study={visualMedia} />
}
