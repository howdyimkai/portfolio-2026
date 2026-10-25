'use client'

// The setup walkthrough (Ch 5): a tappable demo of setup.sh and the Claude Cowork quickstart, so a
// reader who has never opened a terminal feels what a new teammate did. The point to land: the
// role you pick changes what Claude knows. Source of truth is Component_SetupWalkthrough_Spec.md in
// the sprint folder; every string here comes from it, never from the live repo (names, emails).
// Patterns from the Cal hero (StepFrame): every step is stacked in one grid cell, so the card holds
// the tallest step's height (the 8-role grid) and never jumps; inactive steps are inert; focus moves
// to the new step's title and a polite live region announces it. Nothing autoplays or persists.
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

type StepId = 'start' | 'workspace' | 'style' | 'role' | 'result' | 'done' | 'w1' | 'w2' | 'w3' | 'w4' | 'w5'

const CODE: StepId[] = ['start', 'workspace', 'style', 'role', 'result', 'done']
const COWORK: StepId[] = ['w1', 'w2', 'w3', 'w4', 'w5']

const STYLES = [
  { label: 'Casual and direct', line: 'Short outputs, no filler, no preamble.' },
  { label: 'Friendly but structured', line: 'Warm tone with clear organization.' },
  { label: 'Professional and thorough', line: 'Detailed, polished outputs with full context.' },
]

const ROLES = [
  {
    label: 'Social media / community',
    name: 'Social media',
    knows: ['How each platform sounds: Instagram, TikTok, LinkedIn', 'The social visual kit and its color rules', 'How to reply to comments in the brand voice'],
  },
  {
    label: 'Blog / SEO / long-form',
    name: 'Blog / SEO',
    knows: ['Three article formats, from "What a [career] actually does" to how-tos', 'An SEO checklist for every post', "Who reads the blog, and what they don't want"],
  },
  {
    label: 'Copywriter (web, email, UX)',
    name: 'Copywriter',
    knows: ['AIDA for short promos, PASTOR for longer pages', 'How to write UX microcopy and buttons', 'A swaps list for on-brand wording'],
  },
  {
    label: 'Designer',
    name: 'Designer',
    knows: ['Accessibility first, and designing for ages 13 to 30', 'Colors, type, and how to draw Cal', 'Which design files to use for which job'],
  },
  {
    label: 'Events / programs',
    name: 'Events / programs',
    knows: ['How to message workshops, speaker programs, and online challenges', 'Email, social, and partner templates', 'Capturing photos and stories with consent'],
  },
  {
    label: 'Developer',
    name: 'Developer',
    knows: ['Brand as code, with design tokens as the source of truth', 'Brand-ready patterns for buttons and hero sections', 'Accessibility built into the code'],
  },
  {
    label: 'Not sure (start with core brand)',
    name: 'Not sure',
    knows: ["What Tallo does and who it's for", "Voice dos and don'ts", 'Every stat comes from one approved file'],
  },
  {
    label: 'Executive (partner and board decks)',
    name: 'Executive',
    // "With the story left to you" mirrors Ch 3's exec decision ("leave the narrative to her").
    knows: ['Help gathering and recalling research, with the story left to you', 'Never invent a stat, quote, or testimonial', 'Audience words shift by room'],
  },
]

const SUMMARY =
  'A step-by-step walkthrough of the Tallo brand system setup. It asks whether you use Claude Code or Claude Cowork, how you like Claude to talk to you, and which of eight roles you do: social media, blog and SEO, copywriter, designer, events, developer, not sure, or executive. Each role gets its own brand context file.'

const CHOICE =
  'press-scale flex min-h-11 w-full items-center rounded-[10px] border border-hairline bg-white px-4 py-2.5 text-left font-mono text-[13px] leading-[1.45] text-ink-primary transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-tag/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-washi-blue'
const ACTION =
  'press-scale flex min-h-11 w-full items-center justify-center rounded-[10px] bg-ink-primary px-4 py-2.5 font-mono text-[13px] text-white transition-opacity duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-washi-blue'
const TEXT_BUTTON =
  'press-scale -mx-1 inline-flex min-h-11 items-center px-1 font-mono text-[12px] text-ink-body underline decoration-hairline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent-washi-blue'

type Card = {
  eyebrow: string
  title: string
  body: ReactNode
  // Lines the script prints, at most three. A leading ✓ marks a success line.
  out?: string[]
  // Two side by side (one column on phones), three stacked, or the 2-column role grid.
  choices: ReactNode
  layout?: 'pair' | 'stack' | 'grid'
}

