import type { Metadata, Viewport } from 'next'
import { AppProviders } from '@/components/providers/app-providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Music Personality Analyzer',
  description: 'Discover your music personality with AI-powered analysis inspired by Spotify Wrapped',
  keywords: ['music', 'personality', 'spotify', 'analysis', 'wrapped'],
  authors: [{ name: 'Music Personality Analyzer' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        function getTheme() {
          const stored = localStorage.getItem('theme');
          return stored || 'dark';
        }

        const theme = getTheme();

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      })();
    `,
  }}
/>
      </head>
      <body  className="bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
