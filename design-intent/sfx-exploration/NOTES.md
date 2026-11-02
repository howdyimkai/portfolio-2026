# Sound effects exploration

Prototype: `/proto/sfx` (`src/app/proto/sfx/`), sounds in `public/proto/sfx/`.
Started 2026-11-02. **Picked and promoted 2026-11-02** (Kai): tool knock, blossom kalimba,
reveal flourish, broom bamboo, bookmark flip, copy wood, sand hiss.

## What shipped

- `src/lib/sfx.ts`: one AudioContext, created on the first click or key press, which also
  fetches all ten files (`public/sfx/`, 98 KB). Mute is remembered in localStorage (`sfx-muted`),
  sound is on by default.
- `src/components/SoundToggle.tsx`: one toggle, three places. Desktop homepage tool rail
  (under drop tool), the phone menu (under the socials: the phone rail has no room, it's 339 of
  375px with a tool held) and the footer beside the copyright.
- Garden (`SandGarden.tsx`): knock on picking a tool, the same knock at 0.8 rate on putting it
  down; kalimba on each blossom stamp, walking C D E G A; flourish when a principle starts writing;
  hiss while raking, its level following the towed head's speed, silent 70ms after it stops and
  in the shelf's quiet zone. The eraser gets a softer hiss (Kai, 2026-11-02): about half the
  level (0.2 vs 0.35) and lower (2.2 kHz band vs 3.8 kHz), since it smooths the sand.
- Shelf broom (every press), résumé bookmark (opening), Copy email (footer, résumé, rodeo, phone menu).
- Every MP3 starts within 13ms of t=0 when decoded, except the broom swish, which swells in over 64ms.

## Where sound goes (and where it doesn't)

Calm page, playful touch: sound only on things a visitor chooses to do. No sound on
nav hover, page loads, scrolling or the title boil. A mute toggle (planned for the tool
rail, remembered per visitor) ships with the first sound. Browsers stay silent until the
first click anyway, so nothing plays on arrival.

| Moment | Candidates |
|---|---|
| Rake the sand | Hiss, Grain, Brush (live Web Audio noise, level follows speed) |
| Pick up / put down a tool | knock/wood, fit/land.light/finger_wood, fit/hit/bamboo_tok (put down = same take at 0.8 rate) |
| Stamp a blossom | pluck/kalimba_soft, mallet/celesta, ui_pop/soft, each in C pentatonic C5 to A5, one note per stamp |
| A principle writes on | mallet/flourish, mallet/up4, pro_shimmer/m1 |
| Sweep the shelf | swish/soft, swipe/cloth, fit/whoosh.short/bamboo_swish (0.6s, apex 0.3s for the 528ms sweep) |
| Tug the résumé bookmark | swipe/paper, swipe/glide, fit/snap/switch_flip |
| Copy email | notify/mid_wood, pro_notify/ding_1822, pluck/kalimba_soft C6 |

## Source

[earshot](https://github.com/Leonxlnx/earshot) (MIT), v0.4, commit 591fa3e. Every sound
is synthesized in code from its bank, no recordings. Installed at
`~/Desktop/Claude-Workspace/tools/earshot` in a Python 3.12 venv **without torch**
(no wheels for Intel Macs) and without librosa (llvmlite won't build); `sfx render` needs
neither. Re-render everything with `design-intent/sfx-exploration/render.sh`.

The rake sound isn't in the bank (it's built for film and UI one shots), so it's
synthesized live in the browser.

## Open

- `/proto/sfx` and `public/proto/sfx/` can go once the sounds have been lived with.
