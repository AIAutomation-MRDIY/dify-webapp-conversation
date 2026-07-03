'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'
import useLarkUser from '@/hooks/use-lark-user'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs }) => {
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <div className='flex items-start justify-end' key={id}>
      <div className='relative max-w-[80%] pc:max-w-[70%] text-sm text-gray-900'>
        <div className='py-3 px-4 bg-[#E1EFFE] rounded-2xl'>
          {imgSrcs && imgSrcs.length > 0 && (
            <ImageGallery srcs={imgSrcs} />
          )}
          <StreamdownMarkdown content={content} />
        </div>
      </div>
      {/* Lark user avatar */}
      {user?.avatar
        ? (
          <img
            src={user.avatar}
            alt={user.name || 'me'}
            className='w-8 h-8 ml-2 shrink-0 rounded-full object-cover bg-gray-100'
            referrerPolicy='no-referrer'
          />
        )
        : (
          <div className='flex items-center justify-center w-8 h-8 ml-2 shrink-0 rounded-full bg-primary-600 text-white text-sm font-medium'>
            {initial}
          </div>
        )}
    </div>
  )
}

export default React.memo(Question)
