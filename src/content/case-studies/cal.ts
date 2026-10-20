import type { CaseStudy } from '@/components/case-study/types'

// Copy: Claude-Workspace/projects/2026-10-PortfolioSprint/Final Drafts/
// CaseStudy_Cal_ChapterOutline_v2.md (2026-10-19) and CardCopy_Locked_2026-10-19.md.
// Private working draft: nothing here is approved by Tallo yet, so the page is unlisted (see
// src/app/works/cal/page.tsx). Never put 1 in 13 next to 1 in 3 as a comparison: different groups.
export const cal: CaseStudy = {
  title: "Cal's Career Quiz",
  hook: 'Helping young people start career discovery with a three minute story instead of a ten minute test.',
  meta: [
    { label: 'Status', value: 'Shipped' },
    { label: 'Role', value: 'Character, concept, quiz design, the Typeform build, sound, production wireframes' },
    { label: 'Team', value: 'Me, plus a content writer, a product manager and our developer for the in product build' },
    { label: 'Timeline', value: 'Jul 2025 to May 2026' },
    { label: 'Context', value: 'Tallo, a career platform for people 13 to 30' },
  ],
  hero: {
    label: 'Cal and one navigator result screen, animated (the motion study)',
  },
  stats: [
    { value: '86.5%', label: 'finish it in product' },
    { value: '68.7%', label: 'of starters land in a career hub' },
    { value: '1 in 3', label: 'go on to start the full assessment' },
  ],
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
      blocks: [
        {
          kind: 'p',
          text: "Tallo's career assessment worked once people started it, but almost nobody got there. I created Cal, a compass mascot, and a three minute story quiz that sorts you into one of six navigators and drops you into a real career hub. It ran in Typeform, then product built it in.",
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
            'Cal: the character, the six navigator variants, and the rules that keep Cal consistent',
            'The quiz: RIASEC rewritten as trail scenarios, the story arc, the soundscape, the Typeform build',
            'The handoff: wireframes, production copy, a launch checklist with the analytics events we needed',
          ],
        },
      ],
    },
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          kind: 'p',
          text: "1 in 13 people who visited the career hub ever reached the assessment. The page literally said \"10 minute assessment,\" and ten minutes is a lot to ask of a 15 year old who doesn't know why they should care yet. Moving the button wasn't going to fix that. It needed a front door.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'The old "Start my 10 min assessment" page, cropped, with the 1 in 13 stat overlaid',
          },
        },
        {
          kind: 'callout',
          label: 'How might we',
          text: 'How might we make career discovery feel like something a teenager chooses to do?',
        },
      ],
    },
    {
      id: 'who',
      title: "Who it's for",
      blocks: [
        {
          kind: 'p',
          text: "Early Explorers, 13 to 17, the largest group of people who finish Cal's quiz (about 42%).",
        },
      ],
    },
    {
      id: 'rules',
      title: "Cal's rules",
      blocks: [
        {
          kind: 'cards',
          items: [
            { text: "Cal is a compass. Cal doesn't carry one.", visual: { label: 'Cal pose' } },
            { text: 'Cal guides, never decides.', visual: { label: 'Cal pose' } },
            { text: "Cal is not AI. (Tallo's AI is COACH.)", visual: { label: 'Cal pose' } },
          ],
        },
      ],
    },
    {
      id: 'finding',
      title: 'Finding Cal',
      blocks: [
        {
          kind: 'p',
          text: "Cal started as Orion, a constellation guide, with a full set of space scenarios. It was fun and it was wrong. Careers aren't a galaxy you get beamed into. They're trails you walk, so Orion came down to earth as a compass. I sketched Cal by hand and used AI to develop the final character and six variants.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'Orion concept, hand sketch, final Cal, left to right',
            caption: 'From constellation to compass.',
          },
        },
      ],
    },
    {
      id: 'quiz',
      title: 'The quiz',
      blocks: [
        {
          kind: 'p',
          text: 'Each RIASEC item became a moment on the trail from the Valley of Confusion to the Peak of Clarity, with four options, one per type. Cal reacts between questions like an older friend. Rain, wooden planks and birds at a lake play underneath, so it feels like a place instead of a form.',
        },
        {
          kind: 'visual',
          visual: {
            label: '3 quiz screens and 1 result screen, or the rebuilt prototype with sound on',
          },
        },
      ],
    },
    {
      id: 'product',
      title: 'Into the product',
      blocks: [
        {
          kind: 'p',
          text: 'The Typeform did well enough that product adopted it. My job changed from building the quiz to getting it built well: wireframes, production copy, and a launch checklist that named the analytics events before code freeze. After launch I noticed "completed" firing more often than "started," switched us to a unique user funnel, and flagged it to our product manager.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'A wireframe next to the shipped screen',
          },
        },
      ],
    },
    {
      id: 'happened',
      title: 'What happened',
      blocks: [
        {
          kind: 'p',
          text: 'Cal finishes at about the same rate as the full assessment, 86.5% to 88.1%, without the $2,500 scholarship or the ad spend. About 1 in 3 people who start Cal go on to start the full assessment.',
        },
        {
          kind: 'funnel',
          steps: [
            { label: 'Started Cal', count: 2695 },
            { label: 'Finished', count: 2332 },
            { label: 'Landed in a career hub', count: 1851 },
            { label: 'Started the full assessment', count: 810 },
          ],
          caption: 'Unique people at each step, in product. Percentages are of everyone who started.',
        },
      ],
    },
    {
      id: 'started',
      title: 'What Cal started',
      blocks: [
        {
          kind: 'p',
          text: "Cal turned into a format. Tallo's community ran a challenge most months, and four of them needed a career fit quiz, so I wrote down what made Cal feel like Cal and built each one on it. Completion stayed between 75.6% and 82.1%.",
        },
        {
          kind: 'quotes',
          items: [
            {
              text: 'Love the gamification you all are doing to get people engaged.',
              cite: "Brandon Wasserburger, Netflix producer turned marketer, on Cal's Passport Challenge",
            },
            { text: "I'd choose the quiz because it told me about myself at the end.", cite: 'Tallo member' },
            { text: 'It really sounds like me.', cite: 'Tallo member' },
          ],
        },
        {
          kind: 'visual',
          visual: {
            label: 'Four quiz covers in a row, same family, different topics',
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
          text: "In August a quiz built like Cal pulled 135 people. In September the same format pulled 8. Two things changed at once, the prize and its spot on the home page, and I still can't say which one did it.",
        },
        {
          kind: 'p',
          text: 'What I can say: a quiz is only half the design. The other half is where it lives. That\'s why Cal belongs inside the product, where people already show up looking for direction.',
        },
      ],
    },
  ],
}
