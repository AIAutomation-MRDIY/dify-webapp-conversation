import type { NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL } from '@/config'
import { getSessionFromRequest } from '@/utils/lark-auth'

export const getInfo = async (request: NextRequest) => {
  const session = await getSessionFromRequest(request)
  if (!session)
    throw new Error('Unauthorized: no valid Lark session')

  // Human-readable id shown in Dify's Logs & Annotations. A short open_id
  // suffix keeps it unique even when two employees share the same name.
  const user = session.name
    ? `${session.name} (${session.sub.slice(-6)})`
    : (session.email || session.sub)

  return {
    sessionId: session.sub,
    user,
    larkUser: session,
  }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
