import type { FC } from 'react'
import React from 'react'
import FileTypeIcon from '@/app/components/base/file-uploader-in-attachment/file-type-icon'
import { getFileAppearanceType, getFileNameFromUrl } from '@/app/components/base/file-uploader-in-attachment/utils'
import type { VisionFile } from '@/types/app'

export interface ISentFileListProps {
  files: VisionFile[]
}

// Read-only display for non-image attachments (PDF, docx, txt, etc.) that
// were sent along with a message — images already have their own
// ImageGallery rendering, this only covers everything else.
const SentFileList: FC<ISentFileListProps> = ({ files }) => {
  if (!files || files.length === 0) { return null }

  return (
    <div className='flex flex-col gap-1 mb-2'>
      {files.map((file, index) => {
        const raw = file as any
        // Our own locally-built objects use `.name`; Dify's raw history
        // response (loaded after a refresh) uses `.filename` instead.
        const name = file.name || raw.filename || getFileNameFromUrl(file.url) || 'File'
        // Dify's history response also gives a real `.mime_type` — prefer
        // that for icon detection; fall back to the filename's own
        // extension otherwise (covers our own just-uploaded local files).
        const mimeType = raw.mime_type || ''
        const appearanceType = getFileAppearanceType(name, mimeType)

        // Prefer our own permanent proxy (works the instant upload
        // succeeds, and never expires) over Dify's raw signed `url`
        // (which carries a timestamp/signature and can eventually expire).
        const fileId = file.upload_file_id || file.id
        const href = fileId ? `/api/files/${fileId}/preview` : (file.url || undefined)

        return (
          <a
            key={fileId || index}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={`flex items-center gap-2 max-w-[260px] rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-2 shadow-sm ${href ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700' : 'cursor-default'}`}
          >
            <FileTypeIcon type={appearanceType} size='md' />
            <span className='flex-1 min-w-0 truncate text-sm text-gray-700 dark:text-gray-200'>{name}</span>
          </a>
        )
      })}
    </div>
  )
}

export default React.memo(SentFileList)
