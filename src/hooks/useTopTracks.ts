'use client'

import { useEffect, useState, useCallback } from 'react'
import { SpotifyTrack } from '@/types'
import { spotifyService } from '@/services/spotify'

type TimeRange = 'short_term' | 'medium_term' | 'long_term'

interface UseTopTracksReturn {
  tracks: SpotifyTrack[]
  loading: boolean
  error: string | null
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage user's top tracks
 * Supports different time ranges: short_term, medium_term, long_term
 * Handles loading and error states automatically
 */
export function useTopTracks(
  initialLimit: number = 20,
  initialTimeRange: TimeRange = 'medium_term'
): UseTopTracksReturn {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)

  const fetchTracks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await spotifyService.getTopTracks(initialLimit, timeRange)
      setTracks(response.items)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top tracks'
      setError(errorMessage)
      console.error('Error fetching top tracks:', err)
      setTracks([])
    } finally {
      setLoading(false)
    }
  }, [initialLimit, timeRange])

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks])

  return {
    tracks,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch: fetchTracks,
  }
}
