'use client'

import { useEffect } from 'react'
import { useApp } from '@/lib/store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useApp()

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
  }, [theme])

  return <>{children}</>
}
