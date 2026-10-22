import type { CaseStudy, Flow, Kit } from '@/components/case-study/types'

// The live Tallo career quiz, behind "Take the real quiz" under the hero.
const TALLO_QUIZ_URL = 'https://tallo.com/talent/career/career-quiz'

// The hero: four of the quiz's nine paths, rebuilt in Paper (Tallo Brand System › Cal Art) from the
// live quiz. Desktop screens are cropped to 960x832 out of the 1703x952 artboards: x 371 to 1331
// (the middle of the quiz column, which keeps the type readable in the case study and trims the back
// arrow and Exit off the welcome and result), and y 60 to 892, except the welcome at y 112 to 944 so
// Begin Expedition keeps its margin (that drops its "Takes ~7 min" line). Boxes are % of each
// cropped screen, from hero-build/HERO-MEASUREMENTS.md (1080px column space: x minus 60, y minus
// the screen's top).
const H = '/works/cal/hero'
const alt = {
  welcome:
    "Quiz welcome screen. Heading \"Discover Your Career Path / Welcome Explorer!\" above an illustration of Cal, a compass character, standing in a mountain valley. Caption \"I'm Cal, your career navigator.\" Body copy: \"You find yourself standing at the edge of the Valley of Confusion, where fog clouds your vision and countless paths stretch out before you. But don't worry, I'm here to guide you on your journey to the Peak of Clarity, where your true potential will shine as bright as the summit sun. Every great adventure begins with a single step. Ready to discover which path is truly yours?\" A green button reads \"Begin Expedition.\"",
  question:
    'Quiz question screen, path 3 of 9, set in a rainy forest with a frog hiker under a red umbrella. Cal\'s avatar sits above a panel headed "A fellow hiker needs help! They seem lost and overwhelmed by the trail ahead. How do you support them?" Four unselected options: "Show practical techniques, Navigate difficult terrain", "Research and share, Trail conditions knowledge", "Offer emotional support, Listen to their concerns", "Rally them forward, Conquer this together." A green "Continue" button sits below.',
  response:
    'Quiz reaction screen on the same rainy forest scene. Cal\'s avatar now glows inside a purple halo above a speech panel reading: Cal\'s voice softens: "The best trails are the ones where nobody gets left behind." A green "Continue" button sits below.',
  result:
    'Quiz result screen. A "COMPLETED" pill above the heading "Congratulations! You\'ve reached the Peak of Clarity and discovered you\'re..." An illustration shows Cal wearing a beret and holding a paintbrush on a mountain summit. The result is "The Creator." Body copy: "You\'re the imaginative visionary, the expressive artist, the innovative storyteller. You love bringing original ideas to life, thinking outside conventional boundaries, and sharing your unique perspective with the world. Whether through visual arts, writing, design, or performance, you thrive on creativity and self-expression. This reflects how you tend to approach challenges and it can evolve as you explore more." A green button reads "Explore Creator Careers" with a "Retake Assessment" link below it.',
}
const options = ['Show practical techniques', 'Research and share', 'Offer emotional support', 'Rally them forward']

