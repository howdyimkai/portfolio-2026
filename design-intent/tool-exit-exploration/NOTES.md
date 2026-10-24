# Leaving tool mode — decided from /proto/tool-exit (2026-10-24)

Problem: on the homepage, once rake, eraser or blossom was picked there was no way to
put it down, and the shelf floats over the sand, so the gaps between cubbies rake. Going
for a nav link raked the sand on the way and flipped the cursor between rake and arrow.

Kai picked a combination of the two directions:

- Quiet zone: within 32px of any shelf piece (wordmark, cubbies, broom) the tool goes
  quiet. The tool cursor hides, the normal arrow returns, nothing rakes, erases or
  stamps. Back on open sand the tool picks up again, still selected
- Put down: clicking the held tool again puts it down, and the floating rail has a
  "put down" button whose slot is always reserved, so the tools never shift when it shows
- Keyboard: Escape puts the tool down (ignored while typing or with a modifier). The
  put-down button stacks "put down" over an esc keycap on hover-capable screens
- An X shortcut was tried and dropped the same day: Escape alone is the convention, and
  the side-by-side "put down x" label crowded the rail's edge

Rejected:
- Quiet zone alone: leaves keyboard users with no way out, and you still can't put the
  tool down on purpose
- Put down alone: you still rake on the way to the nav
- Showing the put-down button only while a tool is held, unreserved: the rail grew and
  the tools jumped 31px out from under the cursor
- Dropping the tool entirely on approaching the nav: you'd have to re-pick it every time
  you drift near the shelf
