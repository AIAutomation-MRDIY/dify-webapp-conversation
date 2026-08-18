import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

// Aborting the browser's fetch only closes our end of the stream — Dify keeps
// generating (and billing) server-side. This tells Dify to actually stop the
// task. The installed dify-client SDK (2.3.1) has no stopMessage(), so call
// the documented REST endpoint directly.
export async function POST(request: NextRequest, { params }: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = await params
  const { user } = await getInfo(request)

  try {
    const res = await fetch(`${API_URL}/chat-messages/${taskId}/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ result: 'error', error: text }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  }
  catch (e: any) {
    return NextResponse.json({ result: 'error', error: e.message }, { status: 500 })
  }
}
