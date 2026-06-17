"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type Row = {
  id: string
  name: string
  score: number
  details: any
}

export default function Leaderboard({ limit = 5 }: { limit?: number }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/leaderboard?limit=${limit}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setRows(data.leaderboard || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => {
      cancelled = true
    }
  }, [limit])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Лидерборд</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <p className="text-sm text-muted-foreground">Загрузка…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <li key={r.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarFallback>{r.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">#{i + 1}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-foreground">{r.score}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
