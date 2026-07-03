'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, imgSrcs }) => {
  return (
    <div className='flex items-start justify-end' key={id}>
      <div className='relative max-w-[85%] pc:max-w-[75%] text-sm text-gray-900'>
        <div className='py-3 px-4 bg-primary-100 rounded-2xl rounded-tr-md'>
          {imgSrcs && imgSrcs.length > 0 && (
            <ImageGallery srcs={imgSrcs} />
          )}
          <StreamdownMarkdown content={content} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(Question)
