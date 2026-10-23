// Content files keep straight quotes so copy pastes in from the drafts as written; the page shows
// curly ones. Every string in a CaseStudy goes through this once, except paths and links, which
// never hold a quote mark anyway (the guard keeps it that way).
const OPENS = /[\s([{—–-]/

function curl(t: string): string {
  if (!t.includes("'") && !t.includes('"')) return t
  if (t.startsWith('/') || /^https?:/.test(t)) return t
  let out = ''
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    const opens = i === 0 || OPENS.test(t[i - 1])
    if (c === '"') out += opens ? '“' : '”'
    // The copy never single-quotes a phrase, so every ' is an apostrophe.
    else if (c === "'") out += '’'
    else out += c
  }
  return out
}

export function smartQuotes<T>(v: T): T {
  if (typeof v === 'string') return curl(v) as T
  if (Array.isArray(v)) return v.map(smartQuotes) as T
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, smartQuotes(x)])) as T
  }
  return v
}
