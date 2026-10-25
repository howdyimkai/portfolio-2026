// Visual 5, the social before and after (Ch 3). Source of truth is Component_SocialBeforeAfter_Spec.md
// in the sprint folder. A strip of the two master colors turned up for social (real colors, live
// labels), then the feed before and after as images. The grids are screenshots at 606px, so they
// never draw wider than that (about 424px each side by side in the column, full width on phones).
// The strip reads to screen readers as the spec's one sentence; the swatches and arrows are hidden.
// Labels stay Nightshade on the greens, never white on lime (a social palette rule).

type Swatch = { name: string; hex: string; layer: 'master' | 'social'; light?: boolean }

const PAIRS: [Swatch, Swatch][] = [
  [
    { name: 'Purple', hex: '#7960DC', layer: 'master' },
    { name: 'Social Purple', hex: '#7C3AED', layer: 'social' },
  ],
  [
    { name: 'Green', hex: '#BDF184', layer: 'master', light: true },
    { name: 'Key Lime', hex: '#B3FF6A', layer: 'social', light: true },
  ],
]

const GRIDS = [
  {
    id: 'before',
    label: 'Before',
    src: '/works/brand-system/social-before.webp',
    alt: 'A 3x3 grid of Instagram posts from Tallo\'s feed before the social refresh. The posts mix styles: a purple app promo, a photo of a young woman by a small plane, a "Training Gen Alpha for the workforce" video with a boy on a couch, a dense two-column text post comparing marketing teams, a teen in a park with a "bro you gotta see this" caption, and a dark navy "6 Free Skills You Can Learn in a Weekend" post over a photo of a photographer. The bottom row is cut off.',
  },
  {
    id: 'after',
    label: 'After the social layer',
    src: '/works/brand-system/social-after.webp',
    alt: 'A 3x3 grid of Instagram posts after the social refresh, sharing one look. A brighter purple app promo with serif headlines, a "Who knows you better: Showdown" cover with purple labels, a mountain photo with a pale yellow-green caption, a "10 insightful questions to ask recruiters" post with a lime tag, the same park video with a purple caption pill, and a green "Spotlight" template with a serif title. The bottom row is cut off.',
  },
]

// The source crop ends partway through the third row, so that row melts out instead of stopping
// mid frame: stacked backdrop blurs, each masked in a little lower and stronger than the last,
// over the bottom 22% (the cut row), and the whole frame (border too) fading out over its last stretch.
const BLUR = [1, 2, 4, 8, 16]

function Chip({ s }: { s: Swatch }) {
  return (
    <div
      className={`flex aspect-[3/2] min-w-0 flex-1 flex-col justify-end rounded-[12px] p-3 font-mono text-[12px] leading-[1.4] ${s.light ? 'text-[#1E0F41]' : 'text-white'}`}
      style={{ backgroundColor: s.hex }}
    >
      <span className="font-semibold">{s.name}</span>
      <span>
        {s.hex} · {s.layer}
      </span>
    </div>
  )
}

export default function Social() {
  return (
    <div className="@container">
      <p className="sr-only">Master Purple #7960DC becomes Social Purple #7C3AED. Master Green #BDF184 becomes Key Lime #B3FF6A.</p>
      <div aria-hidden="true" className="flex flex-col gap-3 @min-[640px]:flex-row @min-[640px]:gap-8">
        {PAIRS.map(([from, to]) => (
          <div key={from.name} className="flex min-w-0 flex-1 items-center gap-3">
            <Chip s={from} />
            <svg viewBox="0 0 24 12" className="h-3 w-6 shrink-0 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6h21M17 1.5 22 6l-5 4.5" />
            </svg>
            <Chip s={to} />
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-10 @min-[640px]:grid @min-[640px]:grid-cols-2 @min-[640px]:gap-8">
        {GRIDS.map((g) => (
          <section key={g.id} aria-labelledby={`social-${g.id}`} className="min-w-0">
            <h3 id={`social-${g.id}`} className="mb-3 font-mono text-[12px] uppercase tracking-[0.06em] text-ink-muted">
              {g.label}
            </h3>
            <div className="relative [mask-image:linear-gradient(to_bottom,black_86%,transparent)] max-w-[606px] overflow-hidden rounded-[12px] border border-hairline">
              <img src={g.src} width={606} height={660} alt={g.alt} draggable={false} className="block h-auto w-full" />
              {BLUR.map((b, i) => (
                <div
                  key={b}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%]"
                  style={{
                    backdropFilter: `blur(${b}px)`,
                    WebkitBackdropFilter: `blur(${b}px)`,
                    maskImage: `linear-gradient(to bottom, transparent ${i * 20}%, black ${(i + 1) * 20}%)`,
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
