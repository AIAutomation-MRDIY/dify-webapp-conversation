'use client'
import { useCallback, useEffect, useState } from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'pandai-theme'

const applyTheme = (choice: ThemeChoice) => {
  const isDark = choice === 'dark'
    || (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeChoice>('system')

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeChoice) || 'system'
    setThemeState(saved)
    applyTheme(saved)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as ThemeChoice) || 'system'
      if (current === 'system')
        applyTheme('system')
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  const setTheme = useCallback((choice: ThemeChoice) => {
    localStorage.setItem(STORAGE_KEY, choice)
    setThemeState(choice)
    applyTheme(choice)
  }, [])

  return { theme, setTheme }
}

export default useTheme
