import type { ReactNode } from 'react'
import './stray.css'

// The 404 and error pages: one felt toy, a line of what happened and the way back, centered on the
// grid paper under the shelf (AppShell). The actions come in as children (sp-btn, sp-btn-primary).
export default function StrayPage({ toy, title, line, children }: { toy: { src: string; w: number; h: number; width: number }; title: string; line: string; children: ReactNode }) {
  return (
    <section className="sp">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="sp-toy" src={toy.src} alt="" width={toy.w} height={toy.h} style={{ width: toy.width }} draggable={false} />
      <h1 className="sp-title">{title}</h1>
      <p className="sp-line">{line}</p>
      <div className="sp-actions">{children}</div>
    </section>
  )
}
