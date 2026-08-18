import type { NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body
  const { user } = await getInfo(request)
  // request-object form: the positional overload's 4th arg is a boolean `stream`,
  // so passing the 'streaming' string there would be wrong
  const res = await client.createChatMessage({
    inputs,
    query,
    user,
    response_mode: responseMode,
    conversation_id: conversationId ?? undefined,
    files,
  })
  // streaming responses expose the raw Readable on .data, same as before
  return new Response(res.data as any)
}
