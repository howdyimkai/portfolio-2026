// The page change fade (AppShell): the page's <main> and the footer, both tagged data-page-enter,
// fade in when the path changes. 400ms on a soft ease-out, tuned by Kai on 2026-11-02. Opacity only:
// a transform on <main> would become the containing block for the garden's and the rodeo's fixed
// pieces and shift them while it plays.
export function playPageEnter() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.querySelectorAll('[data-page-enter]').forEach((el) =>
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }),
  )
}
