import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react'
import {
  create,
  useStore as useZustandStore,
} from 'zustand'
import type {
  FileEntity,
} from './types'

interface Shape {
  files: FileEntity[]
  setFiles: (files: FileEntity[]) => void
}

export const createFileStore = (
  value: FileEntity[] = [],
  onChange?: (files: FileEntity[]) => void,
) => {
  return create<Shape>(set => ({
    files: value ? [...value] : [],
    setFiles: (files) => {
      set({ files })
      onChange?.(files)
    },
  }))
}

type FileStore = ReturnType<typeof createFileStore>
export const FileContext = createContext<FileStore | null>(null)

export function useStore<T>(selector: (state: Shape) => T): T {
  const store = useContext(FileContext)
  if (!store) { throw new Error('Missing FileContext.Provider in the tree') }

  return useZustandStore(store, selector)
}

export const useFileStore = () => {
  return useContext(FileContext)!
}

interface FileProviderProps {
  children: React.ReactNode
  value?: FileEntity[]
  onChange?: (files: FileEntity[]) => void
}
export const FileContextProvider = ({
  children,
  value,
  onChange,
}: FileProviderProps) => {
  const storeRef = useRef<FileStore | undefined>(undefined)

  if (!storeRef.current) { storeRef.current = createFileStore(value, onChange) }

  // The store above only initializes from `value` once. If the parent
  // resets `value` afterwards (e.g. clearing attachments after a message
  // is sent), that change needs to be pushed into the store directly —
  // otherwise the store (which is what the UI actually reads from) never
  // finds out, and keeps showing/re-sending the stale file list.
  // Using .setState (not the store's own setFiles) avoids re-firing
  // onChange and causing an infinite loop.
  useEffect(() => {
    const store = storeRef.current
    if (!store) { return }
    if (store.getState().files !== value) { store.setState({ files: value || [] }) }
  }, [value])

  return (
    <FileContext.Provider value={storeRef.current}>
      {children}
    </FileContext.Provider>
  )
}
