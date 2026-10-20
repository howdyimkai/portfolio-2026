# Case study page backdrop and chapter bar, decided 2026-10-20 from /proto/case-study-paper

Kai picked **6, "Chalk frame, still"**: the chapter list chalked on the birch frame from /about,
over a faded grid.

- Backdrop: the grid paper fades out under the content column. A white wash at 85% over the grid,
  edges feathered over 56px, reaching 56px past the column on desktop (8px on phones). The grid
  stays full strength in the margins and under the frame.
- Chapter bar: `public/about/frame.webp` (same file as /about's principles frame) in a 240px
  column, sticky. Chalk text mono 13px; current chapter at 95% chalk white, others 50%.
- The frame hangs straight and swings -2deg toward the content on hover (400ms strong ease-out,
  from its top center like a nail). Kai first asked for a resting tilt toward the content, then
  preferred straight at rest with the tilt as the hover.
- An X closes the case study back to /works. It's styled like the nav's broom chip
  (shelf-nav.css `.shelf-broom`): ~36px frosted page color chip, hairline, blur, soft lift,
  black 85% ink; hover tints sand and turns the X -10deg, press scales 0.96. Pinned over the
  frame's top right wood corner. The X path is Kai's SVG.
- Desktop (lg+) only. Phones have no chapter bar or X; the shelf nav is the way back.

Rejected:
- 1 Current (text straight on the grid): grid lines run through ~600 words of body copy.
- 2 Paper sheet (white sheet, generated grain, soft lift): read as a document container, and the
  grain was generated rather than a real paper scan.
- 3 Faded grid with the hairline chapter list: kept the backdrop, lost to the frame.
- 4 Faded grid, wide (wash under the chapter bar too): unused once the chapters moved onto the
  frame, which reads better hanging on the full grid.
- 5 Chalk frame tilted at rest (2deg out, then -2deg toward content) with a chalk X inside the
  board: Kai preferred straight at rest, and the broom chip X over the chalk X.
