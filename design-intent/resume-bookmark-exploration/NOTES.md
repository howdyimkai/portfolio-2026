# Résumé bookmark — decided from /proto/resume-bookmark (2026-10-27)

Brief: strategy/HANDOFF_ResumeLinkedIn_PortfolioChanges.md, "Résumé bookmark: prototype
brief". A red felt ribbon hangs from the top edge, right of the shelf nav, and opens the
résumé on a paper sheet over the current page. No navigation; closing leaves you where you were.

- Direction: Tug. Hover dips the ribbon 6px and curls the V tail toward you
- Curl 44°, hover 340ms cubic-bezier(0.23, 1, 0.32, 1), tail perspective 420px
- Sheet rises from the bottom: open 780ms strong ease-out, close 360ms ease-in
  (cubic-bezier(0.55, 0, 1, 0.45)). 440ms felt too fast for a full page of travel
- Under-sheet: -7px, -13px, -1.7°. It trails by running 15% longer (897ms), not by
  starting later. A 20% delay was tried first: it sat still, then the ease-out's first
  frames jumped it ~310px at once (measured), which read as a stutter
- Behind the sheet: 7px backdrop blur plus grain at 0.2 (overlay blend), on a warm scrim
  at 0.2. The blur fades with the scrim's opacity, so backdrop-filter never animates
- Sheet 864px wide (720 + 20%), résumé type 15.5px mono, 41px name
- Ribbon label "résumé" matches the shelf's cubby labels (9.5px × shelf zoom) and sits on
  the line of their first row. The ribbon is sized from the label plus 12px of felt each
  side: 35px × zoom + 24px, so 68px at 1440×900 and 80px at the 1.6 zoom cap
- Bookmark keeps 56px clear of the open sheet and never goes off screen
- Shortened the same day: with the shelf tidied by the broom, the /works cards move up to
  92px + 96px·zoom and the ribbon ran 64px into them. The felt now ends 10px under the label
  and the V tail is 40/56 as tall as it is wide (was 64/56), about 197px long at 1440×900
  instead of 277px. The homepage shelf also took /works' size and top on desktop
- Phones: a 40px ribbon hangs from the PhoneMenu bar, left of the hamburger; the sheet is
  full screen
- Reduced motion: no curl, dip or travel, just a fade
- Homepage: the bookmark joins the tools' quiet zone (SandGarden QUIET_ZONE_SELECTOR)
- Shown on the shelf pages (home, /works and its case studies, /about). Not on /pieces/*
  (recordings), /resume (it is the résumé) or the Navigation pages (/play is out of scope)
- /resume is a plain page with the same résumé plus the draft's longer "Online résumé
  only" section (speaking with titles and links, awards, community)

Rejected:
- Page turn (tail folds past 90° so its darker back shows; sheet drops from the top):
  the fold hid the ribbon's end and read as folding, not curling
- Lift (tips peel up over a growing shadow; sheet grows out of the ribbon's tip and
  settles tilted): the most motion on a calm page

Still stand-ins: the three felt pieces (`public/resume-bookmark/*-standin.svg`) and the
lettered label. Kai's Paper art drops in 1:1 as 2x WebP, drawn at the 80px maximum
width (160px at 2x), with the tail 40/56 as tall as it is wide. The PDF (`public/resume/Kai-Tran-Resume.pdf`) isn't exported yet.
