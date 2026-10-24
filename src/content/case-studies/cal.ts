import type { CaseStudy, Flow, Kit } from '@/components/case-study/types'

// The live Tallo career quiz, behind "Take the real quiz" under the hero.
const TALLO_QUIZ_URL = 'https://tallo.com/talent/career/career-quiz'

// The hero: the quiz's welcome, one path, Cal's reaction and the result, then where the result's
// button goes, Tallo's Design and Media career hub (moved up from chapter 5, Kai 2026-10-22, so the
// result isn't shown twice).
// Desktop shows the whole 1703x952 desktop screen in the browser frame, not a crop of the quiz
// column (Kai, 2026-10-24, picked "Browser, full" over the column crop and a laptop mockup: the
// forest and paper on both sides are what read as desktop; a device frame doesn't say "demo", the
// caption does). Kai's 2x exports in Cal-Visuals/00-hero/Hero-Desktop2x, saved at 1600 wide. The
// welcome is rebuilt from its layers so Cal can bob: "bg only" with both clouds at their spots in the
// composite (cloud illustration at 1236,771 and cloud shapes at 1850,679, 2x px) is the plate, Cal
// floats on top at 1485,639 (Cal sits over both clouds in the composite). Every button spans x 586.5
// to 1117 of 1703, found by scanning the exports for the lime; option rows are the old crop's rows
// moved back into artboard space.
// Phone screens are Kai's 2x exports in Cal-Visuals/00-hero/Mobile-Desktop2x (2026-10-24). The
// welcome plate is "bgonly" plus the composite's clouds, with the old plate under Cal's silhouette
// (Cal sits over the clouds; no mobile cloud layers), and the old Cal float, which lands exactly on
// the composite's Cal. The hub ("hub-live") sits under a white 59pt status bar, like an iPhone's, so
// the logo clears the phone's rounded corner; its bottom is cut and the "Compare Careers" bar pinned
// back on, as it sits on a phone. Phone boxes are % of each screen, from
// hero-build/HERO-MEASUREMENTS.md.
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
  hub:
    'Tallo\'s Design & Media career hub: a banner of design photos under the breadcrumb "Career Navigator > Hubs," a "My Interests" button, and a card headed "Careers in Design & Media" reading "Unleash your creativity! From visual art to writing, this hub covers design, communication, and broadcasting," with a Career Interests Match of three of five dots, 33 careers and a "View all Careers in Design & Media" button. Below it, "Fastest growing careers in Design & Media," starting with DJ / Announcer, Videographer and Media / Talent Director.',
}
const options = ['Show practical techniques', 'Research and share', 'Offer emotional support', 'Rally them forward']

const quizFlow: Flow = {
  desktop: {
    width: 1703,
    height: 952,
    select: { radius: 12, radio: { right: 21, size: 18 } },
    screens: [
      { name: 'Welcome', src: `${H}/desktop-1-plate.webp`, alt: alt.welcome, float: { src: `${H}/desktop-1-cal.webp`, box: [43.6, 33.56, 15.27, 28.05] }, targets: [{ label: 'Begin Expedition', box: [34.44, 87.39, 31.18, 4.78], does: 'next' }] },
      {
        name: 'Path 3 question',
        src: `${H}/desktop-2-question.webp`,
        alt: alt.question,
        targets: [
          ...options.map((label, i) => ({ label, box: [34.44, [46.64, 55.04, 63.55, 71.95][i], 31.18, 6.62] as [number, number, number, number], does: 'select' as const })),
          { label: 'Continue', box: [34.44, 80.99, 31.18, 4.78], does: 'next' },
        ],
      },
      { name: "Cal's reaction", src: `${H}/desktop-3-response.webp`, alt: alt.response, targets: [{ label: 'Continue', box: [34.44, 59.24, 31.18, 4.78], does: 'next' }] },
      { name: 'Result, The Creator', src: `${H}/desktop-4-result.webp`, alt: alt.result, targets: [{ label: 'Explore Creator Careers', box: [34.44, 83.61, 31.18, 4.78], does: 'next' }] },
      { name: 'Design and Media career hub', src: `${H}/desktop-5-hub.webp`, alt: alt.hub },
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
      { name: 'Result, The Creator', src: `${H}/mobile-4-result.webp`, alt: alt.result, targets: [{ label: 'Explore Creator Careers', box: [5.33, 84.48, 89.33, 5.67], does: 'next' }] },
      { name: 'Design and Media career hub', src: `${H}/mobile-5-hub.webp`, alt: alt.hub },
    ],
  },
  link: { label: 'Take the real quiz', href: TALLO_QUIZ_URL },
  // Kai, 2026-10-24: make clear this is a condensed happy path, not the whole quiz.
  note: 'A short demo of one path. The real quiz has 9 questions.',
}

