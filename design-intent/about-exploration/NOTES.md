# About page — decided from /proto/about (Kai, 2026-10-18)

Brief: an About page with an interactive shelf of felt objects; clicking one shows
what Kai is currently into. Built three ways, Kai kept **Shadow box**.

## Direction: Shadow box
- The shelf is the page. Three floating birch planks, objects large
  (`--zoom` 1 phones, 1.4 sm, 1.7 xl), centered in a column capped at 760px.
- A docked panel beside the shelf (400px, sticky on lg) **starts as the bio**,
  so the page lands for someone who never touches a toy. Picking an object swaps
  the panel to that card in place; picking it again, or "← back to about me",
  returns to the bio. The shelf never leaves view.
- Picked object stays lifted 5 units with its shelf light on (`data-active`).
- Panel swap: keyed re-mount, 220ms opacity + 6px rise, strong ease-out. None
  under reduced motion.
- Phones: panel stacks under the shelves; a pick scrolls the panel into view
  only when it's below the fold.
- Principles: a quiet mono list under the shelves (lg), after the panel on phones.
- Hover moments (mouse hover or keyboard focus only, never touch):
  Archie hops with a landing squash, Toph loaf-stretches, notebook tilts out,
  star book cover swings open on a left hinge to "currently reading →", TV
  warms up with a stepped flicker, lamp nods and lights, cactus wiggles,
  pumpkin rocks back and glows orange, cassette bounces with three notes.
  Reduced motion keeps only the glows.
- No paired asset states were exported (TV on, Toph awake, etc.); every hover
  is CSS over the single image.

## Revision (Kai, 2026-10-18)
- White grid paper (`.grid-sheet`), same as /works.
- Bio panel moved to the **left** (360px, sticky on lg); shelves on the right.
- The chalkboard frame is back with the five principles, **hung on the wall**
  beside the shelves (swings from its top, 2° crooked, straightens on hover). The
  shelves narrowed to fit their objects so the two read as one balanced group.
  An earlier try stood the frame on the middle shelf with the top plank cut
  short; Kai preferred it on the wall.
- Side by side at md (frame 280px) and xl (330px); stacked under the shelves
  below md and between lg and xl, where the column beside the bio is too narrow.
  Chalk text is 4cqw of the frame, so it stays 11 to 13px everywhere.

- Desktop (lg+), Kai 2026-10-18: the frame hangs **above** the shelves
  (280px lg, 300px xl), with the "pick anything up" label between them. The
  bio photo grows to 220px and sits above the name, so the panel (~1030px tall at
  1440) balances the taller right column (~980px). md still puts the frame beside
  the shelves; phones stack it under them. Mobile not revisited yet.
- Kai, 2026-10-18: the two columns pull together and center under the nav
  (bio 460px at xl, 420px at lg, 64px gap). The bio opens with a new intro
  ("I'm Kai Tran, product designer and creative lead. Chronically tinkering in
  St. Louis.") in small mono, then a hero sentence in Bricolage at 32px: "I design
  learning experiences where brand & product play a duet." The old
  "howdy, I'm Kai" header and the "designer and tinkerer" line are gone from it.
- Kai, 2026-10-18: the frame grows (340px lg, 370px xl; chalk ~15px). The
  "what I'm into" label moves onto the left end of the top shelf (an 80 unit
  lead slot, `AboutShelf lead`), with the TV and lamp pushed right. The mono text
  there is a stand-in for Kai's handwritten asset. The childhood photo
  (`kai-horse`) is tucked over the bottom-right corner of the main photo at +5°.
  Intro line 2 is now "Chronically tinkering and daydreaming in St. Louis."
- Kai, 2026-10-18, scrapbook pass (refs: collage/pinboard moodboards): the two
  photos are straightened (`kai-focus-flat`, `kai-horse-flat`; the exports had
  the tilt baked in) and printed on aged paper (#f5eee1). Today's photo is
  true to color: a warm faded grade plus an edge vignette read as washed out
  (Kai), so only the childhood print keeps a light age (sepia .15, saturate .92). Today's print is taped with blue
  washi at -2.5°, the childhood one pinned with a red pin at +6°. Kai's stamp
  (from the nav exploration) sits to the left of today's print, and the whole group
  is centered in the panel, the garden's cherry blossom on the
  main print's corner. Prints straighten a touch on hover.

## Rejected
- **Gallery wall** (Kai's mockup as drawn: bio + photo collage, principles in
  the chalkboard frame, small shelves, centered lightbox with prev/next).
  Faithful but the shelf is a footnote under a wall of text, and the lightbox
  covers the shelf you were exploring.
- **Letter** (text first, one plank inside the letter, a pick rewrites the
  "right now I'm …" sentence). Calmest, but the objects shrink to ~half size
  and stop feeling like toys.

## Open
- Card copy for reading, watching, growing, listening, cats, and the Design
  Garden social is placeholder (marked `draft: true` in `src/components/about/data.ts`).
  TikTok, Luma, and field notes links are `#`.

# Object detail view — decided from /proto/about-detail (Kai, 2026-11-02)

Brief: Kai didn't like the bio panel swapping to each object's card ("I'd prefer a
clean view of the items and maybe we see the shelf again so you can click through
easily"). Built three ways, Kai kept **Shelf drawer**.

## Direction: Shelf drawer
- The bio panel never swaps. It's the page's left column, always (`AboutBio`).
- Picking an object opens a quiet caption card right under that object's plank
  (`ShelfCaption`), with a notch pointing up at the toy that was clicked (both cats
  share one card; the notch finds the one you picked). Nothing covers the page.
- While a card is open, the other objects step back to 40% opacity (200ms), and come
  back to full on hover. The picked one keeps its lift and shelf light.
- The card: category, title, subtitle · date, note (56ch max), CTA as a quiet
  underlined link, ← n/8 → to walk the cards in shelf order (top shelf first), × to close.
  Picking the same object again also closes it.
- Open/close: `grid-template-rows` 0fr → 1fr, 280ms strong ease-out, with the card
  fading in over 200ms; the notch slides 280ms when you pick another object on the
  same shelf. Swapping cards re-mounts the content with a 200ms fade. No motion under
  reduced motion.
- Hidden cards are `inert`, so tabbing never lands in a closed drawer.

## Rejected
- **Lightbox + shelf**: full page over /about, object large on cream paper, caption
  below, a mini copy of the shelf along the bottom as the way through. The cleanest
  "view of the item", but it covers the page again, and the mini shelf's toys are
  ~25px on phones.
- **Sketchbook** (Kai's reference, a lightbox with an open book spread, tick scrubber
  on the left, wheel/arrow paging, "View all" back): the most journal-like, but the
  shelf is out of sight while it's open (the same problem that sank Gallery wall), and
  its elastic band was a CSS stand-in that would need felt art.

## Cactus bloom (Kai, 2026-11-02)
- While the "growing" card is open, Kai's dusty pink felt flower (`public/about/cactus-bloom.webp`,
  from `about-me/artifacts/Dusty pink felt flower@2x.png`, trimmed, 120px) sits on top of the cactus's
  right pad. Placed with `bloom.box` in `data.ts`, the same % registration as the cassette's open art.
- Grows from its base: scale 0 → 1 with a small overshoot (520ms, cubic-bezier(0.34, 1.56, 0.64, 1))
  and unwinds from -40°, 120ms after the pick so the cactus lifts first. It folds away in 160ms ease-in
  when the card closes. Reduced motion: a 200ms fade instead.
