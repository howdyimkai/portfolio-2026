// One data file drives the About shelf (design-intent/about-exploration/NOTES.md). Moving an object
// is changing its `shelf`; swapping one (the pumpkin becomes a seed packet later) is editing its entry.
// Cards marked `draft` still have placeholder copy for Kai to replace.

export type Hover = 'hop' | 'stretch' | 'swing' | 'tilt-out' | 'flicker' | 'lamp' | 'wiggle' | 'tilt-glow' | 'bounce-notes'

export type ShelfObject = {
  id: string
  card: string // card id; both cats open the same card
  shelf: 0 | 1 | 2
  src: string
  w: number // intrinsic px
  h: number
  height: number // display height in shelf units (1 unit = 1px at --zoom 1)
  alt: string
  hover: Hover
  lift?: number // nudge up off the plank, shelf units
}

export type Card = {
  id: string
  category: string
  title: string
  subtitle: string
  image: string
  note: string
  tags: string[]
  date: string
  cta?: { label: string; href: string }
  draft?: boolean
}

const p = (n: string) => `/about/${n}.webp`

export const OBJECTS: ShelfObject[] = [
  { id: 'tv', card: 'watching', shelf: 0, src: p('tv'), w: 345, h: 360, height: 78, alt: 'Clay TV', hover: 'flicker' },
  { id: 'lamp', card: 'tinkering', shelf: 0, src: p('lamp'), w: 339, h: 420, height: 104, alt: 'Felt desk lamp', hover: 'lamp' },
  { id: 'archie', card: 'cats', shelf: 1, src: p('archie'), w: 165, h: 252, height: 62, alt: 'Clay figurine of Archie, a cream cat', hover: 'hop' },
  { id: 'spine', card: 'notes', shelf: 1, src: p('spine'), w: 124, h: 339, height: 84, alt: 'Sage green felt notebook', hover: 'tilt-out' },
  { id: 'book', card: 'reading', shelf: 1, src: p('book'), w: 261, h: 338, height: 80, alt: 'Cream felt book with a star', hover: 'swing' },
  { id: 'toph', card: 'cats', shelf: 1, src: p('toph'), w: 253, h: 185, height: 42, alt: 'Clay figurine of Toph, a sleepy tabby cat', hover: 'stretch' },
  { id: 'cactus', card: 'growing', shelf: 2, src: p('cactus'), w: 241, h: 356, height: 82, alt: 'Felt cactus pincushion in a clay pot', hover: 'wiggle' },
  { id: 'pumpkin', card: 'garden', shelf: 2, src: p('pumpkin'), w: 309, h: 311, height: 68, alt: 'Clay pumpkin with a smiling face', hover: 'tilt-glow' },
  { id: 'cassette', card: 'listening', shelf: 2, src: p('cassette'), w: 361, h: 272, height: 56, alt: 'Pale blue clay cassette player', hover: 'bounce-notes' },
]

