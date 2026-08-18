import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = await getInfo(request)
    // dify-client 3.x takes the user as its own argument and appends it itself
    const res = await client.fileUpload(formData, user)
    // return the full Dify file object (id, name, size, mime_type, ...) as real JSON,
    // not a bare string — the client expects to JSON.parse this response
    return NextResponse.json(res.data)
  }
  catch (e: any) {
    // IMPORTANT: must be a real error status, not a silent 200 —
    // otherwise the client treats the error message as if it were
    // a successful upload's file id, corrupting the next chat message
    const status = e?.response?.status || e?.status || 500
    return NextResponse.json({ message: e.message || 'File upload failed' }, { status })
  }
}
