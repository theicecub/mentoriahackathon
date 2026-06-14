'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navbar } from '@/components/navbar'
import { CourseCard } from '@/components/course-card'
import { courses, type Category, type Difficulty, type Grade } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

const ALL = 'all'

const categoryTabs: { value: string; label: string }[] = [
  { value: ALL, label: 'Все курсы' },
  { value: 'STEM', label: 'STEM' },
  { value: 'Английский', label: 'Английский' },
  { value: 'Бизнес', label: 'Бизнес' },
  { value: 'Программирование', label: 'Программирование' },
  { value: 'Подготовка к экзаменам', label: 'К экзаменам' },
  { value: 'Поступление в университет', label: 'Поступление' },
  { value: 'Наука', label: 'Наука' },
]

const difficulties: (Difficulty | typeof ALL)[] = [ALL, 'Начальный', 'Средний', 'Продвинутый']
const grades: (Grade | typeof ALL)[] = [ALL, '7', '8', '9', '10', '11', 'Студент']

const difficultyColors: Record<string, string> = {
  Начальный: 'bg-green-100 text-green-700 border-green-200',
  Средний: 'bg-amber-100 text-amber-700 border-amber-200',
  Продвинутый: 'bg-red-100 text-red-700 border-red-200',
}

export default function CoursesPage() {
  const { adminCourses, enrolledCourses } = useApp()
  const allCourses = useMemo(() => [...courses, ...adminCourses], [adminCourses])

  const [search, setSearch] = useState('')
  const [categoryTab, setCategoryTab] = useState(ALL)
  const [difficulty, setDifficulty] = useState<string>(ALL)
  const [grade, setGrade] = useState<string>(ALL)
  const [showEnrolled, setShowEnrolled] = useState(false)

  const enrolledIds = enrolledCourses.map((e) => e.courseId)

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      const matchesCategory = categoryTab === ALL || c.category === categoryTab
      const matchesDifficulty = difficulty === ALL || c.difficulty === difficulty
      const matchesGrade = grade === ALL || c.grades.includes(grade as Grade)
      const matchesEnrolled = !showEnrolled || enrolledIds.includes(c.id)
      return matchesSearch && matchesCategory && matchesDifficulty && matchesGrade && matchesEnrolled
    })
  }, [allCourses, search, categoryTab, difficulty, grade, showEnrolled, enrolledIds])

  const clearFilters = () => {
    setSearch('')
    setCategoryTab(ALL)
    setDifficulty(ALL)
    setGrade(ALL)
    setShowEnrolled(false)
  }

  const hasActiveFilters = difficulty !== ALL || grade !== ALL || showEnrolled

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Курсы Mentoria
              </h1>
              <p className="mt-1.5 text-muted-foreground">
                Асинхронные курсы с видеоуроками, тестами и заданиями — {allCourses.length} курсов
              </p>
            </div>
            {enrolledCourses.length > 0 && (
              <button
                onClick={() => setShowEnrolled(!showEnrolled)}
                className={cn(
                  'hidden shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:flex',
                  showEnrolled
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                )}
              >
                <BookOpen className="size-4" />
                Мои курсы ({enrolledCourses.length})
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по курсам, преподавателю или теме..."
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

          {/* Category tabs */}
          <div className="mt-4 overflow-x-auto">
            <Tabs value={categoryTab} onValueChange={setCategoryTab}>
              <TabsList className="h-auto gap-1 bg-transparent p-0 flex flex-nowrap">
                {categoryTabs.map(({ value, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={cn(
                      'shrink-0 rounded-lg border px-3 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary',
                      'data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:border-primary/40'
                    )}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Secondary filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium">Уровень:</span>
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                  difficulty === d
                    ? 'border-primary bg-primary/10 text-primary'
                    : d !== ALL
                    ? difficultyColors[d]
                    : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                {d === ALL ? 'Все уровни' : d}
              </button>
            ))}

            <span className="ml-2 text-xs text-muted-foreground font-medium">Класс:</span>
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                  grade === g
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                {g === ALL ? 'Все классы' : `${g} кл.`}
              </button>
            ))}

            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-auto text-xs text-destructive hover:underline flex items-center gap-1">
                <X className="size-3" /> Сбросить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses grid */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Найдено: <span className="font-medium text-foreground">{filtered.length}</span> курсов
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
            <BookOpen className="mb-3 size-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">Курсы не найдены</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуй изменить запрос или сбросить фильтры
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Сбросить всё
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
