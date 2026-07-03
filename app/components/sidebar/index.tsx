import React, { useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDoubleLeftIcon,
  PencilIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
import UserMenu from '@/app/components/user-menu'
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
  onRenameConversation?: (id: string, name: string) => void
}

const Sidebar: FC<ISidebarProps> = ({
  title,
  currentId,
  onCurrentIdChange,
  list,
  onHide,
  onRenameConversation,
}) => {
  const { t } = useTranslation()
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const commitEditing = () => {
    const newName = editingName.trim()
    const item = list.find(item => item.id === editingId)
    if (editingId && item && newName && newName !== item.name)
      onRenameConversation?.(editingId, newName)
    setEditingId(null)
  }

  return (
    <div
      className="shrink-0 flex flex-col bg-gray-50 dark:bg-zinc-900 pc:w-[260px] tablet:w-[220px] mobile:w-[280px] border-r border-gray-200 dark:border-zinc-800 mobile:h-full tablet:h-screen"
    >
      {/* app info */}
      {title && (
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
          <AppIcon size="small" />
          <div className="flex-1 min-w-0 text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">{title}</div>
          {onHide && (
            <button
              title="Hide sidebar"
              onClick={onHide}
              className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
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
          const isEditing = editingId === item.id
          return (
            <div
              onClick={() => { if (!isEditing) { onCurrentIdChange(item.id) } }}
              key={item.id}
              title={item.name}
              className={classNames(
                isCurrent
                  ? 'bg-white text-primary-700 shadow-sm ring-1 ring-gray-200 dark:bg-zinc-800 dark:text-primary-300 dark:ring-zinc-700'
                  : 'text-gray-700 hover:bg-gray-200/60 dark:text-gray-300 dark:hover:bg-zinc-800/60',
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
              {isEditing
                ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={commitEditing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter')
                        commitEditing()
                      if (e.key === 'Escape')
                        setEditingId(null)
                    }}
                    onClick={e => e.stopPropagation()}
                    className="w-full min-w-0 rounded border border-primary-300 bg-white px-1 py-0.5 text-sm font-normal outline-none dark:bg-zinc-800 dark:border-primary-600 dark:text-gray-100"
                  />
                )
                : (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.id !== '-1' && onRenameConversation && (
                      <button
                        title="Rename"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(item.id, item.name)
                        }}
                        className="hidden group-hover:flex items-center justify-center h-6 w-6 shrink-0 ml-1 rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-zinc-700 dark:hover:text-gray-200"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
            </div>
          )
        })}
      </nav>

      {/* user info */}
      {user && (
        <div className="flex items-center gap-1 px-3 py-3 border-t border-gray-200 dark:border-zinc-800">
          <UserMenu placement="top">
            <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 -mx-1 hover:bg-gray-200/60 dark:hover:bg-zinc-800/60">
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
                <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">{user.name || user.email}</div>
                {user.name && user.email && (
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                )}
              </div>
            </div>
          </UserMenu>
          <a
            href="/api/auth/logout"
            title="Sign out"
            className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
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
