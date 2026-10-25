// Visual 4, the palette hierarchy (Ch 3). Source of truth is Component_PaletteHierarchy_Spec.md in the
// sprint folder; tiers and family jobs come from the brand's colors.json. Chrome is the portfolio's;
// the swatches are Tallo's real colors, since the colors are the content.
// Left is the inherited guide page as an image (still waiting on approval to go public, per the build
// plan; the spec's fallback is a native grid of 38 equal swatches). Right is the rebuilt palette as
// live swatches whose size steps down by tier, at every width, since the scale is the hierarchy.
// Label ink: white on the dark swatches (Blue is the floor at 4.5:1), Nightshade on the light ones.

type Swatch = { name: string; hex: string; light?: boolean }

const PRIMARY: Swatch[] = [
  { name: 'Nightshade', hex: '#1E0F41' },
  { name: 'Purple', hex: '#7960DC' },
  { name: 'Lilac', hex: '#E2D6FF', light: true },
  { name: 'Green', hex: '#BDF184', light: true },
]

const SECONDARY: Swatch[] = [
  { name: 'Navy', hex: '#0C2A86' },
  { name: 'Blavy', hex: '#0D45B5' },
  { name: 'Blue', hex: '#0D6EFD' },
  { name: 'Sky', hex: '#ADE2FC', light: true },
]

const TERTIARY: { job: string; swatches: Swatch[] }[] = [
  {
    job: 'Finance, opportunity',
    swatches: [
      { name: 'Evergreen', hex: '#07362E' },
      { name: 'Panache', hex: '#F8FED3', light: true },
    ],
  },
  {
    job: 'Highlights, deadlines',
    swatches: [
      { name: 'Orange', hex: '#FF6D5B', light: true },
      { name: 'Rust', hex: '#5D0E04' },
      { name: 'Plum', hex: '#5C194D' },
      { name: 'Salmon', hex: '#FFD6CC', light: true },
    ],
  },
]

const EYEBROW = 'font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted'
const HEADLINE = 'mt-2 font-display text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ink-primary [text-wrap:balance] md:text-[26px]'
const TIER = 'font-mono text-[12.5px] leading-[1.5] text-ink-primary'
// A hairline on every swatch keeps the near-white ones (Panache) from melting into the page.
const EDGE = 'shadow-[inset_0_0_0_1px_rgb(61_50_38/0.12)]'

function ink(s: Swatch) {
  return s.light ? 'text-[#1E0F41]' : 'text-white'
}

export default function Palette() {
  return (
    <div className="@container">
      <div className="flex flex-col gap-12 @min-[760px]:grid @min-[760px]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] @min-[760px]:gap-10">
        <section aria-labelledby="palette-inherited">
          <p className={EYEBROW}>Inherited</p>
          <h3 id="palette-inherited" className={HEADLINE}>38 swatches, all the same weight</h3>
          <div className="mt-5 overflow-hidden rounded-[14px] border border-hairline bg-white">
            <img
              src="/works/brand-system/inherited-swatches.webp"
              width={1200}
              height={777}
              alt='Inherited brand guideline page titled "Color palette," showing 38 color swatches in equal-size blocks across rows for neutrals, purples, turquoises, greens, blues, plums, and oranges. The neutrals row labels a blue swatch "Primary Blavy." No swatch is marked as more important than another.'
              draggable={false}
              className="block h-auto w-full"
            />
          </div>
        </section>

        <section aria-labelledby="palette-rebuilt">
          <p className={EYEBROW}>Rebuilt</p>
          <h3 id="palette-rebuilt" className={HEADLINE}>Three tiers, and every family has a job</h3>

          <h4 className={`mt-5 ${TIER}`}>
            <span className="font-semibold">Primary</span> · the foundation, most touchpoints
          </h4>
          <ul className="mt-2.5 grid grid-cols-2 gap-2 @min-[480px]:grid-cols-4">
            {PRIMARY.map((s) => (
              <li
                key={s.name}
                className={`flex aspect-[2/1] flex-col @min-[480px]:aspect-[4/3] justify-end rounded-[12px] p-3 font-mono text-[12.5px] leading-[1.35] ${EDGE} ${ink(s)}`}
                style={{ backgroundColor: s.hex }}
              >
                <span className="font-semibold">{s.name}</span>
                <span>{s.hex}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-6 @min-[480px]:flex-row @min-[480px]:gap-8">
            <div className="min-w-0 @min-[480px]:flex-[4]">
              <h4 className={TIER}>
                <span className="font-semibold">Secondary</span> · info and interactions
              </h4>
              <ul className="mt-2.5 grid grid-cols-4 gap-1.5">
                {SECONDARY.map((s) => (
                  <li
                    key={s.name}
                    className={`flex aspect-[5/4] items-end rounded-[10px] p-2 font-mono text-[11.5px] leading-none ${EDGE} ${ink(s)}`}
                    style={{ backgroundColor: s.hex }}
                  >
                    {s.name}
                    <span className="sr-only">, {s.hex}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-body">Education, informational</p>
            </div>

            <div className="min-w-0 @min-[480px]:flex-[3]">
              <h4 className={TIER}>
                <span className="font-semibold">Tertiary</span> · stays in its family
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-3">
                {TERTIARY.map((f) => (
                  <div key={f.job}>
                    <ul className="flex flex-wrap gap-1">
                      {f.swatches.map((s) => (
                        <li key={s.name} className={`size-7 rounded-[7px] ${EDGE}`} style={{ backgroundColor: s.hex }}>
                          <span className="sr-only">
                            {s.name}, {s.hex}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-body">{f.job}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
