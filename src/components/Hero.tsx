import ZenGarden from '@/components/ZenGarden'

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-6 md:px-10 md:pt-5">
      {/* Desktop width is solved together with the shelf nav's size so the tool cards peek
          148px at the fold (whole blossom) — see --home-garden-w in components/shelf/shelf-nav.css.
          data-home-hero: ShelfNav animates the garden inside it when the swept header collapses. */}
      <div data-home-hero className="relative mx-auto max-w-[900px] md:max-w-[var(--home-garden-w)]">
        <ZenGarden />
      </div>
    </section>
  )
}
