import { NextResponse, type NextRequest } from 'next/server'
import { UNLOCK_COOKIE, unlockToken } from '@/lib/unlock'

// Password gate for private pages, parked. It gated the Cal and Brand System case studies for
// reviewers (2026-10-25) until Kai opened them up on 2026-11-02, and is kept for future private
// projects along with /unlock (src/app/unlock/) and src/lib/unlock.ts.
//
// To gate pages again, create src/proxy.ts (Next 16's middleware) with:
//
//   export { unlockGate as proxy } from '@/lib/unlock-gate'
//   export const config = { matcher: ['/works/<case>/:path*'] }
//
// then set CASE_STUDY_PASSWORD in Vercel (Preview, and Redeploy) and in .env.local. No password set
// means locked, never open. The matcher also catches files in public/works/<case>/, so anything
// shown outside the gate (card covers) must live outside that folder. safeNext in unlock.ts falls
// back to /works/cal; point it at the new page.
export async function unlockGate(request: NextRequest) {
  const password = process.env.CASE_STUDY_PASSWORD
  const cookie = request.cookies.get(UNLOCK_COOKIE)?.value
  if (password && cookie && cookie === (await unlockToken(password))) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/unlock'
  url.search = ''
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}
