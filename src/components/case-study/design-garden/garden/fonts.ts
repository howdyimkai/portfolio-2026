// Design Garden's own type (Enriqueta headings, Inter body), as the match card uses.
import { Enriqueta, Inter } from 'next/font/google'

// preload: false: below the fold, and preloads leak onto other pages' first load.
export const enriqueta = Enriqueta({ weight: ['600', '700'], subsets: ['latin'], display: 'swap', preload: false })
export const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false })
