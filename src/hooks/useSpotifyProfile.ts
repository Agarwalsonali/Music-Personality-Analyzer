'use client'

import { useEffect, useState, useCallback } from 'react'
import { SpotifyUserProfile } from '@/types'

interface UseSpotifyProfileReturn {
  profile: SpotifyUserProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage Spotify user profile
 * Handles loading and error states automatically
 */
export function useSpotifyProfile(): UseSpotifyProfileReturn {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/auth/user', { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user profile'
      setError(errorMessage)
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  }
}
