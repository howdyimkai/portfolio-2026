import type { CaseStudy } from '@/components/case-study/types'

// Build plan: Claude-Workspace/projects/2026-10-PortfolioSprint/case-studies/design-garden/
// CaseStudy_DesignGarden_Handoff.md (2026-10-31, Session 1 done: copy and hero). Copy is that folder's
// CaseStudy_DesignGarden_ChapterOutline_v1.md as of 2026-10-31, plus Kai's 2026-10-31 garden pass (the
// garden body and captions, What's next, and the 8 of 8 stat with its Almanac link).
// Visuals without a src are placeholders named after the outline's [VISUAL] notes.
export const designGarden: CaseStudy = {
  title: 'Design Garden',
  hook: 'Helping designers ship the project they keep putting off, with a partner and a deadline.',
  coldOpen: {
    text: "In 2023 I was running portfolio sprints for other designers with a portfolio I hadn't finished.",
  },
  meta: [
    { label: 'Role', value: 'Founder. Product, design, and the app. I run every crew.' },
    { label: 'Built with', value: 'React and Supabase, with Claude Code as my build partner' },
    { label: 'Timeline', value: 'Spring 2025 to now (app built from Jan 2026)' },
    { label: 'Status', value: 'Live' },
  ],
  // The landing page loop in its MacBook frame (Kai, 2026-10-31: ship it as is; a browser frame
  // re-export would match Cal). artifacts/01-Hero/DesignGardenLPLoop.webm cropped 8px past the
  // laptop and flattened on the tag beige; landing-mask.webp is its alpha (the laptop never moves), so
  // no browser has to play alpha video. The still keeps real alpha. The 95% line in the screenshot stays.
  hero: {
    label: 'Design Garden landing page loop',
    aspect: '1408 / 816',
    video: {
      webm: '/works/design-garden/hero/landing-loop.webm',
      mp4: '/works/design-garden/hero/landing-loop.mp4',
      mask: '/works/design-garden/hero/landing-mask.webp',
    },
    still: '/works/design-garden/hero/landing-still.webp',
    alt: 'Design Garden\'s landing page: "Dig into your craft. Ship your best work, together." Crew avatars in cowboy hats float over fall leaves, around a card for the Fall Sprint, Oct 5 to Nov 13.',
    link: { label: 'Visit Design Garden', href: 'https://designgarden.xyz' },
  },
  stats: [
    { value: '4', label: 'crews' },
    {
      value: '80%',
      label: 'weekly check ins',
      note: 'Of all the weekly check ins pairs were scheduled to do, 80% happened in the app.',
    },
    // Kai, 2026-10-31. The 8 are everyone who answered the summer 2026 survey, never "all participants".
    {
      value: '8\u00a0of\u00a08',
      label: "survey respondents said they wouldn't have gotten this far without it",
      note: '8 survey respondents, summer 2026.',
    },
  ],
  statsLink: { label: 'See what the summer 2026 crew shipped', href: 'https://designgarden.xyz/almanac' },
  quote: {
    text: 'The accountability from deadlines was huge. I accomplished a lot more than I thought I could. I have two young kids and a full-time job.',
    cite: 'Jacob, Digital Experience Manager, Summer 2026 crew',
  },
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
      unnumbered: true,
      blocks: [
        {
          kind: 'p',
          text: "Most designers know what they should be working on. They're just doing it alone, at night, after a day job. Design Garden gives them one partner, four weeks, a weekly check in, and a showcase night at the end. I designed it, built it, and I run it.",
        },
      ],
    },
    {
      id: 'owned',
      title: 'What I owned',
      hook: 'One program, one score, one app',
      blocks: [
        {
          kind: 'owned',
          items: [
            'The program: four week sprints, the schedule, showcase night, 4 crews so far',
            'The matching: six signals scored in code, then a live speed round',
            'The app: designed and built by me, with AI as my build partner',
          ],
        },
      ],
    },
    {
      id: 'started',
      title: 'Where it started',
      hook: "I was the part that didn't scale",
      blocks: [
        {
          kind: 'scene',
          slug: 'Miami, 2023',
          text: 'I met cofounders Angie Gonzalez and Rebeca Kaplan at Miami Hack Week. We were fresh UX bootcamp grads with no "real world" case studies, tired of applying to endless jobs. So we became the main characters of our own problem statement. We joined Buildspace, and that turned into [Sprintfolio](https://www.linkedin.com/company/sprintfolio): two week sprints for designers like us.',
        },
        {
          kind: 'scene',
          slug: 'San Francisco, summer 2023',
          text: 'Out of 5,400 projects, [Buildspace](https://buildspace.so/sf1) picked 35 for its first SF class. Sprintfolio was one of them.',
        },
        // artifacts/02-buildspace (Kai, 2026-10-31: after San Francisco, not Miami as the handoff had it).
        {
          kind: 'visual',
          visual: {
            label: 'Kai with the Sprintfolio Notion template at Buildspace',
            src: '/works/design-garden/started/sprintfolio-template.webp',
            alt: 'Kai smiling at Buildspace in San Francisco, holding up an iPad open to the Sprintfolio Notion template, beside a laptop showing the Sprintfolio site and a "sprint folio" table sign.',
            aspect: '1200 / 1186',
            caption: 'The Notion template we ran Sprintfolio sprints on.',
            print: true,
            printWidth: 400,
          },
        },
        {
          kind: 'scene',
          slug: 'Every season after',
          text: "Our community ran 250+ sprint teams. It worked, and I was the part that didn't scale. Every season meant 6+ hours in a spreadsheet, pairing people by hand.",
        },
      ],
    },
    {
      id: 'matching',
      title: 'Matching',
      hook: 'Six hours in a spreadsheet became six\u00a0signals in code',
      blocks: [
        {
          kind: 'p',
          text: 'I moved matching into code. Every possible pair gets a score on six things: goals, experience, skills, discipline, timezone, and how each person gives and wants feedback.',
        },
        {
          kind: 'p',
          text: "Skills was the interesting one. Partners don't work on the same project, and two people with the same skills don't teach each other much. So the score peaks at about 25 to 50% overlap, not 100%.",
        },
        {
          kind: 'p',
          text: 'Then the summer 2026 surveys said people wanted to meet before committing. The live workflow swap mid sprint already gave people a boost, so I added a speed round before pairs lock. Now the code makes the shortlist and the designers make the pick.',
        },
        {
          kind: 'quote',
          text: "I enjoyed the breakout rooms last night. I'd say they could even be 10 minutes just for the ability to meet more people.",
          cite: 'Week 1 pulse survey, summer 2026',
        },
        // The real match card, rebuilt as a component (design-garden/MatchCard.tsx), scored by the
        // ported matching logic on a seeded demo pair.
        {
          kind: 'visual',
          visual: {
            label: 'Match card with the compatibility breakdown',
            custom: 'match-card',
            caption: 'Six signals, one score per pair. A demo pair, scored by the real logic.',
          },
        },
      ],
    },
    {
      id: 'garden',
      title: 'The garden',
      hook: 'Every check in plants something',
      blocks: [
        {
          kind: 'p',
          text: 'A task list only grows. Nobody prunes it, and it feels like homework. I wanted check ins to be a two player mode, so every pair shares a whimsy garden. Each check in plants something. By week four, the pair can see what they built together.',
        },
        {
          kind: 'quote',
          text: 'I did not expect that our chats would be more like solo builder therapy sessions.',
          cite: 'Week 1 pulse survey, summer 2026',
        },
        // The check in, before and after, both live (design-garden/GardenCompare.tsx): the app's dashboard
        // today, then the upgrade. Captions live in the component, since they swap with the toggle.
        {
          kind: 'visual',
          visual: {
            label: 'Before and after: the garden check in',
            custom: 'garden-compare',
          },
        },
      ],
    },
    {
      id: 'showcase',
      title: 'Showcase night',
      hook: '8\u00a0of\u00a08 said they wouldn\'t have gotten this far without it',
      blocks: [
        {
          kind: 'p',
          text: "After summer 2026, all 8 designers who answered the survey said their project wouldn't have gotten as far without Design Garden. One of them put it like this:",
        },
        {
          kind: 'quote',
          text: 'I whipped up a quick website instead of a portfolio... and landed a paid project with a startup the next day.',
          cite: 'Summer 2026 crew member',
        },
        // No Almanac crop on the page, just the link out (Kai, 2026-10-31).
        { kind: 'link', label: 'See the full Almanac', href: 'https://designgarden.xyz/almanac' },
      ],
    },
    {
      id: 'next',
      title: "What's next",
      hook: 'It works. Now it gets a proper design pass.',
      blocks: [
        {
          kind: 'p',
          text: "Since January, I built for function: make it work and get real crews using it. Now I'm giving Design Garden a proper design pass. The check in and the garden went first, and the before and after above shows what changed. The rest of the app is next.",
        },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      hook: "The part I'm not handing to the code",
      blocks: [
        {
          kind: 'p',
          text: "Sprintfolio ran on me. In 2023, AI couldn't read a spreadsheet, so I paired people by hand and waited for the tools to catch up. I watched self serve products make money and kept ours low cost, since access was the mission. It wore me down.",
        },
        {
          kind: 'p',
          text: "What I believe now: cheap made it too easy to skip. Fall 2026 is $50, and I'm watching whether paying turns into showing up. And the more AI can do, the more people miss building next to each other. That's the part I'm not handing to the code.",
        },
      ],
    },
  ],
}
