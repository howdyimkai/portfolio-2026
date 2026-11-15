// Chapter 4, 13 screens to 6 with the quote (build plan, Phase 3). The quote leads in the template's
// quote style; under it, the old signup as 13 blank screens and the new one as 6 named steps. Step
// names are the build plan's, from the 2023 user flow (open question 4; Kai confirmed them as written,
// 2026-11-15). The squares are aria-hidden with a sr-only count; every step is real text. Under 640px
// of column width the squares wrap and the steps become a vertical list.

const STEPS = ['Landing page', 'Sign up', 'Pick your role', 'Find your school', 'Data agreement check', 'Your first dashboard']
const LABEL = 'font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-primary'

export default function FlowQuote() {
  return (
    <div className="@container flex flex-col gap-8 rounded-[14px] border border-hairline bg-white p-5 md:gap-10 md:p-8">
      <figure className="border-l-2 border-ink-primary pl-6">
        <blockquote className="font-display text-[22px] leading-[1.35] text-ink-primary [text-wrap:pretty] md:text-[28px]">
          “This is too easy... I just created a dashboard in three clicks.”
        </blockquote>
        <figcaption className="mt-2 font-mono text-[12px] text-ink-faint">Executive director of data and technology</figcaption>
      </figure>

      <p className="sr-only">13 screens before, 6 after.</p>

      <div aria-hidden="true">
        <p className={LABEL}>Before: 13 screens</p>
        <p className="mt-1 font-mono text-[12px] leading-[1.5] text-ink-faint">Signup started on the company site. No progress bar.</p>
        <ul className="mt-3 flex flex-wrap gap-1.5 @min-[640px]:flex-nowrap">
          {Array.from({ length: 13 }, (_, i) => (
            <li key={i} className="aspect-square w-[34px] rounded-[4px] border border-chip-line @min-[640px]:w-auto @min-[640px]:flex-1" />
          ))}
        </ul>
      </div>

      <div>
        <p className={LABEL} aria-hidden="true">After: 6 steps</p>
        <ol className="mt-3 flex flex-col gap-1.5 @min-[640px]:grid @min-[640px]:grid-cols-6">
          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1
            return (
              <li
                key={s}
                className={`flex items-center gap-3 rounded-[6px] border px-3 py-2 @min-[640px]:aspect-[1/1] @min-[640px]:flex-col @min-[640px]:items-start @min-[640px]:justify-between @min-[640px]:gap-1 @min-[640px]:p-2.5 ${
                  last ? 'border-accent-washi-blue bg-accent-washi-blue/30' : 'border-chip-line'
                }`}
              >
                <span className="font-mono text-[11px] text-ink-muted">{i + 1}</span>
                <span className="font-mono text-[12.5px] leading-[1.35] text-ink-primary [text-wrap:balance]">{s}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
