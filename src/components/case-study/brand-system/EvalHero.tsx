import { Fragment, type ReactNode } from 'react'

// Visual 1, the eval hero: one prompt, run 1 of three without brand context and with it, plus a
// line on what the other two runs did. Source of truth is Component_EvalHero_Spec.md in the sprint
// folder, cut to one run per side by Kai (2026-10-24); the excerpts are verbatim from eval run
// 2026-10-24_1431, prompt social-02, so the baseline keeps its em dashes and emoji.
// Marks use the spec's own markup ([flag: x], [count: x], ...) and are parsed below.
// Colors are decision 3 of the build plan: orange for flags, washi blue for approved figures.
// Text only ever sits on a tint, never on solid orange or blue.

// total is the flag count over all three runs; flags is run 1's alone.
type Side = { total: number; flags: number; lines: string[]; others: string }

const WITHOUT: Side = {
  total: 19,
  flags: 8,
  lines: [
    '🚀 2026 has been a defining year for Tallo!',
    "We've grown into a thriving community of over [count+flag: 5 million] students and young professionals, connecting them with opportunities.",
    '📈 [flag: 1,200+] organizations [flag: —] from universities to Fortune 500 companies [flag: —]',
    '🎓 Over [flag: 800,000] scholarship opportunities were explored by our users...',
    '💼 [flag: 150,000+] career connections were made...',
  ],
  others: 'Runs 2 and 3 put the user count at [count: 2M+] and [count+flag: 3 million].',
}

// Kai's trims (2026-10-24): both drafts' second lines end in a period where they were cut, not
// "...". Here the 200,000+ monthly active users and 20x clause is gone; in the baseline, "that
// shape their futures" is.
const WITH: Side = {
  total: 0,
  flags: 0,
  lines: [
    'Tallo™ is helping more young people find their path than ever.',
    'This year, our community grew to [approved-count: 2 million users] ages 13–30 across [approved: all 50 states].',
    'Behind those numbers are real opportunities: [approved: 1,800+] careers across [approved: 170] industry pathways, [approved: 4 million+] live job listings, and [approved: 21,000+] scholarships...',
  ],
  others: 'Runs 2 and 3 used [approved-count: 2 million users] too.',
}

type Kind = 'flag' | 'count' | 'count+flag' | 'approved-count' | 'approved'

// Tints are over the white card: orange at 18% (#F5E3DA) and washi blue at 30% (#DCE8F1), both
// about 10:1 under ink-primary. Outlines are inset shadows so they don't shift the line.
const MARK: Record<Kind, { label: string; className: string }> = {
  flag: { label: 'linter flag', className: 'rounded-[4px] bg-accent-orange/18 px-[3px] font-semibold text-ink-primary' },
  count: { label: 'user count', className: 'rounded-[4px] px-[3px] font-semibold text-ink-primary shadow-[inset_0_0_0_1.5px_var(--color-accent-orange)]' },
  'count+flag': {
    label: 'user count, linter flag',
    className: 'rounded-[4px] bg-accent-orange/18 px-[3px] font-semibold text-ink-primary shadow-[inset_0_0_0_1.5px_var(--color-accent-orange)]',
  },
  'approved-count': {
    label: 'approved user count',
    className: 'rounded-[4px] bg-accent-washi-blue/30 px-[3px] font-semibold text-ink-primary shadow-[inset_0_0_0_1.5px_var(--color-accent-washi-blue)]',
  },
  approved: {
    label: 'approved figure',
    className: 'font-semibold text-ink-primary underline decoration-accent-washi-blue decoration-2 underline-offset-[3px]',
  },
}

const MARKUP = /\[(flag|count\+flag|count|approved-count|approved): ([^\]]+)\]/g

