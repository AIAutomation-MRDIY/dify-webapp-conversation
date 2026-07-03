import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  STATE_COOKIE,
  buildAuthorizeUrl,
  getBaseUrl,
} from '@/utils/lark-auth'

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request)
  const redirectUri = `${baseUrl}/api/auth/callback`

  // where to land after login; only allow same-site paths
  const redirectTo = request.nextUrl.searchParams.get('redirect_to') || '/'
  const safeRedirectTo = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/'

  const state = crypto.randomUUID()
  const response = NextResponse.redirect(buildAuthorizeUrl(redirectUri, state))
  response.cookies.set(STATE_COOKIE, JSON.stringify({ state, redirectTo: safeRedirectTo }), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return response
}
