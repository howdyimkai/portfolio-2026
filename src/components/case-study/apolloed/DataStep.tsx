// Chapter 3, the data step before and after (build plan, Phase 3). Two cards in portfolio style, side
// by side from 560px of column width, stacked under it. "test data" takes the orange flag tint (Brand
// System's linter flags), "sample data" the washi blue. No caption: Kai cut the draft (2026-11-15).
//
// The before line is a RECONSTRUCTION: no 2023 screen of the old flow survives, so it stays this short.
// The after card is the 2023 dialog's title verbatim (2023-waiting-approval-dialog.png). Never add the
// dialog's "aggregated sample data from public records found on Third Street School": it was an
// untested concept (Kai, 2026-11-15).

const LABEL = 'mb-2 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-primary'
const CARD = 'flex flex-1 flex-col rounded-[14px] border border-hairline bg-white p-5 md:p-7'
const LINE = 'font-mono text-[14px] leading-[1.6] text-ink-body [text-wrap:pretty]'
const MARK = 'rounded-[4px] px-[3px] font-semibold text-ink-primary'

export default function DataStep() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-5 @min-[560px]:grid-cols-2 @min-[560px]:gap-6">
        <div className="flex flex-col">
          <p className={LABEL}>2023 · before</p>
          <div className={`${CARD} justify-center`}>
            <p className={LINE}>
              Explore your dashboard with <mark className={`${MARK} bg-accent-orange/18`}>test data</mark>.
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className={LABEL}>2023 · after</p>
          <div className={CARD}>
            <p className="font-display text-[19px] font-medium leading-[1.3] text-ink-primary [text-wrap:balance] md:text-[21px]">
              Waiting for your supervisor’s approval to connect your school’s data
            </p>
            <p className={`mt-3 ${LINE}`}>
              In the meantime, explore our dashboard with <mark className={`${MARK} bg-accent-washi-blue/30`}>sample data</mark>.
            </p>
            <p className="mt-5 font-mono text-[12px] leading-[1.5] text-ink-faint">
              Let’s try it <span aria-hidden="true">·</span> <span className="sr-only">or</span> No thanks, skip to a blank dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
