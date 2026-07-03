import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="shrink-0 flex flex-col bg-gray-50 pc:w-[260px] tablet:w-[220px] mobile:w-[280px] border-r border-gray-200 tablet:h-[calc(100vh_-_3.5rem)] mobile:h-full"
    >
      {list.length < MAX_CONVERSATION_LENTH && (
        <div className="flex flex-shrink-0 p-3">
          <button
            onClick={() => { onCurrentIdChange('-1') }}
            className="flex w-full items-center justify-center gap-2 h-10 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            <PencilSquareIcon className="h-4 w-4" /> {t('app.chat.newChat')}
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {list.map((item) => {
          const isCurrent = item.id === currentId
          const ItemIcon
            = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
          return (
            <div
              onClick={() => onCurrentIdChange(item.id)}
              key={item.id}
              title={item.name}
              className={classNames(
                isCurrent
                  ? 'bg-white text-primary-700 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-700 hover:bg-gray-200/60',
                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors',
              )}
            >
              <ItemIcon
                className={classNames(
                  isCurrent
                    ? 'text-primary-600'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-2.5 h-4 w-4 flex-shrink-0',
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </div>
          )
        })}
      </nav>
      <div className="flex flex-shrink-0 px-4 py-3 border-t border-gray-200">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
