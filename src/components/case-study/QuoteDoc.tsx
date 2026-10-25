// A piece the quoted person made, set above the testimonial (Brand System: the Work-Based Learning
// Manager's partner one-pager, Kai 2026-10-25). It shows the top of the page at a readable size,
// the lower part blurred, since it's there to show the piece exists rather than to be read in full.
// No enlarge: the alt carries what's on the page. The item's aspect is the crop shown from the top
// of the page, chosen to end on white.
import './step-frame.css'
import type { Item } from './Strip'

export default function QuoteDoc({ item }: { item: Item }) {
  return (
    <span
      className="relative block w-full max-w-[540px] overflow-hidden rounded-[12px] border border-hairline bg-white"
      style={{ aspectRatio: item.aspect ?? '3 / 2' }}
    >
      <img src={item.src} alt={item.alt} draggable={false} className="qd-sharp absolute inset-0 h-full w-full object-cover object-top" />
      <img src={item.src} alt="" aria-hidden="true" draggable={false} className="qd-veil absolute inset-0 h-full w-full object-cover object-top" />
    </span>
  )
}
