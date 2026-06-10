'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AuthState, SpotifyUserProfile } from '@/types/auth'
import { clearPKCESession } from '@/lib/auth'

type AuthContextValue = AuthState & {
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  expiresAt: null,
  loading: true,
  error: null,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState)
  const checkInFlight = useRef<Promise<void> | null>(null)

  const loadUser = useCallback(async () => {
    const response = await fetch('/api/auth/session', { credentials: 'include' })
    const data = (await response.json()) as {
      authenticated: boolean
      user?: SpotifyUserProfile
      message?: string
    }

    if (data.authenticated && data.user) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: data.user ?? null,
        loading: false,
        error: null,
      }))
      return
    }

    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      loading: false,
      error: data.message ?? null,
    }))
  }, [])

  const checkAuth = useCallback(async () => {
    if (checkInFlight.current) {
      await checkInFlight.current
      return
    }

    const task = loadUser().finally(() => {
      checkInFlight.current = null
    })

    checkInFlight.current = task
    await task
  }, [loadUser])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const login = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      const loginResponse = await fetch('/api/auth/login', { credentials: 'include' })
      if (!loginResponse.ok) {
        throw new Error('Failed to initiate login')
      }

      const { authUrl } = (await loginResponse.json()) as { authUrl: string }
      window.location.href = authUrl
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      clearPKCESession()
      setAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        expiresAt: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed'
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      refreshUser,
    }),
    [authState]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
