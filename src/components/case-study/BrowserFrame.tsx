import type { ReactNode } from 'react'

// A plain browser window drawn in code around a desktop capture: three dots, no address bar, so
// every capture on a case study sits in the same chrome whatever browser it was taken in.
export default function BrowserFrame({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-[12px] border border-hairline bg-white shadow-[0_1px_2px_rgba(58,50,38,0.06),0_8px_24px_rgba(58,50,38,0.08)] ${className}`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-hairline px-3" aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <span key={d} className="size-2 rounded-full bg-chip-line" />
        ))}
      </div>
      {children}
    </div>
  )
}
