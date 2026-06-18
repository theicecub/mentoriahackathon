'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Lock,
  Play,
  Users,
  ClipboardList,
  PenLine,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/navbar'
import { courses, categoryColors, difficultyColors, type Lesson } from '@/lib/data'
import { useApp } from '@/lib/store'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ── Lesson type icon ───────────────────────────────────────────────────────────

function LessonIcon({ type, className }: { type: Lesson['type']; className?: string }) {
  switch (type) {
    case 'video':
      return <Play className={cn('size-4', className)} />
    case 'quiz':
      return <ClipboardList className={cn('size-4', className)} />
    case 'assignment':
      return <PenLine className={cn('size-4', className)} />
    case 'reading':
      return <FileText className={cn('size-4', className)} />
    default:
      return <BookOpen className={cn('size-4', className)} />
  }
}

// ── Quiz component ─────────────────────────────────────────────────────────────

function QuizSection({
  lesson,
  onComplete,
}: {
  lesson: Lesson
  onComplete: () => void
}) {
  const { t } = useI18n()
  const [answers, setAnswers] = useState<number[]>(new Array(lesson.quiz?.length ?? 0).fill(-1))
  const [submitted, setSubmitted] = useState(false)

  if (!lesson.quiz) return null

  const score = answers.filter((a, i) => a === lesson.quiz![i].answer).length
  const allAnswered = answers.every((a) => a !== -1)

  const handleSubmit = () => {
    setSubmitted(true)
    if (score === lesson.quiz!.length) onComplete()
  }

  return (
    <div className="space-y-6">
      {lesson.quiz.map((q, qi) => (
        <div key={qi} className="surface-card rounded-lg p-5">
          <p className="mb-4 font-medium text-foreground">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi
              const isCorrect = oi === q.answer
              const showResult = submitted

              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => {
                    const next = [...answers]
                    next[qi] = oi
                    setAnswers(next)
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                    showResult
                      ? isCorrect
                        ? 'border-green-400 bg-green-50 text-green-800'
                        : isSelected && !isCorrect
                        ? 'border-red-400 bg-red-50 text-red-800'
                        : 'border-border bg-muted text-muted-foreground'
                      : isSelected
                      ? 'border-primary/60 bg-secondary text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                      isSelected && !submitted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-current'
                    )}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                  {showResult && isCorrect && (
                    <CheckCircle className="ml-auto size-4 text-green-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-primary text-primary-foreground"
        >
          {t.courseDetail.submitAnswers}
        </Button>
      ) : (
        <div
          className={cn(
            'rounded-lg border p-4 text-center',
            score === lesson.quiz.length ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
          )}
        >
          <p
            className={cn(
              'text-lg font-bold',
              score === lesson.quiz.length ? 'text-green-700' : 'text-amber-700'
            )}
          >
            {score === lesson.quiz.length
              ? t.courseDetail.allCorrect
              : `${t.courseDetail.correctOf} ${score} / ${lesson.quiz.length}`}
          </p>
          {score < lesson.quiz.length && (
            <p className="mt-1 text-sm text-amber-600">{t.courseDetail.retryHint}</p>
          )}
          {score === lesson.quiz.length && (
            <p className="mt-1 text-sm text-green-600">{t.courseDetail.lessonPassed}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoggedIn, isCourseEnrolled, enrollCourse, getCourseProgress, updateCourseProgress } =
    useApp()
  const { t } = useI18n()

  const courseId = params.id as string
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courseId])

  const enrolled = isCourseEnrolled(courseId)
  const progressData = getCourseProgress(courseId)
  const completedLessons = progressData?.completedLessons ?? []
  const progressPct = course
    ? Math.round((completedLessons.length / course.lessons.length) * 100)
    : 0

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{t.courseDetail.notFound}</p>
            <Link href="/courses">
              <Button variant="outline" className="mt-4">
                {t.courseDetail.backToCourses}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId) ?? null
  const isCompleted = (id: string) => completedLessons.includes(id)

  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push('/onboarding')
      return
    }
    enrollCourse(courseId)
    setActiveLessonId(course.lessons[0].id)
  }

  const markComplete = (lessonId: string) => {
    updateCourseProgress(courseId, lessonId)
  }

  const typeLabel: Record<Lesson['type'], string> = {
    video: t.courseDetail.typeLabelVideo,
    quiz: t.courseDetail.typeLabelQuiz,
    assignment: t.courseDetail.typeLabelAssignment,
    reading: t.courseDetail.typeLabelReading,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Course hero */}
      <div className="border-b border-border/70 bg-background/70">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <Link
            href="/courses"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t.courseDetail.allCourses}
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left: course info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    'text-xs font-medium border-0',
                    categoryColors[course.category] || 'bg-secondary text-secondary-foreground'
                  )}
                >
                  {course.category}
                </Badge>
                <Badge
                  className={cn('text-xs font-medium border-0', difficultyColors[course.difficulty])}
                >
                  {course.difficulty}
                </Badge>
                {course.featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                    {t.courseDetail.popular}
                  </Badge>
                )}
              </div>

              <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
                {course.title}
              </h1>
              <p className="leading-relaxed text-muted-foreground">{course.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-4" />
                  {course.lessons.length} {t.courseDetail.lessonsCount}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  {course.grades.join(', ')} {t.courseDetail.gradeClass}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-4" />
                  {course.instructor}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: enrollment card */}
            <div className="w-full lg:w-72 shrink-0">
              <Card>
                {/* Thumbnail */}
                <div className="relative h-36 overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/15 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="size-16 text-primary/20" />
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  {enrolled ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t.courseDetail.progress}</span>
                          <span className="font-semibold text-primary">{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {completedLessons.length} {t.courseDetail.lessonsDone}{' '}
                          {course.lessons.length} {t.courseDetail.lessonsDoneSuffix}
                        </p>
                      </div>
                      <Button
                        className="w-full bg-primary text-primary-foreground"
                        onClick={() => {
                          const next = course.lessons.find((l) => !isCompleted(l.id))
                          setActiveLessonId(next?.id ?? course.lessons[0].id)
                        }}
                      >
                        <Play className="size-4" data-icon="inline-start" />
                        {progressPct > 0 ? t.courseDetail.continueStudy : t.courseDetail.startLesson}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{t.courseDetail.free}</p>
                        <p className="text-sm text-muted-foreground">{t.courseDetail.asyncFormat}</p>
                      </div>
                      <Button
                        className="w-full bg-primary text-primary-foreground"
                        onClick={handleEnroll}
                      >
                        {t.courseDetail.enroll}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main content: lesson list + viewer */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Lesson list */}
          <aside className="w-full lg:w-72 shrink-0">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  {t.courseDetail.courseProgram}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {course.lessons.map((lesson, index) => {
                    const done = isCompleted(lesson.id)
                    const active = lesson.id === activeLessonId
                    const accessible = enrolled

                    return (
                      <button
                        key={lesson.id}
                        disabled={!accessible}
                        onClick={() => accessible && setActiveLessonId(lesson.id)}
                        className={cn(
                          'group flex items-start gap-3 px-4 py-3.5 text-left transition-colors',
                          index !== course.lessons.length - 1 && 'border-b border-border',
                          active
                            ? 'bg-primary/8 border-l-2 border-l-primary'
                            : 'hover:bg-muted',
                          !accessible && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs',
                            done
                              ? 'bg-green-100 text-green-600'
                              : active
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {done ? (
                            <CheckCircle className="size-4" />
                          ) : accessible ? (
                            <LessonIcon type={lesson.type} />
                          ) : (
                            <Lock className="size-3" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'text-sm font-medium leading-snug',
                              active ? 'text-primary' : 'text-foreground'
                            )}
                          >
                            {index + 1}. {lesson.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{typeLabel[lesson.type]}</span>
                            <ChevronRight className="size-3" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {!enrolled && (
              <div className="surface-card mt-4 rounded-lg border-dashed p-4 text-center">
                <Lock className="mx-auto mb-2 size-6 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">{t.courseDetail.enrollOpen}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.courseDetail.enrollOpenDesc}</p>
                <Button
                  size="sm"
                  className="mt-3 w-full bg-primary text-primary-foreground"
                  onClick={handleEnroll}
                >
                  {t.courseDetail.enrollBtn}
                </Button>
              </div>
            )}
          </aside>

          {/* Lesson viewer */}
          <div className="flex-1">
            {activeLesson ? (
              <div className="space-y-6">
                {/* Lesson header */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      {typeLabel[activeLesson.type]}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      {activeLesson.duration}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{activeLesson.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {activeLesson.description}
                  </p>
                </div>

                <Separator />

                {/* Video */}
                {activeLesson.type === 'video' && activeLesson.videoUrl && (
                  <div className="space-y-5">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-[0_18px_48px_-32px_oklch(0.17_0.02_215_/_0.6)]">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 size-full"
                      />
                    </div>

                    {!isCompleted(activeLesson.id) && (
                      <Button
                        className="bg-primary text-primary-foreground"
                        onClick={() => markComplete(activeLesson.id)}
                      >
                        <CheckCircle className="size-4" data-icon="inline-start" />
                        {t.courseDetail.markComplete}
                      </Button>
                    )}
                    {isCompleted(activeLesson.id) && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="size-5" />
                        <span className="font-medium">{t.courseDetail.lessonDone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz */}
                {activeLesson.type === 'quiz' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-primary/20 bg-secondary/70 p-4">
                      <p className="text-sm font-medium text-primary">
                        {t.courseDetail.quizInstruction}
                      </p>
                    </div>
                    {isCompleted(activeLesson.id) ? (
                      <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700">
                        <CheckCircle className="size-5" />
                        <span className="font-medium">{t.courseDetail.testPassed}</span>
                      </div>
                    ) : (
                      <QuizSection
                        lesson={activeLesson}
                        onComplete={() => markComplete(activeLesson.id)}
                      />
                    )}
                  </div>
                )}

                {/* Assignment */}
                {activeLesson.type === 'assignment' && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <PenLine className="size-5 text-amber-600" />
                        <span className="font-semibold text-amber-800">
                          {t.courseDetail.practicalTask}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-amber-700">
                        {activeLesson.description}
                      </p>
                    </div>

                    {!isCompleted(activeLesson.id) && (
                      <Button
                        className="bg-primary text-primary-foreground"
                        onClick={() => markComplete(activeLesson.id)}
                      >
                        <CheckCircle className="size-4" data-icon="inline-start" />
                        {t.courseDetail.markTaskDone}
                      </Button>
                    )}
                    {isCompleted(activeLesson.id) && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="size-5" />
                        <span className="font-medium">{t.courseDetail.taskDone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Nav between lessons */}
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  {(() => {
                    const idx = course.lessons.findIndex((l) => l.id === activeLesson.id)
                    const prev = idx > 0 ? course.lessons[idx - 1] : null
                    const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null

                    return (
                      <>
                        <Button
                          variant="outline"
                          disabled={!prev}
                          onClick={() => prev && setActiveLessonId(prev.id)}
                        >
                          <ArrowLeft className="size-4" data-icon="inline-start" />
                          {t.courseDetail.prevLesson}
                        </Button>
                        {next ? (
                          <Button
                            className="bg-primary text-primary-foreground"
                            onClick={() => setActiveLessonId(next.id)}
                          >
                            {t.courseDetail.nextLesson}
                            <ChevronRight className="size-4" data-icon="inline-end" />
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle className="size-5" />
                            {t.courseDetail.courseDone}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            ) : (
              // Welcome screen
              <div className="surface-card flex h-full flex-col items-center justify-center rounded-lg border-dashed py-20 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-lg border border-primary/15 bg-secondary">
                  <BookOpen className="size-8 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  {enrolled ? t.courseDetail.chooseLesson : t.courseDetail.enrollFirst}
                </h2>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  {enrolled
                    ? t.courseDetail.chooseLessonDesc
                    : t.courseDetail.enrollFirstDesc}
                </p>
                {!enrolled && (
                  <Button
                    className="mt-6 bg-primary text-primary-foreground"
                    onClick={handleEnroll}
                  >
                    {t.courseDetail.enrollFree}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
