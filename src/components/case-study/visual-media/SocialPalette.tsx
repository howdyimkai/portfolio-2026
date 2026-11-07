// Section 03's figure: the social palette (Kai's social color guidelines, cut down). Mockup:
// Claude-Workspace/nimbalyst-local/mockups/visual-media-03-palette.mockup.html. Chrome is the
// portfolio's; the swatches are Tallo's real colors, since the colors are the content. Static.
// The old and new swatch in a pair touch with no arrow or gap, because the greens are only 1.08:1
// apart and a gap hides the change. The purple and green pairs keep a gap between them (lime next
// to purple at small sizes breaks the social palette's rule). Labels: white on Purple, Social
// Purple and Nightshade, Nightshade on every light swatch, never white on lime.
// Young Serif is Tallo's social display font, so it is loaded here only, for the sample text in
// the three pairing tiles (posts, so the font is content). Everything else is portfolio type.
import { Young_Serif } from 'next/font/google'
import type { Visual } from '../types'

const youngSerif = Young_Serif({ weight: '400', subsets: ['latin'], display: 'swap' })

type Swatch = { name: string; hex: string; light?: boolean }

const PAIRS: { from: Swatch; to: Swatch; delta: string }[] = [
  {
    from: { name: 'Purple', hex: '#7960DC' },
    to: { name: 'Social Purple', hex: '#7C3AED' },
    delta: '10 degree hue shift. Saturation 64% to 83%.',
  },
  {
    from: { name: 'Green', hex: '#BDF184', light: true },
    to: { name: 'Key Lime', hex: '#B3FF6A', light: true },
    delta: '2 degree hue shift. Saturation 80% to 100%.',
  },
]

const PALETTE: (Swatch & { use: string })[] = [
  { name: 'Nightshade', hex: '#1E0F41', use: 'Main background and text.' },
  { name: 'Social Purple', hex: '#7C3AED', use: 'Text pills, spotlight frames, filled shapes.' },
  { name: 'Key Lime', hex: '#B3FF6A', light: true, use: 'Highlights, wins and opportunity moments.' },
  { name: 'Panache', hex: '#F8FED3', light: true, use: 'Static captions on dark backgrounds.' },
  { name: 'Video Caption Yellow', hex: '#FDFF97', light: true, use: 'Video captions, always with a 3 pt stroke.' },
  { name: 'Lilac', hex: '#E2D6FF', light: true, use: 'Soft light background. Dark text only.' },
]

const TILES = [
  { text: 'Lime on Nightshade', bg: '#1E0F41', fg: '#B3FF6A', verdict: 'Do', note: 'bright on dark' },
  { text: 'Dark text on Lime', bg: '#B3FF6A', fg: '#1E0F41', verdict: 'Do', note: 'dark text on light' },
  { text: 'Lime on Purple', bg: '#7C3AED', fg: '#B3FF6A', verdict: 'Avoid', note: 'they buzz, keep a gap' },
]

const EYEBROW = 'mb-3 font-mono text-[12px] uppercase leading-[1.4] tracking-[0.06em] text-ink-muted'
const EDGE = 'shadow-[inset_0_0_0_1px_rgb(61_50_38/0.12)]'
const ink = (s: Swatch) => (s.light ? 'text-[#1E0F41]' : 'text-white')

function Label({ s }: { s: Swatch }) {
  return (
    <>
      <span className="font-bold">{s.name}</span>
      <span>{s.hex}</span>
    </>
  )
}

export default function SocialPalette(_: { visual: Visual }) {
  return (
    <div className="@container">
      <p className="sr-only">Master Purple #7960DC becomes Social Purple #7C3AED. Master Green #BDF184 becomes Key Lime #B3FF6A.</p>

      <section>
        <p className={EYEBROW}>Turned up for social</p>
        <div className="flex flex-col gap-6 @min-[640px]:flex-row @min-[640px]:gap-8">
          {PAIRS.map(({ from, to, delta }) => (
            <div key={from.name} className="min-w-0 flex-1">
              <div className={`flex overflow-hidden rounded-[12px] ${EDGE}`}>
                {[from, to].map((s) => (
                  <div key={s.name} className={`flex h-32 min-w-0 flex-1 flex-col justify-end p-3 font-mono text-[12px] leading-[1.4] ${ink(s)}`} style={{ backgroundColor: s.hex }}>
                    <Label s={s} />
                  </div>
                ))}
              </div>
              <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-primary">{delta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className={EYEBROW}>The social palette</p>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 @min-[640px]:grid-cols-3">
          {PALETTE.map((s) => (
            <li key={s.name} className="min-w-0">
              <div className={`flex h-[88px] flex-col justify-end rounded-[12px] p-3 font-mono text-[12px] leading-[1.4] ${ink(s)} ${EDGE}`} style={{ backgroundColor: s.hex }}>
                <Label s={s} />
              </div>
              <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-muted">{s.use}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <p className={EYEBROW}>Pairings</p>
        <ul className="grid grid-cols-1 gap-x-3 gap-y-5 @min-[640px]:grid-cols-3">
          {TILES.map((t) => (
            <li key={t.text} className="min-w-0">
              <div
                className={`flex h-28 items-center justify-center rounded-[12px] p-4 text-center text-[20px] leading-[1.2] ${youngSerif.className}`}
                style={{ backgroundColor: t.bg, color: t.fg }}
              >
                {t.text}
              </div>
              <p className="mt-2 font-mono text-[12px] leading-[1.5] text-ink-muted">
                <b className="font-bold text-ink-primary">{t.verdict}:</b> {t.note}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
