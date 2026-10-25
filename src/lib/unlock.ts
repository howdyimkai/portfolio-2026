// Password gate for the private case studies (src/proxy.ts, /unlock). The cookie holds a hash of
// CASE_STUDY_PASSWORD, never the password, so changing the password in Vercel signs everyone out.
// Web Crypto so the same code runs in the proxy and the server action.
export const UNLOCK_COOKIE = 'case_study_unlock'
export const UNLOCK_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function unlockToken(password: string) {
  const bytes = new TextEncoder().encode(`case-study-unlock:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

// Only same-site paths, so /unlock can't be used to bounce someone to another site.
export function safeNext(next: unknown) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/works/cal'
}
