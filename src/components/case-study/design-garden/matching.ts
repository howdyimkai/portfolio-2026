// Design Garden's match scoring, ported from DesignGardenTool src/lib/matching.ts (2026-10-31) so
// the case study's match card is scored by the real logic, not hardcoded. Pure functions only: the
// app's UI helpers that this card doesn't use (score chips, relative time) stay behind. If the
// product's scoring changes, port it again rather than editing it here.

// The profile fields scoring reads, plus what the card shows. A slice of the app's Profile row.
export type Profile = {
  full_name: string | null
  bio: string | null
  career_stage: 'student' | 'junior' | 'mid' | 'senior' | 'lead' | null
  specialization: string[] | null
  skills: string[] | null
  years_experience: number | null
  timezone: string | null
  sprint_track: 'job_search' | 'portfolio_building' | null
  sprint_goal: string | null
  goal_hours_weekly: string | null
  accountability_hours: string | null
  working_style: 'structured' | 'flexible' | null
  communication_preference: 'async' | 'sync' | null
  feedback_gives: 'direct' | 'supportive' | null
  feedback_wants: 'direct' | 'supportive' | null
}

export interface ScoreBreakdown {
  commitment: number // max 20
  experience: number // max 15
  skills: number // max 15
  discipline: number // max 20
  timezone: number // max 10
  personality: number // max 20
}

export interface MatchResult {
  total: number // 0-100
  breakdown: ScoreBreakdown
}

export const CRITERION_MAX: Record<keyof ScoreBreakdown, number> = {
  commitment: 20,
  experience: 15,
  skills: 15,
  discipline: 20,
  timezone: 10,
  personality: 20,
}

const HOURS_INDEX: Record<string, number> = {
  '1-5': 0,
  '5-10': 1,
  '10-15': 2,
  '15-20': 3,
  '20+': 4,
}

const ACCOUNTABILITY_INDEX: Record<string, number> = {
  '30min': 0,
  '1hr': 1,
  '2hr': 2,
  '3hr+': 3,
}

const CAREER_INDEX: Record<string, number> = {
  student: 0,
  junior: 1,
  mid: 2,
  senior: 3,
  lead: 4,
}

const TIMEZONE_OFFSETS: Record<string, number> = {
  'America/New_York': -5,
  'America/Chicago': -6,
  'America/Denver': -7,
  'America/Los_Angeles': -8,
  'America/Anchorage': -9,
  'Pacific/Honolulu': -10,
  'America/Phoenix': -7,
  'Asia/Kolkata': 5.5,
}

function scoreCommitment(a: Profile, b: Profile): number {
  // Goal hours alignment (max 12)
  let goalScore = 6 // neutral midpoint
  if (a.goal_hours_weekly && b.goal_hours_weekly) {
    const idxA = HOURS_INDEX[a.goal_hours_weekly]
    const idxB = HOURS_INDEX[b.goal_hours_weekly]
    if (idxA !== undefined && idxB !== undefined) {
      const diff = Math.abs(idxA - idxB)
      goalScore = [12, 9, 5, 2, 0][diff] ?? 0
    }
  }

  // Accountability hours alignment (max 8)
  let accountabilityScore = 4 // neutral midpoint
  if (a.accountability_hours && b.accountability_hours) {
    const idxA = ACCOUNTABILITY_INDEX[a.accountability_hours]
    const idxB = ACCOUNTABILITY_INDEX[b.accountability_hours]
    if (idxA !== undefined && idxB !== undefined) {
      const diff = Math.abs(idxA - idxB)
      accountabilityScore = [8, 5, 2, 0][diff] ?? 0
    }
  }

  return goalScore + accountabilityScore
}

function scoreExperience(a: Profile, b: Profile): number {
  // Career stage proximity (max 10)
  let careerScore = 5 // neutral midpoint
  if (a.career_stage && b.career_stage) {
    const idxA = CAREER_INDEX[a.career_stage]
    const idxB = CAREER_INDEX[b.career_stage]
    if (idxA !== undefined && idxB !== undefined) {
      const diff = Math.abs(idxA - idxB)
      careerScore = [10, 7, 4, 1, 0][diff] ?? 0
    }
  }

  // Years experience similarity (max 5)
  let yearsScore = 3 // neutral midpoint
  if (a.years_experience != null && b.years_experience != null) {
    const diff = Math.abs(a.years_experience - b.years_experience)
    if (diff <= 1) yearsScore = 5
    else if (diff <= 3) yearsScore = 3
    else if (diff <= 6) yearsScore = 1
    else yearsScore = 0
  }

  return careerScore + yearsScore
}

