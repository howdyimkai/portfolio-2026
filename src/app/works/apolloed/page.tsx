import type { Metadata } from 'next'
import CaseStudyPage from '@/components/case-study/CaseStudyPage'
import { apolloed } from '@/content/case-studies/apolloed'

// Unlisted until Kai says so: noindex, and not in the sitemap.
export const metadata: Metadata = {
  title: 'ApolloEd',
  description: apolloed.hook,
  robots: { index: false, follow: false },
}

export default function ApolloEdPage() {
  return <CaseStudyPage study={apolloed} />
}
