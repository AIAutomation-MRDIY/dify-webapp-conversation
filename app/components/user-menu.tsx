'use client'
import type { FC, ReactNode } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import type { ThemeChoice } from '@/hooks/use-theme'
import useTheme from '@/hooks/use-theme'

const THEME_OPTIONS: { value: ThemeChoice, label: string, Icon: typeof SunIcon }[] = [
  { value: 'system', label: 'System', Icon: ComputerDesktopIcon },
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
]

const AboutModal: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className='fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4'
    onClick={onClose}
  >
    <div
      className='relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800'
      onClick={e => e.stopPropagation()}
    >
      <button
        className='absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-700 dark:hover:text-gray-200'
        onClick={onClose}
      >
        <XMarkIcon className='h-5 w-5' />
      </button>
      <div className='mb-3 flex items-center gap-2.5'>
        <img src='/mrdiy-panda.png' alt='PandAI' className='h-10 w-10 rounded-full object-cover object-top bg-gray-100' />
        <div className='text-base font-semibold text-gray-900 dark:text-gray-100'>About PandAI Chatbot</div>
      </div>
      <div className='space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>
        <p>
          Copyright © {new Date().getFullYear()} MR D.I.Y. GROUP (M) BERHAD
          (CO.NO. : 201001034084 (918007-M)). All Rights Reserved.
        </p>
        <p>
          This AI chatbot is provided by MR.DIY to assist employees with internal
          enquiries using available company information. AI-generated responses may
          be incomplete or outdated. Please verify important information with the
          relevant department or official company documents before making decisions.
        </p>
        <p>
          Do not share confidential, personal, financial, customer, or
          password-related information. Chatbot interactions may be monitored for
          security, compliance, and service improvement purposes.
        </p>
      </div>
    </div>
  </div>
)

export interface UserMenuProps {
  children: ReactNode
  placement?: 'top' | 'bottom'
  className?: string
}

// Wraps a trigger (user avatar/name); clicking it opens the settings menu
const UserMenu: FC<UserMenuProps> = ({ children, placement = 'top', className }) => {
  const [open, setOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      <div className='cursor-pointer' onClick={() => setOpen(v => !v)}>
        {children}
      </div>
      {open && (
        <div
          className={`absolute z-[60] w-64 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 ${
            placement === 'top' ? 'bottom-full mb-2 left-0' : 'top-full mt-2 right-0'
          }`}
        >
          {/* theme */}
          <div className='flex items-center justify-between px-2.5 py-2'>
            <span className='text-sm text-gray-700 dark:text-gray-200'>Theme</span>
            <div className='flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-zinc-700'>
              {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  title={label}
                  onClick={() => setTheme(value)}
                  className={`flex h-6 w-8 items-center justify-center rounded-md ${
                    theme === value
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-zinc-600 dark:text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                </button>
              ))}
            </div>
          </div>
          <div className='my-1 h-px bg-gray-100 dark:bg-zinc-700' />
          <a
            href='https://www.mrdiy.com/privacy-policy'
            target='_blank'
            rel='noreferrer'
            className='block rounded-lg px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700'
          >
            Privacy policy
          </a>
          <button
            onClick={() => {
              setShowAbout(true)
              setOpen(false)
            }}
            className='block w-full rounded-lg px-2.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700'
          >
            About
          </button>
        </div>
      )}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}

export default React.memo(UserMenu)
