'use client'

import { Bookmark, BookmarkCheck, Calendar, ExternalLink, Globe, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { type Opportunity, categoryColors } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

interface OpportunityCardProps {
  opportunity: Opportunity
  compact?: boolean
}

export function OpportunityCard({ opportunity, compact = false }: OpportunityCardProps) {
  const { isLoggedIn, isOpportunitySaved, saveOpportunity, unsaveOpportunity } = useApp()
  const saved = isOpportunitySaved(opportunity.id)

  const deadlineDate = new Date(opportunity.deadline)
  const today = new Date()
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysLeft <= 14 && daysLeft > 0
  const isExpired = daysLeft <= 0

  const handleSave = () => {
    if (!isLoggedIn) return
    if (saved) unsaveOpportunity(opportunity.id)
    else saveOpportunity(opportunity.id)
  }

  return (
    <Card className="group flex flex-col overflow-hidden border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* Header stripe */}
      <div className="h-1 w-full bg-primary/20" />

      <CardHeader className="gap-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Logo placeholder */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            {opportunity.logo}
          </div>

          {/* Save button */}
          {isLoggedIn && (
            <button
              onClick={handleSave}
              aria-label={saved ? 'Убрать из избранного' : 'Сохранить'}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                saved
                  ? 'text-primary hover:text-primary/70'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {saved ? <BookmarkCheck className="size-5" /> : <Bookmark className="size-5" />}
            </button>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge
              className={cn(
                'text-xs font-medium',
                categoryColors[opportunity.category] || 'bg-secondary text-secondary-foreground'
              )}
            >
              {opportunity.category}
            </Badge>
            {opportunity.featured && (
              <Badge className="bg-amber/20 text-amber-foreground text-xs border-0">
                Рекомендуем
              </Badge>
            )}
          </div>
          <h3 className="text-balance text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{opportunity.organization}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        {!compact && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {opportunity.description}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {opportunity.format === 'Онлайн' ? (
              <Globe className="size-3.5 shrink-0" />
            ) : (
              <MapPin className="size-3.5 shrink-0" />
            )}
            <span>{opportunity.format}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5 shrink-0" />
            <span>Классы: {opportunity.grades.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                isExpired
                  ? 'text-destructive font-medium'
                  : isUrgent
                  ? 'text-amber-600 font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {isExpired
                ? 'Дедлайн истёк'
                : isUrgent
                ? `Осталось ${daysLeft} дн. — ${deadlineDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
                : `Дедлайн: ${deadlineDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1">
            {opportunity.requirements.slice(0, 2).map((req) => (
              <span
                key={req}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {req}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          size="sm"
          asChild
        >
          <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" data-icon="inline-end" />
            Подать заявку
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
