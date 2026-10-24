import ProjectCard, { type Project } from '@/components/works/ProjectCard'

// Design Garden leads, then Tallo (positioning, 2026-10-10). Tallo links to the Cal quiz case
// study; ApolloEd is still a "coming soon" card.
const PROJECTS: Project[] = [
  {
    name: 'Design Garden',
    hook: 'Helping designers ship the project they keep putting off, with a partner and a deadline.',
    mark: 'ship the project',
    story: 'A four week sprint platform I built and run. Designers pair up, check in weekly, and end on showcase night with real progress on their next move.',
    role: 'founder',
    year: '2026',
    // designgarden-cover.gif frames 0-66 (the Takeaway tab), 480px wide animated WebP.
    cover: {
      anim: '/works/design-garden-cover-anim.webp',
      still: '/works/design-garden-cover-still.webp',
      alt: "Design Garden: two designers' shared garden board for the week",
    },
    href: '/works/design-garden',
    cta: 'see how it grew',
  },
  {
    name: 'Tallo',
    hook: 'A career quiz teens actually want to finish, with a mascot to guide them.',
    mark: 'actually want',
    story: 'I created Cal, a compass mascot, and a three minute story quiz that gets teenagers started on career discovery. I built it with our community, tested it, and product adopted it into the core experience.',
    role: 'brand and product',
    // The Cal hero's desktop Welcome in the hero's browser window (Kai, 2026-10-24, matching the case
    // study hero): the plate at 800 wide (a still, so it serves as both frames) with the hero's own
    // Cal layer bobbing on top. Box is the hero's Cal box grown 20% from the feet, as the tablet
    // cover did, so Cal stands off the screen (Kai, 2026-10-22).
    cover: {
      anim: '/works/tallo-cover-browser.webp',
      still: '/works/tallo-cover-browser.webp',
      float: { src: '/works/cal/hero/desktop-1-cal.webp', box: [42.07, 27.95, 18.32, 33.66] },
      device: 'browser',
      alt: 'Cal\'s Career Quiz welcome screen on desktop: Cal the compass waving in front of a mountain trail, above a Begin Expedition button',
    },
    href: '/works/cal',
    cta: 'meet cal',
  },
  {
    name: 'ApolloEd',
    hook: 'An edtech dashboard.',
    story: 'The story behind this dashboard is on its way.',
    role: 'product design',
  },
]

// White grid paper, the same shelf nav as the homepage, and the three cards.
export default function WorksPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
      <h1 className="sr-only">Selected works</h1>
      <div className="grid grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {PROJECTS.map((p) => (
          <div key={p.name} className="flex w-full max-w-[440px]">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
