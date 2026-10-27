import type { Metadata } from 'next'
import Resume from '@/components/resume/Resume'
import '@/components/resume/resume.css'

export const metadata: Metadata = { title: 'Résumé' }

// A plain, linkable copy of the résumé the bookmark opens, with the draft's longer online-only
// section (speaking with titles and links, awards, community). The bookmark itself isn't shown
// here; this page is the résumé.
export default function ResumePage() {
  return (
    <div className="rs-page">
      <Resume titleId="resume-title" online />
    </div>
  )
}
