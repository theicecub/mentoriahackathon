import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/store'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mentoria Hub — Образовательные возможности и курсы',
  description:
    'Mentoria Hub — платформа для учеников, где можно найти образовательные возможности, пройти асинхронные курсы и отслеживать прогресс.',
  generator: 'v0.app',
  keywords: ['образование', 'курсы', 'стипендии', 'Mentoria', 'EdTech', 'ученики'],
  openGraph: {
    title: 'Mentoria Hub',
    description: 'Возможности + асинхронные курсы на одной платформе',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#3d2db8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
