import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  ArrowRightOnRectangleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronDoubleLeftIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon, MapPinIcon as MapPinSolidIcon } from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
import UserMenu from '@/app/components/user-menu'
import useLarkUser from '@/hooks/use-lark-user'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

// Dify's public Service API has no endpoint to persist a "pinned" flag
// server-side (only rename + delete are supported). So pin state is kept
// client-side only, per-browser, via localStorage — it won't sync across
// devices, but it's the only option without a backend change on Dify's side.
const PINNED_STORAGE_KEY = 'pinned_conversation_ids'

const getStoredPinnedIds = (): string[] => {
  if (typeof window === 'undefined') { return [] }
  try {
    const raw = window.localStorage.getItem(PINNED_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }
  catch {
    return []
  }
}

export interface ISidebarProps {
  title?: string
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
  onHide?: () => void
  onRenameConversation?: (id: string, name: string) => void
  onDeleteConversation?: (id: string) => void
}

const Sidebar: FC<ISidebarProps> = ({
  title,
  currentId,
  onCurrentIdChange,
  list,
  onHide,
  onRenameConversation,
  onDeleteConversation,
}) => {
  const { t } = useTranslation()
  const user = useLarkUser()
  const initial = (user?.name || user?.email || '?').trim()[0]?.toUpperCase()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string } | null>(null)

  // load pinned state once on mount (client-only, since localStorage isn't
  // available during server-side render)
  useEffect(() => {
    setPinnedIds(getStoredPinnedIds())
  }, [])

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const searchFilteredList = searchQuery.trim()
    ? list.filter(item =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    )
    : list

  // pinned conversations float to the top, in their original relative order;
  // "New Chat" (id '-1') is never pinned and always stays wherever it is
  const pinnedList = searchFilteredList.filter(item => item.id !== '-1' && pinnedIds.includes(item.id))
  const unpinnedList = searchFilteredList.filter(item => item.id === '-1' || !pinnedIds.includes(item.id))

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name })
  }

  const confirmDelete = () => {
    if (deleteTarget)
    { onDeleteConversation?.(deleteTarget.id) }
    setDeleteTarget(null)
  }

  const startEditing = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const commitEditing = () => {
    const newName = editingName.trim()
    const item = list.find(item => item.id === editingId)
    if (editingId && item && newName && newName !== item.name)
    { onRenameConversation?.(editingId, newName) }
    setEditingId(null)
  }

  const renderConversationItem = (item: ConversationItem) => {
    const isCurrent = item.id === currentId
    const ItemIcon
      = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon
    const isEditing = editingId === item.id
    const isPinned = pinnedIds.includes(item.id)
    const isNewChatItem = item.id === '-1'

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
        {isPinned && !isEditing && (
          <MapPinSolidIcon className="mr-1.5 h-3 w-3 flex-shrink-0 text-primary-500 rotate-45" aria-hidden="true" />
        )}
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
                { commitEditing() }
                if (e.key === 'Escape')
                { setEditingId(null) }
              }}
              onClick={e => e.stopPropagation()}
              className="w-full min-w-0 rounded border border-primary-300 bg-white px-1 py-0.5 text-sm font-normal outline-none dark:bg-zinc-800 dark:border-primary-600 dark:text-gray-100"
            />
          )
          : (
            <>
              <span className="flex-1 truncate">{item.name}</span>
              {!isNewChatItem && (onRenameConversation || onDeleteConversation) && (
                <Menu as="div" className="relative hidden group-hover:block shrink-0 ml-1">
                  <Menu.Button
                    title="More"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center h-6 w-6 rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-zinc-700 dark:hover:text-gray-200"
                  >
                    <EllipsisHorizontalIcon className="h-4 w-4" />
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      onClick={e => e.stopPropagation()}
                      className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-lg bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black/5 dark:ring-zinc-700 focus:outline-none overflow-hidden"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePin(item.id)
                              }}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-zinc-700' : '',
                                'flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200',
                              )}
                            >
                              <MapPinIcon className="h-4 w-4" />
                              {isPinned ? 'Unpin' : 'Pin'}
                            </button>
                          )}
                        </Menu.Item>
                        {onRenameConversation && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  startEditing(item.id, item.name)
                                }}
                                className={classNames(
                                  active ? 'bg-gray-100 dark:bg-zinc-700' : '',
                                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200',
                                )}
                              >
                                <PencilIcon className="h-4 w-4" />
                                Rename
                              </button>
                            )}
                          </Menu.Item>
                        )}
                        {onDeleteConversation && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteClick(item.id, item.name)
                                }}
                                className={classNames(
                                  active ? 'bg-red-50 dark:bg-red-900/30' : '',
                                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400',
                                )}
                              >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </>
          )}
      </div>
    )
  }

  return (
    <div
      className="shrink-0 flex flex-col h-full bg-gray-50 dark:bg-zinc-900 pc:w-[260px] tablet:w-[220px] mobile:w-[280px] border-r border-gray-200 dark:border-zinc-800"
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

      {/* always available: the upstream template hid this once you had 20+
          conversations, which silently removed the app's primary action */}
      <div className="flex flex-shrink-0 p-3">
        <button
          onClick={() => { onCurrentIdChange('-1') }}
          className="flex w-full items-center justify-center gap-2 h-10 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
        >
          <PencilSquareIcon className="h-4 w-4" /> {t('app.chat.newChat')}
        </button>
      </div>

      {list.length > 0 && (
        <div className="px-3 pb-2">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-8 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-primary-400 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-zinc-700"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {searchFilteredList.length === 0 && searchQuery && (
          <div className="px-3 py-4 text-center text-sm text-gray-400">
            No conversations found
          </div>
        )}

        {pinnedList.length > 0 && (
          <>
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Pinned
            </div>
            {pinnedList.map(item => renderConversationItem(item))}
            <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Conversations
            </div>
          </>
        )}

        {unpinnedList.map(item => renderConversationItem(item))}
      </nav>

      {/* settings / user info */}
      <div className="flex items-center gap-1 px-3 py-3 border-t border-gray-200 dark:border-zinc-800">
        <UserMenu placement="top" className="min-w-0 flex-1">
          {user
            ? (
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
            )
            : (
              // no logged-in Lark session (e.g. local dev without auth) —
              // still expose theme/about/privacy, just without personal identity
              <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 -mx-1 hover:bg-gray-200/60 dark:hover:bg-zinc-800/60">
                <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-full bg-gray-300 text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                  <Cog6ToothIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 text-sm text-gray-700 dark:text-gray-200 font-medium">
                  Settings
                </div>
              </div>
            )}
        </UserMenu>
        {user && (
          <a
            href="/api/auth/logout"
            title="Sign out"
            className="flex items-center justify-center h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:bg-gray-200/60 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-gray-200"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="flex flex-shrink-0 px-4 pb-3">
        <div className="text-gray-400 font-normal text-[10px] leading-4 uppercase">
          Copyright © {(new Date()).getFullYear()} MR D.I.Y. GROUP (M) BERHAD (CO.NO. : 201001034084 (918007-M)) All Rights Reserved.
        </div>
      </div>

      <Transition appear show={!!deleteTarget} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteTarget(null)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-150"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-800 p-5 shadow-xl">
                  <Dialog.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Delete conversation?
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {deleteTarget?.name && (
                      <>
                        <span className="font-medium text-gray-700 dark:text-gray-300">&ldquo;{deleteTarget.name}&rdquo;</span>{' '}
                      </>
                    )}
                    will be removed from your own conversation list. This can&apos;t be undone.
                  </Dialog.Description>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() => setDeleteTarget(null)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default React.memo(Sidebar)
