'use client'
import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'
import useLarkUser from '@/hooks/use-lark-user'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 min-w-0">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 shrink-0 rounded-lg hover:bg-gray-100"
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </button>
        )}
        <AppIcon size="small" />
        <div className="text-sm text-gray-900 font-semibold truncate">{title}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isMobile && (
          <button
            className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-gray-100"
            onClick={() => onCreateNewChat?.()}
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-600" />
          </button>
        )}
        {user && (
          user.avatar
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
            )
        )}
      </div>
    </div>
  )
}

export default React.memo(Header)
