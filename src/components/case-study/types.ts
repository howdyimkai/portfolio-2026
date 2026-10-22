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
  frame?: 'browser' | 'screen' | 'device'
  // A product flow you can step through by tapping, in place of a still (the Cal quiz hero).
  flow?: Flow
  // Captures of one page in a browser frame with a switch between them (a before and after). They
  // share the visual's aspect, so crop them to the same size and zoom.
  compare?: { label: string; src: string; alt: string }[]
  // A row of art on one baseline, each with a caption, that opens larger on tap (Calvolution). The
  // pieces share the visual's aspect and lay out by cols, like placeholder tiles. With frame
  // 'screen' they're product screens instead: a second caption line (note), and a mark that rings
  // a part of the screen.
  // With frame 'device' they're screens in their own mockup bezel, shown as they are.
  strip?: { src: string; alt: string; caption: string; note?: string; mark?: Box }[]
  // Several captures, each in its own browser frame with a label above and a caption under (Cal
  // chapter 8, one per month). Laid out by cols; a link or a small note can follow a caption.
  browsers?: { label: string; src: string; alt: string; caption: string; note?: string; link?: { label: string; href: string } }[]
}

// A box on a screen image as % of the image: [left, top, width, height]. Percentages, so hotspots
// sit over the <img> at any size with no measuring.
export type Box = [number, number, number, number]

export type Screen = {
  // Read out when the step changes, like "Path 3 question".
  name: string
  src: string
  alt: string
  // 'next' advances (the green button). 'select' marks one choice and stays put, no scoring.
  targets?: { label: string; box: Box; does: 'next' | 'select' }[]
  // A decorative layer over the screen that floats on its own (Cal on the welcome screen).
  float?: { src: string; box: Box }
}

// Width and height are the screens' size in design px (the Paper artboard), which the frame uses
// to draw on top of them at the right scale. select is how a picked option looks, in the same px:
// the option's corner radius and where its radio sits (inset from the right edge, diameter).
export type ScreenSet = {
  width: number
  height: number
  select?: { radius: number; radio: { right: number; size: number } }
  screens: Screen[]
}

// One flow, captured twice: desktop screens in a browser frame from md up, mobile screens in a
// phone frame under md. Both lists are the same steps in the same order, so the current step
// survives a resize across the breakpoint.
export type Flow = {
  desktop: ScreenSet
  mobile: ScreenSet
  // Opens the real thing in a new tab, under the frame.
  link?: { label: string; href: string }
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
  // A short list of named rules, each with what it drove. With poses, each rule is a card with its
  // character beside it, the poses reading in order down the list.
  | { kind: 'rules'; items: { title: string; text: string; pose?: { src: string; alt: string } }[] }
  // Short cards in a row, each with its own small visual (Cal's rules, one pose per card).
  | { kind: 'cards'; items: { text: string; visual: Visual }[] }
  // Several short quotes together, quieter than a single pull quote.
  | { kind: 'quotes'; items: { text: string; cite?: string }[] }
  // A funnel of shares, not counts (case studies show percentages and ratios only). share is % of
  // the first step and sets the bar; value is what's printed when it isn't exact, like "about 30%".
  | { kind: 'funnel'; steps: { label: string; share: number; value?: string }[]; caption?: string }
  | { kind: 'visual'; visual: Visual }
  // A character's style kit laid out as one stacked sheet (Cal chapter 6).
  | { kind: 'kit'; kit: Kit }

// A mascot's kit: who it can be, how it talks, how it feels, what it carries, its colors, and where
// it showed up. Character art is on white or flat panel grey and multiplies onto the page.
export type Kit = {
  label: string
  intro: string
  personas: { name: string; type: string; src: string; alt: string }[]
  // One line per row of the type specimen. scale is the line height, as the spec names it.
  specimen: { scale: string; text: string; face: 'adamina' | 'hubballi' | 'inter'; note: string }[]
  expressions: { name: string; src: string }[]
  expressionsNote: string
  props: { name: string; src: string }[]
  propsNote: string
  palette: { name: string; hex: string }[]
  paletteNote: string
  inUse: {
    note: string
    image: { src: string; alt: string; width: number; height: number }
    // Click to load: nothing from YouTube loads until it's asked for.
    video: { youtubeId: string; title: string; poster: string }
  }
}

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
