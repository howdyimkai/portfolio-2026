// Chapter 9, the Lovable handoff (Kai, 2026-11-15): replaces the three small thumbnails (plan, Paper
// frame, live build), which read too alike. Frame 2 is the v2 Paper frame attached to the prompt in
// Lovable-Prompt_DataLens.md (visuals/frame2-after-change.png in the sprint folder); its blue dots
// are the ripple order. The notes beside it are that prompt's "The ripple" section, trimmed, as real
// text: the v2 notes were never a separate image. The prompt's opening sits above as a code block.
// The frame takes the column's full width so it reads; the notes card goes under it, two columns
// from 640px of column width.

const LABEL = 'mb-2.5 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-primary'

const ORDER = [
  ['Preview mode strip dropdown', '0ms'],
  ['KPI row', '80ms'],
  ['Attendance chart', '160ms'],
  ['Enrollment by grade', '240ms'],
  ['Goals table', '320ms'],
]

const RULES = [
  'Each block animates over about 400ms with ease out. Numbers count to the new value.',
  'When the number of bars changes, bars fade and slide in place. Card sizes stay fixed.',
  'Generated tags and the Preview mode strip never animate.',
  'With reduced motion, skip the stagger and counting and swap values instantly.',
]

export default function Handoff() {
  return (
    <div className="@container flex flex-col gap-6">
      <div>
        <p className={LABEL}>Frame 2, in Paper</p>
        <img
          src="/works/apolloed/build/handoff-frame2.webp"
          alt="The Paper frame attached to the Lovable prompt: the dashboard after a trait change, with a sidebar, the Preview mode strip and its three school dropdowns, four metric cards, an attendance line chart, enrollment bars and a strategic plan goals table, every card tagged Generated. Five blue numbered dots mark the ripple order: the grade span dropdown, the metric row, the attendance chart, enrollment by grade, and the goals table."
          draggable={false}
          loading="lazy"
          width={1600}
          height={1154}
          className="block h-auto w-full rounded-[12px] border border-hairline"
        />
      </div>

      <div>
        <p className={LABEL}>The ripple notes, from the prompt</p>
        <div className="grid grid-cols-1 gap-6 rounded-[14px] border border-hairline bg-white p-5 @min-[640px]:grid-cols-2 @min-[640px]:gap-8 md:p-7">
          <div>
            <p className="font-display text-[18px] font-medium leading-[1.3] text-ink-primary">When any dropdown changes</p>
            <ol className="mt-4 flex flex-col gap-2.5">
              {ORDER.map(([what, when], i) => (
                <li key={what} className="flex items-baseline gap-3 font-mono text-[13px] leading-[1.5] text-ink-primary">
                  <span className="inline-flex size-[22px] shrink-0 translate-y-[-1px] items-center justify-center self-center rounded-full bg-accent-washi-blue/45 text-[11.5px] font-semibold">
                    {i + 1}
                  </span>
                  <span>
                    {what} <span className="text-ink-faint">({when})</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <ul className="flex flex-col gap-2.5 border-t border-hairline pt-5 font-mono text-[12.5px] leading-[1.6] text-ink-body [text-wrap:pretty] @min-[640px]:border-l @min-[640px]:border-t-0 @min-[640px]:pl-8 @min-[640px]:pt-0">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
