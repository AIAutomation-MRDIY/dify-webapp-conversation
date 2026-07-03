'use client'
import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'
import UserMenu from '@/app/components/user-menu'
import useLarkUser from '@/hooks/use-lark-user'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  // show the sidebar toggle even on desktop (used when the sidebar is collapsed)
  showToggle?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  showToggle,
  onShowSideBar,
  onCreateNewChat,
}) => {
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <div className="relative shrink-0 flex items-center h-14 px-3 bg-white border-b border-gray-200 dark:bg-zinc-900 dark:border-zinc-800">
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
        {/* desktop (collapsed sidebar): icon + title next to the toggle */}
        {!isMobile && (
          <>
            <AppIcon size="small" />
            <div className="text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">{title}</div>
          </>
        )}
      </div>
      {/* mobile: icon + title centered */}
      {isMobile && (
        <div className="absolute inset-x-0 flex items-center justify-center gap-2 pointer-events-none">
          <AppIcon size="small" />
          <div className="max-w-[55%] text-sm text-gray-900 dark:text-gray-100 font-semibold truncate">{title}</div>
        </div>
      )}
      {/* right: actions (mobile only) */}
      <div className="z-10 ml-auto flex items-center gap-1 shrink-0">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={() => onCreateNewChat?.()}
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        {isMobile && user && (
          <UserMenu placement="bottom">
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
