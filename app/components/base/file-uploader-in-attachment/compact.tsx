'use client'
import { PaperClipIcon } from '@heroicons/react/24/outline'
import FileFromLinkOrLocal from './file-from-link-or-local'
import { useStore } from './store'
import { useFile } from './hooks'
import FileItem from './file-item'
import type { FileUpload } from './types'
import { TransferMethod } from '@/types/app'
import cn from '@/utils/classnames'

// Uploaded attachments shown inside the chat input box.
// Must be rendered inside a FileContextProvider.
export const AttachmentFileList = ({ fileConfig }: { fileConfig: FileUpload }) => {
  const files = useStore(s => s.files)
  const {
    handleRemoveFile,
    handleReUploadFile,
  } = useFile(fileConfig)

  if (!files.length)
    return null

  return (
    <div className='mb-1 space-y-1'>
      {files.map(file => (
        <FileItem
          key={file.id}
          file={file}
          showDeleteAction
          showDownloadAction={false}
          onRemove={() => handleRemoveFile(file.id)}
          onReUpload={() => handleReUploadFile(file.id)}
        />
      ))}
    </div>
  )
}

// Paperclip button that opens the link/local upload popover.
// Must be rendered inside a FileContextProvider.
export const AttachmentTrigger = ({ fileConfig }: { fileConfig: FileUpload }) => {
  const files = useStore(s => s.files)
  const disabled = !!fileConfig.number_limits && files.length >= fileConfig.number_limits
  const methods = fileConfig?.allowed_file_upload_methods
  const showFromLink = !methods || methods.includes(TransferMethod.remote_url)
  const showFromLocal = !methods || methods.includes(TransferMethod.local_file)

  return (
    <FileFromLinkOrLocal
      showFromLink={showFromLink}
      showFromLocal={showFromLocal}
      fileConfig={fileConfig}
      trigger={open => (
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-700',
            open && 'bg-gray-100 text-gray-700',
            disabled && 'opacity-50 pointer-events-none',
          )}
        >
          <PaperClipIcon className='w-[18px] h-[18px]' />
        </div>
      )}
    />
  )
}
