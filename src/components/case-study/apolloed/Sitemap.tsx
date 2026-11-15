// Chapter 1, the 2023 site map rebuilt (build plan, Phase 3). Structure and labels come from
// 2023-sitemap-lowres.png in the sprint folder's visuals/2023-reference; nothing is invented and none
// of its blue is kept. Levels read by tint steps of one ink color plus indent, with a legend, so color
// is never the only signal. The data agreement notice, which sat above every page in 2023, gets the
// one accent (an orange outline, no fill under text).
//
// One nested list serves both layouts, so a screen reader gets the hierarchy either way. Under 640px
// of column width it's an indented outline, top band first. From 640px the dashboard's groups take
// their places on the map: sidebar on the left, header, tabs and the dotted overlays on the right.

type Level = 1 | 2 | 3 | 4
type Node = { label: string; level: Level; children?: Node[] }

const TINT: Record<Level, string> = {
  1: 'bg-ink-primary/[0.03]',
  2: 'bg-ink-primary/[0.08]',
  3: 'bg-ink-primary/[0.14]',
  4: 'bg-ink-primary/[0.22]',
}

const PAGES: Node[] = [
  { label: 'Home', level: 1 },
  { label: 'Trial landing page', level: 1 },
  { label: 'Create account', level: 1 },
]

const HEADER: Node[] = [
  { label: 'Global search', level: 2 },
  { label: 'Notifications', level: 2 },
  {
    label: 'Help',
    level: 2,
    children: ['Search', 'Learn', 'Resources', 'Support chat'].map((label) => ({ label, level: 3 as const })),
  },
  {
    label: 'Account',
    level: 2,
    children: ['Edit profile', 'Settings', 'Manage my team'].map((label) => ({ label, level: 3 as const })),
  },
  { label: 'Log out', level: 2 },
]

const TABS: Node[] = [
  { label: 'Pinned dashboard 1', level: 2 },
  { label: 'Pinned dashboard 2', level: 2 },
  { label: 'Select or create new', level: 2 },
]

const SIDEBAR: Node[] = [
  { label: 'Account', level: 2 },
  { label: 'Dashboard home', level: 2 },
  {
    label: 'Active dashboards',
    level: 2,
    children: ['All', 'Favorites', 'Created by me', 'Shared with me', 'External', 'Deleted'].map((label) => ({ label, level: 3 as const })),
  },
  {
    label: 'All widgets',
    level: 2,
    children: ['Favorites', 'Created by me', 'Shared with me', 'External', 'Custom folders', 'Deleted'].map((label) => ({ label, level: 3 as const })),
  },
  {
    label: 'District info',
    level: 2,
    children: [
      {
        label: 'School info',
        level: 3,
        children: [
          { label: 'Staff directory', level: 4 },
          { label: 'Student information', level: 4 },
        ],
      },
    ],
  },
  {
    label: 'Marketplace',
    level: 2,
    children: ['Widgets', 'Integrations', 'Dashboard templates', 'Consulting services'].map((label) => ({ label, level: 3 as const })),
  },
]

const OVERLAYS: Node[] = [
  {
    label: 'Create a widget',
    level: 3,
    children: ['Select data', 'Filter by date', 'Filter by student or group', 'Filter by grade level', 'Custom filters'].map((label) => ({
      label,
      level: 3 as const,
    })),
  },
  {
    label: 'Help bot',
    level: 3,
    children: ['Search', 'Learn', 'Resources', 'Support chat'].map((label) => ({ label, level: 3 as const })),
  },
]

const CHIP = 'inline-block whitespace-nowrap rounded-[6px] px-2 py-[3px] font-mono text-[12px] leading-[1.4] text-ink-primary'
const GROUP_LABEL = 'mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted'

function Chip({ node }: { node: Node }) {
  return <span className={`${CHIP} ${TINT[node.level]}`}>{node.label}</span>
}

