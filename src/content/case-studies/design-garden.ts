import type { CaseStudy } from '@/components/case-study/types'

// Copy: Claude-Workspace/projects/2026-10-PortfolioSprint/Final Drafts/
// CaseStudy_DesignGarden_ChapterOutline_v1.md (2026-10-19) and CardCopy_Locked_2026-10-19.md.
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
  // The /works cover GIF shows Kai and Amy's real board, and the outline says seeded demo pairs,
  // so the hero stays a placeholder until that recording exists.
  hero: {
    label: 'The shared garden, animated: pieces landing as a pair checks in, fall art showing the season. Seeded demo pairs, not real goals.',
  },
  stats: [
    { value: '4', label: 'crews' },
    {
      value: '80%',
      label: 'weekly check ins',
      note: 'Of all the weekly check ins pairs were scheduled to do, 80% happened in the app.',
    },
    { value: 'Live', label: 'app, built solo' },
  ],
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
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
      blocks: [
        {
          kind: 'scene',
          slug: 'Miami, 2023',
          text: 'I met Angie Gonzalez at Miami Hack Week. We were both bootcamp grads with portfolios nobody was holding us to. With Rebeca Kaplan, we turned that into Sprintfolio: two week sprints for designers like us.',
        },
        {
          kind: 'scene',
          slug: 'San Francisco, summer 2023',
          text: 'Out of 5,400 projects, Buildspace picked 35 for its first SF class. Sprintfolio was one of them.',
        },
        {
          kind: 'scene',
          slug: 'Every season after',
          text: "Our community ran 250+ sprint teams. It worked, and I was the part that didn't scale. Every season meant 6+ hours in a spreadsheet, pairing people by hand.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'The old matching spreadsheet next to the new match screen',
            caption: 'Six hours of hand pairing, and what replaced it.',
          },
        },
      ],
    },
    {
      id: 'matching',
      title: 'Matching',
      blocks: [
        {
          kind: 'p',
          text: 'I moved matching into code. Every possible pair gets a score on six things: goals, experience, skills, discipline, timezone, and how each person gives and wants feedback.',
        },
        {
          kind: 'p',
          text: "Skills was the interesting one. Two people with the same skills don't teach each other much, so the score peaks at 30 to 50% overlap, not 100%.",
        },
        {
          kind: 'p',
          text: 'Then the summer 2026 surveys said people wanted to meet before committing. The live workflow swap mid sprint already gave people a boost, so I added a speed round before pairs lock. Now the code makes the shortlist and the designers make the pick.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'A match card with the score breakdown, then a speed round still',
            caption: 'The code makes the shortlist. The designers make the pick.',
          },
        },
      ],
    },
    {
      id: 'garden',
      title: 'The garden',
      blocks: [
        {
          kind: 'p',
          text: 'Progress bars made it feel like work software, and this is something people do after work. So every pair shares a garden instead. Each check in plants something, and by week four the pair can see what they did together.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'The same garden in summer and in fall, side by side',
            caption: 'One garden, two seasons.',
          },
        },
      ],
    },
    {
      id: 'showcase',
      title: 'Showcase night',
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
        {
          kind: 'visual',
          visual: {
            label: 'The Summer 2026 Almanac, cropped to "The harvest" (needs Tashana and Mads to OK first)',
            caption: 'From the Summer 2026 Almanac.',
          },
        },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      blocks: [
        {
          kind: 'p',
          text: 'I built the matching to get six hours back. The score got good at finding people who fit on paper, and the crew still asked to meet first. So the code makes the list, and people make the call.',
        },
        {
          kind: 'p',
          text: "Where I could be wrong: the 8 who answered the survey are the ones who stayed. I don't hear much from the ones who left, and that's the next thing I want to fix.",
        },
      ],
    },
  ],
}
