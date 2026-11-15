// Chapter 2, the stall (build plan, Phase 3): three steps from the 2023 user flow's data agreement
// branch, with the wait marked between the first two. No "3 to 12 months" on the gap: that figure is
// how long building a dashboard took, not the agreement wait. The quote sits above it as its own
// block (the template can't put a quote beside a visual, and the plan says stack rather than add a
// layout). Stacks vertically under 640px of column width, the gap still between steps 1 and 2.

const CARD = 'rounded-[14px] border border-hairline bg-white p-4 @min-[640px]:flex-1'
const TITLE = 'font-display text-[17px] font-medium leading-[1.3] text-ink-primary [text-wrap:balance]'
const STEP = 'font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted mb-1.5'

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 12" className="h-3 w-6 shrink-0 rotate-90 text-ink-faint @min-[640px]:rotate-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6h21M17 1.5 22 6l-5 4.5" />
    </svg>
  )
}

export default function Stall() {
  return (
    <div className="@container rounded-[14px] bg-tag/55 p-4 md:p-6">
      <ol role="list" className="flex flex-col items-stretch gap-2 @min-[640px]:flex-row @min-[640px]:items-stretch @min-[640px]:gap-0">
        <li className={CARD}>
          <p className={STEP}>Step 1</p>
          <p className={TITLE}>School leader finds the tool</p>
        </li>

        {/* The wait: a broken, dashed connector in the flag orange. Read out as part of the list. */}
        <li className="flex items-center justify-center gap-3 py-2 @min-[640px]:w-[120px] @min-[640px]:shrink-0 @min-[640px]:flex-col @min-[640px]:gap-2 @min-[640px]:py-0">
          <span aria-hidden="true" className="h-5 w-0 border-l-[1.5px] border-dashed border-accent-orange @min-[640px]:h-0 @min-[640px]:w-full @min-[640px]:border-l-0 @min-[640px]:border-t-[1.5px]" />
          <span className="rounded-[4px] bg-accent-orange/18 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-ink-primary">The wait</span>
          <span aria-hidden="true" className="h-5 w-0 border-l-[1.5px] border-dashed border-accent-orange @min-[640px]:h-0 @min-[640px]:w-full @min-[640px]:border-l-0 @min-[640px]:border-t-[1.5px]" />
        </li>

        <li className={CARD}>
          <p className={STEP}>Step 2</p>
          <p className={TITLE}>Data agreement</p>
          <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-body [text-wrap:pretty]">Student records can’t flow until it’s signed.</p>
        </li>

        <li aria-hidden="true" className="flex justify-center py-1 @min-[640px]:items-center @min-[640px]:px-3 @min-[640px]:py-0">
          <Arrow />
        </li>

        <li className={CARD}>
          <p className={STEP}>Step 3</p>
          <p className={TITLE}>Supervisor signs</p>
        </li>
      </ol>
    </div>
  )
}
