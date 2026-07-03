import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  LARK_TENANT_KEY,
  SESSION_COOKIE,
  SESSION_TTL,
  STATE_COOKIE,
  exchangeCodeForToken,
  fetchLarkUserInfo,
  getBaseUrl,
  signSession,
} from '@/utils/lark-auth'

const deny = (baseUrl: string, reason: string) =>
  NextResponse.redirect(`${baseUrl}/auth-error?reason=${encodeURIComponent(reason)}`)

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request)
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')

  let stored: { state?: string, redirectTo?: string } = {}
  try {
    stored = JSON.parse(request.cookies.get(STATE_COOKIE)?.value || '{}')
  }
  catch {}

  if (!code)
    return deny(baseUrl, 'missing_code')
  if (!state || state !== stored.state)
    return deny(baseUrl, 'state_mismatch')

  try {
    const accessToken = await exchangeCodeForToken(code, `${baseUrl}/api/auth/callback`)
    const userInfo = await fetchLarkUserInfo(accessToken)

    if (LARK_TENANT_KEY && userInfo.tenant_key !== LARK_TENANT_KEY)
      return deny(baseUrl, 'wrong_tenant')

    const sessionToken = await signSession({
      sub: userInfo.open_id,
      unionId: userInfo.union_id,
      name: userInfo.name || userInfo.en_name,
      email: userInfo.enterprise_email || userInfo.email,
      avatar: userInfo.avatar_url,
      tenantKey: userInfo.tenant_key,
    })

    const response = NextResponse.redirect(`${baseUrl}${stored.redirectTo || '/'}`)
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL,
    })
    response.cookies.delete(STATE_COOKIE)
    return response
  }
  catch (error: any) {
    console.error('Lark auth callback error:', error)
    return deny(baseUrl, 'auth_failed')
  }
}
