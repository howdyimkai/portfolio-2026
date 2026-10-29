// The résumé, from strategy/Resume_2026-10_Draft.md (the part between the first two `---` lines),
// with the site version header (no email, no St. Louis). Hyphens kept on purpose: it's
// professional copy. The bookmark sheet and the PDF carry the one-page "Speaking and Awards"
// lines; /resume passes `online` for the draft's longer "Online résumé only" section.
import SayHowdy from './SayHowdy'

const EXPERIENCE = [
  {
    org: 'Tallo',
    about: 'Edtech career platform for people 13 to 30',
    dates: 'May 2025 to Nov 2026',
    roles: (
      <>
        <strong>Head of Creative</strong>, Aug 2026 to Nov 2026 · <strong>Multimedia Designer</strong>, May 2025 to Aug 2026
        <br />
        <em>Role eliminated when the parent company closed the marketing department, Nov 2026.</em>
      </>
    ),
    bullets: [
      'Designed Cal, a compass mascot and three-minute story quiz that gets teens started on career discovery. 9,400+ people finished it on Typeform in 6 months. Once Tallo’s product team built it in, 72% of starters finished, and about half of finishers went on to complete the full 60-question assessment.',
      'Rebuilt the brand as structured data that AI reads before it writes, with Claude workflows, a brand linter and an eval. In testing, drafts that broke a brand rule fell from 80% to 31%. Drafts with made-up stats went from 31% to zero. 14 teammates use it.',
      'Redesigned a scholarships application drive mid-campaign. Completion rose from 29.9% to 63.9%.',
      'Ran the monthly community challenges for 14 months, with 1,321 submissions. Took the results of Cal’s Passport Challenge, a back-to-school campaign where students earned stamps for profile tasks, to product, and art directed the Stamps feature that shipped in Feb 2026.',
      'Built Tallo’s first design automation, a testimonial system holding 56 testimonials, and a digital asset hub.',
      'Hired and managed two creative interns. Won “Voice of the User” and “Best Mentor” at the 2025 Tallo Tallies.',
    ],
  },
  {
    org: 'Design Garden',
    about: 'Sprint program and web app where designers pair up and ship one goal in four weeks',
    dates: 'Apr 2023 to present',
    roles: (
      <>
        <strong>Founder and product designer.</strong> Started as Sprintfolio with two cofounders, then rebuilt solo.
      </>
    ),
    bullets: [
      'Designed and built the sprint app, with pair matching and weekly check-ins, using Claude Code and Supabase. 37 designers across four crews have gone through it, with about an 80% pair check-in rate, and 29 more are on the waitlist.',
      <>
        As Sprintfolio, ran nearly 200 sprint partnerships on Notion, then built a platform with the team that reached $1K MRR in its first month. One of 35 teams picked from 57,000 applicants to build in San Francisco with{' '}
        <a href="https://buildspace.so/sf1" target="_blank" rel="noopener noreferrer">Buildspace</a>.
      </>,
    ],
  },
  {
    org: 'USAA',
    about: 'Senior Creative Designer (contract)',
    dates: 'Sep 2021 to Jun 2022, Mar 2024 to May 2025',
    bullets: [
      'Worked with subject matter experts to turn USAA’s value management framework into required training for 205 executives, teaching leaders how to size a bet: budget, goals and risks. 195 finished it, and USAA renewed it as an annual refresher.',
      'Designed and built benefits training for 5,000 employees in Articulate 360 Rise and Storyline.',
      'Created an employee recognition app in Power Apps, Power Automate and SharePoint for the portfolio office’s 219 employees, and took it through launch. Nominations move through three levels of review on their own, so admins no longer build forms or chase reviewers by email.',
    ],
  },
  {
    org: 'Innovare',
    about: 'UX Consultant, team lead (contract)',
    dates: 'Sep 2022 to Jan 2023',
    bullets: [
      'Led three designers to research and design self-service onboarding for a school data dashboard, where half of new clients were dropping off during setup. In usability testing, setup dropped from six to eight weeks of custom builds to under three minutes, and satisfaction rose from 3.8 to 4.13 out of 5.',
    ],
  },
  {
    org: 'University of Texas at Austin',
    about: 'Multimedia Technician',
    dates: 'Apr 2018 to Sep 2021',
    bullets: [
      'Built Premiere Pro templates and beginner-friendly guides for two journalism classes, and refreshed the branding and intro motion graphics for the Reporting Texas broadcast.',
    ],
  },
]

const SKILLS = [
  ['Design', 'interaction design, user flows, information architecture, prototyping, design systems, brand systems, accessibility, motion'],
  ['Research', 'user interviews, usability testing, A/B testing, journey mapping, affinity mapping, competitive analysis, card sorting, survey design'],
  ['AI and build', 'Claude Code, Lovable, Midjourney, Nano Banana, AI workflows and evals, JavaScript, HTML/CSS, Supabase, Git, n8n, Power Apps, Power Automate'],
  ['Tools', 'Figma, Paper, Framer, Webflow, Adobe CC (Illustrator, Photoshop, After Effects, Premiere), DaVinci Resolve, Jitter, Articulate 360, SharePoint, Typeform, Notion'],
]

