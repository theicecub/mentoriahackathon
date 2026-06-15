'use client'

import Link from 'next/link'
import { BookOpen, Clock, GraduationCap, Play, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { type Course, categoryColors, difficultyColors } from '@/lib/data'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
}

export function CourseCard({ course, showProgress = false }: CourseCardProps) {
  const { isCourseEnrolled, enrollCourse, getCourseProgress, isLoggedIn } = useApp()
  const enrolled = isCourseEnrolled(course.id)
  const progressData = getCourseProgress(course.id)

  const progressPct = progressData
    ? Math.round((progressData.completedLessons.length / course.lessons.length) * 100)
    : 0

  const handleEnroll = () => {
    if (isLoggedIn) enrollCourse(course.id)
  }

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_24px_60px_-42px_oklch(0.17_0.02_215_/_0.55)] dark:hover:shadow-[0_24px_60px_-42px_oklch(0_0_0_/_0.7)]">
      {/* Thumbnail */}
      <div className="relative h-36 overflow-hidden border-b border-border/70 bg-[linear-gradient(135deg,oklch(0.94_0.025_188),oklch(0.98_0.01_135)_55%,oklch(0.93_0.035_74))] dark:bg-[linear-gradient(135deg,oklch(0.18_0.04_210),oklch(0.22_0.03_225)_55%,oklch(0.20_0.05_175))]">
        <div className="absolute inset-0 opacity-30 dark:opacity-50 [background-image:linear-gradient(to_right,oklch(0.55_0.04_190_/_0.18)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.04_190_/_0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 items-center justify-center rounded-lg border border-primary/20 bg-card/70 shadow-sm backdrop-blur-sm dark:bg-card/40">
            <GraduationCap className="size-8 text-primary/80" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge
            className={cn(
              'text-xs font-medium border-0',
              difficultyColors[course.difficulty]
            )}
          >
            {course.difficulty}
          </Badge>
        </div>
        {enrolled && (
          <div className="absolute left-2 top-2">
            <Badge className="bg-primary text-primary-foreground text-xs border-0">
              Записан
            </Badge>
          </div>
        )}
        {course.featured && !enrolled && (
          <div className="absolute left-2 top-2">
            <Badge className="border-amber/30 bg-amber/16 text-amber-foreground text-xs">
              Популярный
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="gap-2 pb-2">
        <div className="flex items-center gap-1.5">
          <Badge
            className={cn(
              'text-xs font-medium border-0',
              categoryColors[course.category] || 'bg-secondary text-secondary-foreground'
            )}
          >
            {course.category}
          </Badge>
        </div>
        <h3 className="text-balance text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground">— {course.instructor}</p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 rounded-md bg-muted/45 px-2 py-1">
            <BookOpen className="size-3.5" />
            {course.lessons.length} уроков
          </span>
          <span className="flex items-center gap-1 rounded-md bg-muted/45 px-2 py-1">
            <Clock className="size-3.5" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-muted/45 px-2 py-1">
            <Users className="size-3.5" />
            {course.grades.join(', ')}
          </span>
        </div>

        {(showProgress || enrolled) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-medium text-primary">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 border-t-0 bg-transparent pt-0">
        {enrolled ? (
          <Button
            className="flex-1 text-sm"
            size="sm"
            asChild
          >
            <Link href={`/courses/${course.id}`}>
              <Play className="size-3.5" data-icon="inline-start" />
              {progressPct > 0 ? 'Продолжить' : 'Начать'}
            </Link>
          </Button>
        ) : (
          <div className="flex flex-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
              asChild
            >
              <Link href={`/courses/${course.id}`}>Подробнее</Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 text-sm"
              onClick={handleEnroll}
              asChild={!isLoggedIn}
            >
              {isLoggedIn ? (
                'Записаться'
              ) : (
                <Link href="/onboarding">Записаться</Link>
              )}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
