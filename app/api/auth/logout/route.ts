import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, getBaseUrl } from '@/utils/lark-auth'

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(`${getBaseUrl(request)}/api/auth/login`)
  response.cookies.delete(SESSION_COOKIE)
  return response
}
