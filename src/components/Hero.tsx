import ZenGarden from '@/components/ZenGarden'

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-6 pb-16 pt-6 md:px-10 md:pt-10">
      {/* On short desktop screens the garden gives up width so the shelf nav (222px) still
          leaves the tool cards where they sat under the old 74px bar. 1.553 = plot aspect 803/517. */}
      <div className="relative mx-auto max-w-[900px] md:max-w-[min(900px,calc((100dvh_-_469px)*1.553))]">
        <ZenGarden />
      </div>
    </section>
  )
}
