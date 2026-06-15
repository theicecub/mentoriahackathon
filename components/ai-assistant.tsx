'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import {
  Bot,
  ChevronDown,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/store'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

// ─── Suggestion chips ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Что мне подходит по интересам?',
  'Как подготовиться к IELTS?',
  'Какие стипендии есть для 11 класса?',
  'Посоветуй курс по программированию',
]

// ─── Component ───────────────────────────────────────────────────────────────

export function AIAssistant() {
  const { user, isLoggedIn } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-assistant',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, messages, profile: user },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput('')
  }

  const handleSuggestion = (text: string) => {
    sendMessage({ text })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── Floating chat panel ─────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 flex flex-col transition-all duration-300 sm:bottom-6 sm:right-6',
          open
            ? 'pointer-events-auto opacity-100 translate-y-0'
            : 'pointer-events-none opacity-0 translate-y-4'
        )}
        style={{ width: 'min(calc(100vw - 32px), 400px)' }}
        aria-hidden={!open}
      >
        <div className="ai-panel flex flex-col overflow-hidden rounded-2xl border border-[--ai-border] shadow-2xl"
          style={{ height: 'min(520px, calc(100dvh - 140px))' }}>

          {/* Header */}
          <div className="ai-header flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
  <div className="ai-avatar flex size-8 items-center justify-center rounded-full">
    <Sparkles className="size-4" />
  </div>
  <div>
    <p className="text-sm font-semibold leading-none ai-header-title !text-white">Mentoria AI-Bot</p>
    <p className="mt-0.5 text-xs ai-header-sub !text-white">
      {isLoggedIn ? `Привет, ${user?.name?.split(' ')[0]}` : 'Ассистент'}
    </p>
  </div>
</div>
            <button
              onClick={() => setOpen(false)}
              className="ai-close flex size-7 items-center justify-center rounded-full transition-colors"
              aria-label="Закрыть"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-messages flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="ai-welcome-icon flex size-14 items-center justify-center rounded-2xl">
                  <Bot className="size-7" />
                </div>
                <div>
                  <p className="font-semibold text-sm ai-welcome-title">Привет! Я Mentoria AI</p>
                  <p className="mt-1 text-xs leading-relaxed ai-welcome-sub">
                    Расскажу о возможностях, которые подходят именно тебе — по интересам, классу и целям.
                  </p>
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center mt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      disabled={isLoading}
                      className="ai-chip text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const text = getMessageText(msg)
                  if (!text) return null
                  const isUser = msg.role === 'user'
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2',
                        isUser ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!isUser && (
                        <div className="ai-msg-avatar flex size-6 shrink-0 items-center justify-center rounded-full mt-0.5">
                          <Sparkles className="size-3" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                          isUser
                            ? 'ai-user-bubble rounded-br-sm'
                            : 'ai-ai-bubble rounded-bl-sm'
                        )}
                      >
                        <MessageContent text={text} />
                      </div>
                    </div>
                  )
                })}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="ai-msg-avatar flex size-6 shrink-0 items-center justify-center rounded-full mt-0.5">
                      <Sparkles className="size-3" />
                    </div>
                    <div className="ai-ai-bubble rounded-2xl rounded-bl-sm px-3.5 py-3">
                      <div className="flex gap-1 items-center">
                        <span className="ai-dot" style={{ animationDelay: '0ms' }} />
                        <span className="ai-dot" style={{ animationDelay: '150ms' }} />
                        <span className="ai-dot" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick suggestions after conversation starts */}
          {messages.length > 0 && !isLoading && (
            <div className="ai-suggestions-row flex gap-2 overflow-x-auto px-4 pb-2 pt-1 scrollbar-none">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="ai-chip shrink-0 text-xs px-2.5 py-1 rounded-full transition-colors"
                >
                  <Lightbulb className="inline size-3 mr-1" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="ai-input-area flex items-end gap-2 px-4 py-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спроси о возможностях..."
              rows={1}
              className="ai-textarea flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
              style={{ maxHeight: '96px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="ai-send-btn flex size-9 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-40"
              aria-label="Отправить"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB toggle button ───────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg transition-all duration-300 sm:bottom-6 sm:right-6',
          'ai-fab',
          open && 'ai-fab-open'
        )}
        aria-label={open ? 'Закрыть ассистента' : 'Открыть AI-ассистента'}
      >
        <Sparkles className="size-5" />
        {!open && (
          <span className="text-sm font-semibold pr-1">AI-помощник</span>
        )}
        {open && <ChevronDown className="size-4" />}
        {messages.length === 0 && !open && (
          <span className="absolute -top-1 -right-1 flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ai-ping" />
            <span className="relative inline-flex rounded-full size-3 ai-ping-dot" />
          </span>
        )}
      </button>
    </>
  )
}

// ─── Markdown-lite renderer ─────────────────────────────────────────────────

function MessageContent({ text }: { text: string }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />

        // Bold text: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        const rendered = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>
          }
          return <span key={j}>{part}</span>
        })

        // Bullet list
        if (line.match(/^[\-•]\s/)) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="mt-0.5 shrink-0 ai-bullet">•</span>
              <span>{rendered}</span>
            </div>
          )
        }

        // Numbered list
        if (line.match(/^\d+\.\s/)) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0 font-semibold ai-num">{line.match(/^\d+/)?.[0]}.</span>
              <span>{rendered}</span>
            </div>
          )
        }

        return <p key={i}>{rendered}</p>
      })}
    </div>
  )
}
