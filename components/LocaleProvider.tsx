'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Messages = Record<string, string>

interface LocaleContextValue {
  locale: string
  messages: Messages
  t: (key: string, values?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

const SUPPORTED = ['ru', 'kk', 'en']

function detectLocaleFromPath(): string | null {
  if (typeof window === 'undefined') return null
  const seg = window.location.pathname.split('/')[1]
  if (!seg) return null
  return SUPPORTED.includes(seg) ? seg : null
}

function detectLocale(): string {
  const fromPath = detectLocaleFromPath()
  if (fromPath) return fromPath
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || navigator.languages?.[0] || 'ru'
    if (lang.startsWith('en')) return 'en'
    if (lang.startsWith('kk')) return 'kk'
  }
  return 'ru'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>(() => detectLocale())
  const [messages, setMessages] = useState<Messages>({})

  useEffect(() => {
    // Update <html lang> for accessibility
    try {
      document.documentElement.lang = locale
    } catch (e) {
      // ignore
    }
  }, [locale])

  useEffect(() => {
    let mounted = true
    fetch(`/locales/${locale}.json`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setMessages(data)
      })
      .catch(() => setMessages({}))
    return () => { mounted = false }
  }, [locale])

  const t = (key: string, values?: Record<string, string | number>) => {
    const raw = messages[key] ?? key
    if (!values) return raw
    return raw.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''))
  }

  const value = useMemo(() => ({ locale, messages, t }), [locale, messages])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
