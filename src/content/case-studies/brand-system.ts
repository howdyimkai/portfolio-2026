import type { CaseStudy } from '@/components/case-study/types'

// Tallo Brand System. Copy is locked: CaseStudy_BrandSystem_AIForward_v3.md in the sprint folder
// (Final Drafts/2026-10-24_Portfolio-BrandSystemCaseStudy), with the changes in
// BUILD-PLAN_BrandSystem_ClaudeCode.md section 1 (Kai, 2026-10-24): the Ch 6 table became a bar
// chart, visual 8 is a YouTube episode, and the draft's Notes block is not page content.
// Straight quotes here; the template curls them. Every `custom` key is a visual built in
// src/components/case-study/brand-system/; a key with no component yet renders a labeled placeholder.
export const brandSystem: CaseStudy = {
  eyebrow: 'Case study · Brand systems',
  title: 'Tallo Brand System',
  hook: 'I made our brand guidelines readable by the tools that write and design for us.',
  meta: [
    { label: 'Role', value: 'I designed and built the system: the brand specs, role context files, Claude skills, onboarding script, linter, and eval' },
    { label: 'Team', value: 'Me, a co-maintainer (our SEO technical automation marketer, who applied the system to our n8n and SEO workflows), and contributors across marketing' },
    { label: 'Timeline', value: 'Apr to Oct 2026 (shipped, in daily use, handed off Nov 2026)' },
    { label: 'Context', value: 'Tallo, a free career platform for young people ages 13 to 30, built with schools, employers, and workforce partners' },
  ],
  hero: {
    label: 'Eval hero',
    custom: 'eval-hero',
    aspect: '16 / 11',
    caption: 'Without brand context, the user count changed every run. With it, all three runs used the approved figure.',
  },
  stats: [
    { value: '80% → 31%', label: 'AI drafts that broke a brand rule, in testing' },
    { value: '0%', label: 'made-up stats with the system, down from 31%' },
    { value: '~15', label: 'people using it across the company' },
  ],
  quote: {
    text: "Kai walked me through installing a template in Claude that makes it easy to apply Tallo brand guidelines to presentations and documents. While it doesn't replace the expertise and oversight of our marketing team, it helps me create client-facing content with limited editing required.",
    cite: 'Work-Based Learning Manager, Tallo',
  },
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
      unnumbered: true,
      blocks: [
        {
          kind: 'p',
          text: 'Stakeholders were drafting copy with AI that had never seen our brand, and we spent our time fixing it. I rebuilt the brand as structured data, generated context files for each role (the instructions an AI reads before it writes), and built Claude workflows, a brand linter, and an eval on top, so the first draft starts on brand. About 15 people across the company use it, and it was built to keep running after I left.',
        },
        {
          kind: 'p',
          text: "See also: [Cal's Career Quiz](/works/cal), including the quiz system and Cal Kit.",
        },
      ],
    },
    {
      id: 'problem',
      title: 'The problem',
      hook: 'Stakeholders were already sending us AI drafts',
      blocks: [
        {
          kind: 'p',
          text: 'Tallo is free for young people and built with schools, employers, and workforce partners. So one brand talks to a 14-year-old on TikTok and a district administrator in an email, and the right word changes by room. "Students" works for educators and is wrong in consumer copy. Some of the audience are minors, so every photo and clip carries consent rules too.',
        },
        {
          kind: 'p',
          text: 'All of that lived in two long PDFs that nobody read mid-task, and the AI had never seen them. Meanwhile, stakeholders had started drafting copy with AI and handing it to us as a brief: roughly what they wanted, for us to shape from there. Those drafts came in with invented stats, retired terms, and the wrong voice, and shaping them often meant starting over. Brand review ran through two people, me and one writer, and we kept rebuilding the same decks from scratch. If AI was going to write the first draft anyway, the first draft should start on brand.',
        },
      ],
    },
    {
      id: 'approach',
      title: 'The approach',
      hook: 'Write the brand once, as data every tool can read',
      blocks: [
        {
          kind: 'p',
          text: 'I rewrote the brand as structured data: colors, type, voice, the mascot, and the only approved list of stats. From that one source I generated a shared core file and a context file for each role, from social to exec, then built Claude skills and process templates on top. Claude, our n8n automations, the team\'s Canva kit, Figma, Paper, and our developers all draw from it.',
        },
        {
          kind: 'p',
          text: 'It built on groundwork from the year before: a digital asset library where every file is tagged by audience, channel, and consent status, including whether a student release form is on file. The brand system did the same for words, so audience and consent rules ride along with the content.',
        },
        { kind: 'visual', visual: { label: 'Layered architecture diagram: specs, role contexts, workflows and skills, team output', custom: 'architecture', caption: 'Every tool reads from the same specs, so a fix made once shows up everywhere.' } },
        { kind: 'visual', visual: { label: 'Sanitized folder tree', custom: 'folder-tree', caption: 'value-points.json is the only place a number can come from.' } },
      ],
    },
    {
      id: 'decisions',
      title: 'Decisions',
      hook: "Five calls the AI follows but couldn't have made",
      blocks: [
        {
          kind: 'p',
          lead: 'I gave a flat palette a hierarchy.',
          text: 'I inherited a condensed guide: 38 swatches at equal weight, an invitation to "feel free to explore creative color combinations," and a pairing chart that put two failing pairs in its approved column. I sorted the palette into primary, secondary, and tertiary tiers, gave each color family a job, built light and dark ramps, and tested every pairing I documented.',
        },
        { kind: 'visual', visual: { label: 'Before and after: the inherited swatch page next to the tiered palette', custom: 'palette', caption: '38 equal swatches became three tiers, each with a job.' } },
        {
          kind: 'p',
          lead: 'I made the brand louder for social without forking it.',
          text: 'With our social media strategist, I built a social-only layer on top of the master palette. Social Purple came from five candidates, after we ruled out one that sat too close to Instagram\'s own color. The runner-up display font lost partly because it wouldn\'t upload into CapCut, where our video gets finished. Every pairing became a rule: the caption cream passes at 16.76:1 on our darkest color and fails on white, so it always sits on dark.',
        },
        { kind: 'visual', visual: { label: 'Before and after: an Instagram feed', custom: 'social', caption: 'Two primaries, turned up for the feed. Same brand, louder.' } },
        {
          kind: 'p',
          lead: 'Every stat has a paper trail.',
          text: '`value-points.json` is the only approved source for a number. Pulled stats move to a `retired` block with what replaced them and why. When an employer count turned out to be months out of date, with the real figure nearly double, the fix happened once and every tool picked it up.',
        },
        {
          kind: 'code',
          lang: 'json',
          text: `"retired": [
  {
    "value": "500+ employers and organizations",
    "replaced_by": "900+ employer partners",
    "retired": "2026-08-05"
  }
]`,
        },
        {
          kind: 'p',
          lead: 'I asked how people worked before writing their template.',
          text: 'When I interviewed our exec about how the partnerships team builds decks, formatting turned out never to be the bottleneck. Research and recall were. So her template tells Claude to help gather and remember, and to leave the narrative to her.',
        },
        {
          kind: 'p',
          lead: 'Consent decides what ships.',
          text: 'Before video transcripts went into the shared system, I replaced "is it already online?" with three tiers: always fine, case by case, never. Anything involving minors is never. A classroom recording and a one-on-one interview can look identical in a folder. The guest signed a release. The students in the room didn\'t.',
        },
      ],
    },
    {
      id: 'ai',
      title: 'Working with AI',
      hook: "The AI drafts. People decide what's true.",
      blocks: [
        {
          kind: 'p',
          text: 'I build with Claude Code daily and run it like a small team. A stronger model plans and judges, a cheaper one carries out the plan, and the judge reports only what would block shipping, so I decide what to fix.',
        },
        {
          kind: 'p',
          text: "The brand system works the same way. The AI gets context scoped to the job, a short list of hard rules, and a check wherever one exists, like the deck skill's contrast audit and page screenshots. What's true, what's approved, and what's safe to publish about young people stay with people, and the system makes that explicit.",
        },
      ],
    },
    {
      id: 'adoption',
      title: 'Adoption',
      hook: 'The first piece of work the system made without me',
      blocks: [
        {
          kind: 'p',
          text: "Most of the team doesn't use a terminal, so the hardest part was getting started. `setup.sh` asks your role and scaffolds a working setup in about 15 minutes. Teammates who use Claude Cowork get a separate quickstart that covers the same ground with no terminal.",
        },
        { kind: 'visual', visual: { label: 'Interactive setup walkthrough: pick Claude Code or Claude Cowork, a work style, and a role', custom: 'setup-walkthrough', caption: 'Pick a role. Each one gets its own brand context.' } },
        {
          kind: 'p',
          text: 'Process templates carry work that used to live only in my head. Our in-depth community challenges follow a fixed four-week arc: three episodes, then a closing reflection question. After running it twice, I wrote it up as a step-by-step guide. A writer used that guide to plan a new month\'s series on their own, and I built the challenge from their documentation.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Example challenge episode (YouTube, click to load)',
            custom: 'challenge-video',
            aspect: '16 / 9',
            caption: 'One episode from a community challenge. Each month runs three episodes, then a reflection question.',
          },
        },
        {
          kind: 'p',
          text: 'The same source files power smaller tools. My alt text kit, a Claude project, writes image descriptions that are accessible first and search-friendly second. It keeps them under 125 characters, spells out acronyms because screen readers read "WIOA" letter by letter, and always describes Cal as a compass, never as holding one.',
        },
      ],
    },
    {
      id: 'testing',
      title: 'Testing it',
      hook: 'Three runs, three different user counts',
      blocks: [
        {
          kind: 'p',
          text: 'Context files only guide the AI, so I built two ways to check them: a linter and an eval.',
        },
        {
          kind: 'p',
          text: 'The linter reads its rules straight from the brand files: banned phrases, retired terms, any number not in `value-points.json`, em dashes, and reading level. Because it reads the source, it can\'t drift from it, and it fails a draft the way a test fails a build. Its first run flagged "emerging talent" in an employer pitch, where it\'s the right term, so it now takes an audience setting.',
        },
        {
          kind: 'p',
          text: 'For the eval, I wrote 15 requests the team actually sends, several built to bait a known mistake, like "include a few impressive numbers." Each ran three times without brand context and three times with it, isolated from my own setup.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Before and after bar chart by rule category',
            custom: 'eval-bars',
            aspect: '16 / 10',
            caption: 'Same 15 requests, three runs each. With the system, three of the four mistakes went to zero.',
          },
        },
        {
          kind: 'p',
          text: 'Asked for a LinkedIn post about how big Tallo has grown, the baseline invented a different user count every run:',
        },
        {
          kind: 'quotes',
          items: [
            { text: '...a thriving community of over 5 million students and young professionals...' },
            { text: '📈 2M+ students now on Tallo...' },
            { text: '📈 3M+ users on the platform' },
          ],
        },
        { kind: 'p', text: 'With the system, all three runs used the same approved figure:' },
        { kind: 'quote', text: 'This year, our community grew to 2 million users ages 13–30 across all 50 states...' },
        {
          kind: 'p',
          lead: "What the numbers don't say.",
          text: 'The linter checks the same rules the context teaches, so this shows the AI follows the rules. Whether the copy is good still takes a human read. Fifteen requests is a directional signal. Reading level improved but missed our grade 5 target.',
        },
      ],
    },
    {
      id: 'handoff',
      title: 'Handoff',
      hook: 'The next fix came from someone else',
      blocks: [
        {
          kind: 'p',
          text: 'I built the system to keep working after my last day: a changelog that explains every decision, a quickstart for new hires, a written contribution process, and a co-maintainer who already runs it in their own workflows.',
        },
        {
          kind: 'p',
          text: "One thing I'd change: for months the system lived only in Bitbucket, where most of the people it was built for never looked. Dated release zips on the shared drive fixed access but split the system in two, because changes from drive users came back as messages someone had to turn into pull requests. I should have designed both paths from the start.",
        },
        {
          kind: 'p',
          text: 'A contributor noticed the role templates and our automation file each restated the brand voice in their own words, and the copies had started to contradict each other. One listed "empowering" as a core trait while another banned "empower." Their fix made `BRAND.md` the only place voice is written in prose. It\'s the single-source rule I\'d applied to stats, now applied to voice, and I didn\'t have to be the one to spot it.',
        },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      hook: 'Every stat was approved. Some still said the wrong thing.',
      blocks: [
        {
          kind: 'p',
          text: 'In testing, the system took made-up stats to zero. Then a flyer drafted with it, which skipped the linter, came back reading "Just 1 in 7 young people say a real conversation with a pro helps most." The report behind it was on our approved list, but the survey let people pick up to three sources, and the top answer was family, friends, or mentors at about 1 in 3. We decided to pull the research from the repo to keep unapproved numbers out, so nothing checked how its numbers were framed.',
        },
        { kind: 'p', text: 'Next time, every stat carries what was asked, where it came from, and who it\'s for.' },
        {
          kind: 'p',
          text: "The second lesson is about where brand and product meet. Tallo's marketing and product grew up as two systems, each solving its own problems. On social, purple filled so much of the frame that a purple button disappeared, so our posts follow a 60-30-10 split: lilac for the background, purple for structure, and green, one of our own primaries, for the one thing to act on. Lessons like that lived in marketing's files, while product made its own calls in its own system.",
        },
        {
          kind: 'p',
          text: 'In "[Brand as Software](https://pauljun.substack.com/p/brand-as-software)," Paul Jun of Ramp argues that a brand should run like a product, with owners, maintenance, and a roadmap. The line I mentally highlighted is "Taste remains human. Repetition becomes software." This system took on the repetition, and the flyer showed what still needs a person. What it becomes next belongs to the team: give product a seat at it, so both sides draw from one set of decisions. That\'s when brand and product can play a stellar duet.',
        },
      ],
    },
  ],
}
