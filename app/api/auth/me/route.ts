import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/utils/lark-auth'

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session)
    return NextResponse.json({ authenticated: false }, { status: 401 })

  return NextResponse.json({
    authenticated: true,
    user: {
      openId: session.sub,
      name: session.name,
      email: session.email,
      avatar: session.avatar,
    },
  })
}
