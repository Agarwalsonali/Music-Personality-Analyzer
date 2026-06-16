/**
 * Auth Guard Component
 * Protects pages that require authentication
 * Allows demo mode to bypass authentication
 */

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDemo } from '@/contexts/demo-provider'

export interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const { isDemoMode } = useDemo()

  useEffect(() => {
    if (!loading && !isAuthenticated && !isDemoMode) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, isDemoMode, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isDemoMode) {
    return null
  }

  return <>{children}</>
}