// "Online résumé only" in the draft: titles and links, since the web has no page limit.
const ONLINE = [
  {
    id: 'speaking',
    title: 'Speaking',
    items: [
      <>“Design, Test, Repeat” · <a href="https://haas.berkeley.edu/business-academy/" target="_blank" rel="noopener noreferrer">UC Berkeley Business Academy for Youth</a>, Haas School of Business · Feb 2026</>,
      <><a href="https://www.chicagocamps.org/event/ux-camp-fall-2024/" target="_blank" rel="noopener noreferrer">Future Proof Your Portfolio with AI Projects + Insights</a> · UX Camp Fall · 2024</>,
      <><a href="https://www.chicagocamps.org/kai-tran-bridging-gaps-how-ai-transforms-design-learning-and-careers/" target="_blank" rel="noopener noreferrer">Bridging Gaps: How AI Transforms Design Learning and Careers</a> · Chicago Camp Tent Talks podcast · 2024</>,
      <><a href="https://vimeo.com/876057163" target="_blank" rel="noopener noreferrer">The Future of Tech Needs Design Innovators</a> · University of Arizona, UX of UA · 2023</>,
    ],
  },
  {
    id: 'awards',
    title: 'Awards',
    items: [<><a href="https://uxdesignathon.com/" target="_blank" rel="noopener noreferrer">Miami Hack Week UX Designathon</a>, winner · 2023</>],
  },
  {
    id: 'community',
    title: 'Community',
    items: [
      <>Judge and mentor at 3 hackathons: <a href="https://www.makeitmvp.com/" target="_blank" rel="noopener noreferrer">makeitMVP</a> pitch night, <a href="https://outsidellms.devpost.com/" target="_blank" rel="noopener noreferrer">Outside LLMs</a> AI and music hackathon, <a href="https://imnothackathon.devfolio.co/" target="_blank" rel="noopener noreferrer">imnotHackathon</a> · 2023 to 2024</>,
    ],
  },
]

export default function Resume({ titleId, online = false }: { titleId: string; online?: boolean }) {
  const Name = online ? 'h1' : 'h2'
  return (
    <article className="rs-doc">
      <header className="rs-head">
        {/* The page's heading on /resume, the dialog's title in the sheet. */}
        <Name id={titleId} className="rs-name">Kai Tran</Name>
        <p className="rs-line">Product designer · Open to remote or roles in Austin, Texas</p>
        <p className="rs-line">
          <a href="https://howdyimkai.com">howdyimkai.com</a> ·{' '}
          <a href="https://www.linkedin.com/in/uxdesignerkai/" target="_blank" rel="noopener noreferrer">linkedin.com/in/uxdesignerkai</a>
        </p>
        <div className="rs-actions">
          {/* MISSING: /resume/Kai-Tran-Resume.pdf isn't exported yet (handoff step 2), so this 404s for now. */}
          <a className="rs-btn rs-btn-primary" href="/resume/Kai-Tran-Resume.pdf" download>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.5v9m0 0-3.5-3.5M10 12.5l3.5-3.5M4 15.5h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Download PDF
          </a>
          <SayHowdy />
        </div>
      </header>

      <p className="rs-summary">
        Product designer who makes learning feel like play. I designed a three-minute career quiz that 9,400+ people finished in 6 months, and an AI brand system 14 teammates use.
      </p>

      <section aria-labelledby="rs-exp">
        <h3 id="rs-exp" className="rs-h">Experience</h3>
        {EXPERIENCE.map((job) => (
          <div key={job.org} className="rs-job">
            <p className="rs-org">
              <strong>{job.org}</strong> · {job.about}
            </p>
            <p className="rs-dates">{job.dates}</p>
            {job.roles && <p className="rs-roles">{job.roles}</p>}
            <ul className="rs-list">
              {job.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className="rs-earlier">
          <strong>Earlier:</strong> designed the MVP of Aceable’s mobile driver’s ed app, marketing for 1,000+ Go! Retail stores (Disney, Hasbro, LEGO), and game cinematics for BioWare and Trion Worlds.
        </p>
      </section>

      <section aria-labelledby="rs-skills">
        <h3 id="rs-skills" className="rs-h">Skills</h3>
        <dl className="rs-skills">
          {SKILLS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="rs-edu">
        <h3 id="rs-edu" className="rs-h">Education</h3>
        <p>
          <strong>B.S. Radio, Television and Digital Media</strong>, minor in Digital Arts and Media · University of Texas at Austin
        </p>
      </section>

      {online ? (
        ONLINE.map((sec) => (
          <section key={sec.id} aria-labelledby={`rs-${sec.id}`}>
            <h3 id={`rs-${sec.id}`} className="rs-h">{sec.title}</h3>
            <ul className="rs-list">
              {sec.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <section aria-labelledby="rs-speaking">
          <h3 id="rs-speaking" className="rs-h">Speaking and Awards</h3>
          <p>
            <strong>Speaking:</strong> UC Berkeley Haas (2026), UX Camp Fall (2024), Chicago Camp podcast (2024), University of Arizona (2023)
          </p>
          <p>
            <strong>Awards:</strong> Miami Hack Week UX Designathon winner (2023)
          </p>
        </section>
      )}
    </article>
  )
}
