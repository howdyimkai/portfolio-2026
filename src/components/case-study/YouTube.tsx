'use client'

// A still with a play button. Tapping it opens the YouTube player (nocookie) large, in the same
// <dialog> viewer as Strip's enlarge (Kai, 2026-10-24: in the column it played too small). Nothing
// from YouTube loads until then, and the player only mounts while the dialog is open, so closing it
// (Escape, the button, a tap outside the video) stops the video. Shared by Cal's kit (a 9:16 Short)
// and the Brand System challenge episode (16:9, `wide`). The caller sizes the poster via className.
import { useRef, useState } from 'react'
import './step-frame.css'

export default function YouTube({
  youtubeId,
  title,
  poster,
  chip,
  wide = false,
  className,
}: {
  youtubeId: string
  title: string
  poster: string
  // The label that rises on hover or focus.
  chip: string
  wide?: boolean
  className: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [on, setOn] = useState(false)
  const open = () => {
    setOn(true)
    dialog.current?.showModal()
  }
  return (
    <div className={className}>
      <button type="button" onClick={open} className="kit-play group absolute inset-0 block w-full cursor-pointer">
        <img src={poster} alt="" draggable={false} className="kit-poster absolute inset-0 h-full w-full object-cover" />
        <span className="kit-play-btn absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#211e1a] shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
          <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
        </span>
        <span aria-hidden="true" className="kit-play-chip absolute inset-x-0 bottom-4 mx-auto w-max rounded-full bg-[#211e1a]/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-white">
          {chip}
        </span>
        <span className="sr-only">Play: {title}</span>
      </button>
      <dialog ref={dialog} onClick={() => dialog.current?.close()} onClose={() => setOn(false)} aria-label={title} className="st-dialog st-dialog-video">
        <figure className="flex flex-col items-center gap-4 px-6 pb-6 pt-14">
          <div className={`kit-video overflow-hidden rounded-[12px] bg-[#211e1a] ${wide ? 'kit-video-wide' : ''}`}>
            {on && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0`}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="block h-full w-full"
              />
            )}
          </div>
          <figcaption className="text-center font-mono text-[13px] text-ink-muted">{title}</figcaption>
        </figure>
        <button type="button" className="st-close press-scale" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </dialog>
    </div>
  )
}
