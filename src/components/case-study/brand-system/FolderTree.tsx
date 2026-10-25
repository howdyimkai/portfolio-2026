import type { ReactNode } from 'react'

// Visual 3, the sanitized folder tree (Ch 2). Source of truth is Component_FolderTree_Spec.md in the
// sprint folder: the tree is verbatim from the draft's Ch 2 code block, so add no files.
// It wears the template's code block (tag surface, hairline, 12px radius, mono 13px) as a <pre> the
// eye reads, which screen readers skip for a nested list below it, since box drawing reads badly.
// Wide, comments sit in one aligned column (each row is a subgrid of the tree's two columns); under
// 640px of column width each comment drops under its path, indented to the path's depth with the
// tree's guides carried down. value-points.json gets the washi blue band, the hero's "approved" tint.

type Entry = { name: string; comment?: string; highlight?: boolean; children?: Entry[] }

const TREE: Entry = {
  name: 'brand-system/',
  children: [
    {
      name: 'brand/',
      comment: 'source of truth, as data',
      children: [
        { name: 'colors.json' },
        { name: 'typography.json' },
        { name: 'personality.json' },
        { name: 'mascot.json' },
        { name: 'value-points.json', comment: 'the only place a stat may come from', highlight: true },
        { name: 'social/', comment: 'social palette + contrast decisions' },
      ],
    },
    {
      name: 'claude-templates/',
      children: [
        { name: 'BRAND.md', comment: 'shared core: voice, terms, banned phrases' },
        { name: '*-context.md', comment: 'one per role: social, blog, copy, design, dev, events, exec' },
      ],
    },
    { name: 'process-templates/', comment: 'challenges, video production, presentations' },
    { name: 'setup.sh', comment: '15-minute onboarding' },
    { name: 'QUICKSTART.md', comment: "for people who've never opened a terminal" },
    { name: 'QUICKSTART-COWORK.md', comment: 'the same setup in Claude Cowork, no terminal' },
    { name: 'CONTRIBUTE.md', comment: 'how to propose changes, what can ship' },
    { name: 'CHANGELOG.md', comment: 'what changed, where, why, evidence' },
  ],
}

// One row per entry. lead is the guides before the name ("│   ├── "); under is the same guides
// carried down a line, for a comment that wraps under its path on phones. A file's comment lines up
// with its name; a folder's sits one step in, past the guide its children hang from.
type Row = { lead: string; under: string; entry: Entry; root: boolean }

function flatten(e: Entry, guides = '', root = true): Row[] {
  const rows: Row[] = root ? [{ lead: '', under: '', entry: e, root }] : []
  e.children?.forEach((c, i) => {
    const last = i === e.children!.length - 1
    rows.push({ lead: guides + (last ? '└── ' : '├── '), under: guides + (last ? '    ' : '│   ') + (c.children ? '│   ' : ''), entry: c, root: false })
    if (c.children) rows.push(...flatten(c, guides + (last ? '    ' : '│   '), false))
  })
  return rows
}

const ROWS = flatten(TREE)

function SrList({ entries }: { entries: Entry[] }): ReactNode {
  return (
    <ul>
      {entries.map((e) => (
        <li key={e.name}>
          {e.highlight && 'highlighted: '}
          {e.name}
          {e.comment && `, ${e.comment}`}
          {e.children && <SrList entries={e.children} />}
        </li>
      ))}
    </ul>
  )
}

export default function FolderTree() {
  return (
    <div className="@container">
      <div className="sr-only">
        <p>Folder tree of the brand system:</p>
        <SrList entries={[TREE]} />
      </div>
      <pre
        aria-hidden="true"
        className="overflow-hidden rounded-[12px] border border-hairline bg-tag/55 px-4 py-4 font-mono text-[13px] leading-[1.6] text-ink-primary md:px-6 md:py-5"
      >
        <code className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8">
          {ROWS.map(({ lead, under, entry, root }) => (
            <span
              key={lead + entry.name}
              className={`col-span-2 -mx-4 flex flex-col px-4 md:-mx-6 md:px-6 @min-[640px]:grid @min-[640px]:grid-cols-subgrid ${
                entry.highlight ? 'rounded-[6px] bg-accent-washi-blue/30' : ''
              }`}
            >
              <span className="whitespace-pre">
                {lead}
                <span className={root ? 'font-semibold' : ''}>{entry.name}</span>
              </span>
              {/* Comments in ink-body, not muted: muted is under 4.5:1 on this surface. The
                  highlighted row's comment goes to ink-primary to clear 4.5:1 on the band. */}
              {entry.comment && (
                <span className={`flex ${entry.highlight ? 'text-ink-primary' : 'text-ink-body'}`}>
                  <span className="whitespace-pre @min-[640px]:hidden">{under}</span>
                  <span className="min-w-0 whitespace-pre-wrap"># {entry.comment}</span>
                </span>
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
