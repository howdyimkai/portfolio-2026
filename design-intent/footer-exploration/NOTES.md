# Footer — decided from /works/proto-footer (2026-11-02)

Picked: **Chalkboard**, then two rounds of Kai's tweaks. Lives in `src/components/Footer.tsx` + `footer.css`.

- A full-width band of Kai's /works board (`public/works/case-study-chalk-large.webp`) with the
  wooden ledge (`public/play/ledge.webp`) redrawn as an 18px strip across its top edge. The board's own
  ledge is cropped off: phones scale the board to 140% of the band's height (bottom anchored), md+
  scale it to the band's width.
- Everything on it is chalk: rgb(240 236 226) at 0.9 to 0.95 for the invitation, 0.82 for the blurb
  and icons, 0.6 for the copyright, with a 1px chalk glow on text.
- Left: Kai's stamp (the rodeo sign off's girl in a cowboy hat, `STAMP` from about/data.ts) tilted
  −6deg beside "Come play. Say howdy." in the display face (32px). It straightens to −2deg while the
  pointer is over that block, like the rodeo's. 88px wide on md+, 76px on phones. Under it: Copy email
  (SayHowdy, chalk outline) and the phone menu's four socials (LinkedIn, GitHub, TikTok, X) as icons in
  44px chalk rings.
- Right: the locked footer blurb beside the shelf broom's glyph, with "© year Kai Tran" tucked under
  its bottom right (Kai: "makes the footer a bit shorter"). ~257px tall at 1440.
- Stacks in one column below 900px.

Rejected:
- **Current** (one mono line of text links): missing the locked footer copy and the sweep icon.
- **Paper** (bio left, chalk tiles right, on the grid paper): calm but the least memorable; the tiles
  were the only playful touch.
- **Ledge** (chalk tiles standing on a strip of the wooden ledge, labeled like the cubbies, centered):
  the tallest, and centered body text reads worse at the blurb's length.
- Chalk *tiles* on the board: chalk on chalk, so the board version draws chalk rings instead.
- Copyright on its own row under the band: cost a row of height for one small line.
