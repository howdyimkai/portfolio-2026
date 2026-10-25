import type { ComponentType } from 'react'
import type { Visual } from '../types'
import Architecture from './Architecture'
import ChallengeVideo from './ChallengeVideo'
import EvalBars from './EvalBars'
import EvalHero from './EvalHero'
import FolderTree from './FolderTree'
import Outputs from './Outputs'
import Palette from './Palette'
import SetupWalkthrough from './SetupWalkthrough'
import Social from './Social'

// The Brand System case study's built visuals, by the `custom` key in its content file. A key with
// no component yet falls back to the labeled placeholder, so the page reads end to end while the
// visuals land phase by phase (eval hero, static visuals, setup walkthrough).
export const CUSTOM_VISUALS: Record<string, ComponentType<{ visual: Visual }>> = {
  'eval-hero': EvalHero,
  architecture: Architecture,
  'folder-tree': FolderTree,
  palette: Palette,
  social: Social,
  'challenge-video': ChallengeVideo,
  'eval-bars': EvalBars,
  'setup-walkthrough': SetupWalkthrough,
  outputs: Outputs,
}
