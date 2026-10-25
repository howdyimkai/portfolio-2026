import type { ReactNode } from 'react'

// Paragraph text with two bits of inline markup: `code` spans and [text](url) links. Nothing else
// is parsed, so ordinary copy passes through untouched.
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g

export default function Inline({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    if (m[1] !== undefined) {
      out.push(
        <code key={at} className="rounded-[4px] bg-tag px-1.5 py-0.5 font-mono text-[0.9em] text-ink-primary [overflow-wrap:anywhere]">
          {m[1]}
        </code>,
      )
    } else {
      const href = m[3]
      const external = /^https?:/.test(href)
      out.push(
        <a
          key={at}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-ink-primary underline decoration-hairline underline-offset-4 hover:decoration-ink-primary"
        >
          {m[2]}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>,
      )
    }
    last = at + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}
