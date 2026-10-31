'use client'

// Design Garden's match card, rebuilt from DesignGardenTool src/pages/Matches.tsx (renderProfileCard
// and renderScoreBreakdown, 2026-10-31) for the Matching chapter: the app's layout and plant rating
// in portfolio tokens, on the tag panel like Cal's screens. A seeded demo pair, never crew data,
// scored by the ported logic in matching.ts. Handoff: Claude-Workspace .../case-studies/design-garden/
// CaseStudy_DesignGarden_Handoff.md, Session 2.
import { useId, useState } from 'react'
import type { Visual } from '../types'
import { CRITERION_MAX, calculateMatchScore, getBarColor, getPlantRating, scoreFeedbackCrossMatch, type Profile, type ScoreBreakdown } from './matching'

// The pair is picked so the score reads honest, not perfect: their skills overlap yours by a third
// (2 shared of 6, the top band), and they're an hour off your timezone, so that row shows ✕.
const YOU: Profile = {
  full_name: 'You',
  bio: null,
  career_stage: 'junior',
  specialization: ['UX Design'],
  skills: ['Figma', 'Framer', 'UX Research', 'Claude Code'],
  years_experience: 2,
  timezone: 'America/New_York',
  sprint_track: 'portfolio_building',
  sprint_goal: 'add_case_study',
  goal_hours_weekly: '5-10',
  accountability_hours: '1hr',
  working_style: 'structured',
  communication_preference: 'async',
  feedback_gives: 'direct',
  feedback_wants: 'supportive',
}

const THEM: Profile = {
  full_name: 'Robin Demo',
  bio: 'Product designer moving into design systems. Looking for a partner who keeps a weekly deadline.',
  career_stage: 'mid',
  specialization: ['Product Design', 'Design Systems'],
  skills: ['Figma', 'UX Research', 'Webflow', 'Prototyping'],
  years_experience: 4,
  timezone: 'America/Chicago',
  sprint_track: 'portfolio_building',
  sprint_goal: 'add_case_study',
  goal_hours_weekly: '5-10',
  accountability_hours: '2hr',
  working_style: 'structured',
  communication_preference: 'sync',
  feedback_gives: 'supportive',
  feedback_wants: 'direct',
}

// Labels as the app has them (Matches.tsx and lib/goalLabels.ts).
const CRITERION_LABELS: Record<keyof ScoreBreakdown, string> = {
  commitment: 'Commitment',
  experience: 'Experience',
  skills: 'Skills',
  discipline: 'Sprint Track',
  timezone: 'Timezone',
  personality: 'Personality',
}
const SPRINT_TRACK_LABELS: Record<string, string> = { job_search: 'Job Search', portfolio_building: 'Portfolio Building' }
const FEEDBACK_STYLE_LABELS: Record<string, string> = { direct: 'Direct', supportive: 'Supportive' }
const SPRINT_GOAL_LABELS: Record<string, string> = { add_case_study: 'Add a new case study' }
const BAR_KEYS: (keyof ScoreBreakdown)[] = ['commitment', 'experience', 'skills']

