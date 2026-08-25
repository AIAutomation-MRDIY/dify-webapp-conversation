import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { user } = await getInfo(request)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')

  // No conversation yet (e.g. right after stopping a brand-new chat) means
  // there is nothing to load. dify-client 3.x throws a ValidationError for an
  // empty id, which used to surface as an unhandled 500.
  if (!conversationId)
  { return NextResponse.json({ data: [] }) }

  try {
    const { data }: any = await client.getConversationMessages(user, conversationId)
    return NextResponse.json(data)
  }
  catch (e: any) {
    const status = e?.status || e?.response?.status || 500
    return NextResponse.json({ data: [], error: e.message || 'Failed to load messages' }, { status })
  }
}
