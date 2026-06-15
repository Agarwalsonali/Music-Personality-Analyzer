'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/auth-provider'

function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnChunkError = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { name?: string; message?: string } | undefined
      const message = reason?.message ?? ''
      const isChunkError =
        reason?.name === 'ChunkLoadError' ||
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError')

      if (isChunkError) {
        event.preventDefault()
        window.location.reload()
      }
    }

    window.addEventListener('unhandledrejection', reloadOnChunkError)
    return () => window.removeEventListener('unhandledrejection', reloadOnChunkError)
  }, [])

  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"        // ← was "dark", now respects OS preference
      enableSystem                 // ← reads prefers-color-scheme
      disableTransitionOnChange    // ← prevents flash on theme switch
      storageKey="theme"           // ← must match layout.tsx inline script
    >
      <AuthProvider>
        <ChunkLoadRecovery />
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}