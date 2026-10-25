'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UNLOCK_COOKIE, UNLOCK_MAX_AGE, safeNext, unlockToken } from '@/lib/unlock'

export type UnlockState = { error: string | null }

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const password = process.env.CASE_STUDY_PASSWORD
  const attempt = formData.get('password')
  if (!password || typeof attempt !== 'string' || (await unlockToken(attempt)) !== (await unlockToken(password))) {
    return { error: "That's not it. Try again?" }
  }

  const jar = await cookies()
  jar.set(UNLOCK_COOKIE, await unlockToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: UNLOCK_MAX_AGE,
  })
  redirect(safeNext(formData.get('next')))
}
