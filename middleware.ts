import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  LARK_CLIENT_ONLY,
  getSessionFromRequest,
  isLarkClient,
} from '@/utils/lark-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Optionally reject anything that is not the Lark in-app browser.
  // Note: user-agent checks are a convenience filter, not a security boundary —
  // the OAuth session below is what actually protects the app.
  if (LARK_CLIENT_ONLY && !isLarkClient(request) && pathname !== '/auth-error') {
    if (pathname.startsWith('/api/'))
      return NextResponse.json({ error: 'Lark client required' }, { status: 403 })
    return NextResponse.redirect(new URL('/auth-error?reason=lark_client_required', request.url))
  }

  const session = await getSessionFromRequest(request)
  if (!session) {
    if (pathname.startsWith('/api/'))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/api/auth/login', request.url)
    loginUrl.searchParams.set('redirect_to', pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Protect everything except:
     * - /api/auth/* (login, callback, logout must stay public)
     * - /auth-error (the access-denied page)
     * - Next.js internals and static assets
     */
    '/((?!api/auth|auth-error|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|map)$).*)',
  ],
}
