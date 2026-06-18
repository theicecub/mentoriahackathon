'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Pencil,
  PlusCircle,
  Shield,
  Trash2,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Navbar } from '@/components/navbar'
import {
  opportunities as staticOps,
  courses as staticCourses,
  categoryColors,
  difficultyColors,
  type Opportunity,
  type Course,
  type Category,
  type Format,
  type Difficulty,
} from '@/lib/data'
import { useApp } from '@/lib/store'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type OpportunityForm = Omit<Opportunity, 'id' | 'logo' | 'requirements' | 'grades' | 'tags'> & {
  requirements: string
  grades: string
  tags: string
}

type CourseForm = Omit<Course, 'id' | 'thumbnail' | 'grades' | 'tags' | 'lessons'> & {
  grades: string
  tags: string
}

const defaultOpForm: OpportunityForm = {
  title: '',
  organization: '',
  category: 'Бизнес',
  format: 'Онлайн',
  deadline: '',
  description: '',
  requirements: '',
  grades: '',
  tags: '',
  link: '#',
}

const defaultCourseForm: CourseForm = {
  title: '',
  description: '',
  category: 'STEM',
  difficulty: 'Начальный',
  grades: '',
  duration: '',
  tags: '',
  instructor: '',
}

const categories: Category[] = [
  'Бизнес', 'STEM', 'Социальное влияние', 'Финансы',
  'Программирование', 'Наука', 'Английский', 'Подготовка к экзаменам', 'Поступление в университет',
]
const formats: Format[] = ['Онлайн', 'Офлайн', 'Гибридный']
const difficulties: Difficulty[] = ['Начальный', 'Средний', 'Продвинутый']

