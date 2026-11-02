# Garden check in — decided from /proto/garden-checkin, /proto/garden-tasks, /proto/garden-compare (2026-10-31)

**Shipped to the case study 2026-10-31** as the garden chapter's visual: custom visual
`garden-compare` (`src/components/case-study/design-garden/GardenCompare.tsx`, parts in
`design-garden/garden/`). The proto routes are deleted. In the case study the after opens mid check
in (wins, both answers in), its three captions (space, who leads, tasks) each jump the demo to their
moment, and the timer, the bloom and the growing text box aren't featured (Kai: the timer is left
out of the after entirely; bloom and the text box still work). Commits: 6c91fdb (chapter, copy pass,
stat strip link), 5f62edb (follow-ups below).

Brief: Design Garden case study, chapter 04 (The garden), its before and after visual. Handoff:
Claude-Workspace/projects/2026-10-PortfolioSprint/case-studies/design-garden/CaseStudy_DesignGarden_Handoff.md.
"Before" is today's check in, ported from DesignGardenTool (TetrisGarden, CanvasRitualBar,
CheckinPlant, SprintOverviewCard, WeeklyGoalCard) with the app's own colors, copy and motion.
"After" is the upgrade. 

## Decided

- Check in direction: Prompt card. One prompt at a time on a card, the thread under it, the
  garden beside it. Rejected: Lit plot (one surface, floating composer; the garden stays lit
  but the card had nowhere to put the leader and gate), Shared bed (the pair as two halves of
  one bed; the busiest of the three, and the plant label crowded entries at 390)
- Dashboard layout: Swap. Starting the check in swaps the task card for the check in card;
  the garden keeps the right at 47 / 53 (20% narrower than the dashboard's two thirds, Kai).
  Rejected: Side by side (three columns, cramped at 880), Tabs (liked first, but the card
  is squeezed under a tab bar; Swap won once Expand existed)
- Takeaway: the garden steps aside and the tasks take its place, editable (check off, rename
  in place with the name selected, remove, add; Return saves, Escape cancels). Nothing grows
  in the garden then, and it's when the app already asks you to review your tasks
- Leading: the card says who leads, with an info tooltip on what leading means ("More in the
  leader guide", no link). The leader's way on reads "Move us both to Obstacles →" and opens
  only once both have shared; pressing it while the partner is typing asks first ("Robin is
  still typing." Wait / Move on anyway). The follower gets no button
- Text box: grows from one line to 5 (desktop) / 3 (phone) lines, then scrolls. Return plants,
  Shift+Return is a new line; on touch keyboards Return is a new line. "Place my takeaway" gets
  its own full width row
- Ground: the sand texture multiplied by #c4a07a, a shade darker so pieces read on dirt
- End of the check in: the garden comes back interactive (drag pieces, tap one to read it)
- **Bloom on close (Kai, 2026-10-31, for the real app too).** Finishing the check in makes this
  week's plant bloom. Wins still grow the seedling stage by stage during the call, but closing
  turns it into the flower, whatever the count. The app blooms at 4 combined wins, so a light
  week ended on a seedling, and the end of the check in fell flat. A one time sparkle (warm glow
  plus eight drawn stars, ~1.7s, starts 540ms after the garden returns) marks it. Reduced
  motion: none
- Meeting timer, not a focus timer (Kai, 2026-10-31). It's there to keep the check in efficient:
  pairs get excited and run long. The leader sets the length they agreed to when starting (the
  app's 15 / 30 / 45 and its words, "How long do you want this check-in to run? A friendly
  countdown, not a hard stop."), and the countdown sits on the garden, top left, for both. At the
  takeaway, when the garden steps aside, it moves into the card's header. Amber at 00:00, never a
  hard stop. Joining when Robin leads shows what Robin set. The app already has this (begin gate +
  strip countdown, Phase 29); the upgrade moves the choice onto the dashboard card and the clock
  onto the garden. Rejected: the Pomodoro (PomodoroPanel, a solo work timer the app stopped
  showing on Jun 26, fb3165e) under the tasks, which was a misread of what the timer is for
- Case study presentation: Toggle (template's compare, live demos, opens on After). Rejected:
  Stacked (~1,350px for a ~70 word chapter), Look back (the before is the easiest to miss). The
  before is the app's dashboard row (tasks 1/3, garden 2/3) from its own resting state, with the
  real header (Flower.svg, ☰, 🌸, "You and Robin's Design Garden")
- Case study frame: the 880px column can't grow (chapter rail on the left). An Expand button
  opens the same live demo full screen, without restarting it
- Follow ups (Kai, 2026-11-01, 5f62edb): the frame is 5:4 from tablet up (~640px in the column,
  was 16:10 at ~500px), since the before's warm-up questions piled on each other in a ~290px
  garden. Starting a check in (either version) also opens the full screen view, so the flow runs
  where there's room and the column stays a preview. The "Who leads" caption also opens the
  leader's info tooltip; it closes on a click away, Escape, or another caption

## Rejected

- Kai's crayon dirt mound (artifacts/04-garden/Dirt mound ghost@2x.png) under the stage piece:
  looked awkward on the soil. Back to the soft dug bed

## To carry into DesignGardenTool

- Bloom on close (above). Where the app grows CheckinPlant from winsCount, the completed
  session's plant should be the flower; wins past 4 can still scale it, as now
- The leader gate and "Move us both" wording, if the prototype's flow is adopted
- Meeting timer: the length picked on the dashboard card, the countdown on the garden
- Kai chose to do these later, in their own session in DesignGardenTool
- Straight apostrophes in the app's ritual copy (What's, you're) could be curly

## Open

- Not pushed: Kai runs git push, which rebuilds the Vercel review preview
- Design Garden has no data/DATA-SUMMARY.md, though the repo's rule wants every stat backed there
  (8 of 8 was already in the Showcase night copy). The Almanac is now linked twice (stat strip,
  Showcase night) and 8 of 8 is both a stat and that chapter's hook
- The chapter outline in the sprint folder still has the old garden body, What's next and stat
  copy; design-garden.ts is the source of record
- New copy to approve: the gate lines, the leader tooltip, "Your tasks this week", "Robin
  started your check-in." / "Join check-in"
- The em dashes in the app's plant labels show inside the screens (page copy bans them)
