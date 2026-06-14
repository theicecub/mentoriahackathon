'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string
  email: string
  grade: string
  interests: string[]
  goals: string[]
  avatar: string
}

export interface EnrolledCourse {
  courseId: string
  progress: number
  completedLessons: string[]
  enrolledAt: string
  lastActivity: string
}

export interface AppState {
  isLoggedIn: boolean
  onboardingComplete: boolean
  user: UserProfile | null
  savedOpportunities: string[]
  enrolledCourses: EnrolledCourse[]
  // Admin data
  adminOpportunities: import('./data').Opportunity[]
  adminCourses: import('./data').Course[]
  // Theme
  theme: 'dark' | 'light'
}

interface AppContextValue extends AppState {
  login: (profile: UserProfile) => void
  logout: () => void
  toggleTheme: () => void
  completeOnboarding: (profile: UserProfile) => void
  saveOpportunity: (id: string) => void
  unsaveOpportunity: (id: string) => void
  isOpportunitySaved: (id: string) => boolean
  enrollCourse: (courseId: string) => void
  updateCourseProgress: (courseId: string, lessonId: string) => void
  getCourseProgress: (courseId: string) => EnrolledCourse | undefined
  isCourseEnrolled: (courseId: string) => boolean
  addOpportunity: (op: import('./data').Opportunity) => void
  updateOpportunity: (op: import('./data').Opportunity) => void
  deleteOpportunity: (id: string) => void
  addCourse: (course: import('./data').Course) => void
  updateCourse: (course: import('./data').Course) => void
  deleteCourse: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'mentoria_hub_state'

const defaultState: AppState = {
  isLoggedIn: false,
  onboardingComplete: false,
  user: null,
  savedOpportunities: [],
  enrolledCourses: [],
  adminOpportunities: [],
  adminCourses: [],
  theme: 'dark',
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setState(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, hydrated])

  // Apply theme class to <html>
  useEffect(() => {
    if (!hydrated) return
    const root = document.documentElement
    if (state.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [state.theme, hydrated])

  const toggleTheme = useCallback(() => {
    setState((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
  }, [])

  const login = useCallback((profile: UserProfile) => {
    setState((s) => ({ ...s, isLoggedIn: true, user: profile, onboardingComplete: true }))
  }, [])

  const logout = useCallback(() => {
    setState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setState((s) => ({ ...s, isLoggedIn: true, onboardingComplete: true, user: profile }))
  }, [])

  const saveOpportunity = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      savedOpportunities: s.savedOpportunities.includes(id)
        ? s.savedOpportunities
        : [...s.savedOpportunities, id],
    }))
  }, [])

  const unsaveOpportunity = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      savedOpportunities: s.savedOpportunities.filter((x) => x !== id),
    }))
  }, [])

  const isOpportunitySaved = useCallback(
    (id: string) => state.savedOpportunities.includes(id),
    [state.savedOpportunities]
  )

  const enrollCourse = useCallback((courseId: string) => {
    setState((s) => {
      if (s.enrolledCourses.find((c) => c.courseId === courseId)) return s
      return {
        ...s,
        enrolledCourses: [
          ...s.enrolledCourses,
          {
            courseId,
            progress: 0,
            completedLessons: [],
            enrolledAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
          },
        ],
      }
    })
  }, [])

  const updateCourseProgress = useCallback((courseId: string, lessonId: string) => {
    setState((s) => {
      const enrolled = s.enrolledCourses.find((c) => c.courseId === courseId)
      if (!enrolled) return s

      const completedLessons = enrolled.completedLessons.includes(lessonId)
        ? enrolled.completedLessons
        : [...enrolled.completedLessons, lessonId]

      return {
        ...s,
        enrolledCourses: s.enrolledCourses.map((c) =>
          c.courseId === courseId
            ? { ...c, completedLessons, lastActivity: new Date().toISOString() }
            : c
        ),
      }
    })
  }, [])

  const getCourseProgress = useCallback(
    (courseId: string) => state.enrolledCourses.find((c) => c.courseId === courseId),
    [state.enrolledCourses]
  )

  const isCourseEnrolled = useCallback(
    (courseId: string) => !!state.enrolledCourses.find((c) => c.courseId === courseId),
    [state.enrolledCourses]
  )

  const addOpportunity = useCallback((op: import('./data').Opportunity) => {
    setState((s) => ({ ...s, adminOpportunities: [...s.adminOpportunities, op] }))
  }, [])

  const updateOpportunity = useCallback((op: import('./data').Opportunity) => {
    setState((s) => ({
      ...s,
      adminOpportunities: s.adminOpportunities.map((o) => (o.id === op.id ? op : o)),
    }))
  }, [])

  const deleteOpportunity = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      adminOpportunities: s.adminOpportunities.filter((o) => o.id !== id),
    }))
  }, [])

  const addCourse = useCallback((course: import('./data').Course) => {
    setState((s) => ({ ...s, adminCourses: [...s.adminCourses, course] }))
  }, [])

  const updateCourse = useCallback((course: import('./data').Course) => {
    setState((s) => ({
      ...s,
      adminCourses: s.adminCourses.map((c) => (c.id === course.id ? course : c)),
    }))
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      adminCourses: s.adminCourses.filter((c) => c.id !== id),
    }))
  }, [])

  if (!hydrated) return null

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        toggleTheme,
        completeOnboarding,
        saveOpportunity,
        unsaveOpportunity,
        isOpportunitySaved,
        enrollCourse,
        updateCourseProgress,
        getCourseProgress,
        isCourseEnrolled,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        addCourse,
        updateCourse,
        deleteCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