const Q = '/works/cal/quiz'

// Chapter 5's rewrite strip: one Investigative item through three versions, Kai's captures in
// Cal-Visuals/05-quiz, each cut to 3:5 from the top (the Orion one loses the Typeform editor's
// "Add choice" link). The ring marks Orion's Investigative answer; Cal's capture already has it
// picked.
const rewrite = [
  {
    src: `${Q}/rewrite-1-survey.webp`,
    caption: 'the flagship survey',
    note: 'rating scale',
    alt: 'Tallo\'s career assessment, question 16 of 60: "You would like to... Study the movement of planets." Five answers from Strongly Disagree to Strongly Agree.',
  },
  {
    src: `${Q}/rewrite-2-orion.webp`,
    caption: 'Orion, in space',
    note: 'scenario with options',
    mark: [50.5, 36.2, 43, 31.6] as [number, number, number, number],
    alt: 'The Orion quiz, question 1: "You discover an uncharted planet. What draws you there?" Four illustrated answers: the chance to meet new civilizations, mysterious energy readings to investigate (ringed), rich resources waiting to be cultivated, and beautiful landscapes to explore and document.',
  },
  {
    src: `${Q}/rewrite-3-cal.webp`,
    caption: 'Cal, on the trail',
    note: 'scenario with options',
    alt: 'Cal\'s quiz, path 4 of 9: "Strange tracks discovered! You\'ve found mysterious animal tracks in Mystery Grove. What\'s your instinct?" Four answers: Research and identify, what made these tracks (picked); Imagine the story, what creature made these; Document systematically, catalog these tracks; Lead an expedition, track this animal.',
  },
]

// Chapter 8's months, one capture each in a browser frame (Kai, 2026-10-22), from
// Cal-Visuals/08-what-cal-started, all cut to 16:9 at 1280x720. October is cut above the first
// "Median Pay" row (x 160 to 1484, y 0 to 745 of the 1667 page) so no dollar figures show.
// August is a real Growth Reflection question (growthquiz-weekend.png, x 126 to 1626, y 100 to 944,
// trimming Typeform's progress bar and arrows), replacing the result card that called Cal "he".
// Captions are Kai's, confirmed 2026-10-22. Each month links its live challenge page.
const LANDING = {
  jul: 'https://tallo.com/rcrj-entrepreneurship/',
  aug: 'https://tallo.com/august-community-challenge-cals-birthday/',
  sep: 'https://tallo.com/september-community-challenge-creative-careers/',
  oct: 'https://tallo.com/all-articles/tallo-community-october-challenge-careers-in-construction/',
}
const M = '/works/cal/started'
const months = [
  {
    label: 'Jul · Founder Fit',
    src: `${M}/1-jul-founder-fit.webp`,
    caption: 'Weekly video drops with real entrepreneur interviews, then a quiz.',
    link: { label: 'See the landing page', href: LANDING.jul },
    alt: 'Founder Fit video thumbnail: "Real Careers, Real Journeys. Explore Entrepreneurship, Part One," with Cal in a shirt and tie beside a photo of a woman on the phone at a laptop, and a speech bubble asking "Would you actually want this kind of life?"',
  },
  {
    label: 'Aug · Growth Reflection',
    src: `${M}/2-aug-growth-reflection.webp`,
    caption: 'Questions about things that happened to you, not hypotheticals.',
    link: { label: 'See the landing page', href: LANDING.aug },
    alt: 'Growth Reflection question 2: "A free weekend with nothing planned. What actually happens?" over a "Happy Weekend" sky illustration, with two answers: "I end up doing five different things because something new always pulls my attention" (picked) and "I get pulled into one thing and lose track of time."',
  },
  {
    label: 'Sep · Creative Career Fit',
    src: `${M}/3-sep-creative-career-fit.webp`,
    caption: 'Each week built toward a project submission, and the quiz came right before it.',
    link: { label: 'See the landing page', href: LANDING.sep },
    alt: 'Creative Careers week 4 page, "Final Submission": tips for a final submission and a "Take Quiz + Submit" button, beside a poster of Cal in a beret reading "Final Submission! It\'s been a long journey! Time to submit your work and claim your badge!"',
  },
  {
    label: 'Oct · Build Style',
    src: `${M}/4-oct-build-style.webp`,
    caption: "Real-world career data and examples closer to a teenager's life.",
    note: "Data from Tallo's Career Navigator, which draws on O*NET, the Bureau of Labor Statistics and Lightcast.",
    link: { label: 'See the landing page', href: LANDING.oct },
    alt: 'Build Style landing page: "All twelve jobs on this quiz," four build styles (Hands-on Builder, Problem-Solver, Planner, Crew Lead), then "If you\'re a Hands-On Builder," the Realistic interest area, with photos of a carpenter, an iron and steel worker and a solar installer.',
  },
]

