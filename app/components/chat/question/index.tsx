'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import copy from 'copy-to-clipboard'
import {
  ClipboardDocumentIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'
import Toast from '@/app/components/base/toast'
import useLarkUser from '@/hooks/use-lark-user'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
  onEditSend?: (content: string) => void
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs, onEditSend }) => {
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(content)

  const handleCopy = () => {
    copy(content)
    Toast.notify({ type: 'success', message: 'Copied' })
  }

  const handleEditSend = () => {
    const text = editText.trim()
    setIsEditing(false)
    if (text && text !== '')
      onEditSend?.(text)
  }

  return (
    <div className='group flex items-start justify-end' key={id}>
      {/* bubble first (rightmost); actions sit to its left and wrap below when space is tight */}
      <div className='flex min-w-0 flex-1 flex-row-reverse flex-wrap content-start items-end justify-start gap-1'>
        <div className={`relative min-w-0 text-sm text-gray-900 dark:text-gray-100 ${isEditing ? 'flex-1 basis-full' : 'max-w-[80%] pc:max-w-[70%]'}`}>
          {isEditing
            ? (
              <div className='rounded-2xl border-2 border-primary-300 dark:border-primary-600 bg-white dark:bg-zinc-800 p-3 shadow-lg'>
                <textarea
                  autoFocus
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      handleEditSend()
                    }
                    if (e.key === 'Escape')
                      setIsEditing(false)
                  }}
                  rows={Math.min(6, editText.split('\n').length + 1)}
                  className='block w-full resize-none bg-transparent text-sm leading-6 text-gray-900 dark:text-gray-100 outline-none'
                />
                <div className='mt-2 flex items-center justify-end gap-2'>
                  <button
                    onClick={() => setIsEditing(false)}
                    className='h-8 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-700'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSend}
                    className='h-8 rounded-lg bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700'
                  >
                    Send
                  </button>
                </div>
              </div>
            )
            : (
              <div className='py-3 px-4 bg-[#E1EFFE] dark:bg-[#27314D] rounded-2xl break-words'>
                {imgSrcs && imgSrcs.length > 0 && (
                  <ImageGallery srcs={imgSrcs} />
                )}
                <StreamdownMarkdown content={content} />
              </div>
            )}
        </div>
        {/* hover actions: copy + edit */}
        {!isEditing && (
          <div className='flex shrink-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity items-center gap-0.5 rounded-[10px] border border-gray-200 bg-white p-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800'>
            <button
              title='Copy'
              onClick={handleCopy}
              className='flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-200'
            >
              <ClipboardDocumentIcon className='h-4 w-4' />
            </button>
            {onEditSend && (
              <button
                title='Edit'
                onClick={() => {
                  setEditText(content)
                  setIsEditing(true)
                }}
                className='flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-700 dark:hover:text-gray-200'
              >
                <PencilIcon className='h-4 w-4' />
              </button>
            )}
          </div>
        )}
      </div>
      {/* Lark user avatar */}
      {user?.avatar
        ? (
          <img
            src={user.avatar}
            alt={user.name || 'me'}
            className='w-10 h-10 ml-2 shrink-0 rounded-full object-cover bg-gray-100'
            referrerPolicy='no-referrer'
          />
        )
        : (
          <div className='flex items-center justify-center w-10 h-10 ml-2 shrink-0 rounded-full bg-primary-600 text-white text-sm font-medium'>
            {initial}
          </div>
        )}
    </div>
  )
}

export default React.memo(Question)
