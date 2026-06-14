'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle,
  Code,
  DollarSign,
  FlaskConical,
  GraduationCap,
  Globe,
  Heart,
  Microscope,
  Target,
  Trophy,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

// ── Step data ──────────────────────────────────────────────────────────────────

const grades = [
  { value: '7', label: '7 класс' },
  { value: '8', label: '8 класс' },
  { value: '9', label: '9 класс' },
  { value: '10', label: '10 класс' },
  { value: '11', label: '11 класс' },
  { value: 'Студент', label: 'Студент' },
]

const interestOptions = [
  { value: 'Математика', icon: '∑', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'Физика', icon: '⚛', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  { value: 'Биология', icon: '🧬', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'Программирование', icon: '<>', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { value: 'Бизнес', icon: '📊', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 'Финансы', icon: '$', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'Английский', icon: 'Aa', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { value: 'Экономика', icon: '📈', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { value: 'Химия', icon: '⚗', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { value: 'Социальные науки', icon: '🌐', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { value: 'Дизайн', icon: '✏', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { value: 'Наука', icon: '🔭', color: 'bg-sky-50 border-sky-200 text-sky-700' },
]

const goalOptions = [
  {
    value: 'Поступить в зарубежный университет',
    icon: GraduationCap,
    desc: 'США, Великобритания, Европа',
  },
  {
    value: 'Выиграть олимпиаду',
    icon: Trophy,
    desc: 'Международные и республиканские',
  },
  {
    value: 'Получить стипендию',
    icon: DollarSign,
    desc: 'Болашак и другие программы',
  },
  {
    value: 'Подготовиться к SAT/IELTS',
    icon: BookOpen,
    desc: 'Международные экзамены',
  },
  {
    value: 'Запустить стартап',
    icon: Briefcase,
    desc: 'Предпринимательство',
  },
  {
    value: 'Развить навыки программирования',
    icon: Code,
    desc: 'Python, алгоритмы, проекты',
  },
  {
    value: 'Участвовать в научных проектах',
    icon: FlaskConical,
    desc: 'Исследования и публикации',
  },
  {
    value: 'Развить лидерские качества',
    icon: Target,
    desc: 'Конференции, волонтёрство',
  },
]

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding } = useApp()

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])

  const progress = ((step - 1) / TOTAL_STEPS) * 100

  const toggleInterest = (val: string) => {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    )
  }

  const toggleGoal = (val: string) => {
    setGoals((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    )
  }

  const canProceed = () => {
    if (step === 1) return name.trim().length > 1 && email.includes('@')
    if (step === 2) return !!grade
    if (step === 3) return interests.length > 0
    if (step === 4) return goals.length > 0
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
    else handleFinish()
  }

  const handleFinish = () => {
    completeOnboarding({
      name,
      email,
      grade,
      interests,
      goals,
      avatar: name[0]?.toUpperCase() ?? 'U',
    })
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              Mentoria<span className="text-primary"> Hub</span>
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">
            Шаг {step} из {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <Progress value={progress} className="h-1 rounded-none" />

      {/* Content */}
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl">

          {/* ── Step 1: Name & Email ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <User className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Привет! Давай знакомиться</h1>
                <p className="mt-2 text-muted-foreground">
                  Создай свой профиль на Mentoria Hub — это займёт меньше 2 минут.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Твоё имя и фамилия</Label>
                  <Input
                    id="name"
                    placeholder="Например: Айгерим Бекова"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email-адрес</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Grade ────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <GraduationCap className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">В каком ты классе?</h1>
                <p className="mt-2 text-muted-foreground">
                  Это поможет нам подобрать подходящие для тебя возможности и курсы.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {grades.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setGrade(value)}
                    className={cn(
                      'rounded-xl border-2 p-4 text-center text-sm font-medium transition-all',
                      grade === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted'
                    )}
                  >
                    {grade === value && (
                      <CheckCircle className="mx-auto mb-1.5 size-5 text-primary" />
                    )}
                    <span className="text-base">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Interests ────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Heart className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Что тебя интересует?</h1>
                <p className="mt-2 text-muted-foreground">
                  Выбери от 1 до 5 предметов или направлений. Мы покажем подходящие возможности.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {interestOptions.map(({ value, icon, color }) => (
                  <button
                    key={value}
                    onClick={() => toggleInterest(value)}
                    className={cn(
                      'relative rounded-xl border-2 p-3.5 text-left transition-all',
                      interests.includes(value)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted'
                    )}
                  >
                    {interests.includes(value) && (
                      <CheckCircle className="absolute right-2 top-2 size-4 text-primary" />
                    )}
                    <span className="mb-1.5 block text-xl">{icon}</span>
                    <span className={cn('text-xs font-medium', interests.includes(value) ? 'text-primary' : 'text-foreground')}>
                      {value}
                    </span>
                  </button>
                ))}
              </div>

              {interests.length > 0 && (
                <p className="text-center text-sm text-primary">
                  Выбрано: {interests.length}
                </p>
              )}
            </div>
          )}

          {/* ── Step 4: Goals ────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Target className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Каковы твои цели?</h1>
                <p className="mt-2 text-muted-foreground">
                  Выбери одну или несколько целей, которых хочешь достичь с Mentoria Hub.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {goalOptions.map(({ value, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => toggleGoal(value)}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
                      goals.includes(value)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted'
                    )}
                  >
                    <div className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl',
                      goals.includes(value) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm font-medium', goals.includes(value) ? 'text-primary' : 'text-foreground')}>
                        {value}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {goals.includes(value) && (
                      <CheckCircle className="size-5 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" data-icon="inline-start" />
              Назад
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              size="lg"
            >
              {step === TOTAL_STEPS ? (
                <>
                  <CheckCircle className="size-4" data-icon="inline-start" />
                  Завершить и перейти
                </>
              ) : (
                <>
                  Продолжить
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>

          {step === 1 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => {
                  setName('Айгерим Бекова')
                  setEmail('aigerim@example.com')
                }}
                className="text-primary underline-offset-2 hover:underline"
              >
                Войти с тестовыми данными
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
