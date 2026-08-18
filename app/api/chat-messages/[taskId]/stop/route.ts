import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

// Aborting the browser's fetch only closes our end of the stream — Dify keeps
// generating (and billing) server-side. This tells Dify to actually stop the task.
export async function POST(request: NextRequest, { params }: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params
  const { user } = await getInfo(request)

  try {
    const res = await client.stopChatMessage(taskId, user)
    return NextResponse.json(res.data)
  }
  catch (e: any) {
    const status = e?.status || e?.response?.status || 500
    return NextResponse.json({ result: 'error', error: e.message || 'Stop failed' }, { status })
  }
}
