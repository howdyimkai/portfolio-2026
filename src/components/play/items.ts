// The /play lineup (Kai, 2026-11-02): nine tiles in four rows, the last three normals. Copy is Kai's,
// from the playground brief (Claude-Workspace projects/2026-10-PortfolioSprint/playground/
// IMPLEMENTATION_Playground.md); decisions in design-intent/play-exploration/NOTES.md. Media lives in
// public/play/. No tile links anywhere: each one is the whole story.

export type Loop = { src: string; poster: string; w: number; h: number; alt: string }
export type Still = { src: string; w: number; h: number; alt: string }

// How a piece sits in its tile: flush on the surface (the nav loop, recorded on the page color),
// full bleed, contained on its own surface (Gengar), or an object with room around it.
export type Fit = 'flush' | 'bleed' | 'contain' | 'object'
export type Piece =
  | { kind: 'loop'; loop: Loop; fit: Fit }
  | { kind: 'still'; still: Still; fit: Fit }
  // A roast: before and after on one canvas, swapped by the case study toggle; opens on after.
  | { kind: 'compare'; before: Still; after: Loop }

export type Item = {
  id: string
  name: string
  type: string
  year: string
  wide?: boolean
  // The tile's own surface, where the art brings one (Gengar's navy), in place of the tint.
  surface?: string
  line?: string
  piece: Piece
}

const loop = (name: string, w: number, h: number, alt: string): Loop => ({
  src: `/play/${name}`,
  poster: `/play/${name}-poster.webp`,
  w,
  h,
  alt,
})

export const ITEMS: Item[] = [
  {
    id: 'ruler',
    name: 'Ruler nav',
    type: 'Interaction',
    year: '2026',
    wide: true,
    piece: {
      kind: 'loop',
      fit: 'flush',
      loop: loop('ruler', 1200, 222, 'A nav drawn as a ruler. Its tick marks swell toward the cursor, hovered cells light up blue, and a click moves the selected cell.'),
    },
  },
  {
    id: 'lenny',
    name: "Lenny's Lightning Round",
    type: 'Replit buildathon',
    year: '2026',
    line: "You answer first, then see who said it and why. Now you're comparing instead of nodding.",
    piece: {
      kind: 'still',
      fit: 'bleed',
      still: { src: '/play/lennys-lightning-round.webp', w: 1000, h: 1000, alt: "Two phones over a campfire at dusk. One shows the Lenny's Lightning Round badge and \"5 real quotes. 5 guesses.\"; the other shows an Oracle persona card." },
    },
  },
  {
    id: 'curiosity',
    name: 'Curiosity creates possibilities',
    type: 'Motion illustration',
    year: '2025',
    piece: {
      kind: 'loop',
      fit: 'bleed',
      loop: loop('curiosity', 900, 898, 'Red paper stars tumble around the words "curiosity creates possibilities" on a peach gradient, with a thin orbit line.'),
    },
  },
  {
    id: 'aih',
    name: 'AI for Humans',
    type: 'Concept roast',
    year: '2024',
    wide: true,
    line: 'I love how animated Gavin and Kevin are in their show, so I decided to amp that up.',
    piece: {
      kind: 'compare',
      before: { src: '/play/aih-before.webp', w: 1438, h: 691, alt: 'Before: the AI for Humans site as it was, a dark hero with an episode headline and a thumbnail of the hosts.' },
      after: loop('aih-after', 1438, 690, 'After: a bright podcast hero where the two hosts are big cartoon heads bouncing on either side of the headline.'),
    },
  },
  {
    id: 'hobonichi',
    name: 'Hobonichi Techo',
    type: 'Concept roast',
    year: '2025',
    wide: true,
    line: 'Hobonichi fans cover their planners in stickers and doodles, so I gave the site that same scrapbook feel.',
    piece: {
      kind: 'compare',
      before: { src: '/play/hobonichi-before.webp', w: 1438, h: 836, alt: 'Before: the Hobonichi store homepage, a grey bar over a carousel of planner colors and centered body copy.' },
      after: loop('hobonichi-after', 1200, 698, 'After: a scrapbook collage homepage with a sticky note nav. Hovered notes turn yellow and stickers sparkle.'),
    },
  },
  {
    id: 'gengar',
    name: 'Gengar Clefairy mirror',
    type: 'Illustration',
    year: '2025',
    line: 'Opposite of an identity crisis.',
    surface: '#100C3F',
    piece: {
      kind: 'still',
      fit: 'contain',
      still: { src: '/play/gengar-clefairy.webp', w: 773, h: 1000, alt: 'Gengar stands at a mirror in a small isometric room and sees Clefairy smiling back, above the words "not feeling like me, and I like it hehe".' },
    },
  },
  {
    id: 'moodeng',
    name: 'Moo Deng is iconic',
    type: 'Animated icon',
    year: '2024',
    piece: {
      kind: 'loop',
      fit: 'object',
      loop: loop('moodeng', 900, 896, 'Moo Deng the baby hippo as a pink app icon, opening her mouth and sticking out her tongue.'),
    },
  },
  {
    id: 'poster',
    name: 'Claude & Cursor 101 for designers',
    type: 'Workshop + poster',
    year: '2025',
    line: 'I designed the poster and hosted this hands-on workshop with Ashita Achuthan.',
    piece: {
      kind: 'still',
      fit: 'bleed',
      still: { src: '/play/claude-cursor-101.webp', w: 900, h: 900, alt: 'Poster for "Claude & Cursor 101 for designers, hands-on workshop with Ashita Achuthan": four halftone tiles of a starburst, a sun, a cube and an arrow.' },
    },
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp Sprint Design book',
    type: 'Commissioned illustration',
    year: '2023',
    piece: {
      kind: 'still',
      fit: 'object',
      still: { src: '/play/bootcamp-shoe.webp', w: 1400, h: 1200, alt: 'A red high top sneaker hand lettered with "Bootcamp Sprint Design" along its side.' },
    },
  },
]
