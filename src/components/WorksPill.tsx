import Image from 'next/image'
import Link from 'next/link'

// "Pill", picked from /proto/works-nudge (Kai, 2026-11-02): a way into /works on the homepage
// for people who don't read the shelf toys as links. The tool rail's material with the shelf's
// felt cloud. Desktop: bottom right, across from the tools. Phones: centered just above the
// tool rail. 2026-11-16 (reviewer pass): 14px medium, a solid page fill and an ink border so it reads before hover. data-tool-quiet lets a held tool go quiet over it so it can be clicked.
export default function WorksPill() {
  return (
    <Link
      href="/works"
      data-tool-quiet
      className="group press-scale absolute bottom-[calc(max(16px,env(safe-area-inset-bottom))+116px)] left-1/2 z-40 flex w-max -translate-x-1/2 items-center gap-2 rounded-full border border-ink-primary/40 bg-page py-2 pl-2.5 pr-4 font-mono text-[14px] font-medium text-ink-primary shadow-[0_1px_2px_rgba(58,50,38,0.1),0_8px_24px_rgba(58,50,38,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-primary md:bottom-8 md:left-auto md:right-8 md:translate-x-0"
    >
      <Image src="/nav/shelf/cloud.webp" alt="" width={183} height={111} draggable={false} unoptimized className="h-auto w-10" />
      see selected works
      <span aria-hidden className="transition-transform duration-200 ease-[var(--ease-out-strong)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
