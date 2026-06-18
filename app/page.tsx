'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  GraduationCap,
  LineChart,
  Lightbulb,
  Users,
  CheckCircle,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { OpportunityCard } from '@/components/opportunity-card'
import { CourseCard } from '@/components/course-card'
import { opportunities, courses } from '@/lib/data'
import { useApp } from '@/lib/store'
import { useI18n } from '@/lib/i18n'

const featureIcons = [Compass, BookOpen, Lightbulb, LineChart, Award, Target]
const featureColors = [
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
]

export default function HomePage() {
  const { isLoggedIn } = useApp()
  const { t } = useI18n()

  const featuredOpportunities = opportunities.filter((o) => o.featured).slice(0, 3)
  const featuredCourses = courses.filter((c) => c.featured).slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t.home.heroTitle}
                <br />
                <span className="text-primary">{t.home.heroTitleAccent}</span>
              </h1>

              <p className="mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t.home.heroDesc}
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href={isLoggedIn ? '/opportunities' : '/onboarding'}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    <Compass className="size-4" data-icon="inline-start" />
                    {t.home.heroCta}
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="px-8">
                    <BookOpen className="size-4" data-icon="inline-start" />
                    {t.home.heroCtaCourses}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                {t.home.featuresTitle}
              </h2>
              <p className="mt-3 text-muted-foreground">{t.home.featuresDesc}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.map((feature, idx) => {
                const Icon = featureIcons[idx]
                const color = featureColors[idx]
                return (
                  <div key={feature.title} className="surface-card rounded-lg p-6 transition-all hover:-translate-y-0.5">
                    <div className={`mb-4 flex size-11 items-center justify-center rounded-md ${color}`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────── */}
        <section className="section-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">{t.home.howTitle}</h2>
              <p className="mt-3 text-muted-foreground">{t.home.howDesc}</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {t.steps.map(({ title, desc }, idx) => (
                <div key={title} className="flex flex-col gap-3">
                  <span className="text-5xl font-bold text-primary/15">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10">
                  {t.home.howJoin}
                  <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Opportunities ─────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t.home.featuredOpsTitle}</h2>
                <p className="mt-1 text-muted-foreground">{t.home.featuredOpsDesc}</p>
              </div>
              <Link href="/opportunities" className="hidden sm:block">
                <Button variant="ghost" className="gap-1.5">
                  {t.home.featuredOpsAll} <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredOpportunities.map((op) => (
                <OpportunityCard key={op.id} opportunity={op} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link href="/opportunities">
                <Button variant="outline">{t.home.featuredOpsMobileAll}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Courses ───────────────────────────────────── */}
        <section className="section-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t.home.featuredCoursesTitle}</h2>
                <p className="mt-1 text-muted-foreground">{t.home.featuredCoursesDesc}</p>
              </div>
              <Link href="/courses" className="hidden sm:block">
                <Button variant="ghost" className="gap-1.5">
                  {t.home.featuredCoursesAll} <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link href="/courses">
                <Button variant="outline">{t.home.featuredCoursesMobileAll}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">{t.home.testimonialsTitle}</h2>
              <p className="mt-2 text-muted-foreground">{t.home.testimonialsDesc}</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {t.testimonials.map(({ name, grade, text, avatar, tag }) => (
                <div key={name} className="surface-card rounded-lg p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md border border-primary/15 bg-secondary text-sm font-bold text-primary">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{grade}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{`"${text}"`}</p>
                  <div className="mt-4">
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">{tag}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="bg-foreground dark:bg-card py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <GraduationCap className="mx-auto size-12 text-primary-foreground/60 mb-4 dark:text-white" />
            <h2 className="text-balance text-3xl font-bold text-primary-foreground dark:text-card-foreground sm:text-4xl">
              {t.home.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/70 dark:text-card-foreground/70">
              {t.home.ctaDesc}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary dark:text-primary-foreground px-8">
                  {t.home.ctaCreate} <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary/30 dark:text-card-foreground dark:hover:bg-primary/10 px-8">
                  {t.home.ctaCourses}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-background/90">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Mentoria<span className="text-primary"> Hub</span></span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/opportunities" className="hover:text-foreground transition-colors">{t.home.footerOpportunities}</Link>
              <Link href="/courses" className="hover:text-foreground transition-colors">{t.home.footerCourses}</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">{t.home.footerDashboard}</Link>
              <Link href="/admin" className="hover:text-foreground transition-colors">{t.home.footerAdmin}</Link>
            </nav>
            <p className="text-xs text-muted-foreground">{'© '}{new Date().getFullYear()} Mentoria Hub</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
