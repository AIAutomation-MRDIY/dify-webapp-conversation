import type { NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function GET(request: NextRequest, { params }: {
  params: Promise<{ fileId: string }>
}) {
  const { fileId } = await params
  const { user } = await getInfo(request)

  try {
    const res = await client.filePreview(fileId, user)

    return new Response(res.data as any, {
      status: 200,
      headers: {
        'Content-Type': res.headers?.['content-type'] || 'application/octet-stream',
        'Content-Disposition': res.headers?.['content-disposition'] || 'inline',
      },
    })
  }
  catch (e: any) {
    const status = e?.status || e?.response?.status || 500
    return new Response(e.message || 'File preview failed', { status })
  }
}
