'use client'

// No address on the page or in the markup: the mailto is assembled on click so scrapers don't find it.
export default function SayHowdy() {
  return (
    <button type="button" className="rs-btn" onClick={() => (location.href = 'mailto:' + ['uxdesignerkaitran', 'gmail.com'].join('@'))}>
      Say howdy
    </button>
  )
}
