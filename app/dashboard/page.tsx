'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Calendar,
  CheckCircle,
  Compass,
  GraduationCap,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Fire,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Leaderboard from '@/components/leaderboard'
import { Navbar } from '@/components/navbar'
import { OpportunityCard } from '@/components/opportunity-card'
import { CourseCard } from '@/components/course-card'
import DeadlineCalendar from '@/components/deadline-calendar'
import {
  opportunities,
  courses,
  getRecommendedOpportunities,
  getRecommendedCourses,
  categoryColors,
  difficultyColors,
} from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const {
    isLoggedIn,
    user,
    savedOpportunities,
    enrolledCourses,
    adminOpportunities,
    adminCourses,
  } = useApp()

  // Redirect if not logged in
  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="size-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Войдите в аккаунт</h1>
            <p className="mt-2 text-muted-foreground">
              Чтобы попасть в личный кабинет, нужно создать профиль на Mentoria Hub.
            </p>
            <Link href="/onboarding">
              <Button className="mt-5 bg-primary text-primary-foreground">
                Создать профиль
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const allOpportunities = useMemo(
    () => [...opportunities, ...adminOpportunities],
    [adminOpportunities]
  )
  const allCourses = useMemo(() => [...courses, ...adminCourses], [adminCourses])

  const savedOps = allOpportunities.filter((op) => savedOpportunities.includes(op.id))

  const enrolled = enrolledCourses.map((ec) => {
    const course = allCourses.find((c) => c.id === ec.courseId)
    if (!course) return null
    const pct = Math.round((ec.completedLessons.length / course.lessons.length) * 100)
    return { course, enrolled: ec, pct }
  }).filter(Boolean) as { course: (typeof allCourses)[0]; enrolled: (typeof enrolledCourses)[0]; pct: number }[]

  const streakDays = useMemo(() => {
    const activityDays = new Set(
      enrolled
        .map((e) => {
          const d = e.enrolled.lastActivity
          if (!d) return null
          const dt = new Date(d)
          return dt.toISOString().slice(0, 10)
        })
        .filter(Boolean)
    )

    let streak = 0
    const today = new Date()
    for (let i = 0; ; i++) {
      const day = new Date(today)
      day.setDate(today.getDate() - i)
      const key = day.toISOString().slice(0, 10)
      if (activityDays.has(key)) streak++
      else break
    }

    return streak
  }, [enrolled])

  const recommended = getRecommendedOpportunities(user.interests, user.grade).slice(0, 3)
  const recommendedCourses = getRecommendedCourses(user.interests, user.grade)
    .filter((c) => !enrolledCourses.find((e) => e.courseId === c.id))
    .slice(0, 3)

  // Upcoming deadlines from saved opps
  const upcomingDeadlines = savedOps
    .filter((op) => {
      const days = Math.ceil(
        (new Date(op.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
      return days > 0 && days <= 60
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5)

  const completedCount = enrolled.filter((e) => e.pct === 100).length
  const inProgressCount = enrolled.filter((e) => e.pct > 0 && e.pct < 100).length

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* ── Welcome banner ─────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                Привет, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {user.grade} класс · {user.interests.slice(0, 3).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/opportunities">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Compass className="size-4" data-icon="inline-start" />
                Возможности
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="sm" className="bg-primary text-primary-foreground gap-1.5">
                <BookOpen className="size-4" data-icon="inline-start" />
                Курсы
              </Button>
            </Link>
          </div>
        </div>

        {/* ── AI Assistant callout ───────────────────────────────── */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Mentoria AI знает, что тебе подойдёт
            </p>
            <p className="text-xs text-muted-foreground">
              Нажми на кнопку <span className="font-medium text-primary">AI-помощник</span> внизу справа, чтобы получить персональные рекомендации
            </p>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: 'Сохранено',
              value: savedOpportunities.length,
              icon: Bookmark,
              color: 'bg-blue-500/15 text-blue-400 dark:bg-blue-500/20 dark:text-blue-300',
            },
            {
              label: 'Курсов начато',
              value: inProgressCount,
              icon: Play,
              color: 'bg-amber-500/15 text-amber-500 dark:bg-amber-500/20 dark:text-amber-300',
            },
            {
              label: 'Курсов завершено',
              value: completedCount,
              icon: CheckCircle,
              color: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
            },
            {
              label: 'Дедлайнов скоро',
              value: upcomingDeadlines.length,
              icon: Calendar,
              color: 'bg-rose-500/15 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300',
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('flex size-10 items-center justify-center rounded-md', color)}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Left column ──────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Enrolled courses */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <TrendingUp className="size-5 text-primary" />
                  Мои курсы
                </h2>
                <Link href="/courses">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Все курсы <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              {enrolled.length === 0 ? (
                <div className="surface-card flex flex-col items-center justify-center rounded-lg border-dashed py-10 text-center">
                  <BookOpen className="mb-3 size-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-foreground">Ты ещё не записан на курсы</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Запишись на курс и отслеживай прогресс здесь
                  </p>
                  <Link href="/courses">
                    <Button size="sm" variant="outline" className="mt-3">
                      Найти курс
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {enrolled.map(({ course, pct }) => (
                    <Card key={course.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-secondary">
                          <GraduationCap className="size-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {course.title}
                            </p>
                            <Badge
                              className={cn(
                                'shrink-0 text-xs border-0',
                                difficultyColors[course.difficulty]
                              )}
                            >
                              {course.difficulty}
                            </Badge>
                          </div>
                          <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{course.instructor}</span>
                            <span>·</span>
                            <span>{course.lessons.length} уроков</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {pct === 100 ? (
                              <span className="text-emerald-500 dark:text-emerald-400 font-medium">Завершён</span>
                            ) : (
                              `${pct}% завершено`
                            )}
                          </p>
                        </div>
                        <Link href={`/courses/${course.id}`}>
                          <Button
                            size="sm"
                            className="shrink-0 bg-primary text-primary-foreground"
                          >
                            {pct === 100 ? (
                              'Повторить'
                            ) : pct > 0 ? (
                              <>
                                <Play className="size-3.5" data-icon="inline-start" />
                                Продолжить
                              </>
                            ) : (
                              'Начать'
                            )}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Saved opportunities */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Bookmark className="size-5 text-primary" />
                  Сохранённые возможности
                </h2>
                <Link href="/opportunities">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Каталог <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>

              {savedOps.length === 0 ? (
                <div className="surface-card flex flex-col items-center justify-center rounded-lg border-dashed py-10 text-center">
                  <Bookmark className="mb-3 size-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-foreground">Нет сохранённых возможностей</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Сохраняй интересные возможности, нажимая на закладку
                  </p>
                  <Link href="/opportunities">
                    <Button size="sm" variant="outline" className="mt-3">
                      Найти возможности
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedOps.slice(0, 4).map((op) => (
                    <OpportunityCard key={op.id} opportunity={op} compact />
                  ))}
                  {savedOps.length > 4 && (
                    <div className="surface-card flex items-center justify-center rounded-lg border-dashed p-4 sm:col-span-2">
                      <Link href="/opportunities?saved=true">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          Ещё {savedOps.length - 4} сохранённых
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Recommended courses */}
            {recommendedCourses.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Sparkles className="size-5 text-primary" />
                    Рекомендуем тебе
                  </h2>
                  <Link href="/courses">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      Все курсы <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedCourses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Goals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="size-4 text-primary" />
                  Мои цели
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {user.goals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Цели не указаны</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {user.goals.map((goal) => (
                      <li key={goal} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-foreground">{goal}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Upcoming deadlines */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="size-4 text-primary" />
                  Ближайшие дедлайны
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <DeadlineCalendar opportunities={savedOps} />

                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-sm text-muted-foreground">Нет ближайших дедлайнов</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Сохраняй возможности, чтобы отслеживать их дедлайны
                    </p>
                  </div>
                ) : (
                  <ul className="mt-3 flex flex-col gap-3">
                    {upcomingDeadlines.map((op, i) => {
                      const days = Math.ceil(
                        (new Date(op.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                      )
                      const isUrgent = days <= 14

                      return (
                        <li key={op.id}>
                          {i > 0 && <Separator className="mb-3" />}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {op.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{op.organization}</p>
                            </div>
                            <Badge
                              className={cn(
                                'shrink-0 text-xs border-0',
                                isUrgent
                                  ? 'bg-rose-500/15 text-rose-500 dark:bg-rose-500/25 dark:text-rose-300'
                                  : 'bg-secondary text-secondary-foreground'
                              )}
                            >
                              {days} дн.
                            </Badge>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Recommended opportunities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="size-4 text-primary" />
                  Для тебя
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                {recommended.slice(0, 3).map((op, i) => {
                  const days = Math.ceil(
                    (new Date(op.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div key={op.id}>
                      {i > 0 && <Separator className="mb-3" />}
                      <div>
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug text-foreground">
                            {op.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              'text-xs border-0',
                              categoryColors[op.category] || 'bg-secondary text-secondary-foreground'
                            )}
                          >
                            {op.category}
                          </Badge>
                          {days > 0 && (
                            <span className="text-xs text-muted-foreground">{days} дн.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <Link href="/opportunities">
                  <Button variant="outline" size="sm" className="mt-1 w-full gap-1.5">
                    Все рекомендации
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Мой профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Стрик
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge className="bg-rose-500/10 text-rose-500 border-0 text-sm">
                      <Fire className="size-3" data-icon="inline-start" />
                      {streakDays} дн.
                    </Badge>
                    <p className="text-xs text-muted-foreground">дней подряд</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Интересы
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {user.interests.map((i) => (
                      <Badge
                        key={i}
                        className="bg-primary/10 text-primary border-0 text-xs"
                      >
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <Link href="/onboarding">
                  <Button variant="outline" size="sm" className="w-full">
                    Обновить профиль
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Leaderboard limit={5} />
          </div>
        </div>
      </main>
    </div>
  )
}
