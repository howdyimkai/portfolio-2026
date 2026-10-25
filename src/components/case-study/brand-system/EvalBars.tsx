// Visual 9, before and after bars (Ch 6), in place of the draft's results table (build plan
// decision 4). Data from eval run 2026-10-24_1431, results.md: share of 45 drafts each way.
// It is a real <table> with a visually hidden caption and column headers, so screen readers get the
// numbers. Rows, headers and cells also carry their roles, since the grid layout would otherwise
// strip table semantics in some browsers.
// Each row pairs a Without bar (accent orange) over a With bar (washi blue) on a 0 to 100% track,
// with the value printed in ink at the bar's end. A 0% bar is a hairline tick plus "0%".

const ROWS = [
  { label: 'Broke at least one rule', without: 80, with: 31 },
  { label: 'Used a made-up stat', without: 31, with: 0 },
  { label: 'Used a retired term or stat', without: 13, with: 0 },
  { label: 'Used em dashes', without: 73, with: 0 },
]

const SERIES = [
  { key: 'without', name: 'Without the system', bar: 'bg-accent-orange' },
  { key: 'with', name: 'With the system', bar: 'bg-accent-washi-blue' },
] as const

function Bar({ value, bar }: { value: number; bar: string }) {
  return (
    <td role="cell" className="relative mr-12 flex h-4 items-center rounded-full bg-tag/55">
      <span
        aria-hidden="true"
        className={`h-full rounded-full ${value === 0 ? 'w-[2px] bg-ink-muted' : bar}`}
        style={value === 0 ? undefined : { width: `${value}%` }}
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-[13px] tabular-nums text-ink-primary"
        style={{ left: value === 0 ? '2px' : `${value}%` }}
      >
        {value}%
      </span>
    </td>
  )
}

export default function EvalBars() {
  return (
    <div>
      <table role="table" className="block w-full">
        <caption className="sr-only">Share of drafts that broke each rule, without and with the brand system</caption>
        <thead role="rowgroup" className="sr-only">
          <tr role="row">
            <th role="columnheader" scope="col">Share of drafts that...</th>
            {SERIES.map((s) => (
              <th key={s.key} role="columnheader" scope="col">
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="flex flex-col">
          {ROWS.map((r) => (
            <tr
              key={r.label}
              role="row"
              className="grid grid-cols-1 gap-x-8 gap-y-2 border-t border-hairline py-4 first:border-t-0 first:pt-0 md:grid-cols-[220px_minmax(0,1fr)] md:items-center"
            >
              <th role="rowheader" scope="row" className="text-left font-mono text-[13px] font-normal leading-[1.5] text-ink-primary md:row-span-2">
                {r.label}
              </th>
              {SERIES.map((s) => (
                <Bar key={s.key} value={r[s.key]} bar={s.bar} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul aria-hidden="true" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] text-ink-muted">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className={`inline-block h-3 w-5 rounded-full ${s.bar}`} />
            {s.name}
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-[12px] leading-[1.6] text-ink-faint">Average reading level: grade 11 without the system, grade 6.5 with it.</p>
    </div>
  )
}