// Chapter 10's Build Style questions, Kai's phone mockups (Cal-Visuals/09-reflection, 2026-10-22),
// trimmed to the bezel (x 15 to 597, y 14 to 1044) with the transparent corners kept. The intro
// screen (01-construction.png) is left out: it isn't a question, and it shows a $50 prize entry.
const buildStyle = [
  {
    src: '/works/cal/reflection/build-style-q1.webp',
    caption: 'Build Style, question 1',
    alt: 'Build Style quiz, question 1: "A group project starts. Nobody assigns roles. You end up..." over a photo of students crowding around a laptop. Four answers: "Doing the part where something actually gets built" (picked), "Figuring out the thing nobody can get to work," "Mapping out what has to happen and in what order," "Making sure everyone knows what they\'re doing."',
  },
  {
    src: '/works/cal/reflection/build-style-q4.webp',
    caption: 'Build Style, question 4',
    alt: 'Build Style quiz, question 4: "Which one actually held your attention in school?" over a photo of an apple on a stack of books beside ABC blocks. Four answers: "Sports, clubs, anything where I ran the group," "Shop, welding, art, anything you make with your hands," "Drafting, CAD, or games where you build a whole system," "Science labs, taking electronics apart, puzzles."',
  },
]

// Chapter 2's homepage before and after: Cal-Visuals/02-problem/Tallo-LP-*.png whole, Safari window
// and all (Kai, 2026-10-22: the tight crops lost too much). The before window was 59px wider, so
// plain columns are cut out of it until both windows match, then each is trimmed to its window and
// shadow and scaled to exactly 1579x980, so the toggle swaps in place with no edge jump (Kai,
// 2026-10-23; script in the sprint folder's problem-build/). Before public: the new one still shows the unverified "2+ Million Users" badge, and the
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
// public/works/cal/kit is Kai's 2x transparent Paper exports (Cal-Visuals/06-into-product/
// cal-kit-final, 2026-10-24), run through kit-build/normalize_exports.py (sprint folder): every
// Cal on one 400x392 canvas with the same dial width and the feet on one baseline (the dial rule
// from normalize_cal.py, at 2x like the rules cards), props on a 224px square at 78% fill. The
// recap header is the full export, trimmed 2px a side to the 1055:498 slot.
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
      width: 2110,
      height: 996,
      alt: "Community recap header: an \"August recap\" tag above the headline \"Cal's Birthday Challenge: Community Roundup,\" beside Cal laughing in a striped party hat.",
    },
    video: { youtubeId: 'aYcAXaAlExM', title: 'Happy Birthday, Cal!', poster: `${K}/minecraft.webp` },
  },
}

