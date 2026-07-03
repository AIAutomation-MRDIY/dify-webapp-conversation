import type { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

/**
 * Lark / Feishu OAuth + signed session helpers.
 * Edge-runtime compatible (used by both middleware and API routes).
 */

export const SESSION_COOKIE = 'lark_session'
export const STATE_COOKIE = 'lark_oauth_state'

// Lark (international) by default; set LARK_DOMAIN=feishu for the CN platform.
const isFeishu = process.env.LARK_DOMAIN === 'feishu'
export const LARK_ACCOUNTS_BASE = isFeishu
  ? 'https://accounts.feishu.cn'
  : 'https://accounts.larksuite.com'
export const LARK_API_BASE = isFeishu
  ? 'https://open.feishu.cn'
  : 'https://open.larksuite.com'

export const LARK_APP_ID = process.env.LARK_APP_ID || ''
export const LARK_APP_SECRET = process.env.LARK_APP_SECRET || ''
// Optional: restrict logins to a single tenant (find it in the user_info response)
export const LARK_TENANT_KEY = process.env.LARK_TENANT_KEY || ''
// Optional: also require the request to come from the Lark client (user-agent check)
export const LARK_CLIENT_ONLY = process.env.LARK_CLIENT_ONLY === 'true'
// Session lifetime in seconds (default 12h); re-auth inside Lark is seamless
export const SESSION_TTL = Number.parseInt(process.env.SESSION_TTL || '43200', 10)

export type LarkSession = {
  sub: string // open_id
  unionId?: string
  name?: string
  email?: string
  avatar?: string
  tenantKey?: string
}

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET
  if (!secret)
    throw new Error('SESSION_SECRET env var is not set')
  return new TextEncoder().encode(secret)
}

export const signSession = async (session: LarkSession) => {
  return new SignJWT(session as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL)
    .sign(getSecretKey())
}

export const verifySession = async (token?: string): Promise<LarkSession | null> => {
  if (!token)
    return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (!payload.sub)
      return null
    return payload as unknown as LarkSession
  }
  catch {
    return null
  }
}

export const getSessionFromRequest = (request: NextRequest) =>
  verifySession(request.cookies.get(SESSION_COOKIE)?.value)

// Base URL of this deployment, honouring Vercel's proxy headers
export const getBaseUrl = (request: NextRequest) => {
  if (process.env.APP_BASE_URL)
    return process.env.APP_BASE_URL.replace(/\/$/, '')
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export const isLarkClient = (request: NextRequest) => {
  const ua = request.headers.get('user-agent') || ''
  return /Lark|Feishu/i.test(ua)
}

export const buildAuthorizeUrl = (redirectUri: string, state: string) => {
  const params = new URLSearchParams({
    client_id: LARK_APP_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  })
  return `${LARK_ACCOUNTS_BASE}/open-apis/authen/v1/authorize?${params.toString()}`
}

// Exchange the authorization code for a user access token (OAuth v2)
export const exchangeCodeForToken = async (code: string, redirectUri: string) => {
  const res = await fetch(`${LARK_API_BASE}/open-apis/authen/v2/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: LARK_APP_ID,
      client_secret: LARK_APP_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  })
  const data = await res.json()
  if (!res.ok || data.code !== 0 || !data.access_token)
    throw new Error(`Lark token exchange failed: ${data.error_description || data.msg || JSON.stringify(data)}`)
  return data.access_token as string
}

export const fetchLarkUserInfo = async (accessToken: string) => {
  const res = await fetch(`${LARK_API_BASE}/open-apis/authen/v1/user_info`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok || data.code !== 0 || !data.data?.open_id)
    throw new Error(`Lark user_info failed: ${data.msg || JSON.stringify(data)}`)
  return data.data as {
    open_id: string
    union_id?: string
    user_id?: string
    name?: string
    en_name?: string
    email?: string
    enterprise_email?: string
    avatar_url?: string
    tenant_key?: string
  }
}
