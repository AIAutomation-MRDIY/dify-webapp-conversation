import type { NextRequest } from 'next/server'
import { API_KEY, API_URL } from '@/config'
import { getInfo } from '@/app/api/utils/common'

// The installed dify-client SDK version (2.3.1, pinned in package.json)
// doesn't expose a filePreview() method — that was only added in a later
// major version we're not on. Rather than bump the SDK (risking breaking
// changes elsewhere), call Dify's documented REST endpoint directly.
export async function GET(request: NextRequest, { params }: {
  params: Promise<{ fileId: string }>
}) {
  const { fileId } = await params
  const { user } = await getInfo(request)

  try {
    const url = `${API_URL}/files/${fileId}/preview?user=${encodeURIComponent(user)}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(text || 'File preview failed', { status: res.status })
    }

    const arrayBuffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = res.headers.get('content-disposition') || 'inline'

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    })
  }
  catch (e: any) {
    return new Response(e.message || 'File preview failed', { status: 500 })
  }
}
