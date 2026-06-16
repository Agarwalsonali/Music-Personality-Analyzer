'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/auth-provider'
import { DemoProvider } from '@/contexts/demo-provider'

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
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
        storageKey="theme"
      >
      <AuthProvider>
        <DemoProvider>
          <ChunkLoadRecovery />
          {children}
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}