// Chapter 4's rule cards: Kai's three poses (Cal-Visuals/04-rules, 1024px transparent PNGs), read
// worried, thinking, then the Researcher (Kai's pick over the plan's standard-outfit pose). Cut on
// the Kit's canvas with the same dial rule (kit-build/normalize_cal.py) at 2x, so Cal is the same
// size here as in the Kit. Before public: the scribbles on the ponder pose's glove cuff.
const R = '/works/cal/rules'

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
      hook: 'One mascot, one quiz, one handoff',
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
      hook: 'Only 3 in 100 made it to the starting line',
      blocks: [
        {
          kind: 'p',
          text: "Almost nobody started Tallo's career assessment: in spring 2025, about 3 in 100 career hub visits reached its intro page. I redesigned the homepage to put it first, but better placement only puts a big ask in front of more people. The assessment is 60 questions about mundane tasks like \"keep inventory records,\" a lot to ask of a 15 year old who doesn't know yet why they should care. So I built a shorter, friendlier way in: 9 questions, each a moment on a trail.",
        },
        {
          kind: 'visual',
          visual: {
            label: 'Before/after toggle: old homepage with three equal buttons, new homepage with one button, "Start Your Free Career Quiz"',
            aspect: '1579 / 980',
            compare: [
              {
                label: 'Before',
                caption: '3 equal buttons. No clear first step.',
                src: '/works/cal/problem/homepage-before.webp',
                alt: "Before: Tallo's old homepage offered three equal buttons, Explore Careers, Build Skills and Find a Job.",
              },
              {
                label: 'After',
                caption: 'One first step.',
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
      hook: "A compass doesn't work in space",
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
      hook: "Cal doesn't pick your path",
      blocks: [
        {
          kind: 'rules',
          items: [
            {
              title: 'The trailhead looks scarier than the trail.',
              text: 'Drove: 9 questions, told as a story.',
              pose: { src: `${R}/1-worried.webp`, alt: 'Cal looking worried, gloved hands clasped under a frown.' },
            },
            {
              title: "Cal doesn't pick your path. Cal helps you find it.",
              text: 'Drove: every result ends on a button into a career hub, a cluster of related careers, so people keep exploring.',
              pose: { src: `${R}/2-ponder.webp`, alt: 'Cal pondering, one glove at the chin, eyes looking up.' },
            },
            {
              title: 'Your result can change.',
              text: 'Drove: no percent match, which felt too definitive for a short intro quiz, and every result page ends with "it can evolve as you explore more."',
              pose: { src: `${R}/3-researcher.webp`, alt: 'Cal as the Researcher, grinning in a fedora and trench coat, holding up a magnifying glass.' },
            },
          ],
        },
      ],
    },
    {
      id: 'quiz',
      title: 'The quiz',
      // No-break space keeps the 9 with its word when the hook wraps on phones.
      hook: '60 survey questions became 9\u00a0moments on a trail',
      blocks: [
        {
          kind: 'p',
          text: 'I rewrote each RIASEC item as a moment on the trail from the Valley of Confusion to the Peak of Clarity. When we tried it out at an all-hands, people said six options per question was too many, so we cut it to four. Each type still shows up exactly six times across the nine questions, so no path gets a head start. If your top types tie, a tenth question breaks the tie. Cal reacts between questions like an older friend, so the quiz feels like a hike.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'Rewrite strip: survey item "Study the movement of planets" → Orion version → Cal version',
            frame: 'screen',
            aspect: '3 / 5',
            strip: rewrite,
            cols: [3, 3],
          },
        },
      ],
    },
    {
      id: 'product',
      title: 'Into the product',
      hook: 'The Typeform got a permanent home',
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
      hook: '86.5% made it to the Peak',
      blocks: [
        {
          kind: 'p',
          text: "Most people who start Cal finish it. Most who finish click through into a career hub, and about 1 in 3 go on to start the full assessment. Without a comparison group, I can't say how many would have started it anyway.",
        },
        // Shares as set in CaseStudy_Cal_V4.md Part 2 (86.5% and 34.5% also in the quiz system
        // DATA-SUMMARY.md). The last step is 34.5% of finishers, 29.8% of starters, so "about 30%".
        // Never a count on the page.
        {
          kind: 'funnel',
          steps: [
            { label: 'Started Cal', share: 100 },
            { label: 'Finished', share: 86.5 },
            { label: 'Clicked through to a career hub', share: 68.7 },
            { label: 'Started the full assessment', share: 30, value: 'about 30%' },
          ],
          caption: 'Share of people who started Cal. What happened, not what Cal caused.',
        },
      ],
    },
    {
      id: 'started',
      title: 'What Cal started',
      hook: 'One quiz became a monthly format',
      blocks: [
        {
          kind: 'p',
          text: 'Cal\'s quiz became the template for the community\'s monthly challenge quizzes, and each month added a twist. Founder Fit scored you, and a "Developing" result counted as a real answer, with no fail state. Growth Reflection tracked two scores at once, each with Cal\'s tiebreaker, plus one open question to check if it landed. I designed the branching, and my intern, Jae Stokes, built it from my setup guide. In September few people came back to comment, so October\'s Build Style quiz drops the community post, ends on real trades with pay, and asks for one sentence on the badge page. Completion across the Typeform quizzes held between 76% and 88%.',
        },
        {
          kind: 'visual',
          visual: {
            label:
              'Strip: what changed each month with a caption each, Jul Founder Fit > Aug Growth Reflection > Sep Creative Career Fit > Oct Build Style, October step links the landing page',
            aspect: '16 / 9',
            browsers: months,
            cols: [1, 2],
          },
        },
        {
          kind: 'quote',
          text: "I got Strong. I've always liked making things myself, there's a reason I fell in love with coding.",
          cite: 'Participant of the Founder Fit challenge',
        },
      ],
    },
    {
      id: 'next',
      title: "What's next",
      hook: "The trail isn't finished",
      blocks: [
        {
          kind: 'p',
          text: "Cal's Passport challenge was a test run for stamps. I took its results to product and art directed the stamps, which a product designer built into Tallo. Earning them teaches you how to use the platform. The next step I pitched builds on that: the homepage as Cal's trail, with your stamps showing how far you've come. The trail homepage hasn't shipped.",
        },
        {
          kind: 'visual',
          visual: {
            // Kai's files in Cal-Visuals/10-whats-next (2026-10-22): the shipped Stamps page in a phone
            // mockup, trimmed to its bezel, and the Career Passport exploration (2000x1510, at 1400).
            // Jennifer Stout built the stamps in product (credit from Kai, 2026-10-22).
            label: 'Stamps in product; Mascot Core image labeled "Exploration, not shipped"',
            pair: [
              {
                label: 'Shipped, in Tallo',
                src: '/works/cal/next/stamps-shipped.webp',
                width: 600,
                height: 1029,
                look: 'device',
                credit: 'Built in Tallo by Jennifer Stout, product designer.',
                alt: 'Tallo\'s Stamps page on a phone: "Collect stamps by completing activities on Tallo." Getting Started, 5 of 5 collected, each with an illustrated stamp and date: Account Created, First Step (complete the career assessment), Update Your Profile, Join a Group and First Post.',
              },
              {
                label: 'Exploration, not shipped',
                src: '/works/cal/next/passport-exploration.webp',
                width: 1400,
                height: 1057,
                look: 'card',
                alt: 'Career Passport exploration: "Collect stamps as you explore. Every trailhead you explore, every milestone you hit, marked in your Career Passport." Six stamp cards, Trail Starter and Arts Explorer earned; Career Compass, First Steps, Gear Check and Pathfinder not yet earned.',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'reflection',
      title: 'Reflection',
      hook: 'A 15 year old told us we got it wrong',
      blocks: [
        {
          kind: 'p',
          text: 'Back to the monthly challenges. In August, a challenge quiz built like Cal pulled in almost half of our entries. In September each quiz in the same format drew less than a sixth of that. The prize went away, the community lost its home page spot, and the topic narrowed, all at once, so I can\'t say which one did it.',
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
            frame: 'device',
            aspect: '582 / 1030',
            strip: buildStyle,
            cols: [2, 2],
          },
        },
        {
          // Kai, 2026-10-23: the photo full width felt too big. The closing lines lead in the quote
          // style, and the photo sits under them at the device strip's width.
          kind: 'photoQuote',
          label: 'Final takeaway',
          visual: {
            // Kai's Cal-Visuals/09-reflection/TalloSelfieReflect.jpeg (1280x720), as WebP at its own size.
            // A photo, not a screen, so no frame.
            label: 'Photo: Kai with Cal and two award badges',
            src: '/works/cal/reflection/tallies-selfie.webp',
            aspect: '1280 / 720',
            alt: 'Kai in headphones, smiling, with Cal making a heart and two badges: I Won The Tallies 2025, Voice of the User Award, and Mentor of the Year Award.',
            caption: "The Tallies 2025, Tallo's team awards: Voice of the User and Mentor of the Year.",
          },
          text: "Plenty of kids find their path because one adult puts something in front of them. I wanted Cal to be that mentor for the kids who don't have one. Cal taught me to start where people are. I still design that way.",
        },
      ],
    },
  ],
}
