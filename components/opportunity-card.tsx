'use client'

import { Bookmark, BookmarkCheck, Calendar, ExternalLink, Globe, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { type Opportunity, categoryColors } from '@/lib/data'
import { useApp } from '@/lib/store'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface OpportunityCardProps {
  opportunity: Opportunity
  compact?: boolean
}

export function OpportunityCard({ opportunity, compact = false }: OpportunityCardProps) {
  const { isLoggedIn, isOpportunitySaved, saveOpportunity, unsaveOpportunity } = useApp()
  const { t, language } = useI18n()
  const saved = isOpportunitySaved(opportunity.id)

  const deadlineDate = new Date(opportunity.deadline)
  const today = new Date()
  const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysLeft <= 14 && daysLeft > 0
  const isExpired = daysLeft <= 0

  // Locale string for dates
  const localeMap: Record<string, string> = { ru: 'ru-RU', kz: 'kz-KZ', en: 'en-US' }
  const locale = localeMap[language] ?? 'ru-RU'

  const handleSave = () => {
    if (!isLoggedIn) return
    if (saved) unsaveOpportunity(opportunity.id)
    else saveOpportunity(opportunity.id)
  }

  const oc = t.opportunityCard

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_24px_60px_-42px_oklch(0.17_0.02_215_/_0.55)]">
      <CardHeader className="gap-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-secondary text-lg font-bold text-primary">
            {opportunity.logo}
          </div>

          {isLoggedIn && (
            <button
              onClick={handleSave}
              aria-label={saved ? oc.unsaveAria : oc.saveAria}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                saved
                  ? 'bg-secondary text-primary hover:text-primary/70'
                  : 'text-muted-foreground hover:bg-secondary hover:text-primary'
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
              <Badge className="border-amber/30 bg-amber/16 text-amber-foreground text-xs dark:text-white">
                {oc.recommended}
              </Badge>
            )}
          </div>
          <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
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

        <div className="grid gap-1.5 rounded-md border border-border/70 bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {opportunity.format === 'Онлайн' || opportunity.format === 'Online' ? (
              <Globe className="size-3.5 shrink-0" />
            ) : (
              <MapPin className="size-3.5 shrink-0" />
            )}
            <span>{opportunity.format}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5 shrink-0" />
            <span>{oc.gradesLabel} {opportunity.grades.join(', ')}</span>
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
                ? oc.deadlineExpired
                : isUrgent
                ? `${oc.deadlineUrgentPrefix} ${daysLeft} ${oc.deadlineUrgentSuffix} — ${deadlineDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`
                : `${oc.deadlinePrefix} ${deadlineDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1">
            {opportunity.requirements.slice(0, 2).map((req) => (
              <span
                key={req}
                className="rounded-md border border-border/60 bg-background/70 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {req}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 border-t-0 bg-transparent pt-0">
        <Button className="flex-1 text-sm" size="sm" asChild>
          <a
            href={opportunity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>{oc.applyBtn}</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
