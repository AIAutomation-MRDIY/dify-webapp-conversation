import type { NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { API_KEY, API_URL, APP_ID } from '@/config'
import { getSessionFromRequest } from '@/utils/lark-auth'

const userPrefix = `user_${APP_ID}:`

export const getInfo = async (request: NextRequest) => {
  const session = await getSessionFromRequest(request)
  if (!session)
    throw new Error('Unauthorized: no valid Lark session')

  // Stable per-employee id so each Lark user keeps their own Dify conversations
  const sessionId = session.sub
  const user = userPrefix + session.sub
  return {
    sessionId,
    user,
    larkUser: session,
  }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
