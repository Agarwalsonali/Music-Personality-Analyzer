'use client'

import { useEffect, useState, useCallback } from 'react'
import { SpotifyArtist } from '@/types'
import { spotifyService } from '@/services/spotify'

type TimeRange = 'short_term' | 'medium_term' | 'long_term'

interface UseTopArtistsReturn {
  artists: SpotifyArtist[]
  loading: boolean
  error: string | null
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage user's top artists
 * Supports different time ranges: short_term, medium_term, long_term
 * Handles loading and error states automatically
 */
export function useTopArtists(
  initialLimit: number = 20,
  initialTimeRange: TimeRange = 'medium_term'
): UseTopArtistsReturn {
  const [artists, setArtists] = useState<SpotifyArtist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await spotifyService.getTopArtists(initialLimit, timeRange)
      setArtists(response.items)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top artists'
      setError(errorMessage)
      console.error('Error fetching top artists:', err)
      setArtists([])
    } finally {
      setLoading(false)
    }
  }, [initialLimit, timeRange])

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  return {
    artists,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch: fetchArtists,
  }
}
