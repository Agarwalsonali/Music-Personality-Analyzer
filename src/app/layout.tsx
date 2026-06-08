import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Music Personality Analyzer',
  description: 'Discover your music personality with AI-powered analysis inspired by Spotify Wrapped',
  keywords: ['music', 'personality', 'spotify', 'analysis', 'wrapped'],
  viewport: 'width=device-width, initial-scale=1',
  authors: [{ name: 'Music Personality Analyzer' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
