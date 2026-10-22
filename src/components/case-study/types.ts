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
  // Placeholder shape only, ignored once there's a src. tiles lays the slot out as several pieces
  // (a row of four phones, a strip of frames) so page length reads true before the art exists;
  // cols is [phones, md and up]. frame: 'browser' draws a toolbar on the slot.
  tiles?: { aspect: string; label?: string }[]
  cols?: [number, number]
  frame?: 'browser'
}

export type Block =
  | { kind: 'p'; text: string }
  // "What I owned": numbered 01, 02, 03.
  | { kind: 'owned'; items: string[] }
  // A place and year heading, like a slug line in a script.
  | { kind: 'scene'; slug: string; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  // A labeled one liner set apart from the body, like a "how might we".
  | { kind: 'callout'; label?: string; text: string }
  // A short list of named rules, each with what it drove.
  | { kind: 'rules'; items: { title: string; text: string }[] }
  // Short cards in a row, each with its own small visual (Cal's rules, one pose per card).
  | { kind: 'cards'; items: { text: string; visual: Visual }[] }
  // Several short quotes together, quieter than a single pull quote.
  | { kind: 'quotes'; items: { text: string; cite?: string }[] }
  // A funnel drawn from real counts: each step's bar is its share of the first step.
  | { kind: 'funnel'; steps: { label: string; count: number }[]; caption?: string }
  | { kind: 'visual'; visual: Visual }

export type Chapter = {
  id: string
  title: string
  // Leaves the chapter out of the 01, 02, 03 count (a TL;DR ahead of chapter 1).
  unnumbered?: boolean
  blocks: Block[]
}

export type Stat = {
  value: string
  label: string
  // A definition printed under the strip, so the number never needs a hover to make sense.
  note?: string
}

export type CaseStudy = {
  // A small label above the title, like "Case study · Product design". Optional.
  eyebrow?: string
  title: string
  hook: string
  // One honest line above everything else. Optional.
  coldOpen?: { text: string; source?: string }
  meta: { label: string; value: string }[]
  hero: Visual
  stats: [Stat, Stat, Stat]
  // A pull quote under the stat strip. Optional.
  quote?: { text: string; cite?: string }
  chapters: Chapter[]
}