export default function SetupWalkthrough() {
  const [history, setHistory] = useState<StepId[]>(['start'])
  const [style, setStyle] = useState<number | null>(null)
  const [role, setRole] = useState<number | null>(null)
  // Bumped on every step change, so the active step's output lines replay their stagger.
  const [visit, setVisit] = useState(0)
  const root = useRef<HTMLElement>(null)
  const refocus = useRef(false)
  const step = history[history.length - 1]

  const go = (next: StepId, reset = false) => {
    refocus.current = !!root.current?.contains(document.activeElement)
    setHistory((h) => (reset ? [next] : [...h, next]))
    setVisit((v) => v + 1)
  }
  const back = () => {
    refocus.current = true
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
    setVisit((v) => v + 1)
  }
  const startOver = () => {
    setStyle(null)
    setRole(null)
    go('start', true)
  }
  const pickRole = (i: number) => {
    setRole(i)
    go('result')
  }

  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    root.current?.querySelector<HTMLElement>(`[data-step="${step}"][data-active="true"] h3`)?.focus({ preventScroll: true })
  }, [step, visit])

  // Number keys 1 to 8 pick a role on the role step.
  const onKeyDown = (e: KeyboardEvent) => {
    if (step !== 'role' || e.metaKey || e.ctrlKey || e.altKey) return
    const n = Number(e.key)
    if (n >= 1 && n <= ROLES.length) {
      e.preventDefault()
      pickRole(n - 1)
    }
  }

  const path = COWORK.includes(step) ? COWORK : CODE
  const index = path.indexOf(step)
  const r = ROLES[role ?? 0]
  const s = STYLES[style ?? 2]

  const cards: Record<StepId, Card> = {
    start: {
      eyebrow: '[1/7] Checking for Claude Code',
      title: 'How do you use Claude?',
      body: 'Most of the team had never opened a terminal, so setup works two ways.',
      layout: 'pair',
      choices: (
        <>
          <button type="button" className={CHOICE} onClick={() => go('workspace')}>
            Claude Code (terminal)
          </button>
          <button type="button" className={CHOICE} onClick={() => go('w1')}>
            Claude Cowork (no terminal)
          </button>
        </>
      ),
    },
    workspace: {
      eyebrow: '[2/7] Setting up your workspace',
      title: 'One folder Claude can read',
      body: 'Setup makes a workspace on your Desktop and copies the brand system into it.',
      out: ['✓ Created ABOUT ME/', '✓ Created PROJECTS/', '✓ Copied tallo-brand-localsystem/'],
      choices: <Action onClick={() => go('style')}>Next</Action>,
    },
    style: {
      eyebrow: '[4/7] Tell us about yourself',
      title: 'How should Claude talk to you?',
      body: 'Your answer goes into a working-style file Claude reads every time.',
      layout: 'stack',
      choices: STYLES.map((st, i) => (
        <button
          key={st.label}
          type="button"
          className={CHOICE}
          onClick={() => {
            setStyle(i)
            go('role')
          }}
        >
          {st.label}
        </button>
      )),
    },
    role: {
      eyebrow: '[6/7] Choose your role',
      title: 'What do you do?',
      body: 'Your pick decides which brand context Claude starts from.',
      out: ['✓ Created ABOUT ME/working-style.md'],
      layout: 'grid',
      choices: ROLES.map((ro, i) => (
        <button key={ro.label} type="button" className={CHOICE} onClick={() => pickRole(i)}>
          <span aria-hidden="true" className="mr-2.5 text-ink-body tabular-nums">
            {i + 1}
          </span>
          {ro.label}
        </button>
      )),
    },
    result: {
      eyebrow: `✓ Selected: ${r.name}`,
      title: "Here's what Claude knows now",
      body: (
        <ul className="flex flex-col gap-1">
          {r.knows.map((k) => (
            <li key={k} className="flex gap-2">
              <span aria-hidden="true" className="text-ink-body">
                ·
              </span>
              {k}
            </li>
          ))}
        </ul>
      ),
      out: [`✓ Created CLAUDE.md from ${r.name} template`],
      layout: 'pair',
      choices: (
        <>
          <Action onClick={() => go('done')}>Finish setup</Action>
          <button type="button" className={CHOICE} onClick={() => go('role')}>
            Pick a different role
          </button>
        </>
      ),
    },
    done: {
      eyebrow: '[7/7] Setup complete',
      title: 'Your workspace is ready',
      body: (
        <>
          <p>Open the folder, start Claude, and it already knows the brand and your role.</p>
          <p className="mt-3 font-mono text-[12.5px] leading-[1.6]">
            <span className="text-ink-body">How Claude will talk to you: </span>
            <span className="text-ink-primary">{s.line}</span>
          </p>
          <pre className="mt-3 whitespace-pre-wrap font-mono text-[12.5px] leading-[1.6] text-ink-primary">
            {`Claude-Context/
├── ABOUT ME/
├── PROJECTS/
├── tallo-brand-localsystem/
├── CLAUDE.md  ← ${r.name}
└── global-instructions.md`}
          </pre>
        </>
      ),
      layout: 'pair',
      choices: (
        <>
          <Action onClick={() => go('role')}>Try another role</Action>
          <button type="button" className={CHOICE} onClick={startOver}>
            Start over
          </button>
        </>
      ),
    },
    w1: {
      eyebrow: 'Claude Cowork',
      title: 'Grab the latest release',
      body: 'Every release ships as a dated zip on the shared drive. Unzip it and put the folder on your Desktop.',
      choices: <Action onClick={() => go('w2')}>Next</Action>,
    },
    w2: {
      eyebrow: 'Claude Cowork',
      title: 'Point Cowork at the folder',
      body: 'Create a project in Claude Cowork and point it at the brand folder. Claude reads the brand files and templates the same way it would in Claude Code.',
      choices: <Action onClick={() => go('w3')}>Next</Action>,
    },
    w3: {
      eyebrow: 'Claude Cowork',
      title: 'Tell Claude about your job',
      body: 'In your first chat, Claude asks a few questions about your role and audience, then writes a short "about me" for the project\'s custom instructions. Every chat after that uses it.',
      choices: <Action onClick={() => go('w4')}>Next</Action>,
    },
    w4: {
      eyebrow: 'Claude Cowork',
      title: 'Two rules before you publish',
      body: (
        <ul className="flex flex-col gap-1.5">
          <li>Words: check terms against the core brand file. &quot;Students&quot; is for educators only.</li>
          <li>Numbers: if a stat isn&apos;t in the approved stats file, don&apos;t publish it.</li>
        </ul>
      ),
      choices: <Action onClick={() => go('w5')}>Next</Action>,
    },
    w5: {
      eyebrow: 'Claude Cowork',
      title: 'Same brand, no terminal',
      body: 'Cowork users get the same brand files as everyone else. The process guides work as docs you can ask Claude to walk you through.',
      layout: 'pair',
      choices: (
        <>
          <Action onClick={() => go('workspace')}>See the Claude Code setup</Action>
          <button type="button" className={CHOICE} onClick={startOver}>
            Start over
          </button>
        </>
      ),
    },
  }

  const active = cards[step]
  // Announce the title, plus the ✓ Selected line on a role result; never the folder lines.
  const announcement = `Step ${index + 1} of ${path.length}: ${step === 'result' ? `${active.eyebrow}. ` : ''}${active.title}`

  return (
    <div className="@container">
      <section
        ref={root}
        aria-label="Interactive demo: brand system setup"
        onKeyDown={onKeyDown}
        className="sw-card mx-auto max-w-[640px] rounded-[14px] border border-hairline bg-white p-5 print:hidden md:p-7"
      >
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="flex flex-1 gap-1">
            {path.map((id, i) => (
              <span key={id} className={`h-1 flex-1 rounded-full transition-colors duration-200 ${i <= index ? 'bg-ink-primary' : 'bg-tag'}`} />
            ))}
          </div>
          <span className="font-mono text-[12px] tabular-nums text-ink-body">
            {index + 1} / {path.length}
          </span>
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        {/* Every step in one cell: the cell takes the tallest, so the card never changes height. */}
        <div className="mt-5 grid">
          {(Object.keys(cards) as StepId[]).map((id) => (
            <StepLayer key={id} id={id} card={cards[id]} active={id === step} visit={visit} onBack={history.length > 1 ? back : undefined} />
          ))}
          {/* Sizing ghosts: every role's result and end card, so no role can grow the card. */}
          {ROLES.map((ro, i) =>
            i === (role ?? 0) ? null : (
              <div key={ro.name} aria-hidden="true" inert className="invisible col-start-1 row-start-1 flex flex-col">
                <Ghost eyebrow={`✓ Selected: ${ro.name}`} lines={ro.knows} />
              </div>
            ),
          )}
        </div>
      </section>

      {/* Without JS, or in print: the Claude Code path as a list, then the roles. */}
      <noscript>
        <style>{'.sw-card{display:none!important}.sw-fallback{display:block!important}'}</style>
      </noscript>
      <div className="sw-fallback hidden font-mono text-[13px] leading-[1.6] text-ink-body print:block">
        <p>{SUMMARY}</p>
        <ol className="mt-3 list-decimal pl-5">
          {CODE.map((id) => (
            <li key={id}>{cards[id].title}</li>
          ))}
        </ol>
        <ul className="mt-3 flex flex-col gap-2">
          {ROLES.map((ro) => (
            <li key={ro.name}>
              <span className="text-ink-primary">{ro.name}:</span> {ro.knows.join('. ')}.
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Action({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={ACTION} onClick={onClick}>
      {children}
    </button>
  )
}

function StepLayer({ id, card, active, visit, onBack }: { id: StepId; card: Card; active: boolean; visit: number; onBack?: () => void }) {
  const choices = {
    pair: 'grid grid-cols-1 gap-2 @min-[480px]:grid-cols-2',
    stack: 'flex flex-col gap-2',
    grid: 'grid grid-cols-1 gap-2 @min-[480px]:grid-cols-2',
  }[card.layout ?? 'stack']
  return (
    <div
      data-step={id}
      data-active={active}
      inert={!active}
      aria-hidden={!active}
      // A step shows at once and fades in; a leaving step fades out and only then hides. Focus moves
      // to the new title in the same frame, which a still-hidden title would refuse.
      className={`col-start-1 row-start-1 flex flex-col motion-reduce:transition-none ${
        active ? 'visible opacity-100 [transition:opacity_180ms_ease-out]' : 'invisible opacity-0 [transition:opacity_180ms_ease-out,visibility_0s_linear_180ms]'
      }`}
    >
      <p className="font-mono text-[12px] leading-[1.5] text-ink-body">{card.eyebrow}</p>
      <h3 tabIndex={-1} className="mt-2 font-display text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-ink-primary outline-none md:text-[26px]">
        {card.title}
      </h3>
      <div className="mt-2 font-mono text-[13px] leading-[1.6] text-ink-body [text-wrap:pretty]">{card.body}</div>
      {card.out && (
        <div key={active ? visit : 'idle'} className="mt-4 flex flex-col gap-0.5 rounded-[10px] bg-tag/55 px-3 py-2.5 font-mono text-[12px] leading-[1.5] text-ink-primary">
          {card.out.map((line, i) => (
            // Wrapped lines hang under the text, past the ✓.
            <p key={line} className="sw-line pl-[2ch] -indent-[2ch]" style={{ animationDelay: `${i * 150}ms` }}>
              {line}
            </p>
          ))}
        </div>
      )}
      <div className={`mt-auto pt-5 ${choices}`}>{card.choices}</div>
      <div className="mt-2 min-h-11">
        {onBack && id !== 'start' && (
          <button type="button" className={TEXT_BUTTON} onClick={onBack}>
            Back
          </button>
        )}
      </div>
    </div>
  )
}

// The result card's shape for a role not on screen, so the tallest one sets the card's height.
function Ghost({ eyebrow, lines }: { eyebrow: string; lines: string[] }) {
  return (
    <>
      <p className="font-mono text-[12px] leading-[1.5]">{eyebrow}</p>
      <p className="mt-2 font-display text-[22px] font-medium leading-[1.2] md:text-[26px]">Here&apos;s what Claude knows now</p>
      <ul className="mt-2 flex flex-col gap-1 font-mono text-[13px] leading-[1.6]">
        {lines.map((k) => (
          <li key={k}>· {k}</li>
        ))}
      </ul>
      <div className="mt-4 rounded-[10px] px-3 py-2.5 font-mono text-[12px] leading-[1.5]">✓ Created CLAUDE.md</div>
      <div className="mt-auto grid grid-cols-1 gap-2 pt-5 @min-[480px]:grid-cols-2">
        <div className="min-h-11" />
        <div className="min-h-11" />
      </div>
      <div className="mt-2 min-h-11" />
    </>
  )
}