// ── Admin page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const {
    adminOpportunities,
    adminCourses,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addCourse,
    updateCourse,
    deleteCourse,
    enrolledCourses,
    savedOpportunities,
  } = useApp()
  const { t } = useI18n()

  const allOpportunities = useMemo(() => [...staticOps, ...adminOpportunities], [adminOpportunities])
  const allCourses = useMemo(() => [...staticCourses, ...adminCourses], [adminCourses])

  const [tab, setTab] = useState('overview')

  // Opportunity modal state
  const [opModalOpen, setOpModalOpen] = useState(false)
  const [editingOp, setEditingOp] = useState<Opportunity | null>(null)
  const [opForm, setOpForm] = useState<OpportunityForm>(defaultOpForm)

  // Course modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseForm, setCourseForm] = useState<CourseForm>(defaultCourseForm)

  // ── Opportunity handlers ─────────────────────────────────────

  const openAddOp = () => {
    setEditingOp(null)
    setOpForm(defaultOpForm)
    setOpModalOpen(true)
  }

  const openEditOp = (op: Opportunity) => {
    setEditingOp(op)
    setOpForm({
      title: op.title,
      organization: op.organization,
      category: op.category,
      format: op.format,
      deadline: op.deadline,
      description: op.description,
      requirements: op.requirements.join('\n'),
      grades: op.grades.join(', '),
      tags: op.tags.join(', '),
      link: op.link,
    })
    setOpModalOpen(true)
  }

  const handleSaveOp = () => {
    if (!opForm.title.trim() || !opForm.organization.trim()) return
    const parsed: Opportunity = {
      id: editingOp?.id ?? `op-admin-${Date.now()}`,
      logo: opForm.organization[0]?.toUpperCase() ?? 'A',
      title: opForm.title.trim(),
      organization: opForm.organization.trim(),
      category: opForm.category,
      format: opForm.format,
      deadline: opForm.deadline,
      description: opForm.description.trim(),
      requirements: opForm.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      grades: opForm.grades.split(',').map((g) => g.trim()).filter(Boolean) as any,
      tags: opForm.tags.split(',').map((tg) => tg.trim()).filter(Boolean),
      link: opForm.link || '#',
    }

    if (editingOp) {
      updateOpportunity(parsed)
    } else {
      addOpportunity(parsed)
    }
    setOpModalOpen(false)
  }

  const handleDeleteOp = (id: string) => {
    if (staticOps.find((o) => o.id === id)) return
    deleteOpportunity(id)
  }

  // ── Course handlers ──────────────────────────────────────────

  const openAddCourse = () => {
    setEditingCourse(null)
    setCourseForm(defaultCourseForm)
    setCourseModalOpen(true)
  }

  const openEditCourse = (c: Course) => {
    setEditingCourse(c)
    setCourseForm({
      title: c.title,
      description: c.description,
      category: c.category,
      difficulty: c.difficulty,
      grades: c.grades.join(', '),
      duration: c.duration,
      tags: c.tags.join(', '),
      instructor: c.instructor,
    })
    setCourseModalOpen(true)
  }

  const handleSaveCourse = () => {
    if (!courseForm.title.trim() || !courseForm.instructor.trim()) return
    const parsed: Course = {
      id: editingCourse?.id ?? `course-admin-${Date.now()}`,
      thumbnail: '',
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      category: courseForm.category,
      difficulty: courseForm.difficulty,
      grades: courseForm.grades.split(',').map((g) => g.trim()).filter(Boolean) as any,
      duration: courseForm.duration.trim(),
      tags: courseForm.tags.split(',').map((tg) => tg.trim()).filter(Boolean),
      instructor: courseForm.instructor.trim(),
      lessons: editingCourse?.lessons ?? [],
    }

    if (editingCourse) {
      updateCourse(parsed)
    } else {
      addCourse(parsed)
    }
    setCourseModalOpen(false)
  }

  const handleDeleteCourse = (id: string) => {
    if (staticCourses.find((c) => c.id === id)) return
    deleteCourse(id)
  }

  // ── Stats ────────────────────────────────────────────────────

  const stats = [
    { label: t.admin.statOps, value: allOpportunities.length, icon: Compass, color: 'bg-blue-50 text-blue-600' },
    { label: t.admin.statCourses, value: allCourses.length, icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
    { label: t.admin.statYourCourses, value: adminCourses.length, icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
    { label: t.admin.statYourOps, value: adminOpportunities.length, icon: PlusCircle, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Admin header */}
      <div className="border-b border-border/70 bg-background/70">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-primary/15 bg-secondary">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t.admin.title}</h1>
              <p className="text-sm text-muted-foreground">{t.admin.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="h-auto gap-1 bg-muted p-1">
            {[
              { value: 'overview', label: t.admin.tabOverview, icon: LayoutDashboard },
              { value: 'opportunities', label: t.admin.tabOpportunities, icon: Compass },
              { value: 'courses', label: t.admin.tabCourses, icon: BookOpen },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* ── Overview tab ──────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <Card key={label}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={cn('flex size-10 items-center justify-center rounded-md', color)}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Activity breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Course breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="size-4 text-primary" />
                    {t.admin.coursesByCategory}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {categories.map((cat) => {
                    const count = allCourses.filter((c) => c.category === cat).length
                    if (count === 0) return null
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{cat}</span>
                          <span className="font-medium text-primary">{count}</span>
                        </div>
                        <Progress
                          value={Math.round((count / allCourses.length) * 100)}
                          className="h-1.5"
                        />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Opportunities breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="size-4 text-primary" />
                    {t.admin.opsByCategory}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {categories.map((cat) => {
                    const count = allOpportunities.filter((o) => o.category === cat).length
                    if (count === 0) return null
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{cat}</span>
                          <span className="font-medium text-primary">{count}</span>
                        </div>
                        <Progress
                          value={Math.round((count / allOpportunities.length) * 100)}
                          className="h-1.5"
                        />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card
                className="cursor-pointer border-dashed bg-card/80 shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/40"
                onClick={openAddOp}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-md border border-primary/15 bg-secondary">
                    <PlusCircle className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.admin.addOpCard}</p>
                    <p className="text-sm text-muted-foreground">{t.admin.addOpCardDesc}</p>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer border-dashed bg-card/80 shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/40"
                onClick={openAddCourse}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-md bg-amber-100">
                    <BookOpen className="size-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.admin.addCourseCard}</p>
                    <p className="text-sm text-muted-foreground">{t.admin.addCourseCardDesc}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── Opportunities tab ─────────────────────────────────── */}
        {tab === 'opportunities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t.admin.totalOps}{' '}
                <span className="font-medium text-foreground">{allOpportunities.length}</span>{' '}
                {t.admin.totalOpsSuffix}
                {adminOpportunities.length > 0 && (
                  <span className="ml-2 text-primary">
                    ({t.admin.addedByYou} {adminOpportunities.length} {t.admin.addedByYouSuffix})
                  </span>
                )}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground gap-1.5"
                onClick={openAddOp}
              >
                <PlusCircle className="size-4" data-icon="inline-start" />
                {t.admin.addBtn}
              </Button>
            </div>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/35">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t.admin.tableTitle}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">{t.admin.tableCategory}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">{t.admin.tableFormat}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">{t.admin.tableDeadline}</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t.admin.tableActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOpportunities.map((op, i) => {
                      const isAdmin = adminOpportunities.some((a) => a.id === op.id)
                      const isExpired = new Date(op.deadline) < new Date()

                      return (
                        <tr
                          key={op.id}
                          className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {op.logo}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[220px]">
                                  {op.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{op.organization}</p>
                              </div>
                              {isAdmin && (
                                <Badge className="ml-1 shrink-0 bg-primary/10 text-primary border-0 text-xs">
                                  {t.admin.badgeYours}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <Badge
                              className={cn(
                                'text-xs border-0',
                                categoryColors[op.category] || 'bg-secondary text-secondary-foreground'
                              )}
                            >
                              {op.category}
                            </Badge>
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <span className="text-muted-foreground">{op.format}</span>
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell">
                            <span className={cn('text-xs', isExpired ? 'text-destructive' : 'text-muted-foreground')}>
                              {new Date(op.deadline).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => openEditOp(op)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteOp(op.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Courses tab ───────────────────────────────────────── */}
        {tab === 'courses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t.admin.totalCourses}{' '}
                <span className="font-medium text-foreground">{allCourses.length}</span>{' '}
                {t.admin.totalCoursesSuffix}
                {adminCourses.length > 0 && (
                  <span className="ml-2 text-primary">
                    ({t.admin.addedByYou} {adminCourses.length} {t.admin.addedByYouSuffix})
                  </span>
                )}
              </p>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground gap-1.5"
                onClick={openAddCourse}
              >
                <PlusCircle className="size-4" data-icon="inline-start" />
                {t.admin.addCourseBtn}
              </Button>
            </div>

            <div className="surface-card overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/35">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t.admin.tableCourse}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">{t.admin.tableCategory}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">{t.admin.tableLevel}</th>
                      <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">{t.admin.tableLessons}</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t.admin.tableActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCourses.map((c) => {
                      const isAdmin = adminCourses.some((a) => a.id === c.id)

                      return (
                        <tr
                          key={c.id}
                          className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <GraduationCap className="size-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[200px]">
                                  {c.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{c.instructor}</p>
                              </div>
                              {isAdmin && (
                                <Badge className="ml-1 shrink-0 bg-primary/10 text-primary border-0 text-xs">
                                  {t.admin.badgeYours}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <Badge
                              className={cn(
                                'text-xs border-0',
                                categoryColors[c.category] || 'bg-secondary text-secondary-foreground'
                              )}
                            >
                              {c.category}
                            </Badge>
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <Badge
                              className={cn('text-xs border-0', difficultyColors[c.difficulty])}
                            >
                              {c.difficulty}
                            </Badge>
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell">
                            <span className="text-muted-foreground">
                              {c.lessons.length} {t.admin.lessonsCount}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => openEditCourse(c)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteCourse(c.id)}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Opportunity modal ──────────────────────────────────── */}
      <Dialog open={opModalOpen} onOpenChange={setOpModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Compass className="size-5 text-primary" />
              {editingOp ? t.admin.modalEditOp : t.admin.modalAddOp}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="op-title">{t.admin.fieldTitle}</Label>
                <Input
                  id="op-title"
                  placeholder="Diamond Challenge 2025"
                  value={opForm.title}
                  onChange={(e) => setOpForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="op-org">{t.admin.fieldOrg}</Label>
                <Input
                  id="op-org"
                  placeholder="University of Delaware"
                  value={opForm.organization}
                  onChange={(e) => setOpForm((f) => ({ ...f, organization: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="op-cat">{t.admin.fieldCategory}</Label>
                <select
                  id="op-cat"
                  value={opForm.category}
                  onChange={(e) => setOpForm((f) => ({ ...f, category: e.target.value as Category }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="op-format">{t.admin.fieldFormat}</Label>
                <select
                  id="op-format"
                  value={opForm.format}
                  onChange={(e) => setOpForm((f) => ({ ...f, format: e.target.value as Format }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {formats.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="op-deadline">{t.admin.fieldDeadline}</Label>
                <Input
                  id="op-deadline"
                  type="date"
                  value={opForm.deadline}
                  onChange={(e) => setOpForm((f) => ({ ...f, deadline: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="op-desc">{t.admin.fieldDesc}</Label>
              <Textarea
                id="op-desc"
                placeholder={t.admin.fieldDescPlaceholder}
                rows={3}
                value={opForm.description}
                onChange={(e) => setOpForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="op-req">{t.admin.fieldReq}</Label>
                <Textarea
                  id="op-req"
                  rows={3}
                  value={opForm.requirements}
                  onChange={(e) => setOpForm((f) => ({ ...f, requirements: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="op-grades">{t.admin.fieldGrades}</Label>
                <Input
                  id="op-grades"
                  placeholder="9, 10, 11"
                  value={opForm.grades}
                  onChange={(e) => setOpForm((f) => ({ ...f, grades: e.target.value }))}
                />
                <Label htmlFor="op-tags" className="mt-2 block">{t.admin.fieldTags}</Label>
                <Input
                  id="op-tags"
                  value={opForm.tags}
                  onChange={(e) => setOpForm((f) => ({ ...f, tags: e.target.value }))}
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpModalOpen(false)}>
                {t.admin.cancelBtn}
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={handleSaveOp}
                disabled={!opForm.title.trim() || !opForm.organization.trim()}
              >
                <CheckCircle className="size-4" data-icon="inline-start" />
                {editingOp ? t.admin.saveChanges : t.admin.addConfirm}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Course modal ───────────────────────────────────────── */}
      <Dialog open={courseModalOpen} onOpenChange={setCourseModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              {editingCourse ? t.admin.modalEditCourse : t.admin.modalAddCourse}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-title">{t.admin.fieldCourseTitle}</Label>
              <Input
                id="c-title"
                placeholder={t.admin.fieldCourseTitlePlaceholder}
                value={courseForm.title}
                onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-desc">{t.admin.fieldCourseDesc}</Label>
              <Textarea
                id="c-desc"
                placeholder={t.admin.fieldCourseDescPlaceholder}
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-cat">{t.admin.fieldCategory}</Label>
                <select
                  id="c-cat"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value as Category }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-diff">{t.admin.fieldCourseLevel}</Label>
                <select
                  id="c-diff"
                  value={courseForm.difficulty}
                  onChange={(e) => setCourseForm((f) => ({ ...f, difficulty: e.target.value as Difficulty }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-dur">{t.admin.fieldCourseDuration}</Label>
                <Input
                  id="c-dur"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm((f) => ({ ...f, duration: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-instructor">{t.admin.fieldCourseInstructor}</Label>
                <Input
                  id="c-instructor"
                  placeholder={t.admin.fieldCourseInstructorPlaceholder}
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm((f) => ({ ...f, instructor: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-grades">{t.admin.fieldCourseGrades}</Label>
                <Input
                  id="c-grades"
                  placeholder="9, 10, 11"
                  value={courseForm.grades}
                  onChange={(e) => setCourseForm((f) => ({ ...f, grades: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="c-tags">{t.admin.fieldCourseTags}</Label>
              <Input
                id="c-tags"
                value={courseForm.tags}
                onChange={(e) => setCourseForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCourseModalOpen(false)}>
                {t.admin.cancelBtn}
              </Button>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={handleSaveCourse}
                disabled={!courseForm.title.trim() || !courseForm.instructor.trim()}
              >
                <CheckCircle className="size-4" data-icon="inline-start" />
                {editingCourse ? t.admin.saveChanges : t.admin.addCourseConfirm}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