export default function MatchCard({ visual }: { visual: Visual }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const { total, breakdown } = calculateMatchScore(YOU, THEM)
  const plants = getPlantRating(total)
  const feedback = scoreFeedbackCrossMatch(YOU, THEM)

  const rows = [
    {
      label: 'Sprint Track',
      value: SPRINT_TRACK_LABELS[THEM.sprint_track ?? ''] ?? '—',
      matched: breakdown.discipline === CRITERION_MAX.discipline,
    },
    { label: 'Timezone', value: THEM.timezone ?? '—', matched: breakdown.timezone === CRITERION_MAX.timezone },
    // Ticked when what they give matches what you want to receive.
    { label: 'Gives feedback', value: FEEDBACK_STYLE_LABELS[THEM.feedback_gives ?? ''] ?? '—', matched: feedback.bGivesMatchesAWants },
    // Ticked when what you give matches what they want to receive.
    { label: 'Wants feedback', value: FEEDBACK_STYLE_LABELS[THEM.feedback_wants ?? ''] ?? '—', matched: feedback.aGivesMatchesBWants },
  ]

  return (
    <div className="rounded-[14px] bg-tag px-5 pb-5 pt-6 md:px-10 md:pb-7 md:pt-10" role="group" aria-label={`${visual.label}: a demo designer, ${plants.label.toLowerCase()}, ${plants.count} of 5 plants`}>
      <div className="mx-auto max-w-[560px] rounded-[12px] border border-hairline bg-white p-5 shadow-[0_8px_24px_rgba(58,50,38,0.08)] md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3 md:gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sand-light md:size-14" aria-hidden="true">
              <span className="font-display text-[20px] font-semibold text-ink-primary">{THEM.full_name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-[17px] font-semibold leading-tight text-ink-primary">{THEM.full_name}</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-sand-light px-2 py-0.5 font-mono text-[11px] text-ink-primary">{THEM.career_stage}</span>
                {THEM.specialization?.map((s) => (
                  <span key={s} className="rounded-full bg-tag px-2 py-0.5 font-mono text-[11px] text-ink-body">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Plant rating: five sprouts, the unearned ones faded, as in the app. */}
          <div className="shrink-0 text-right">
            <div className="mb-0.5 flex justify-end gap-0.5 text-[13px] md:text-[15px]" role="img" aria-label={`${plants.count} of 5 plants`}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} aria-hidden="true" style={{ opacity: i < plants.count ? 1 : 0.2 }}>
                  🌱
                </span>
              ))}
            </div>
            <span className="font-mono text-[11px] text-ink-muted">{plants.label}</span>
          </div>
        </div>

        <p className="mb-3 font-mono text-[13px] leading-[1.55] text-ink-body [text-wrap:pretty]">{THEM.bio}</p>

        <div className="mb-3">
          <p className="mb-1.5 font-mono text-[11px] text-ink-muted">Goal:</p>
          <span className="rounded-full bg-accent-orange/10 px-2 py-0.5 font-mono text-[11px] text-accent-orange">
            {SPRINT_GOAL_LABELS[THEM.sprint_goal ?? '']}
          </span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="press-scale relative inline-flex items-center gap-1 font-mono text-[12px] text-ink-primary underline decoration-chip-line underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-['']"
        >
          {open ? 'Hide' : 'See'} compatibility breakdown
          <span aria-hidden="true" className={`inline-block transition-transform duration-200 ease-[var(--ease-out-strong)] motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </button>

        {/* Opens by its rows' height (grid 0fr to 1fr), no fixed max-height. */}
        <div
          id={id}
          inert={!open}
          className={`grid transition-[grid-template-rows] duration-[240ms] ease-[var(--ease-out-strong)] motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="mt-3 space-y-2.5 border-t border-hairline pt-3">
              {BAR_KEYS.map((key) => {
                const pct = Math.round((breakdown[key] / CRITERION_MAX[key]) * 100)
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 font-mono text-[12px] text-ink-body">{CRITERION_LABELS[key]}</span>
                    <div
                      className="h-1.5 flex-1 rounded-full bg-tag"
                      role="meter"
                      aria-label={CRITERION_LABELS[key]}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-valuetext={`${pct}%`}
                    >
                      <div className={`h-full rounded-full ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {rows.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-[12px] text-ink-muted">{r.label}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[12px] font-medium text-ink-primary">{r.value}</span>
                  <span className={`font-mono text-[12px] font-medium ${r.matched ? 'text-ink-primary' : 'text-ink-faint'}`}>
                    <span aria-hidden="true">{r.matched ? '✓' : '✕'}</span>
                    <span className="sr-only">{r.matched ? 'match' : 'no match'}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* The same cue row as the Cal quiz hero's "Tap to try it", gone once the breakdown is open. */}
      <p className="mt-4 min-h-[18px] font-mono text-[12px] leading-[1.5] text-ink-body md:mt-5" aria-hidden={open}>
        {open ? '' : 'Tap to see the score'}
      </p>
    </div>
  )
}
