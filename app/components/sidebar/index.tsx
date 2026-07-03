import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDoubleLeftIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
import useLarkUser from '@/hooks/use-lark-user'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export interface ISidebarProps {
  title?: string
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onHide?: () => void
}

const Sidebar: FC<ISidebarProps> = ({
  title,
  currentId,
  onCurrentIdChange,
  list,
  onHide,
}) => {
  const { t } = useTranslation()
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <div
      className="shrink-0 flex flex-col bg-gray-50 pc:w-[260px] tablet:w-[220px] mobile:w-[280px] border-r border-gray-200 mobile:h-full tablet:h-screen"
    >
      {/* app info */}
      {title && (
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
          <AppIcon size="small" />
          <div className="flex-1 min-w-0 text-sm text-gray-900 font-semibold truncate">{title}</div>
          {onHide && (
            <button
              title="Hide sidebar"
              onClick={onHide}
              className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:bg-gray-200/60 hover:text-gray-700"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

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

      {/* user info */}
      {user && (
        <div className="flex items-center gap-2.5 px-3 py-3 border-t border-gray-200">
          {user.avatar
            ? (
              <img
                src={user.avatar}
                alt={user.name || 'avatar'}
                className="h-8 w-8 shrink-0 rounded-full object-cover bg-gray-100"
                referrerPolicy="no-referrer"
              />
            )
            : (
              <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-full bg-primary-600 text-white text-sm font-medium">
                {initial}
              </div>
            )}
          <div className="min-w-0 flex-1">
            <div className="text-sm text-gray-900 font-medium truncate">{user.name || user.email}</div>
            {user.name && user.email && (
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            )}
          </div>
          <a
            href="/api/auth/logout"
            title="Sign out"
            className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:bg-gray-200/60 hover:text-gray-700"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </a>
        </div>
      )}

      <div className="flex flex-shrink-0 px-4 pb-3">
        <div className="text-gray-400 font-normal text-[10px] leading-4 uppercase">
          Copyright © {(new Date()).getFullYear()} MR D.I.Y. GROUP (M) BERHAD (CO.NO. : 201001034084 (918007-M)) All Rights Reserved.
        </div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