// A page and whatever sits under it, indented on a hairline.
function Item({ node }: { node: Node }) {
  return (
    <li>
      <Chip node={node} />
      {node.children && (
        <ul className="ml-2.5 mt-1 flex flex-col gap-1 border-l border-hairline pl-3 pt-0.5">
          {node.children.map((c) => (
            <Item key={c.label} node={c} />
          ))}
        </ul>
      )}
    </li>
  )
}

// A labeled part of the dashboard. row lays its items side by side on the wide map.
function Group({ label, nodes, row, dotted, className = '' }: { label: string; nodes: Node[]; row?: boolean; dotted?: boolean; className?: string }) {
  return (
    <li className={`rounded-[10px] border p-3 ${dotted ? 'border-dotted border-chip-line border-[1.5px]' : 'border-hairline'} ${className}`}>
      <p className={GROUP_LABEL}>{label}</p>
      <ul className={`flex flex-col gap-1 ${row ? `@min-[640px]:flex-row @min-[640px]:flex-wrap @min-[640px]:items-start @min-[640px]:gap-x-2 @min-[640px]:gap-y-2 [&>li>ul]:@min-[640px]:ml-1.5 [&>li>ul]:@min-[640px]:pl-2` : ''}`}>
        {nodes.map((n) => (
          <Item key={n.label} node={n} />
        ))}
      </ul>
    </li>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11.5px] text-ink-muted" aria-label="Legend">
      {([1, 2, 3, 4] as Level[]).map((l) => (
        <li key={l} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-3 w-5 rounded-[3px] border border-hairline ${TINT[l]}`} />
          Level {l}
        </li>
      ))}
    </ul>
  )
}

export default function Sitemap() {
  return (
    <div className="@container rounded-[14px] border border-hairline bg-white p-4 md:p-5">
      <Legend />
      <ul className="mt-4 flex flex-col gap-3" aria-label="ApolloEd site map, 2023">
        {/* The data agreement notice, above every page. */}
        <li className={`flex flex-col gap-2 rounded-[10px] border-[1.5px] border-accent-orange p-3 @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:justify-center @min-[640px]:gap-4`}>
          <p className="font-display text-[16px] font-medium leading-[1.3] text-ink-primary">Data contract notification</p>
          <ul>
            <li>
              <span className={`${CHIP} border border-hairline`}>Explore pricing plans</span>
            </li>
          </ul>
        </li>

        <li>
          <ul className={`flex flex-col gap-1 @min-[640px]:flex-row @min-[640px]:gap-3`}>
            {PAGES.map((p) => (
              <Item key={p.label} node={p} />
            ))}
          </ul>
        </li>

        <li>
          <Chip node={{ label: 'Dashboard', level: 2 }} />
          <ul
            className={`ml-2.5 mt-2 flex flex-col gap-3 border-l border-hairline pl-3 @min-[640px]:ml-0 @min-[640px]:grid @min-[640px]:grid-cols-[224px_minmax(0,1fr)] @min-[640px]:grid-rows-[auto_auto_1fr] @min-[640px]:items-start @min-[640px]:border-l-0 @min-[640px]:pl-0`}
          >
            <Group label="Header" nodes={HEADER} row className={`@min-[640px]:col-start-2 @min-[640px]:row-start-1`} />
            <Group label="Dashboard tabs" nodes={TABS} row className={`@min-[640px]:col-start-2 @min-[640px]:row-start-2`} />
            <Group label="Sidebar" nodes={SIDEBAR} className={`@min-[640px]:col-start-1 @min-[640px]:row-span-3 @min-[640px]:row-start-1`} />
            <li className={`@min-[640px]:col-start-2 @min-[640px]:row-start-3`}>
              <p className={GROUP_LABEL}>Overlays</p>
              <ul className={`flex flex-col gap-3 @min-[640px]:flex-row @min-[640px]:items-start`}>
                {OVERLAYS.map((o) => (
                  <Group key={o.label} label={o.label} nodes={o.children!} dotted className={`@min-[640px]:flex-1`} />
                ))}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}