const quizFlow: Flow = {
  desktop: {
    width: 960,
    height: 832,
    select: { radius: 12, radio: { right: 21, size: 18 } },
    screens: [
      { name: 'Welcome', src: `${H}/desktop-1-plate.webp`, alt: alt.welcome, float: { src: `${H}/desktop-1-cal.webp`, box: [38.65, 31.25, 27.08, 32.09] }, targets: [{ label: 'Begin Expedition', box: [22.4, 92.79, 55.31, 5.53], does: 'next' }] },
      {
        name: 'Path 3 question',
        src: `${H}/desktop-2-question.webp`,
        alt: alt.question,
        targets: [
          ...options.map((label, i) => ({ label, box: [22.4, [46.15, 55.77, 65.5, 75.12][i], 55.31, 7.57] as [number, number, number, number], does: 'select' as const })),
          { label: 'Continue', box: [22.4, 85.46, 55.31, 5.53], does: 'next' },
        ],
      },
      { name: "Cal's reaction", src: `${H}/desktop-3-response.webp`, alt: alt.response, targets: [{ label: 'Continue', box: [22.4, 60.58, 55.31, 5.53], does: 'next' }] },
      { name: 'Result, The Creator', src: `${H}/desktop-4-result.webp`, alt: alt.result },
    ],
  },
  mobile: {
    width: 375,
    height: 812,
    select: { radius: 12, radio: { right: 17, size: 17 } },
    screens: [
      { name: 'Welcome', src: `${H}/mobile-1-plate.webp`, alt: alt.welcome, float: { src: `${H}/mobile-1-cal.webp`, box: [32.53, 27.59, 45.6, 21.67] }, targets: [{ label: 'Begin Expedition', box: [5.33, 87.68, 89.33, 5.67], does: 'next' }] },
      {
        name: 'Path 3 question',
        src: `${H}/mobile-2-question.webp`,
        alt: alt.question,
        targets: [
          ...options.map((label, i) => ({ label, box: [5.33, [38.42, 47.29, 56.16, 65.02][i], 89.33, 7.64] as [number, number, number, number], does: 'select' as const })),
          { label: 'Continue', box: [5.33, 75.37, 89.33, 5.67], does: 'next' },
        ],
      },
      { name: "Cal's reaction", src: `${H}/mobile-3-response.webp`, alt: alt.response, targets: [{ label: 'Continue', box: [5.33, 51.48, 89.33, 5.67], does: 'next' }] },
      { name: 'Result, The Creator', src: `${H}/mobile-4-result.webp`, alt: alt.result },
    ],
  },
  link: { label: 'Take the real quiz', href: TALLO_QUIZ_URL },
}

// Chapter 2's homepage before and after: Cal-Visuals/02-problem/Tallo-LP-*.png whole, Safari window
// and all (Kai, 2026-10-22: the tight crops lost too much). Each is trimmed to its window and shadow,
// scaled to 980px tall, and centered on a shared 1604x980 transparent canvas, so the toggle swaps
// in place. Before public: the new one still shows the unverified "2+ Million Users" badge, and the
// old one the CBS News bar.

// Chapter 3's Calvolution, from Kai's Paper export Cal-Visuals/03-finding-cal/03-findingcal.png
// (3942x1303, on white): four 900x1030 cells cut on one shared row band (y 60 to 1090) so the feet
// keep one baseline, each centered on its character (x 537, 1447, 2361, 3304). The baked labels are
// cropped off and set as captions, word for word. Before public: paint out the scribbles on Cal's
// right glove cuff (an AI artifact).
const F = '/works/cal/finding'

