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
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const goalIcons = [GraduationCap, Trophy, DollarSign, BookOpen, Briefcase, Code, FlaskConical, Target]

const interestIcons = ['∑', '⚛', '🧬', '<>', '📊', '$', 'Aa', '📈', '⚗', '🌐', '✏', '🔭']
const interestColors = [
  'bg-blue-50 border-blue-200 text-blue-700',
  'bg-cyan-50 border-cyan-200 text-cyan-700',
  'bg-green-50 border-green-200 text-green-700',
  'bg-purple-50 border-purple-200 text-purple-700',
  'bg-amber-50 border-amber-200 text-amber-700',
  'bg-yellow-50 border-yellow-200 text-yellow-700',
  'bg-rose-50 border-rose-200 text-rose-700',
  'bg-orange-50 border-orange-200 text-orange-700',
  'bg-indigo-50 border-indigo-200 text-indigo-700',
  'bg-teal-50 border-teal-200 text-teal-700',
  'bg-pink-50 border-pink-200 text-pink-700',
  'bg-sky-50 border-sky-200 text-sky-700',
]

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding } = useApp()
  const { t } = useI18n()
  const ob = t.onboarding

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
      <header className="border-b border-border/70 bg-background/82 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-foreground">
              <GraduationCap className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              Mentoria<span className="text-primary"> Hub</span>
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">
            {ob.stepOf} {step} {ob.stepOfMid} {TOTAL_STEPS}
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
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg border border-primary/15 bg-secondary">
                  <User className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{ob.step1Title}</h1>
                <p className="mt-2 text-muted-foreground">{ob.step1Desc}</p>
              </div>

              <div className="surface-card space-y-4 rounded-lg p-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{ob.nameLabel}</Label>
                  <Input
                    id="name"
                    placeholder={ob.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{ob.emailLabel}</Label>
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
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg border border-primary/15 bg-secondary">
                  <GraduationCap className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{ob.step2Title}</h1>
                <p className="mt-2 text-muted-foreground">{ob.step2Desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {t.grades.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setGrade(value)}
                    className={cn(
                      'rounded-lg border p-4 text-center text-sm font-medium transition-all',
                      grade === value
                        ? 'border-primary/60 bg-secondary text-primary'
                        : 'border-border/80 bg-card/80 text-foreground hover:border-primary/40 hover:bg-secondary/70'
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
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg border border-primary/15 bg-secondary">
                  <Heart className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{ob.step3Title}</h1>
                <p className="mt-2 text-muted-foreground">{ob.step3Desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {t.interests.map((interestLabel, idx) => (
                  <button
                    key={interestLabel}
                    onClick={() => toggleInterest(interestLabel)}
                    className={cn(
                      'relative rounded-lg border p-3.5 text-left transition-all',
                      interests.includes(interestLabel)
                        ? 'border-primary/60 bg-secondary'
                        : 'border-border/80 bg-card/80 hover:border-primary/30 hover:bg-secondary/70'
                    )}
                  >
                    {interests.includes(interestLabel) && (
                      <CheckCircle className="absolute right-2 top-2 size-4 text-primary" />
                    )}
                    <span className="mb-1.5 block text-xl">{interestIcons[idx] ?? '•'}</span>
                    <span className={cn('text-xs font-medium', interests.includes(interestLabel) ? 'text-primary' : 'text-foreground')}>
                      {interestLabel}
                    </span>
                  </button>
                ))}
              </div>

              {interests.length > 0 && (
                <p className="text-center text-sm text-primary">
                  {ob.selectedCount} {interests.length}
                </p>
              )}
            </div>
          )}

          {/* ── Step 4: Goals ────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg border border-primary/15 bg-secondary">
                  <Target className="size-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{ob.step4Title}</h1>
                <p className="mt-2 text-muted-foreground">{ob.step4Desc}</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {t.goals.map(({ value, desc }, idx) => {
                  const Icon = goalIcons[idx] ?? Target
                  return (
                    <button
                      key={value}
                      onClick={() => toggleGoal(value)}
                      className={cn(
                        'flex items-center gap-4 rounded-lg border p-4 text-left transition-all',
                        goals.includes(value)
                          ? 'border-primary/60 bg-secondary'
                          : 'border-border/80 bg-card/80 hover:border-primary/30 hover:bg-secondary/70'
                      )}
                    >
                      <div className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-md',
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
                  )
                })}
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
              {ob.backBtn}
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
                  {ob.finishBtn}
                </>
              ) : (
                <>
                  {ob.continueBtn}
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </>
              )}
            </Button>
          </div>

          {step === 1 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {ob.alreadyHaveAccount}{' '}
              <button
                onClick={() => {
                  setName('Айгерим Бекова')
                  setEmail('aigerim@example.com')
                }}
                className="text-primary underline-offset-2 hover:underline"
              >
                {ob.loginWithTest}
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