function scoreSkills(a: string[] | null, b: string[] | null): number {
  if (!a || !b || a.length === 0 || b.length === 0) return 8 // neutral midpoint

  const setA = new Set(a.map((s) => s.toLowerCase()))
  const setB = new Set(b.map((s) => s.toLowerCase()))
  const intersection = [...setA].filter((s) => setB.has(s)).length
  const union = new Set([...setA, ...setB]).size

  const ratio = intersection / union

  // Peaks above 25% and up to 50% overlap: shared context plus strengths to trade. Partners don't
  // work on the same project, so more overlap scores lower.
  if (ratio <= 0.1) return 3
  if (ratio <= 0.25) return 8
  if (ratio <= 0.5) return 15
  if (ratio <= 0.7) return 13
  return 10
}

function scoreDiscipline(a: Profile, b: Profile): number {
  if (!a.sprint_track || !b.sprint_track) return 10 // neutral midpoint
  return a.sprint_track === b.sprint_track ? 20 : 8
}

function scoreTimezone(a: string | null, b: string | null): number {
  if (!a || !b) return 5 // neutral midpoint

  const offsetA = TIMEZONE_OFFSETS[a]
  const offsetB = TIMEZONE_OFFSETS[b]
  if (offsetA === undefined || offsetB === undefined) return 5

  const diff = Math.abs(offsetA - offsetB)
  if (diff === 0) return 10
  if (diff === 1) return 8
  if (diff === 2) return 5
  if (diff === 3) return 2
  return 0
}

export function scoreFeedbackCrossMatch(
  a: Profile,
  b: Profile,
): { score: number; aGivesMatchesBWants: boolean; bGivesMatchesAWants: boolean } {
  // Direction 1: does A's giving style match what B wants to receive?
  let aDirectionScore = 3 // neutral midpoint (indeterminate)
  let aGivesMatchesBWants = false
  if (a.feedback_gives != null && b.feedback_wants != null) {
    aGivesMatchesBWants = a.feedback_gives === b.feedback_wants
    aDirectionScore = aGivesMatchesBWants ? 6 : 2
  }

  // Direction 2: does B's giving style match what A wants to receive?
  let bDirectionScore = 3 // neutral midpoint (indeterminate)
  let bGivesMatchesAWants = false
  if (b.feedback_gives != null && a.feedback_wants != null) {
    bGivesMatchesAWants = b.feedback_gives === a.feedback_wants
    bDirectionScore = bGivesMatchesAWants ? 6 : 2
  }

  const score = Math.round((aDirectionScore + bDirectionScore) / 2)

  return { score, aGivesMatchesBWants, bGivesMatchesAWants }
}

function scorePersonality(a: Profile, b: Profile): number {
  // Working style (max 8)
  let workingScore = 4 // neutral midpoint
  if (a.working_style && b.working_style) {
    workingScore = a.working_style === b.working_style ? 8 : 3
  }

  // Communication preference (max 6)
  let commScore = 3 // neutral midpoint
  if (a.communication_preference && b.communication_preference) {
    commScore = a.communication_preference === b.communication_preference ? 6 : 2
  }

  // Feedback style (max 6), cross-matched: what A gives vs what B wants, and vice versa
  const feedbackScore = scoreFeedbackCrossMatch(a, b).score

  return workingScore + commScore + feedbackScore
}

export function calculateMatchScore(currentUser: Profile, candidate: Profile): MatchResult {
  const breakdown: ScoreBreakdown = {
    commitment: scoreCommitment(currentUser, candidate),
    experience: scoreExperience(currentUser, candidate),
    skills: scoreSkills(currentUser.skills, candidate.skills),
    discipline: scoreDiscipline(currentUser, candidate),
    timezone: scoreTimezone(currentUser.timezone, candidate.timezone),
    personality: scorePersonality(currentUser, candidate),
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  return { total, breakdown }
}

export function getPlantRating(score: number): { count: number; label: string } {
  if (score >= 80) return { count: 5, label: 'Great fit' }
  if (score >= 60) return { count: 4, label: 'Strong fit' }
  if (score >= 40) return { count: 3, label: 'Good fit' }
  if (score >= 20) return { count: 2, label: 'Decent fit' }
  return { count: 1, label: 'Worth a try' }
}

// The app's bar bands (green, brand green, yellow, grey), in portfolio ink: darker is a stronger fit.
export function getBarColor(pct: number): string {
  if (pct >= 80) return 'bg-ink-primary'
  if (pct >= 60) return 'bg-ink-body'
  if (pct >= 40) return 'bg-sand-dark'
  return 'bg-chip-line'
}
