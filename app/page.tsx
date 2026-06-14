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
  Zap,
  Globe,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { OpportunityCard } from '@/components/opportunity-card'
import { CourseCard } from '@/components/course-card'
import { opportunities, courses } from '@/lib/data'
import { useApp } from '@/lib/store'

const stats = [
  { value: '200+', label: 'Образовательных возможностей', icon: Compass },
  { value: '50+', label: 'Асинхронных курсов', icon: BookOpen },
  { value: '5 000+', label: 'Активных учеников', icon: Users },
  { value: '40+', label: 'Стран-участников', icon: Globe },
]

const features = [
  {
    icon: Compass,
    title: 'Каталог возможностей',
    description:
      'Более 200 олимпиад, стипендий, летних программ и конкурсов в одном месте. Фильтруй по классу, теме и дедлайну.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: BookOpen,
    title: 'Асинхронные курсы',
    description:
      'Учись в своём темпе. Каждый курс включает видеоуроки, тесты и задания. Прогресс сохраняется автоматически.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Lightbulb,
    title: 'Персональные рекомендации',
    description:
      'Платформа изучает твои интересы и цели, затем подбирает курсы и возможности, которые подходят именно тебе.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: LineChart,
    title: 'Отслеживание прогресса',
    description:
      'Личный кабинет с дедлайнами, прогресс-барами по курсам и сохранёнными возможностями всегда под рукой.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Award,
    title: 'Реальные достижения',
    description:
      'Участвуй в конкурсах и программах, которые ценят лучшие университеты мира. Строй своё портфолио.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: Target,
    title: 'Цели и дедлайны',
    description:
      'Устанавливай цели, получай напоминания о дедлайнах и отслеживай свой путь к мечте.',
    color: 'bg-teal-100 text-teal-700',
  },
]

const steps = [
  {
    num: '01',
    title: 'Создай профиль',
    desc: 'Расскажи о своём классе, интересах и целях. Займёт 2 минуты.',
  },
  {
    num: '02',
    title: 'Получи рекомендации',
    desc: 'Платформа сразу подберёт подходящие курсы и возможности.',
  },
  {
    num: '03',
    title: 'Сохраняй и учись',
    desc: 'Сохраняй возможности, записывайся на курсы и отслеживай прогресс.',
  },
  {
    num: '04',
    title: 'Достигай целей',
    desc: 'Подавай заявки, получай сертификаты и стройте блестящее будущее.',
  },
]

const testimonials = [
  {
    name: 'Айгерим Б.',
    grade: '11 класс, Алматы',
    text: 'Через Mentoria Hub нашла стипендию Diamond Challenge и прошла в финал. Платформа подобрала её за 5 минут!',
    avatar: 'А',
    tag: 'Diamond Challenge Finalist',
  },
  {
    name: 'Тимур К.',
    grade: '10 класс, Астана',
    text: 'Курс по Python помог мне выиграть школьную олимпиаду по информатике. Объясняется очень понятно.',
    avatar: 'Т',
    tag: 'Олимпиада по информатике',
  },
  {
    name: 'Зарина М.',
    grade: '9 класс, Шымкент',
    text: 'За месяц прошла курс по английскому и сдала IELTS на 6.5. Рекомендую всем, кто готовится к экзаменам.',
    avatar: 'З',
    tag: 'IELTS 6.5',
  },
]

export default function HomePage() {
  const { isLoggedIn } = useApp()
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
              <Badge className="mb-6 border-primary/20 bg-secondary/80 px-4 py-1.5 text-sm text-primary">
                <Zap className="mr-1.5 size-3.5 inline" />
                EdTech-платформа для учеников Центральной Азии
              </Badge>

              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Возможности и курсы —
                <br />
                <span className="text-primary">всё на одной платформе</span>
              </h1>

              <p className="mt-6 text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Mentoria Hub помогает ученикам находить олимпиады, стипендии и летние программы, а
                также проходить качественные асинхронные курсы — в своём темпе, без давления.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href={isLoggedIn ? '/opportunities' : '/onboarding'}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                    <Compass className="size-4" data-icon="inline-start" />
                    Найти возможности
                    <ArrowRight className="size-4" data-icon="inline-end" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="px-8">
                    <BookOpen className="size-4" data-icon="inline-start" />
                    Начать обучение
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                {['Бесплатно', 'Без рекламы', 'На русском языке', 'Для 7–11 класса'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="size-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <section className="section-muted">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex size-10 items-center justify-center rounded-md border border-primary/15 bg-secondary">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground sm:text-3xl">{value}</span>
                  <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Всё, что нужно для роста
              </h2>
              <p className="mt-3 text-muted-foreground">
                Mentoria Hub — это не просто сайт. Это твой личный навигатор по образовательным возможностям.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }) => (
                <div key={title} className="surface-card rounded-lg p-6 transition-all hover:-translate-y-0.5">
                  <div className={`mb-4 flex size-11 items-center justify-center rounded-md ${color}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────── */}
        <section className="section-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">Как это работает</h2>
              <p className="mt-3 text-muted-foreground">Начни за 5 минут, учись всю жизнь</p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ num, title, desc }) => (
                <div key={num} className="flex flex-col gap-3">
                  <span className="text-5xl font-bold text-primary/15">{num}</span>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10">
                  Присоединиться к Mentoria
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
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Актуальные возможности</h2>
                <p className="mt-1 text-muted-foreground">Конкурсы и программы с ближайшими дедлайнами</p>
              </div>
              <Link href="/opportunities" className="hidden sm:block">
                <Button variant="ghost" className="gap-1.5">
                  Все возможности <ArrowRight className="size-4" />
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
                <Button variant="outline">Смотреть все возможности</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Courses ───────────────────────────────────── */}
        <section className="section-muted py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Популярные курсы Mentoria</h2>
                <p className="mt-1 text-muted-foreground">Асинхронные курсы, разработанные нашими педагогами</p>
              </div>
              <Link href="/courses" className="hidden sm:block">
                <Button variant="ghost" className="gap-1.5">
                  Все курсы <ArrowRight className="size-4" />
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
                <Button variant="outline">Смотреть все курсы</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Что говорят ученики</h2>
              <p className="mt-2 text-muted-foreground">Реальные истории успеха с Mentoria Hub</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {testimonials.map(({ name, grade, text, avatar, tag }) => (
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
        <section className="bg-foreground py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <GraduationCap className="mx-auto size-12 text-primary-foreground/60 mb-4" />
            <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
              Готов начать свой путь?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/70">
              Присоединись к тысячам учеников, которые уже используют Mentoria Hub для достижения своих образовательных целей.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8">
                  Создать профиль <ArrowRight className="size-4" data-icon="inline-end" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
                  Смотреть курсы
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
              <Link href="/opportunities" className="hover:text-foreground transition-colors">Возможности</Link>
              <Link href="/courses" className="hover:text-foreground transition-colors">Курсы</Link>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Кабинет</Link>
              <Link href="/admin" className="hover:text-foreground transition-colors">Для администраторов</Link>
            </nav>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Mentoria Hub</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
