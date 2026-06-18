'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  BookOpen,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
  Globe,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApp } from '@/lib/store'
import { useI18n, type Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const LANGUAGE_OPTIONS: { value: Language; label: string; short: string }[] = [
  { value: 'ru', label: 'Русский', short: 'RU' },
  { value: 'kz', label: 'Қазақша', short: 'KZ' },
  { value: 'en', label: 'English', short: 'EN' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, user, logout, toggleTheme, theme, language, setLanguage } = useApp()
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/opportunities', label: t.nav.opportunities, icon: Compass },
    { href: '/courses', label: t.nav.courses, icon: BookOpen },
  ]

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const currentLang = LANGUAGE_OPTIONS.find((l) => l.value === language) ?? LANGUAGE_OPTIONS[0]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      {/* Main row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-foreground shadow-sm">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Mentoria<span className="text-primary"> Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname?.startsWith(href)
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground outline-none"
              aria-label={t.nav.languageSwitcher}
            >
              <Globe className="size-4" />
              <span>{currentLang.short}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {LANGUAGE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setLanguage(opt.value)}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{opt.label}</span>
                  {language === opt.value && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant={pathname === '/dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1.5"
                >
                  <LayoutDashboard className="size-4" data-icon="inline-start" />
                  {t.nav.dashboard}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/70 outline-none">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{user?.name?.split(' ')[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="size-4" />
                      {t.nav.myDashboard}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2">
                      <Settings className="size-4" />
                      {t.nav.admin}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    {t.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/onboarding">
                <Button variant="ghost" size="sm">
                  {t.nav.login}
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t.nav.join}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile right actions */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-secondary/70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.nav.menuAriaLabel}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname?.startsWith(href)
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-secondary/70'
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}

            {/* Mobile language switcher */}
            <div className="mt-1 flex items-center gap-1 rounded-md border border-border/70 px-3 py-2">
              <Globe className="size-4 shrink-0 text-muted-foreground" />
              <span className="mr-2 text-sm text-muted-foreground">{t.nav.languageSwitcher}:</span>
              <div className="flex gap-1">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className={cn(
                      'rounded px-2 py-0.5 text-xs font-semibold transition-colors',
                      language === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                    )}
                  >
                    {opt.short}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/70"
                >
                  <LayoutDashboard className="size-4" />
                  {t.nav.dashboard}
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/70"
                >
                  <Settings className="size-4" />
                  {t.nav.admin}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-secondary/70"
                >
                  <LogOut className="size-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground">
                    {t.nav.join}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
