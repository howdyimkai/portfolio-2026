import { NextResponse, type NextRequest } from 'next/server'
import { UNLOCK_COOKIE, unlockToken } from '@/lib/unlock'

// The Cal and Brand System case studies are shared with reviewers behind a password until Tallo
// OKs public use (Kai, 2026-10-25). No password set means locked, never open.
export async function proxy(request: NextRequest) {
  const password = process.env.CASE_STUDY_PASSWORD
  const cookie = request.cookies.get(UNLOCK_COOKIE)?.value
  if (password && cookie && cookie === (await unlockToken(password))) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/unlock'
  url.search = ''
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/works/cal/:path*', '/works/brand-system/:path*'],
}