function Line({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(MARKUP)) {
    const kind = m[1] as Kind
    const value = m[2]
    const { label, className } = MARK[kind]
    out.push(text.slice(last, m.index))
    out.push(
      // A mark never breaks across lines. The dash is announced by name, since screen readers often
      // skip the glyph.
      <span key={m.index} className={`whitespace-nowrap ${className}`}>
        {value === '—' ? (
          <>
            <span className="sr-only">{label}: em dash</span>
            <span aria-hidden="true">—</span>
          </>
        ) : (
          <>
            <span className="sr-only">{label}: </span>
            {value}
          </>
        )}
      </span>,
    )
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return <p>{out.map((n, i) => <Fragment key={i}>{n}</Fragment>)}</p>
}

function Column({ id, title, side, tone }: { id: string; title: string; side: Side; tone: 'flag' | 'approved' }) {
  const rule = tone === 'flag' ? 'border-accent-orange' : 'border-accent-washi-blue'
  const pill = tone === 'flag' ? 'bg-accent-orange/18' : 'bg-accent-washi-blue/30'
  return (
    // From two columns up, each column spans the parent's three rows through subgrid, so the run
    // cards line up across the gutter at one height, and so do the notes under them.
    <section aria-labelledby={id} className="flex flex-col gap-4 @min-[700px]:row-span-3 @min-[700px]:grid @min-[700px]:grid-rows-subgrid">
      <h2 id={id} className={`flex items-end justify-between gap-4 border-b-2 pb-3 ${rule}`}>
        <span className="pb-1.5 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-primary">{title}</span>
        <span className="sr-only">, </span>
        <span className="font-display text-[40px] font-medium leading-none tracking-[-0.015em] text-ink-primary tabular-nums md:text-[48px]">
          {side.total} flags
        </span>
        <span className="sr-only"> across 3 runs</span>
      </h2>
      <div className="rounded-[14px] border border-hairline bg-white p-5">
        <p className="mb-3 flex items-center justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted">
          <span>Run 1 of 3</span>
          <span className="sr-only">, </span>
          <span className={`rounded-full px-2.5 py-0.5 normal-case tracking-normal text-ink-primary ${pill}`}>
            {side.flags} {side.flags === 1 ? 'flag' : 'flags'}
          </span>
        </p>
        <div className="flex flex-col gap-1.5 font-mono text-[13.5px] leading-[1.7] text-ink-body [text-wrap:pretty]">
          {side.lines.map((l, j) => (
            <Line key={j} text={l} />
          ))}
        </div>
      </div>
      <div className="px-1 font-mono text-[12.5px] leading-[1.7] text-ink-muted">
        <Line text={side.others} />
      </div>
    </section>
  )
}

const KEY: { kind: Kind; text: string; sample?: string }[] = [
  { kind: 'flag', text: 'Linter flag' },
  { kind: 'count', text: 'User count (changes every run)' },
  { kind: 'approved-count', text: 'Approved user count' },
  { kind: 'approved', text: 'Other figures, all from the approved stats file', sample: '1,800+' },
]

export default function EvalHero() {
  return (
    <div className="@container">
      <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted">Same request, 3 runs each</p>
      <p className="mt-3 font-display text-[24px] leading-[1.25] tracking-[-0.01em] text-ink-primary [text-wrap:balance] md:text-[30px]">
        “Write a LinkedIn post about how big Tallo has grown this year. Include a few impressive numbers.”
      </p>
      <div className="mt-10 flex flex-col gap-12 @min-[700px]:grid @min-[700px]:grid-cols-2 @min-[700px]:grid-rows-[repeat(3,auto)] @min-[700px]:gap-x-8 @min-[700px]:gap-y-4">
        <Column id="eval-without" title="Without brand context" side={WITHOUT} tone="flag" />
        <Column id="eval-with" title="With the brand system" side={WITH} tone="approved" />
      </div>
      <ul aria-label="Key" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] leading-[1.6] text-ink-muted">
        {KEY.map((k) => (
          <li key={k.kind} className="flex items-center gap-2">
            {k.sample ? (
              <span aria-hidden="true" className={MARK[k.kind].className}>{k.sample}</span>
            ) : (
              <span aria-hidden="true" className={`inline-block h-3.5 w-5 ${MARK[k.kind].className}`} />
            )}
            {k.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
