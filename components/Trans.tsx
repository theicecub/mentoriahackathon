'use client'

import React from 'react'
import { useLocale } from './LocaleProvider'

export function Trans({ children, values, className }: { children: React.ReactNode; values?: Record<string, string | number>; className?: string }) {
  const { t } = useLocale()

  // Only handle simple string children or strings with placeholders
  if (typeof children === 'string') {
    return <span className={className} aria-hidden={false}>{t(children, values)}</span>
  }

  return <>{children}</>
}

export default Trans
