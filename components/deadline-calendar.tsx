"use client"

import React, { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Opportunity } from '@/lib/data'

function formatDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function DeadlineCalendar({ opportunities }: { opportunities: Opportunity[] }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [open, setOpen] = useState(false)
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  const eventsByDate = useMemo(() => {
    const map: Record<string, Opportunity[]> = {}
    opportunities.forEach((op) => {
      if (!op.deadline) return
      const d = new Date(op.deadline)
      const key = formatDateKey(d)
      if (!map[key]) map[key] = []
      map[key].push(op)
    })
    return map
  }, [opportunities])

  const monthLabel = currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })

  function prevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // build calendar grid (6 weeks)
  const weeks = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const weekday = (first.getDay() + 6) % 7 // make Monday=0
    const start = new Date(first)
    start.setDate(first.getDate() - weekday)

    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }

    const rows: Date[][] = []
    for (let r = 0; r < 6; r++) {
      rows.push(days.slice(r * 7, r * 7 + 7))
    }
    return rows
  }, [currentMonth])

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const selectedEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : []

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium text-foreground">{monthLabel}</div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button size="sm" variant="ghost" onClick={nextMonth} aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
        {weekdays.map((w) => (
          <div key={w} className="text-center text-[11px] font-medium">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {weeks.flat().map((day) => {
          const key = formatDateKey(day)
          const events = eventsByDate[key] || []
          const inMonth = day.getMonth() === currentMonth.getMonth()
          const isToday = formatDateKey(day) === formatDateKey(new Date())

          return (
            <button
              key={key}
              onClick={() => {
                setSelectedDateKey(key)
                setOpen(true)
              }}
              className={cn(
                'flex h-12 w-full flex-col items-start justify-start rounded-md p-2 text-left text-xs hover:bg-accent',
                !inMonth && 'text-muted-foreground',
                isToday && 'ring-1 ring-primary/40'
              )}
            >
              <div className="flex w-full items-start justify-between">
                <span className="text-sm font-medium leading-none">{day.getDate()}</span>
                {events.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-600">
                    {events.length}
                  </span>
                )}
              </div>
              <div className="mt-1 max-w-full text-[11px] text-muted-foreground">
                {events.slice(0, 2).map((e) => (
                  <div key={e.id} className="truncate">{e.title}</div>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogTitle>Дедлайны на {selectedDateKey}</DialogTitle>
          <DialogDescription>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет дедлайнов</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedEvents.map((e) => {
                  const daysLeft = Math.ceil((new Date(e.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  return (
                    <li key={e.id} className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/opportunities/${e.id}`} className="text-sm font-medium text-foreground">
                          {e.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">{e.organization}</div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {daysLeft > 0 ? `${daysLeft} дн.` : 'Дедлайн прошёл'}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}
