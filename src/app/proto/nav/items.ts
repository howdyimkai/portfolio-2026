export type ProtoItem = { key: string; lines: [string, string] }

export const ITEMS: ProtoItem[] = [
  { key: 'works', lines: ['Selected', 'works'] },
  { key: 'play', lines: ['Play', 'ground'] },
  { key: 'notes', lines: ['Field', 'notes'] },
  { key: 'about', lines: ['About', 'me'] },
]

export type NavProps = { active: string; onSelect: (key: string) => void }
