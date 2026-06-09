/**
 * Hook to manage Spotify authentication state and operations
 */

'use client'

import { useEffect, useState } from 'react'
import { AuthState, SpotifyUserProfile } from '@/types/auth'
import { clearPKCESession } from '@/lib/auth'

export function useAuth(): AuthState & {
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
} {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    expiresAt: null,
    loading: true,
    error: null,
  })

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user', { credentials: 'include' })
        if (response.ok) {
          const user = (await response.json()) as SpotifyUserProfile
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            user,
            loading: false,
          }))
        } else {
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: false,
            loading: false,
          }))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: false,
          loading: false,
        }))
      }
    }

    checkAuth()
  }, [])

  const login = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      // Get authorization URL from server (server generates PKCE pair and state)
      const loginResponse = await fetch('/api/auth/login', { credentials: 'include' })
      if (!loginResponse.ok) {
        throw new Error('Failed to initiate login')
      }

      const { authUrl } = (await loginResponse.json()) as { authUrl: string }

      // Redirect to Spotify authorization
      window.location.href = authUrl
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      console.error('Login error:', error)
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
      console.error('Logout error:', error)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/user', { credentials: 'include' })
      if (response.ok) {
        const user = (await response.json()) as SpotifyUserProfile
        setAuthState((prev) => ({
          ...prev,
          user,
        }))
      }
    } catch (error) {
      console.error('Refresh user failed:', error)
    }
  }

  return {
    ...authState,
    login,
    logout,
    refreshUser,
  }
}
