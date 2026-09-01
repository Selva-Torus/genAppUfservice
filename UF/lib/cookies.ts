// app/next-api/auth/lib/cookies.ts
import { NextResponse } from 'next/server'

export const FULL_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const COOKIE_PREFIX = FULL_BASE_PATH.replace(/^\/|\/$/g, '').replace(/\//g, '_')

export function baseCookieOptions() {
  return {
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    path: FULL_BASE_PATH,
  }
}

export function clearAuthCookies(response: NextResponse) {
  const expired = { ...baseCookieOptions(), maxAge: 0 }
  response.cookies.set(`${COOKIE_PREFIX}_token`, '', expired)
  response.cookies.set(`${COOKIE_PREFIX}_tp_ps`, '', expired)
  response.cookies.set(`${COOKIE_PREFIX}_oauth_state`, '', expired)
  response.cookies.set(`${COOKIE_PREFIX}_app_tenant`, '', expired)
  response.cookies.set(`${COOKIE_PREFIX}_app_tenant_id`, '', expired)
}

export function setTokenCookie(response: NextResponse, token: string) {
  response.cookies.set(`${COOKIE_PREFIX}_token`, token, {
    ...baseCookieOptions(),
    httpOnly: true,
    maxAge: 60 * 60 * 8,
  })
}