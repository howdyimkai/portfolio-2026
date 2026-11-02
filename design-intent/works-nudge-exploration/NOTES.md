# Way into the works — decided from /proto/works-nudge (2026-11-02)

Problem: the homepage's only way to /works was the "selected works" toy on the shelf,
which reads as a toy before it reads as a link. On phones the shelf is behind the
hamburger, so the work was two taps deep.

Kai's first idea was a button under the "psst, try the eraser above" hint. Not there:
the hint comes and goes on timers, two asks in one spot weaken both, and the space under
the title is where the eraser sweeps and the principles play.

- Direction: Pill (`src/components/WorksPill.tsx`, mounted in `SandboxHome`)
- Copy: "see selected works →", with the shelf's felt cloud (`/nav/shelf/cloud.webp`)
- The tool rail's material: page color at 85%, hairline border, same shadow and blur
- Desktop: bottom right of the sand, 32px in, across from the tools
- Phones: centered 110px above the tool rail's bottom offset, so it clears the rail
- Always there from the first second, no timers; the arrow nudges 2px on hover
- `data-tool-quiet` puts it in the tools' quiet zone (`QUIET_ZONE_SELECTOR` in
  `SandGarden.tsx`), so it can be clicked while holding the rake

Rejected:
- Shelf nudge (after 7s with no clicks or keys, the cloud does its tap Tic twice): the
  calmest option, but easy to miss, and nothing at all on phones
- Both (the nudge on desktop, the pill on phones only): Claude's pick; Kai preferred one
  simple thing on every size
