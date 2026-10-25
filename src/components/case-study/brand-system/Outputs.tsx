import Strip from '../Strip'
import type { Visual } from '../types'

// Ch 5's outputs strip (handoff 2026-10-25): pieces made with the system, as product screens on the
// warm panel. From md the Instagram post fills the left column and the LinkedIn ad stacks over the
// video cover on the right, one rectangle (Kai, 2026-10-25; the partner one-pager moved above the
// testimonial). The post is contained on its own near-white where the box isn't quite its shape,
// so nothing is cropped. One column on phones. The video cover links out to YouTube rather than
// adding a second player.
export default function Outputs({ visual }: { visual: Visual }) {
  return (
    <div className="rounded-[14px] bg-tag px-5 pb-6 pt-6 md:px-10 md:pb-10 md:pt-10">
      <Strip items={visual.strip ?? []} aspect="1 / 1" cols={[1, 2]} look="screen" feature />
    </div>
  )
}