// Chapter 6's Cal Kit, from Kai's Paper layout (Cal-Visuals/06-into-product/Cal Kit-reference
// layout.png, 1352px wide), stacked for the column (Kai, 2026-10-22: personas live here, not in
// chapter 3; name and type only; specimen and palette as live text and color). The art in
// public/works/cal/kit is cut from that 1x reference as a stand-in until Kai's Paper exports
// land: same names, so swapping is a file copy. Personas and expressions go through
// kit-build/normalize_cal.py (sprint folder) so every Cal's dial is the same width with the feet
// on one baseline (Kai, 2026-10-22); run it on the Paper exports too. Panel grey (#F2F2F2) is
// lifted to white so the art multiplies onto the page. The recap header has its "his first birthday" line filled out.
// The Minecraft Short is by Gavin Han, an intern (credit OK'd by Kai, 2026-10-22).
const K = '/works/cal/kit'
const calKit: Kit = {
  label: 'Cal Kit',
  intro: 'Every outfit, pose and phrase has a name, so anyone on the team can use Cal without redrawing Cal.',
  personas: [
    { name: 'The Builder', type: 'Realistic', src: `${K}/p-builder.webp`, alt: 'Cal as the Builder, in a yellow hard hat, flannel and overalls, holding a wrench.' },
    { name: 'The Researcher', type: 'Investigative', src: `${K}/p-researcher.webp`, alt: 'Cal as the Researcher, in a fedora and trench coat, holding a magnifying glass.' },
    { name: 'The Creator', type: 'Artistic', src: `${K}/p-creator.webp`, alt: 'Cal as the Creator, in a beret and striped sweater, holding a paintbrush.' },
    { name: 'The Guide', type: 'Social', src: `${K}/p-guide.webp`, alt: 'Cal as the Guide, in round glasses and a plaid scarf, holding an open book.' },
    { name: 'The Leader', type: 'Enterprising', src: `${K}/p-leader.webp`, alt: 'Cal as the Leader, in a white shirt and tie, gesturing forward with one hand.' },
    { name: 'The Organizer', type: 'Conventional', src: `${K}/p-organizer.webp`, alt: 'Cal as the Organizer, in a grey blazer, holding a clipboard and waving.' },
  ],
  specimen: [
    { scale: '1.1x', text: 'Welcome, Explorer!', face: 'adamina', note: 'Adamina · headlines' },
    { scale: '1.3x', text: 'the best trails are the ones where', face: 'hubballi', note: "Hubballi · Cal's voice" },
    { scale: '1.3x', text: 'nobody gets left behind', face: 'hubballi', note: 'Speech bubbles only' },
    { scale: '1.6x', text: 'Every great adventure begins with a single step.', face: 'inter', note: 'Inter · story + body' },
    { scale: '1.6x', text: 'Ready to discover which path is truly yours?', face: 'inter', note: '160% leading' },
  ],
  expressions: ['worried', 'confused', 'ponder', 'appreciative', 'laughing', 'default'].map((name) => ({ name, src: `${K}/e-${name}.webp` })),
  expressionsNote: 'named in the quiz spec',
  props: [
    ['anchor', 'Anchor'],
    ['chain', 'Chain links'],
    ['clipboard', 'Clipboard'],
    ['star-map', 'Star map'],
    ['glasses', 'Round glasses'],
    ['lightbulb', 'Lightbulb'],
    ['magnifier', 'Magnifying glass'],
    ['megaphone', 'Megaphone'],
    ['tie', 'Striped tie'],
    ['paintbrush', 'Paintbrush'],
    ['snorkel', 'Snorkel mask'],
    ['wrench', 'Wrench'],
  ].map(([file, name]) => ({ name, src: `${K}/x-${file}.webp` })),
  propsNote: '12 objects',
  palette: [
    { name: 'Dial', hex: '#F8EFCC' },
    { name: 'Rim', hex: '#79679B' },
    { name: 'Pack', hex: '#8F9F7B' },
    { name: 'Boots', hex: '#E29B47' },
    { name: 'Win', hex: '#BDF184' },
    { name: 'Ink', hex: '#201F1F' },
  ],
  paletteNote: 'Purple over corporate blue, lime for the moment something good happens',
  inUse: {
    note: 'Same kit, outside the quiz: a community recap, and a Minecraft build by our intern, Gavin Han.',
    image: {
      src: `${K}/recap.webp`,
      width: 1055,
      height: 498,
      alt: "Community recap header: an \"August recap\" tag above the headline \"Cal's Birthday Challenge: Community Roundup,\" beside Cal laughing in a striped party hat.",
    },
    video: { youtubeId: 'aYcAXaAlExM', title: 'Happy Birthday, Cal!', poster: `${K}/minecraft.webp` },
  },
}

