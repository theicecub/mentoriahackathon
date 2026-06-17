import { NextResponse } from 'next/server'
import { courses } from '@/lib/data'

type UserProgress = {
  id: string
  name: string
  avatar?: string
  enrolledCourses: {
    courseId: string
    completedLessons: string[]
    enrolledAt?: string
    completedAt?: string
  }[]
  quizzesPassed: number
  streakDays: number
}

const fakeCompleted = (n: number) => Array.from({ length: n }, (_, i) => `l-${i + 1}`)

const users: UserProgress[] = [
  {
    id: 'u1',
    name: 'Айгуль Нуруллина',
    enrolledCourses: [
      {
        courseId: 'course-1',
        completedLessons: fakeCompleted(7),
        enrolledAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        courseId: 'course-4',
        completedLessons: fakeCompleted(6),
        enrolledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizzesPassed: 12,
    streakDays: 15,
  },
  {
    id: 'u2',
    name: 'Данияр С.',
    enrolledCourses: [
      {
        courseId: 'course-6',
        completedLessons: fakeCompleted(5),
        enrolledAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        courseId: 'course-3',
        completedLessons: fakeCompleted(2),
        enrolledAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizzesPassed: 6,
    streakDays: 7,
  },
  {
    id: 'u3',
    name: 'Мадина Е.',
    enrolledCourses: [
      {
        courseId: 'course-2',
        completedLessons: fakeCompleted(6),
        enrolledAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizzesPassed: 9,
    streakDays: 4,
  },
  {
    id: 'u4',
    name: 'Арман К.',
    enrolledCourses: [
      {
        courseId: 'course-5',
        completedLessons: fakeCompleted(3),
        enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizzesPassed: 2,
    streakDays: 2,
  },
  {
    id: 'u5',
    name: 'Екатерина П.',
    enrolledCourses: [
      {
        courseId: 'course-8',
        completedLessons: fakeCompleted(4),
        enrolledAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    quizzesPassed: 4,
    streakDays: 12,
  },
]

function difficultyWeight(d: string) {
  switch (d) {
    case 'Начальный':
      return 1
    case 'Средний':
      return 1.5
    case 'Продвинутый':
      return 2
    default:
      return 1
  }
}

function parseDurationToDays(duration: string) {
  const m = duration.match(/\d+/)
  const weeks = m ? parseInt(m[0], 10) : 8
  return weeks * 7
}

function daysBetween(a?: string, b?: string) {
  if (!a || !b) return 0
  const da = new Date(a).getTime()
  const db = new Date(b).getTime()
  return Math.max(0, Math.round((db - da) / (1000 * 60 * 60 * 24)))
}

function computeScore(user: UserProgress) {
  let courseScore = 0
  let speedScore = 0
  let completedCourses = 0

  for (const ec of user.enrolledCourses) {
    const course = courses.find((c) => c.id === ec.courseId)
    if (!course) continue
    const total = course.lessons.length
    const completed = ec.completedLessons.length
    const ratio = completed / Math.max(1, total)
    const weight = difficultyWeight(course.difficulty)
    courseScore += ratio * 100 * weight

    if (completed === total) {
      completedCourses += 1
      const expectedDays = parseDurationToDays(course.duration)
      const actualDays = daysBetween(ec.enrolledAt, ec.completedAt)
      if (actualDays > 0 && actualDays < expectedDays) {
        speedScore += Math.round((expectedDays - actualDays) * 0.5)
      }
    }
  }

  const quizScore = user.quizzesPassed * 25
  const streakScore = Math.min(user.streakDays, 30) * 5

  const total = Math.round(courseScore + quizScore + streakScore + speedScore)

  return {
    total,
    breakdown: {
      courseScore: Math.round(courseScore),
      quizScore,
      streakScore,
      speedScore,
      completedCourses,
      quizzesPassed: user.quizzesPassed,
      streakDays: user.streakDays,
    },
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit') || '10')

  const board = users
    .map((u) => ({ id: u.id, name: u.name, score: computeScore(u).total, details: computeScore(u).breakdown }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return NextResponse.json({ leaderboard: board })
}
