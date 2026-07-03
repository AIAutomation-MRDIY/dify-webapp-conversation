'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import AppIcon from '@/app/components/base/app-icon'

export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}

type UserInfo = {
  name?: string
  email?: string
  avatar?: string
}

const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated)
          setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()

  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-3 pc:px-5 bg-white border-b border-gray-200">
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
        <div className="text-sm pc:text-base text-gray-900 font-semibold truncate">{title}</div>
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
          <div className="flex items-center gap-2 pl-2 pc:pl-3 ml-1 border-l border-gray-200">
            {user.avatar
              ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'avatar'}
                  className="h-8 w-8 rounded-full object-cover bg-gray-100"
                  referrerPolicy="no-referrer"
                />
              )
              : (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-600 text-white text-sm font-medium">
                  {initial}
                </div>
              )}
            {!isMobile && (
              <div className="max-w-[140px] text-sm text-gray-700 font-medium truncate">
                {user.name || user.email}
              </div>
            )}
            <a
              href="/api/auth/logout"
              title="Sign out"
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(Header)
