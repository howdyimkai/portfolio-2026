import type { CaseStudy } from '@/components/case-study/types'

// Copy is CaseStudy_VisualMedia_v1.md (Claude-Workspace/projects/2026-10-PortfolioSprint/case-studies/
// visual-media/, 2026-11-04) with the handoff beside it. Visuals are Paper's exports from "Claude
// Sessions", published to public/works/visual-media/. Where the draft's open checks (its "Not page
// copy" list) were all answered by Kai on 2026-11-07 and are in. Change the draft first, then this file.
export const visualMedia: CaseStudy = {
  eyebrow: 'Case study · Video and motion',
  title: 'Tallo Video System',
  hook: 'Short videos about big career decisions, and the system that kept them coming.',
  meta: [
    { label: 'Role', value: 'Multimedia Designer, then Head of Creative' },
    { label: 'Where', value: 'Tallo, May 2025 to Nov 2026. Design Garden, my own program.' },
    { label: 'Tools', value: 'DaVinci Resolve, Jitter, Capsule, Canva, Claude Code, Remotion' },
    { label: 'Background', value: 'Film at UT Austin, then game cinematics for BioWare and Trion Worlds.' },
  ],
  // The reel, click to load from YouTube (the master stays there). Credits sit under it.
  hero: {
    label: 'Motion reel',
    custom: 'reel-player',
    aspect: '16 / 9',
    caption: 'Edited and animated by me. An intern wrote and shot [No Tutorial](https://www.youtube.com/watch?v=gM25Pn0udMA). Our social media manager started the educator video, and I finished it.',
  },
  stats: [
    { value: '12', label: 'episodes published in the career series' },
    { value: '1 hour to under 3 minutes', label: 'from live session to finished episode' },
    {
      value: '1,750 to 11,700',
      label: 'TikTok followers in 11 months',
      note: 'Made mostly by our social media manager and interns, using my production guide. Includes one video with 1.4 million views. Counted after a paid campaign ended.',
    },
  ],
  chapters: [
    {
      id: 'owned',
      title: 'What I owned',
      hook: 'The scripts, the edit, the motion and the rules',
      blocks: [
        {
          kind: 'owned',
          items: [
            'Story arcs and scripts for the career discovery series',
            'Editing, captions and sound in DaVinci Resolve',
            'Motion graphics, from title cards to full animated sequences',
            'The video guidelines and production guides our team and interns worked from',
          ],
        },
      ],
    },
    {
      id: 'series',
      title: 'The series',
      hook: 'An hour of Zoom, under three minutes of story',
      blocks: [
        {
          kind: 'visual',
          visual: {
            label: 'Entrepreneurship, Ep 1',
            aspect: '16 / 9',
            cols: [1, 1],
            strip: [
              {
                src: '/works/visual-media/series-ep1.webp',
                alt: 'Video cover for the Entrepreneurship series, episode 1. Opens on YouTube.',
                caption: 'Entrepreneurship, Ep 1.',
                href: 'https://www.youtube.com/watch?v=S6Sy1F0Z-Es',
                hrefLabel: 'Watch the episode on YouTube',
              },
            ],
          },
        },
        {
          kind: 'p',
          text: 'Tallo had hours of recorded sessions with working professionals, and young people asking the questions those sessions could answer. I designed a series to connect them: three episodes per topic, each under three minutes. We’ve published 12.',
        },
        {
          kind: 'p',
          text: 'The order never changes. Episode one asks if you’d want this life. Episode two shows how to get there. Episode three is real talk about what it costs.',
        },
        {
          kind: 'p',
          text: 'Each session ran about an hour with setup. A trim pass got it down to a longform version, then I found the moments that answer each question and cut it down even further around them. On Music Careers, I wrote the host script and hosted it on camera. On Mental Health, an intern wrote and hosted the bridges, I helped refine the script, and I cut Ep 1.',
        },
        // Kept in step with Brand System ("I built the challenge from their plan").
        {
          kind: 'p',
          text: 'After running it twice, I wrote the process down and made it a skill the team could call up in our [brand system](/works/brand-system). A writer used it to plan a new month’s series on their own, and I built the challenge from their plan.',
        },
        {
          kind: 'p',
          text: 'The rules did the most work. Captions get checked by hand. Clips start mid answer. No music swells over a hard story, and no cut ends on the hardest moment.',
        },
        {
          kind: 'p',
          text: 'We kept learning too. A text prompt with no voice felt jarring, as if someone asked a question and nobody spoke. We narrated the ask from then on, and that went in the guide.',
        },
      ],
    },
    {
      id: 'channels',
      title: 'Channels and collaborators',
      hook: 'Same program, a different reason to say yes',
      blocks: [
        {
          kind: 'visual',
          visual: {
            label: 'Educator and volunteer videos',
            aspect: '16 / 9',
            cols: [1, 2],
            strip: [
              {
                src: '/works/visual-media/educator.webp',
                alt: 'Video cover for the Real Careers, Real Journeys educator video. Opens on YouTube.',
                caption: 'Teachers and counselors heard “No prep for you.”',
                href: 'https://www.youtube.com/watch?v=CvS0BOaQW-w',
                hrefLabel: 'Watch the educator video',
              },
              {
                src: '/works/visual-media/volunteer.webp',
                alt: 'Video cover for the Real Careers, Real Journeys volunteer video. Opens on YouTube.',
                caption: 'Volunteers heard “Share your career story with students.”',
                href: 'https://www.youtube.com/watch?v=dL02JIn6jnI',
                hrefLabel: 'Watch the volunteer video',
              },
            ],
          },
        },
        {
          kind: 'p',
          text: 'Real Careers, Real Journeys had to win over two very different audiences. Volunteers heard “Share your career story with students.” Teachers and counselors heard “No prep for you.”',
        },
        {
          kind: 'p',
          text: 'Our social media manager used the brand system to start the educator cut from the volunteer trailer. I wrote a new voiceover on the same beats, so the pacing would still hold. The old graphics had black gaps and stats that didn’t match, so I rebuilt every graphic section in code with Claude Code and retimed it to the voiceover. It went through six versions in one day, with tests of a music score, voice only, and voice with sound effects.',
        },
        {
          kind: 'p',
          text: 'Episodes changed shape for their channel too. Entrepreneurship Ep 1 became a vertical teaser for social, cut down to 44 seconds.',
        },
        {
          kind: 'p',
          text: 'I work in whatever gets the video out. My edits run through DaVinci Resolve, Jitter and Capsule, and the educator video ran on code. Teammates finished in CapCut or Resolve. The rough cut gives any editor a clear target, so people can use the tool they’re fastest in.',
        },
        {
          kind: 'p',
          text: 'With interns, I start where they are. One wrote and shot [No Tutorial](https://www.youtube.com/watch?v=gM25Pn0udMA), and I edited it and added the motion graphics. Another wrote and hosted the bridges on Mental Health, and I helped refine the script.',
        },
      ],
    },
    {
      id: 'system',
      title: 'The video system',
      hook: 'Standards that survive the handoff',
      blocks: [
        {
          kind: 'p',
          text: 'I wrote Tallo’s video guidelines so our look didn’t depend on who was editing. They cover logo and watermark rules, type, color, caption length, platform specs, three story templates and a checklist to run before publishing.',
        },
        {
          kind: 'p',
          text: 'Then social outgrew them. Our palette wasn’t standing out in feeds, so I reworked it with our social media team in September 2026 and wrote down every decision.',
        },
        {
          kind: 'p',
          text: 'Our purple moved to #7C3AED, a 10 degree hue shift with more saturation. It reads as the same color turned up. I scoped it to social, so product, web and print stayed the same. The new green changed once we saw it in use: Acid Lime read too electric, so we moved to Key Lime.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'The social palette: two primaries turned up, the palette and its pairings',
            custom: 'social-palette',
            caption: 'Two primaries, turned up for the feed. Same brand, louder.',
          },
        },
        {
          kind: 'visual',
          visual: {
            label: 'Showdown cover, before and after the refresh',
            custom: 'showdown-wipe',
            caption: 'Showdown cover. Same layout, with our purple moved to #7C3AED.',
          },
        },
        {
          kind: 'p',
          text: 'Captions got a rule anyone could follow. Busy footage gets a purple pill with white text. Dark footage gets yellow with a dark stroke. One line, every time. The exact values live in caption templates, so editors apply them and never set them by hand.',
        },
        {
          kind: 'visual',
          visual: {
            label: 'One clip, two caption routes',
            aspect: '9 / 8',
            compare: [
              {
                label: 'Purple pill',
                src: '/works/visual-media/captions/kit-purple.webp',
                alt: 'A woman in safety glasses assembling a small drone, with the caption “Get started with engineering” in white text on a purple pill.',
                with: [
                  {
                    src: '/works/visual-media/captions/kit-yellow.webp',
                    alt: 'The same clip, with the caption now in yellow text with a dark stroke and no pill.',
                  },
                ],
                caption: 'Purple pill, white text, beside caption yellow with a dark stroke. Same clip, same caption.',
              },
            ],
          },
        },
        {
          kind: 'p',
          text: 'The tools got a vote too. Caprasimo had more personality as a display font, but it wouldn’t upload into CapCut, which would have broken the team’s editing workflow. Young Serif won.',
        },
      ],
    },
    {
      id: 'closing',
      title: 'Reflection',
      hook: 'Stories worth someone’s 3 minutes',
      blocks: [
        {
          kind: 'p',
          text: 'I started in film school at UT Austin and made game cinematics for BioWare and Trion Worlds. Gamers had already picked up the controller, so the story mostly had to keep them. At Tallo, I had three minutes to make a young person care about a decision they might not be thinking about yet.',
        },
        {
          kind: 'p',
          text: 'Tallo taught me the other half too. A good cut helps one video. A standard helps every video made after it, by people who never got to ask me why. So when we hit something with no rule, I make the call, say the reason out loud, and write it down.',
        },
        {
          kind: 'p',
          text: 'That’s the work I want to keep doing: stories worth someone’s three minutes, and standards strong enough to outlast the person who wrote them.',
        },
      ],
    },
  ],
}
