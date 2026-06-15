'use client'

import { useMemo, useState } from 'react'
import { Bookmark, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/navbar'
import { OpportunityCard } from '@/components/opportunity-card'
import { opportunities, type Category, type Format, type Grade } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

const ALL = 'all'

const categories: (Category | typeof ALL)[] = [
  ALL,
  'Бизнес',
  'STEM',
  'Социальное влияние',
  'Финансы',
  'Программирование',
  'Наука',
  'Поступление в университет',
]

const formats: (Format | typeof ALL)[] = [ALL, 'Онлайн', 'Офлайн', 'Гибридный']
const grades: (Grade | typeof ALL)[] = [ALL, '7', '8', '9', '10', '11', 'Студент']

export default function OpportunitiesPage() {
  const { savedOpportunities, adminOpportunities } = useApp()
  const allOpportunities = useMemo(
    () => [...opportunities, ...adminOpportunities],
    [adminOpportunities]
  )

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>(ALL)
  const [format, setFormat] = useState<string>(ALL)
  const [grade, setGrade] = useState<string>(ALL)
  const [sortBy, setSortBy] = useState<'deadline' | 'title'>('deadline')
  const [showSaved, setShowSaved] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    return allOpportunities
      .filter((op) => {
        const q = search.toLowerCase()
        const matchesSearch =
          !search ||
          op.title.toLowerCase().includes(q) ||
          op.organization.toLowerCase().includes(q) ||
          op.tags.some((t) => t.toLowerCase().includes(q))
        const matchesCategory = category === ALL || op.category === category
        const matchesFormat = format === ALL || op.format === format
        const matchesGrade = grade === ALL || op.grades.includes(grade as Grade)
        const matchesSaved = !showSaved || savedOpportunities.includes(op.id)
        return matchesSearch && matchesCategory && matchesFormat && matchesGrade && matchesSaved
      })
      .sort((a, b) => {
        if (sortBy === 'deadline')
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        return a.title.localeCompare(b.title)
      })
  }, [allOpportunities, search, category, format, grade, sortBy, showSaved, savedOpportunities])

  const activeFilters = [
    category !== ALL && category,
    format !== ALL && format,
    grade !== ALL && `${grade}`,
  ].filter(Boolean) as string[]

  const clearFilters = () => {
    setCategory(ALL)
    setFormat(ALL)
    setGrade(ALL)
    setSearch('')
    setShowSaved(false)
  }

  const FiltersPanel = () => (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Категория
        </p>
        <div className="flex flex-col gap-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                category === c
                  ? 'bg-secondary text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              )}
            >
              {c === ALL ? 'Все категории' : c}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Формат
        </p>
        <div className="flex flex-col gap-1">
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm transition-colors',
                format === f
                  ? 'bg-secondary text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              )}
            >
              {f === ALL ? 'Любой формат' : f}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Класс / Возраст
        </p>
        <div className="flex flex-wrap gap-1.5">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                grade === g
                  ? 'border-primary/50 bg-secondary text-primary'
                  : 'border-border/80 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              {g === ALL ? 'Все' : `${g}`}
            </button>
          ))}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <>
          <Separator />
          <Button variant="ghost" size="sm" onClick={clearFilters} className="justify-start gap-1.5 text-destructive hover:text-destructive">
            <X className="size-3.5" data-icon="inline-start" />
            Сбросить фильтры
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero banner */}
      <div className="border-b border-border/70 bg-background/70">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Каталог возможностей
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Олимпиады, стипендии, летние программы и конкурсы — {allOpportunities.length} возможностей
          </p>

          {/* Search bar */}
          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, организации или тегу..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Select value={sortBy} onValueChange={(v: 'deadline' | 'title') => setSortBy(v)}>
              <SelectTrigger className="h-13 w-40">
                  <span>{sortBy === 'deadline' ? 'По дедлайну' : 'По названию'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">По дедлайну</SelectItem>
                <SelectItem value="title">По названию</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-11 gap-1.5 lg:hidden"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <SlidersHorizontal className="size-4" />
              Фильтры
              {activeFilters.length > 0 && (
                <Badge className="ml-1 size-5 rounded-full bg-primary text-primary-foreground p-0 text-xs">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Active filter chips */}
          {(activeFilters.length > 0 || showSaved) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Активные фильтры:</span>
              {activeFilters.map((f) => (
                <Badge key={f} className="bg-primary/10 text-primary border-0 gap-1">
                  {f}
                </Badge>
              ))}
              {showSaved && (
                <Badge className="bg-primary/10 text-primary border-0 gap-1">
                  Избранное
                  <button onClick={() => setShowSaved(false)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              <button onClick={clearFilters} className="text-xs text-destructive hover:underline">
                Сбросить
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilterOpen && (
        <div className="border-b border-border/70 bg-background/90 px-4 py-5 lg:hidden">
          <FiltersPanel />
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
        {/* Desktop Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="surface-card sticky top-20 rounded-lg p-5">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Фильтры</span>
            </div>

            {/* Saved toggle */}
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={cn(
                'mb-4 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                showSaved
                  ? 'border-primary/50 bg-secondary text-primary'
                  : 'border-border/80 text-muted-foreground hover:bg-secondary/70'
              )}
            >
              <Bookmark className="size-4" />
              Только избранные
            </button>

            <FiltersPanel />
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1">
          {/* Saved toggle (mobile) */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={cn(
              'mb-4 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors lg:hidden',
              showSaved
                ? 'border-primary/50 bg-secondary text-primary'
                : 'border-border/80 text-muted-foreground hover:bg-secondary/70'
            )}
          >
            <Bookmark className="size-4" />
            Только избранные
          </button>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Найдено: <span className="font-medium text-foreground">{filtered.length}</span> возможностей
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="surface-card flex flex-col items-center justify-center rounded-lg border-dashed py-20 text-center">
              <Search className="mb-3 size-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Ничего не найдено</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Попробуй изменить запрос или сбросить фильтры
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Сбросить всё
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((op) => (
                <OpportunityCard key={op.id} opportunity={op} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
