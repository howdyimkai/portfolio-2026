import ProjectCard, { type Project } from '@/components/works/ProjectCard'

// Design Garden leads, then Tallo's Cal Quiz (positioning, 2026-10-10), then Tallo Brand System. The
// Cal Quiz card links to the Cal case study. ApolloEd is hidden for now (see HIDDEN below).
const PROJECTS: Project[] = [
  {
    name: 'Design Garden',
    hook: 'Helping designers ship the project they keep putting off, with a partner and a deadline.',
    mark: 'ship the project',
    story: 'A four week sprint platform I built and run. Designers pair up, check in weekly, and end on showcase night with real progress on their next move.',
    role: 'founder',
    year: '2026',
    // The case study hero's landing page loop in its MacBook (Kai, 2026-11-01), in the wide window
    // with no browser chrome of its own; the mask cuts the loop to the laptop. The landing still is
    // its poster and the reduced motion frame. These files are outside the password gate.
    cover: {
      anim: '/works/design-garden/hero/landing-still.webp',
      still: '/works/design-garden/hero/landing-still.webp',
      device: 'browser',
      video: {
        webm: '/works/design-garden/hero/landing-loop.webm',
        mp4: '/works/design-garden/hero/landing-loop.mp4',
        mask: '/works/design-garden/hero/landing-mask.webp',
        aspect: '1408 / 816',
      },
      alt: 'Design Garden\'s landing page on a laptop: "Dig into your craft. Ship your best work, together." with crew avatars in cowboy hats floating over fall leaves',
    },
    href: '/works/design-garden',
    cta: 'see how it grew',
  },
  {
    name: "Tallo's Cal Quiz",
    hook: 'A career quiz teens actually want to finish, with a mascot to guide them.',
    mark: 'actually want',
    story: 'I created Cal, a compass mascot, and a three minute story quiz that gets teenagers started on career discovery. I built it with our community, tested it, and product adopted it into the core experience.',
    role: 'brand and product',
    year: '2026',
    // The Cal hero's desktop Welcome in the hero's browser window (Kai, 2026-10-24, matching the case
    // study hero): the plate at 800 wide (a still, so it serves as both frames) with the hero's own
    // Cal layer bobbing on top. Box is the hero's Cal box grown 20% from the feet, as the tablet
    // cover did, so Cal stands off the screen (Kai, 2026-10-22).
    cover: {
      anim: '/works/tallo-cover-browser.webp',
      still: '/works/tallo-cover-browser.webp',
      // A copy of the hero's Cal layer beside the other covers: under /works/cal/ the password gate
      // caught it, so logged-out visitors got no Cal.
      float: { src: '/works/tallo-cover-cal.webp', box: [42.07, 27.95, 18.32, 33.66] },
      device: 'browser',
      alt: 'Cal\'s Career Quiz welcome screen on desktop: Cal the compass waving in front of a mountain trail, above a Begin Expedition button',
    },
    href: '/works/cal',
    cta: 'meet cal',
  },
  {
    name: 'Tallo Brand System',
    hook: 'Brand guidelines our AI tools read before they write.',
    mark: 'read before they write',
    story: 'I rebuilt Tallo\'s brand as data, gave each role its own AI context, and built a linter and an eval to check the drafts. Invented stats in testing went from 31% to zero.',
    role: 'brand systems',
    year: '2026',
    // The case study's setup walkthrough on its role step (Kai, 2026-10-24: the role you pick is the
    // system's point), captured from the live card at 2x without its border and saved 800 wide, in
    // the browser window like the Tallo card.
    cover: {
      anim: '/works/brand-system-cover-setup.webp',
      still: '/works/brand-system-cover-setup.webp',
      device: 'browser',
      alt: 'The brand system setup asking "What do you do?" with eight roles to pick from, from social media to executive',
    },
    href: '/works/brand-system',
    cta: 'see the system',
  },
  {
    name: 'Tallo Video System',
    hook: 'Short videos about big career decisions, and the system that kept them coming.',
    mark: 'big career decisions',
    story: 'I turned hours of live sessions into a series of under three minute episodes, then wrote the guidelines our team and interns made every video from. Twelve episodes so far.',
    role: 'video and motion',
    year: '2026',
    // The reel teaser's first frame, in the wide window like the other 16:9 covers. It plays on hover.
    cover: {
      anim: '/works/visual-media/reel-teaser-still.webp',
      still: '/works/visual-media/reel-teaser-still.webp',
      device: 'browser',
      teaser: { webm: '/works/visual-media/reel-teaser.webm', mp4: '/works/visual-media/reel-teaser.mp4' },
      alt: 'Reel teaser: white type on blue reading "Real career paths," then "Real decisions," as Real Careers, Real Journeys episode cards fan in.',
    },
    href: '/works/visual-media',
    cta: 'watch the reel',
  },
]

// Hidden 2026-10-24 (Kai) to keep /works at three cards. Move back into PROJECTS to bring it back.
// const HIDDEN: Project[] = [
//   {
//     name: 'ApolloEd',
//     hook: 'An edtech dashboard.',
//     story: 'The story behind this dashboard is on its way.',
//     role: 'product design',
//   },
// ]

// White grid paper, the same shelf nav as the homepage, and the cards two up (2026-11-09,
// design-intent/works-layout-exploration/NOTES.md).
export default function WorksPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14">
      <h1 className="sr-only">Selected works</h1>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </div>
  )
}