// Copy: Claude-Workspace/projects/2026-10-PortfolioSprint/Final Drafts/CaseStudy_Cal_V4.md, Part 1
// (locked 2026-10-21). Paste as written: don't edit copy here, edit the doc. Every visual but the hero is
// still a placeholder named after its *[...]* marker; Part 2 of the doc specs each one.
// Private working draft: names teammates and nothing is signed off by Tallo yet, so the page is
// unlisted and noindex (see src/app/works/cal/page.tsx). Never frame 3 in 100 → 1 in 3 as a lift.
export const cal: CaseStudy = {
  eyebrow: 'Case study · Product design',
  title: "Cal's Career Quiz",
  hook: 'A three minute story quiz that gets young people started on career discovery.',
  meta: [
    { label: 'Role', value: 'Product designer' },
    {
      label: 'Team',
      value: 'Me (design, brand and story), Kae Burdo (copywriting), Julia Domino (product management), Dominic Pace (engineering)',
    },
    { label: 'Timeline', value: "Jul 2025 to May 2026 (quiz shipped). Cal's format still running through Oct 2026." },
    {
      label: 'Context',
      value: 'Tallo, a career platform for people 13 to 30. Cal is built for the youngest group, Early Explorers, ages 13 to 17.',
    },
  ],
  hero: {
    label: 'Hero: interactive quiz',
    flow: quizFlow,
  },
  stats: [
    { value: '86.5%', label: 'finish it in product' },
    { value: '68.7%', label: 'of starters click through to a career hub' },
    { value: '~1 in 3', label: 'finishers go on to start the full assessment' },
  ],
  quote: {
    cite: 'Julia, Product Manager at Tallo',
    text: 'Kai is deeply passionate about helping young people discover their future careers and that passion shows up in her work every day. [...] At Tallo, she led and contributed to multiple creative quizzes that made career exploration feel fun and approachable and helped drive meaningful engagement on our platform.',
  },
  chapters: [
    {
      id: 'tldr',
      title: 'TL;DR',
      unnumbered: true,
      blocks: [
        {
          kind: 'p',
          text: "Tallo's career assessment is built on RIASEC, a well-known career interest model, but almost nobody got there. I created Cal, a compass mascot, and a three minute story quiz that sorts you into one of six RIASEC types and sends you to a matching career hub, one of Tallo's 24 industry hubs, like construction or design. It ran in Typeform first, then product built it in.",
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
            'Cal: character, six persona variants (one per career type), usage rules',
            'The quiz: story arc, trail scenarios, and the Typeform build (scoring, result routing, logic jumps), embedded on WordPress pages',
            'The handoff: dev-ready specs, production copy, analytics launch checklist',
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
          text: "Almost nobody started Tallo's career assessment: in spring 2025, about 3 in 100 career hub visits reached its intro page. I redesigned the homepage to put it first, but better placement only puts a big ask in front of more people. The assessment is 60 questions about mundane tasks like \"keep inventory records,\" a lot to ask of a 15 year old who doesn't know yet why they should care. So I built a shorter, friendlier way in: 9 questions, each a moment on a trail.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'Before/after toggle: old homepage with three equal buttons, new homepage with one button, "Start Your Free Career Quiz"',
            aspect: '1604 / 980',
            compare: [
              {
                label: 'Before',
                src: '/works/cal/problem/homepage-before.webp',
                alt: "Before: Tallo's old homepage offered three equal buttons, Explore Careers, Build Skills and Find a Job.",
              },
              {
                label: 'After',
                src: '/works/cal/problem/homepage-after.webp',
                alt: 'After: the redesigned homepage has one button, Start Your Free Career Quiz.',
              },
            ],
          },
        },
        {
          kind: 'callout',
          text: 'How might we make the first step of career discovery feel like something a teenager wants to do?',
        },
      ],
    },
    {
      id: 'finding',
      title: 'Finding Cal',
      blocks: [
        {
          kind: 'p',
          text: 'Cal started as Orion, a compass named after the constellation, with a full set of space scenarios. Then the logic broke. A compass doesn\'t work in space, because there\'s no north to point to. The theme was off too. Space says "reach for the stars," and Tallo stays away from dream careers. Young people want the next real step. So Orion came down to earth. On a trail, a compass makes sense, and careers are trails you walk. I sketched Cal by hand, chose the styles for a mascot test our product manager ran (a retro sticker look shaped the final texture), and used AI to develop the final character and six persona variants.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Calvolution strip: first idea · my sketch · Orion, rendered from my sketch · Cal, down to earth',
            aspect: '900 / 1030',
            strip: [
              {
                src: `${F}/calvolution-1-idea.webp`,
                caption: 'a scrappy idea',
                alt: 'A scrappy first drawing: a round dark navy compass face with a purple star and a small smile, stick arms raised, stick legs, and a glowing orange lightbulb above its head.',
              },
              {
                src: `${F}/calvolution-2-sketch.webp`,
                caption: 'a sketch of Orion',
                alt: 'A black and white line sketch of Orion, a pocket compass with a star on its crown, cartoon eyes, a big smile, giving a thumbs up mid stride in sneakers.',
              },
              {
                src: `${F}/calvolution-3-orion.webp`,
                caption: 'Orion, rendered with AI',
                alt: 'Orion rendered from the sketch: a purple pocket compass with an orange star on its crown, starry eyes, rosy cheeks and a wide grin, giving a thumbs up mid stride in purple sneakers.',
              },
              {
                src: `${F}/calvolution-4-cal.webp`,
                caption: 'Cal, retro and down to Earth',
                alt: 'Cal, the final character: a retro compass with a cream face marked N, E, S and W, sparkly eyes and rosy cheeks, waving in purple gloves, wearing a striped purple scarf, a green hiking pack with a bedroll, and tan hiking boots.',
              },
            ],
            cols: [2, 4],
          },
        },
      ],
    },
    {
      id: 'rules',
      title: "Cal's rules",
      blocks: [
        {
          kind: 'rules',
          items: [
            { title: 'The trailhead looks scarier than the trail.', text: 'Drove: 9 questions, told as a story.' },
            {
              title: "Cal doesn't pick your path. Cal helps you find it.",
              text: 'Drove: every result ends on a button into a career hub, a cluster of related careers, so people keep exploring.',
            },
            {
              title: 'Your result can change.',
              text: 'Drove: no percent match, which felt too definitive for a short intro quiz, and every result page ends with "it can evolve as you explore more."',
            },
          ],
        },
        {
          kind: 'visual',
          visual: {
            label: 'Three cards, each with a Cal pose',
            tiles: [
              { aspect: '4 / 3', label: 'Worried' },
              { aspect: '4 / 3', label: 'Ponder' },
              { aspect: '4 / 3', label: 'Excited or pointing' },
            ],
            cols: [1, 2],
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
          text: 'I rewrote each RIASEC item as a moment on the trail from the Valley of Confusion to the Peak of Clarity. When we tried it out at an all-hands, people said six options per question was too many, so we cut it to four. Each type still shows up exactly six times across the nine questions, so no path gets a head start. Cal reacts between questions like an older friend, so the quiz feels like a hike.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Interactive result → hub, desktop and mobile versions: The Creator result → Design and Media career hub',
            frame: 'browser',
          },
        },
        {
          kind: 'visual',
          visual: {
            label: 'Rewrite strip: survey item "Study the movement of planets" → Orion version → Cal version',
            tiles: [
              { aspect: '3 / 2', label: 'Survey item' },
              { aspect: '3 / 2', label: 'Orion version' },
              { aspect: '3 / 2', label: 'Cal version' },
            ],
            cols: [1, 3],
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
          text: "Product adopted the Typeform, and my job changed from building the quiz to getting it built well: dev-ready specs, production copy, and a launch checklist asking for the analytics we'd need.",
        },
        {
          kind: 'p',
          text: "Meanwhile I turned Cal into a kit, so Cal could leave the quiz too: community posts, social, even Cal's first birthday.",
        },
        { kind: 'kit', kit: calKit },
      ],
    },
    {
      id: 'happened',
      title: 'What happened',
      blocks: [
        {
          kind: 'p',
          text: "Most people who start Cal finish it. Most who finish click through into a career hub, and about 1 in 3 go on to start the full assessment. I can't say how many would have gone to the assessment anyway, since there's no comparison group.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'Funnel chart, share of people who started Cal: 100% > 86.5% > 68.7% > about 30%',
            aspect: '16 / 7',
          },
        },
      ],
    },
    {
      id: 'started',
      title: 'What Cal started',
      blocks: [
        {
          kind: 'p',
          text: 'Cal\'s quiz became the template for the community\'s monthly challenge quizzes, and each month added a twist. Founder Fit scored you, and a "Developing" result counted as a real answer, with no fail state. Growth Reflection added a tiebreaker that only shows up when your answers disagree, plus one open question to check if it landed. I designed the branching, and an intern built it from my setup guide. In September few people came back to comment, so October\'s Build Style quiz drops the community post, ends on real trades with pay, and asks for one sentence on the badge page. Completion across the Typeform quizzes held between 76% and 88%.',
        },
        {
          kind: 'visual',
          visual: {
            label:
              'Strip: what changed each month with a caption each, Jul Founder Fit > Aug Growth Reflection > Sep Creative Career Fit > Oct Build Style, October step links the landing page',
            tiles: [
              { aspect: '3 / 4', label: 'Jul, Founder Fit' },
              { aspect: '3 / 4', label: 'Aug, Growth Reflection' },
              { aspect: '3 / 4', label: 'Sep, Creative Career Fit' },
              { aspect: '3 / 4', label: 'Oct, Build Style' },
            ],
            cols: [2, 4],
          },
        },
        { kind: 'quote', text: 'About how you were able to find who I am with some very simple questions.' },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      blocks: [
        {
          kind: 'p',
          text: 'In August a quiz built like Cal pulled in almost half of our challenge entries. In September each quiz in the same format drew less than a sixth of that. The prize went away, the community lost its home page spot, and the topic narrowed, all at once, so I can\'t say which one did it.',
        },
        {
          kind: 'p',
          text: 'A quiz is only half the design. The other half is where it lives. That\'s why I wanted Cal in the product, where people already show up looking for direction.',
        },
        {
          kind: 'p',
          text: 'A quiz result is a mere draft of a person, and people tell you whether it fits. One member wrote "It really sounds like me." A 15 year old wrote "All work wise nothing to apply to life im 15 no job." Our questions assumed a job they didn\'t have, so some of October\'s questions now ask about things like group projects and favorite classes.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Build Style Q1 and Q4, cropped: "A group project starts..." and "Which one actually held your attention in school?"',
            tiles: [
              { aspect: '4 / 3', label: 'Q1' },
              { aspect: '4 / 3', label: 'Q4' },
            ],
            cols: [1, 2],
          },
        },
        {
          kind: 'p',
          text: 'Plenty of kids find their path because one adult puts something in front of them. I wanted Cal to be that mentor for the kids who don\'t have one.',
        },
      ],
    },
    {
      id: 'next',
      title: "What's next",
      blocks: [
        {
          kind: 'p',
          text: "Cal's Passport challenge was a test run for stamps. I took its results to product and art directed the stamps, which a product designer built into Tallo. Earning them teaches you how to use the platform. The next step I pitched builds on that: the homepage as Cal's trail, with your stamps showing how far you've come. The trail homepage hasn't shipped.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'Stamps in product; Mascot Core image labeled "Exploration, not shipped"',
            tiles: [
              { aspect: '16 / 9', label: 'Stamps in product' },
              { aspect: '16 / 9', label: 'Mascot Core image' },
            ],
            cols: [1, 1],
          },
        },
      ],
    },
  ],
}
