// Visual 2, the architecture diagram (Ch 2). Source of truth is Component_ArchitectureDiagram_Spec.md
// in the sprint folder; V2_ArchitectureDiagram is a structure reference only. Labels are the spec's.
// The four steps are an ordered list in reading order, which is also the phone order: specs, role
// context, workflows and skills, output, then the direct readers and the checks rail. From 760px
// of column width up, one grid places them as the desktop diagram; the list is `display: contents`
// so its items join that grid, with role="list" to keep the list semantics Safari drops.
// Specs takes the chalkboard slate of the chapter frame beside it, the strongest thing on the page;
// output takes a washi blue tint. Side routes are dashed, the checks rail in washi blue.

const EYEBROW = 'font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted'
const CARD = 'rounded-[14px] border border-hairline bg-white p-4'
const NODE_TITLE = 'font-display text-[16px] font-medium leading-[1.3] text-ink-primary'
const NODE_DETAIL = 'mt-1 font-mono text-[12.5px] leading-[1.6] text-ink-body [text-wrap:pretty]'

function Arrow({ dir, className = '' }: { dir: 'right' | 'down' | 'left' | 'up'; className?: string }) {
  const rotate = { right: '', down: 'rotate-90', left: 'rotate-180', up: '-rotate-90' }[dir]
  return (
    <svg aria-hidden="true" viewBox="0 0 24 12" className={`h-3 w-6 shrink-0 ${rotate} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6h21M17 1.5 22 6l-5 4.5" />
    </svg>
  )
}

// The flow arrow under a step on phones; the wide layout draws its own between columns.
function DownArrow() {
  return (
    <div className={`flex justify-center pt-3 text-ink-faint @min-[760px]:hidden`}>
      <Arrow dir="down" />
    </div>
  )
}

function Node({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={`${CARD} flex flex-1 flex-col justify-center`}>
      <p className={NODE_TITLE}>{title}</p>
      <p className={NODE_DETAIL}>{detail}</p>
    </div>
  )
}

const SPECS = ['colors', 'type', 'voice', 'mascot', 'stats', 'social layer']
const OUTPUT = ['Posts', 'Blogs and emails', 'Decks', 'Challenge series', 'Video', 'Alt text']
const DIRECT = ['n8n automations', 'Canva kit', 'Figma', 'Paper', 'Developers']

export default function Architecture() {
  return (
    <div className="@container">
      <p className="sr-only">
        Diagram: brand specs, stored as data, feed a shared core file and 7 role files, which feed process templates, Claude skills, and an alt
        text kit. n8n automations, the Canva kit, Figma, Paper, and developers read the specs directly. All of it produces first drafts on
        brand. A linter and eval read their rules from the specs and check the drafts.
      </p>
      <div
        className={`flex flex-col gap-3 @min-[760px]:grid @min-[760px]:grid-cols-[minmax(0,0.8fr)_36px_minmax(0,1.1fr)_36px_minmax(0,1.1fr)_36px_minmax(0,0.8fr)] @min-[760px]:grid-rows-[auto_auto_auto] @min-[760px]:gap-x-0 @min-[760px]:gap-y-4`}
      >
        <ol role="list" className="contents">
          <li className={`flex flex-col @min-[760px]:col-start-1 @min-[760px]:row-span-2 @min-[760px]:row-start-1`}>
            <p className={`${EYEBROW} mb-2`}>1 · Specs</p>
            <div className="flex flex-1 flex-col rounded-[14px] bg-[#262626] p-5 text-[rgb(240_236_226/0.9)] [text-shadow:0_0_1px_rgb(240_236_226/0.35)]">
              <p className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.01em]">Brand specs</p>
              <p className="mt-2 font-mono text-[12.5px] leading-[1.6] opacity-80">The one source, stored as data.</p>
              <ul className={`mt-5 flex flex-col gap-1 font-mono text-[12.5px] leading-[1.5] @min-[760px]:mt-auto @min-[760px]:pt-6`}>
                {SPECS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <DownArrow />
          </li>

          <li className={`flex flex-col @min-[760px]:col-start-3 @min-[760px]:row-start-1`}>
            <p className={`${EYEBROW} mb-2`}>2 · Role context</p>
            <div className="flex flex-1 flex-col gap-3">
              <Node title="Shared core file" detail="Voice, terms, banned phrases" />
              <Node title="7 role files" detail="Social, blog, copy, design, dev, events, exec" />
            </div>
            <DownArrow />
          </li>

          <li className={`flex flex-col @min-[760px]:col-start-5 @min-[760px]:row-start-1`}>
            <p className={`${EYEBROW} mb-2`}>3 · Workflows and skills</p>
            <div className="flex flex-1 flex-col gap-3">
              <Node title="Process templates" detail="Challenges, video, presentations" />
              <Node title="Claude skills" detail="Deck builder with a contrast audit" />
              <Node title="Alt text kit" detail="Accessible first, search second" />
            </div>
            <DownArrow />
          </li>

          <li className={`flex flex-col @min-[760px]:col-start-7 @min-[760px]:row-span-2 @min-[760px]:row-start-1`}>
            <p className={`${EYEBROW} mb-2`}>4 · Team output</p>
            <div className="flex flex-1 flex-col rounded-[14px] border border-accent-washi-blue bg-accent-washi-blue/30 p-5 text-ink-primary">
              <p className="font-display text-[26px] font-medium leading-[1.1] tracking-[-0.01em] [text-wrap:balance]">First drafts on brand</p>
              <ul className={`mt-5 flex flex-col gap-1 font-mono text-[12.5px] leading-[1.5] @min-[760px]:mt-auto @min-[760px]:pt-6`}>
                {OUTPUT.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </li>
        </ol>

        {/* Flow arrows between the columns, wide layout only. Specs → middle and middle → output are
            centered on the full height; role context → workflows on the top row. */}
        <div aria-hidden="true" className={`hidden text-ink-faint @min-[760px]:col-start-2 @min-[760px]:row-span-2 @min-[760px]:row-start-1 @min-[760px]:flex @min-[760px]:items-center @min-[760px]:justify-center @min-[760px]:pt-7`}>
          <Arrow dir="right" />
        </div>
        <div aria-hidden="true" className={`hidden text-ink-faint @min-[760px]:col-start-4 @min-[760px]:row-start-1 @min-[760px]:flex @min-[760px]:items-center @min-[760px]:justify-center @min-[760px]:pt-7`}>
          <Arrow dir="right" />
        </div>
        <div aria-hidden="true" className={`hidden text-ink-faint @min-[760px]:col-start-6 @min-[760px]:row-span-2 @min-[760px]:row-start-1 @min-[760px]:flex @min-[760px]:items-center @min-[760px]:justify-center @min-[760px]:pt-7`}>
          <Arrow dir="right" />
        </div>

        <div className={`mt-3 rounded-[14px] border border-dashed border-chip-line p-4 @min-[760px]:col-span-3 @min-[760px]:col-start-3 @min-[760px]:row-start-2 @min-[760px]:mt-0`}>
          <p className={EYEBROW}>Also read the specs directly</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-display text-[16px] font-medium leading-[1.4] text-ink-primary">
            {DIRECT.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div
          className={`flex flex-col gap-2 rounded-[14px] border border-dashed border-accent-washi-blue p-4 font-mono text-[12.5px] leading-[1.5] text-ink-body @min-[760px]:col-span-7 @min-[760px]:row-start-3 @min-[760px]:grid @min-[760px]:grid-cols-[1fr_auto_1fr] @min-[760px]:items-center @min-[760px]:gap-4 @min-[760px]:px-5`}
        >
          <p className={`order-first font-display text-[16px] font-medium text-ink-primary @min-[760px]:order-none @min-[760px]:col-start-2 @min-[760px]:row-start-1`}>Linter + eval</p>
          <p className={`flex items-center gap-2 @min-[760px]:col-start-1 @min-[760px]:row-start-1`}>
            <Arrow dir="left" className={`hidden text-ink-faint @min-[760px]:block`} />
            <Arrow dir="up" className={`text-ink-faint @min-[760px]:hidden`} />
            Reads its rules from the specs
          </p>
          <p className={`flex items-center gap-2 @min-[760px]:col-start-3 @min-[760px]:row-start-1 @min-[760px]:justify-end`}>
            <Arrow dir="up" className={`text-ink-faint @min-[760px]:hidden`} />
            Checks the drafts
            <Arrow dir="right" className={`hidden text-ink-faint @min-[760px]:block`} />
          </p>
        </div>
      </div>
    </div>
  )
}
