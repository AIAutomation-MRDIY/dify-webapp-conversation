'use client'
import type { FC } from 'react'
import React from 'react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChatBubbleLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'
import UserMenu from '@/app/components/user-menu'
import type { UserMenuAction } from '@/app/components/user-menu'
import useLarkUser from '@/hooks/use-lark-user'

export interface IHeaderProps {
  title: string
  conversationName?: string
  isMobile?: boolean
  // show the sidebar toggle even on desktop (used when the sidebar is collapsed)
  showToggle?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
  // only shown when the app actually has configurable prompt variables
  showConversationActions?: boolean
  onResetConversation?: () => void
  onChangeTopic?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  conversationName,
  isMobile,
  showToggle,
  onShowSideBar,
  onCreateNewChat,
  showConversationActions,
  onResetConversation,
  onChangeTopic,
}) => {
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  // on mobile these live in the avatar dropdown instead of as header icons
  const menuActions: UserMenuAction[] | undefined = isMobile
    ? [
      {
        label: 'New chat',
        icon: <PencilSquareIcon className="h-4 w-4" />,
        onClick: () => onCreateNewChat?.(),
      },
      ...(showConversationActions
        ? [
          {
            label: 'Reset conversation',
            icon: <ArrowPathIcon className="h-4 w-4" />,
            onClick: () => onResetConversation?.(),
          },
          {
            label: 'Change topic',
            icon: <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />,
            onClick: () => onChangeTopic?.(),
          },
        ]
        : []),
    ]
    : undefined

  return (
    <div className="relative shrink-0 flex items-center h-14 px-3 pc:px-4 bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
      {/* left: sidebar toggle */}
      <div className="z-10 flex items-center gap-2 min-w-0">
        {(isMobile || showToggle) && (
          <button
            className="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        {/* desktop (collapsed sidebar): icon + titles next to the toggle */}
        {!isMobile && (
          <>
            <AppIcon size="small" />
            <div className="text-sm text-gray-900 dark:text-gray-100 font-semibold truncate shrink-0">{title}</div>
            {conversationName && (
              <>
                <div className="mx-2 h-4 w-px shrink-0 bg-gray-200 dark:bg-zinc-700" />
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversationName}</div>
              </>
            )}
          </>
        )}
      </div>
      {/* mobile: icon + conversation title centered (falls back to the app name) */}
      {isMobile && (
        <div className="absolute inset-x-0 flex items-center justify-center gap-2 pointer-events-none">
          <AppIcon size="small" />
          <div className="max-w-[55%] text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">{conversationName || title}</div>
        </div>
      )}
      {/* right: actions. On mobile the header has no room for icons, so they
          move into the avatar menu (see menuActions above). */}
      <div className="z-10 ml-auto flex items-center gap-1 shrink-0">
        {!isMobile && showConversationActions && (
          <>
            <button
              title="Reset conversation"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
              onClick={() => onResetConversation?.()}
            >
              <ArrowPathIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              title="Change topic"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-gray-300"
              onClick={() => onChangeTopic?.()}
            >
              <ChatBubbleLeftEllipsisIcon className="h-[18px] w-[18px]" />
            </button>
          </>
        )}
        {user && (
          <UserMenu placement="bottom" actions={menuActions}>
            {user.avatar
              ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'avatar'}
                  className="h-8 w-8 ml-1 rounded-full object-cover bg-gray-100"
                  referrerPolicy="no-referrer"
                />
              )
              : (
                <div className="flex items-center justify-center h-8 w-8 ml-1 rounded-full bg-primary-600 text-white text-sm font-medium">
                  {initial}
                </div>
              )}
          </UserMenu>
        )}
      </div>
    </div>
  )
}

export default React.memo(Header)
