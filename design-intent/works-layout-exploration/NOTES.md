# Selected works layout — decided from /proto/works-deck (2026-11-09)

Problem (Kai): on /works the product image with the blossoms was too small to be
compelling. Three cards across at up to 440px left the cover window about 350px wide.

- Direction: 2×2. Two columns from 768px, one column below, in a 1200px container
- The card keeps its stacked shape: cover on top, chalkboard under it, ledge between
- Cover window fills the cover (480px wide at 1440, about 1.4× the old one)
- Name and role · year moved off the cover onto the top of the chalkboard, so the cover
  is only the product
- Browser bar redrawn for the larger window (26px, 8px dots); blossoms held to 13% and
  9.5% of the window so they stay accents
- Hook 23px from 768px (21px below), story and CTA unchanged
- Hover and keyboard focus paint the cover's background blue (`CoverPaint.tsx`):
  - texture: the painted frame of the sprint's `inspiration/Paintloop.mp4`
    (`public/works/cover-paint.webp`)
  - mask: six hand-drawn strokes of different widths and wobble, alternating direction,
    edges frayed by a noise filter
  - enter, all together: pull in 420ms (`--ease-out-strong`), fade up 240ms, and swell
    from 42% to full width over 540ms on `cubic-bezier(0.65, 0, 0.35, 1)`, so the cover
    is zebra stripes of blue and paper for a moment; a last coat fades in over 300ms
    from 260ms to close the gaps
  - exit: everything pulls off at once in 260ms
  - reduced motion: the fill appears with no transition. Touch never sees it

Rejected:
- Rows (one wide card per row, cover beside the board, 625px window): biggest cover, but
  a long page, and Kai preferred seeing two at a time
- Flashcards (the scroll deals a pinned deck, after `inspiration/flashcardmotion.mov`,
  with the top card tucking behind the stack instead of leaving the screen): pins the
  page for two screens of scroll and shows one project at a time. A card this size
  can't clear the stack without leaving the screen, so it lifted 40% and faded through
  the swap
- Shuffle (the same deck dealt by buttons, arrow keys or a tap on the stack): hides
  three projects behind a click
- Slowing Paintloop.mp4 itself: it is a still with a six frame wipe, so it would stutter
- Paint as five even gradient bands: too uniform, read as a machine wipe
- Paint strokes one after another over about 1s (280, 200, 310, 225, 290, 175ms starting
  at 0, 175, 295, 510, 630, 810ms): natural, but slow
- Exit as a stroke by stroke rewind: slower still, and crossing the grid left several
  cards unpainting at once
- Swell starting after the pull-in (at 220ms): read as two moves and stuttered

Review pass (2026-11-09, emil-ui-review):
- Cover and board sit on the page grid's rows (subgrid), so a row shares one cover height
  and the ledges line up. Before, Design Garden's cover was 18px shorter than Cal's
- Page top padding 56 → 24px and cover padding 44/36 → 36/32px from 768px: at 1440 the
  first row's hooks end at y=783, inside a browser window on a 900px screen. The story and
  link stay below the fold on purpose; the whole card is the link
- Browser screens hold 800×448 in CSS, so the cover keeps its height before the image loads
- Cal and Brand System covers re-exported at 1200px (Cal from the hero's 1600px plate; the
  setup walkthrough recaptured at 883px wide, role step, 3×)

Open:
- Not checked in Safari (a filter inside an SVG mask) or on a real phone
