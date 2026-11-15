import type { CaseStudy } from '@/components/case-study/types'

// ApolloEd. Copy is locked: CaseStudy_DataTestDrive_ChapterOutline_v2.md (v2.9) in the sprint
// folder (case-studies/data-test-drive), built per BUILD-PLAN_ApolloEd_ClaudeCode.md. Everything
// from the outline's "# Kept off the page" down is not page content. Straight quotes here; the
// template curls them. Part two's media (Lovable exports, public/works/apolloed/) is in since
// Phase 2. The 2023 visuals are still labeled placeholders: Phase 3 builds their `custom` keys in
// src/components/case-study/apolloed/.
export const apolloed: CaseStudy = {
  eyebrow: 'Case study · Product design',
  title: 'ApolloEd',
  hook: 'Let school leaders try the dashboard before the district signs for the data.',
  meta: [
    { label: 'Role', value: '2023, UX consultant and team lead (4 UX designers). 2026, solo.' },
    { label: 'Timeline', value: '13 weeks, 2022 to 2023. Reimagined Nov 2026.' },
    { label: 'Status', value: '2023 design tested, not built. 2026 working prototype, not tested with users.' },
  ],
  hero: {
    // lovable-exports/new/00-hero-loop-v4 (mp4 + webm) and its poster, cropped to the laptop lid (no base or
    // shadow; Kai, 2026-11-15) so the screen fills the panel. hero-mask.webp is the lid's rounded corners
    // (alpha), so the loop's white backdrop doesn't show as a box on the tag panel.
    label: 'Hero: the 18 second loop of the 2026 flow',
    aspect: '1490 / 956',
    video: { webm: '/works/apolloed/hero-loop.webm', mp4: '/works/apolloed/hero-loop.mp4', mask: '/works/apolloed/hero-mask.webp' },
    still: '/works/apolloed/hero-still.webp',
    alt: 'A laptop showing ApolloEd, a school dashboard in preview mode. In the loop, the leader picks three school traits and every figure changes, requests the data from their district, the approver\'s email appears, and a four step tracker shows the wait.',
    caption: 'The whole 2026 flow in 18 seconds: pick three traits, request the data, the approver\'s email, the tracker.',
    link: { label: 'Try the live demo', href: 'https://apolloed.lovable.app' },
  },
  stats: [
    { value: '3.8 → 4.13', label: 'CSAT in testing, the same 5 testers rating the old signup, then ours' },
    { value: '13 → 6', label: 'signup screens before the first dashboard' },
    { value: '5', label: 'educators in usability testing, 4 of them school leaders' },
  ],
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
      unnumbered: true,
      blocks: [
        {
          kind: 'p',
          text: 'An edtech data platform was losing half its new clients during onboarding. The school leaders who found it couldn\'t try it. Student data stayed locked until a supervisor signed a data agreement. We let them build a dashboard with sample data first. Three years later I rebuilt the idea on my own.',
        },
      ],
    },
    {
      id: 'owned',
      title: 'What I owned',
      hook: 'A team of four, and the map we built on',
      blocks: [
        { kind: 'scene', slug: '2023 · With my team', text: 'Tested with educators, never built.' },
        {
          kind: 'owned',
          items: [
            'I led 4 UX designers through research, testing, the client presentation, and the handoff',
            'I built the site map: every piece of content, how it connected, before the style guide existed',
          ],
        },
        {
          kind: 'visual',
          visual: {
            label: 'Color coded site map (2023), rebuilt natively',
            custom: 'sitemap',
            aspect: '16 / 11',
            caption: 'The 2023 site map. The data agreement notice sits above every page.',
          },
        },
      ],
    },
    {
      id: 'problem',
      title: 'The problem',
      hook: 'The person who wants it can\'t sign for it',
      blocks: [
        {
          kind: 'p',
          text: 'We started with stakeholder interviews, then interviewed 5 school leaders over Zoom about setup, training, and how their supervisor approved the tool.',
        },
        {
          kind: 'p',
          text: 'School leaders were the platform\'s biggest fans. They far outnumber the supervisors who can start a partnership, and they\'re the ones out looking for better tools. But student records can\'t flow to a vendor until the district signs a data agreement, and only a supervisor can sign it. Leaders told us building a dashboard took 3 to 12 months.',
        },
        {
          kind: 'quote',
          text: 'When building out a new dashboard or editing one, I could do this on my own... it would happen way quicker and people would feel better about it.',
          cite: 'Executive director of data and technology',
        },
        {
          kind: 'p',
          text: 'So a leader would find the tool, get excited, and then wait. That wait is where clients dropped off.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Champion, then agreement, then approver, with the stall marked between the first two',
            custom: 'stall',
            aspect: '16 / 7',
            caption: 'The leader wants it. Only the supervisor can sign for the data.',
          },
        },
      ],
    },
    {
      id: 'test-drive',
      title: 'The test drive',
      hook: 'Try the dashboard before anyone signs',
      blocks: [
        {
          kind: 'p',
          text: 'So we flipped the order. Leaders pick their role, get a dashboard built for it, and explore it with sample data first. Real records come after the agreement.',
        },
        {
          kind: 'p',
          text: 'One word mattered. We tested with 5 educators and sorted what we saw on an affinity map. The old flow said "test data," and educators didn\'t realize we were generating fake data for them to play with. "Sample data" made that clear.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Before and after of the data step: "test data" then "sample data"',
            custom: 'data-step',
            aspect: '16 / 8',
            // No caption: Kai cut the build plan's draft (2026-11-15), it restated the paragraph.
          },
        },
      ],
    },
    {
      id: 'results',
      title: 'What happened',
      hook: '"I just created a dashboard in three clicks"',
      blocks: [
        {
          kind: 'p',
          text: 'In testing, CSAT went from 3.8 to 4.13, past the client\'s goal of 4. Signup went from 13 screens to 6. The same executive director tested the redesign: "This is too easy... I just created a dashboard in three clicks."',
        },
        {
          kind: 'visual',
          visual: {
            label: 'The quote over the new 6 screen flow',
            custom: 'flow-quote',
            aspect: '16 / 10',
          },
        },
      ],
    },
    {
      id: 'gap',
      title: 'The gap',
      hook: 'Sample data was still someone else\'s school',
      blocks: [
        { kind: 'scene', slug: '2026 · On my own', text: 'A working prototype I built three years later. Not tested with users.' },
        {
          kind: 'p',
          text: 'The 2023 sample school wasn\'t yours. A 300 student charter leader looking at a big district\'s numbers still had to picture their own. So the leader picks three traits, and the dashboard becomes theirs.',
        },
        {
          kind: 'visual',
          visual: {
            // The 2023 template preview, cropped to its browser frame, beside the 2026 poster's laptop
            // lid (build plan, Phase 2). Replaces the retired 00-hero-split image.
            label: 'The 2023 template preview beside the 2026 dashboard',
            pair: [
              {
                label: '2023',
                src: '/works/apolloed/template-2023.webp',
                width: 1600,
                height: 1098,
                look: 'card',
                alt: 'The 2023 design: a dashboard preview in a browser window. A dark banner reads "This is a preview of your dashboard" with a three step progress bar (Find school, Connect data, Build dashboard) and a Publish button. Below it sit an Academics dashboard with bar, ring and calendar cards, and a template picker on the left.',
              },
              {
                label: '2026',
                src: '/works/apolloed/dashboard-2026.webp',
                width: 1489,
                height: 956,
                look: 'card',
                alt: 'The 2026 prototype on a laptop screen: a dashboard in preview mode with a sidebar, four metric cards and charts. Every card carries an orange "Generated" tag.',
              },
            ],
            caption: 'Same promise, three years apart.',
          },
        },
        {
          kind: 'visual',
          visual: {
            label: 'Ripple: the three traits (school type, grade span, enrollment) change the whole dashboard',
            // new/06-ripple-v2.mp4, plus a WebM and a still from its last frame.
            video: { webm: '/works/apolloed/ripple.webm', mp4: '/works/apolloed/ripple.mp4' },
            still: '/works/apolloed/ripple-still.webp',
            aspect: '1440 / 900',
            alt: 'The ApolloEd dashboard as the leader changes the three school traits at the top: school type, grade span and enrollment. The metric cards, attendance line and enrollment bars all update to match.',
            caption: 'School type, grade span and enrollment. Same traits, same numbers, every time.',
          },
        },
      ],
    },
    {
      id: 'rule',
      title: 'Design rule',
      hook: 'Generated data should never pass for real',
      blocks: [
        {
          kind: 'p',
          text: 'This rule comes straight from 2023: when educators couldn\'t tell the data was generated, the test drive confused them. So the dashboard looks finished but never looks real, and explains itself in one click.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Close-up of generated data: hatched bars, dashed lines, an orange tag on every card',
            src: '/works/apolloed/generated-closeup.webp',
            aspect: '1440 / 905',
            alt: 'Left, an "Enrollment by grade" card of six hatched sage green bars, K to 5, with an orange "Generated" tag at its top right. Right, a "How this data is generated" panel: every number is made up on purpose, shaped by the three school traits, never uses student records, and is replaced by real records after the district signs.',
            caption: 'Hatched bars, dashed lines, an orange tag on every card. The tag opens the recipe.',
          },
        },
      ],
    },
    {
      id: 'pitch',
      title: 'Growth',
      hook: 'The leader does the selling, so hand them the pitch',
      blocks: [
        {
          kind: 'p',
          text: 'Not every district decision happens over email, so the pitch comes in two forms. And the leader gets one reminder, no more. They still have to work with this person.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'The approver\'s email and a one page district brief',
            src: '/works/apolloed/email-and-brief.webp',
            aspect: '1460 / 958',
            alt: 'Two panels. Left, the email the approver gets: "Here\'s what Dr. Rivera will get," saying a school leader in your district wants to see this with real data, with the leader\'s note, the generated preview figures tagged as made from school traits, and what the agreement covers. Right, a one page "District brief" with the request, four sample figures, strategic plan targets, and what the agreement protects.',
            caption: 'The email the approver gets, and a one page brief for the meeting.',
          },
        },
        {
          kind: 'visual',
          visual: {
            label: 'The waiting tracker, desktop and phone',
            src: '/works/apolloed/waiting-tracker.webp',
            aspect: '1467 / 588',
            alt: 'The dashboard on desktop and on a phone after the request is sent. A four step tracker reads: Preview set up, Sent to your superintendent, Data agreement signed (current, waiting on your district), Real records connected. A "Send a reminder" button notes you can send one reminder.',
            caption: 'After sending, the request becomes a four step tracker.',
          },
        },
      ],
    },
    {
      id: 'limits',
      title: 'Limits',
      hook: 'The preview won\'t fake what it can\'t know',
      blocks: [
        {
          kind: 'p',
          text: 'School leaders answer to a strategic plan, so the goals speak that language. Indicators the preview can\'t generate honestly don\'t get fake numbers. They wait for district data, in plain sight.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Strategic goals table with the goal editor beside it',
            pair: [
              {
                label: 'Strategic plan goals',
                src: '/works/apolloed/goals-table.webp',
                width: 1440,
                height: 703,
                look: 'card',
                alt: 'A strategic plan goals table with goal, level, target, current and status columns. Attendance, absenteeism and Grade 3 reading show "Needs attention", Grade 5 reading is "On track", and Chronic tardiness reads "Set after connection", "Attendance records" and a lock tag, "Needs district data".',
              },
              {
                label: 'Goal editor',
                src: '/works/apolloed/goal-editor.webp',
                width: 940,
                height: 1297,
                look: 'card',
                alt: 'The "Edit strategic plan goals" dialog: for each goal, a grade level, a target percentage and a check in rhythm (annual, quarterly, monthly or weekly).',
              },
            ],
            caption: 'Chronic tardiness waits for real attendance records.',
          },
        },
      ],
    },
    {
      id: 'build',
      title: 'How I built it',
      hook: 'Planned with Claude, built in one Lovable prompt',
      blocks: [
        {
          kind: 'p',
          text: 'I planned with Claude Code, then Claude built frames in Paper through WebMCP while I art directed: off the usual edtech blue and purple, and trait chips that no longer read as the main button. One detailed Lovable prompt meant credits went to building, not guessing.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Three small thumbnails: the Claude Code plan, a frame in Paper, the live Lovable build',
            // Thumbnails, left to right. The plan card is the opening lines of the Lovable prompt set
            // in mono (nothing personal in it); the Paper frame is frame1-default; the build is the
            // poster cropped to the dashboard. Sources in the build plan, Phase 2.
            frame: 'screen',
            aspect: '16 / 10',
            cols: [1, 3],
            strip: [
              {
                src: '/works/apolloed/build-plan-code.webp',
                alt: 'The opening of the Lovable prompt: "Build a single page web app: a SaaS style dashboard for school leaders that runs in Preview mode on generated data shaped like their school," then a list of hard rules, starting with no backend, no auth, no database and no API calls.',
                caption: 'The plan, in Claude Code',
              },
              {
                src: '/works/apolloed/build-paper-frame.webp',
                alt: 'A frame designed in Paper: the dashboard with a sidebar, four metric cards, an attendance line chart, an enrollment bar chart and a strategic plan goals table.',
                caption: 'A frame in Paper',
              },
              {
                src: '/works/apolloed/build-live.webp',
                alt: 'The live Lovable build: the same dashboard running in a browser, with the orange Generated tags on every card.',
                caption: 'The live Lovable build',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      hook: 'Honesty is the pitch',
      blocks: [
        {
          kind: 'p',
          text: 'The agreement was never the thing to remove. It protects students, and it should stay.',
        },
        {
          kind: 'p',
          text: 'I expected marketing and privacy to pull against each other. They pulled together. The orange tags, the data recipe and the goals the preview refuses to fake are what make it safe to forward to a superintendent. The honest version is the one a leader can sell.',
        },
        {
          kind: 'p',
          text: 'As districts move from trying AI tools to setting rules for them, more products will demo on generated data. Where generated ends and real begins is a design decision, and it belongs on the screen.',
        },
      ],
    },
  ],
}
