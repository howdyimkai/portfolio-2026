# My career rodeo — decided from /proto/career-rodeo (2026-10-30)

Brief: `Claude-Workspace/projects/2026-10-PortfolioSprint/about-me/IMPLEMENTATION_CareerRodeo.md`.
Copy of record: `about-me/ABOUT_Final.md`, "My career rodeo". The prototype lives on
`explore/proto-about-rodeo` (never merged); `/about` got the winner on `explore/brand-system`.

## Picked: Reel

The cowboy hat on the About shelf's top shelf opens a paper sheet over the page (the résumé's sheet,
scrim and dialog rules). Inside, a rope runs down the page with four era cards pinned to it: Story,
Systems, Learning, Building. You ride the hat down the rope.

- **The sheet never scrolls by itself.** The hat holds a line about 42% down and the rope reels up
  past it. Dragging the hat, the wheel and a swipe all do the same thing: move along the rope. This is
  what fixed Drag the hat, where page scrolling fought the drag.
- **You can see the whole trail first.** The full rope shows faintly, with every brass pin and every
  chalk era label. Cards wait as dashed outlines. Each photo and line appear when the hat reaches its
  pin, and stay.
- **Tap a pin or a waiting card** and the hat travels the rope to it (ease in and out, 380 to 900ms
  by distance), revealing what it passes.
- **Keyboard:** the hat is a slider. Arrows nudge it, Page keys jump pin to pin, Home and End.
- **Hint:** "drag the hat or scroll to ride the rope ↓" fades in after 700ms and stays. On phones it
  sits under the title, a size up, in primary ink. The hat nudges down until it's first moved.
- **Era labels:** Kai's handwriting turned near white on the shelf's chalk tile, at each photo's top
  outer corner (phones: always left, beside the pins). They stagger in when the sheet opens: from
  380ms, 90ms apart, 320ms each.
- **Card reveal:** 700ms, `cubic-bezier(0.22, 0.61, 0.36, 1)`, photo rises 11px and settles from
  0.97, line follows 90ms later. The strong ease out at 360ms felt too fast.
- **Rope (Kai's values):** outline 15px `#4a3627`, twist 8px `#dcb57e` dashed 11 on 12 off, trail x
  offset 2px, hover tilt 2°. Rope and hat are stand ins until Kai's art.
- **End:** a roomy lasso loop with a long tail on desktop, so the hat finishes clear of the loop,
  closing line below. Phones have no loop; the rope just ends.
- **Spacing:** about 36 to 40px between a card and the next card's tag. Captions use the bio's body
  type (13px/1.6, primary ink).

## Rejected

- **Under the page** (trail behind the bio and shelves, cards in the side gutters): Kai didn't like
  it. Crossings had to dodge the shelf label, and the right gutter collided with the résumé ribbon.
- **Below the bio** (its own stretch of page under the content, from Kai's sketch, drawn on with
  scroll): didn't make the cut once the overlay directions existed.
- **Over the page** (the sheet, rope drawing on as you scroll): kept as the fallback while exploring;
  Reel replaced it.
- **Drag the hat** (Over the page, but you pull the hat): Kai liked it, but the sheet's own scroll
  competed with the drag. Reel is this, minus the fight.

## Open

- Hat art: the stand in is the shelf nav's hat, so two hats show on /about. Swap Kai's hat 1:1.
- Rope art: drawn rope could replace the stroked stand in.
- Not yet tried on a real phone or trackpad (tested with simulated touch and wheel).

## Closing: stamp + Copy email (Kai, 2026-11-02)
- Under the closing line, Kai's stamp (the girl in the cowboy hat, `public/about/stamp.webp`, 68px,
  -6°, straightens a touch on hover) sits beside a dark Copy email button. It's the résumé's
  `SayHowdy` (copies the address assembled on click, swaps to "Copied" for 2s) with its own
  `rodeo-email` style. Centered on the wander layout, left aligned on the phone column.
- The closing block is now measured in `replan`, so the sheet's height always fits it (+56px).
- It stays `visibility: hidden` until the hat reaches the end of the rope, so the button isn't in the
  tab order before you can see it.
