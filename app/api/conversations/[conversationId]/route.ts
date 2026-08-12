import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

// Removes the conversation from this user's own conversation list.
// Dify's API only ever performs a soft delete (flips an internal flag) —
// it does not purge the conversation from the app owner's Logs console.
export async function DELETE(request: NextRequest, { params }: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const { user } = await getInfo(request)

  await client.deleteConversation(conversationId, user)
  return NextResponse.json({ result: 'success' })
}
