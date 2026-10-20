// The shared case study template's content model (sprint plan, 2026-10-20): a stat strip of three,
// a chapter bar, and one visual per chapter. Each case study is one of these, in src/content/.

// A visual with no src renders as a labeled placeholder, so the page can be read before the
// recordings and exports exist. The label says what goes there.
export type Visual = {
  label: string
  src?: string
  // Animated sources get a first frame for reduced motion.
  still?: string
  alt?: string
  caption?: string
  // CSS aspect ratio, e.g. '16 / 10'. Defaults to 16 / 10.
  aspect?: string
}

export type Block =
  | { kind: 'p'; text: string }
  // "What I owned": numbered 01, 02, 03.
  | { kind: 'owned'; items: string[] }
  // A place and year heading, like a slug line in a script.
  | { kind: 'scene'; slug: string; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'visual'; visual: Visual }

export type Chapter = {
  id: string
  title: string
  blocks: Block[]
}

export type Stat = {
  value: string
  label: string
  // A definition printed under the strip, so the number never needs a hover to make sense.
  note?: string
}

export type CaseStudy = {
  title: string
  hook: string
  // One honest line above everything else. Optional.
  coldOpen?: { text: string; source?: string }
  meta: { label: string; value: string }[]
  hero: Visual
  stats: [Stat, Stat, Stat]
  chapters: Chapter[]
}