export const CARDS: Card[] = [
  {
    id: 'cats',
    category: 'living with',
    title: 'Archie and Toph',
    subtitle: 'the two bosses of the house',
    image: p('archie'),
    note: "Archie is the cream one who hops at anything that moves. Toph is the tabby who would like you to leave. They have their own TikTok, and it does better than anything I've ever posted.",
    tags: ['cats', 'chaos'],
    date: 'since 2021',
    cta: { label: 'watch on TikTok', href: '#' },
    draft: true,
  },
  {
    id: 'reading',
    category: 'reading',
    title: 'Book title goes here',
    subtitle: 'Author name, year',
    image: p('book'),
    note: 'Two or three sentences on why this book has my attention right now. What surprised me, and one line I keep thinking about when I should be doing something else.',
    tags: ['design', 'nonfiction'],
    date: 'started Oct 2026',
    draft: true,
  },
  {
    id: 'notes',
    category: 'writing',
    title: 'Field notes',
    subtitle: 'what tinkering teaches me',
    image: p('spine'),
    note: 'I build first and write second. Most notes start as something I made in code with AI as my build partner, then turn into a few paragraphs on what it taught me.',
    tags: ['substack', 'process'],
    date: 'new posts monthly',
    cta: { label: 'read the notes', href: '#' },
  },
  {
    id: 'watching',
    category: 'watching',
    title: 'Show title goes here',
    subtitle: 'season, where to watch',
    image: p('tv'),
    note: "A sentence or two about what I'm watching and the small moment in it that made me pause it to rewind. Film school never really leaves you.",
    tags: ['tv', 'story'],
    date: 'this week',
    draft: true,
  },
  {
    id: 'tinkering',
    category: 'tinkering on',
    title: 'This site',
    subtitle: 'a zen garden you can rake',
    image: p('lamp'),
    note: "The homepage is a sand tray you can rake and erase. I'm building it in Next and React with Claude as my pair, one felt toy at a time. You're standing in it.",
    tags: ['react', 'motion'],
    date: 'Oct 2026',
  },
  {
    id: 'growing',
    category: 'growing',
    title: 'A cactus that might flower',
    subtitle: 'week 6, no bloom yet',
    image: p('cactus'),
    note: "Swap this for whatever you're growing: a plant, a skill, a habit. Keep it to a couple of sentences so the card stays a glance, not a read.",
    tags: ['plants', 'patience'],
    date: 'week 6',
    draft: true,
  },
  {
    id: 'garden',
    category: 'hosting',
    title: 'Design Garden fall social',
    subtitle: 'St. Louis and online',
    image: p('pumpkin'),
    note: "A sprint community for designers who ship. Every season we get together, show what we made, and eat too many snacks. Next one's brewing, follow along.",
    tags: ['community', 'design garden'],
    date: 'fall 2026',
    cta: { label: 'follow on Luma', href: '#' },
    draft: true,
  },
  {
    id: 'listening',
    category: 'listening',
    title: 'Album or podcast title',
    subtitle: 'artist or host',
    image: p('cassette'),
    note: 'What has been on repeat while I work, and when I reach for it. One sentence is plenty here.',
    tags: ['music'],
    date: 'on repeat',
    draft: true,
  },
]

export const cardById = (id: string) => CARDS.find((c) => c.id === id)!

// Kai, 2026-10-18: the intro and hero sentence open the bio panel, the paragraphs follow.
export const INTRO = ["I'm Kai Tran, product designer and creative lead.", 'Chronically tinkering and daydreaming in St. Louis.']
export const HERO = 'I design learning experiences where brand & product play a duet.'

export const BIO = [
  "I'm currently shaping brand and product at Tallo, an edtech platform for early career explorers and starters. I design brand systems, run experiments in social and content, and carry what I learn back into the product. Growth loops are my jam.",
  'After hours, I tend Design Garden, a sprint platform I built and run where designers ship work together.',
  'I tinker first and write second. Most of my field notes start as something I built in code with AI as my build partner, including this site. I care about the little moments that make something feel alive: a character, a transition, a phrase that tugs at you.',
  "On teams I'm a translator. I turn technical ideas into stories people actually get, and what people say back into product decisions. Give me a problem and I'll mull it over on a Sunday night, in the grocery line, in all the boring spaces where thoughts get room to breathe.",
]

export const PRINCIPLES = [
  'Learning should feel like discovery, and discovery should be delightful.',
  'I design interfaces to fade, so content can shine and shimmer.',
  'The best designs remove friction rather than add it.',
  'Solid systems should be practical and save time.',
  'Great designs can be genius and stupid simple.',
]

export const YOUNG_PHOTO = { src: p('kai-horse-flat'), w: 215, h: 292, alt: 'Kai as a kid in a cowboy hat, sitting on a saddle' }
export const PHOTO = { src: p('kai-focus-flat'), w: 368, h: 522, alt: 'Kai smiling under blossoming trees' }
