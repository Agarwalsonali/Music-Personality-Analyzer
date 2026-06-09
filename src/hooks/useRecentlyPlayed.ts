'use client'

import { useEffect, useState, useCallback } from 'react'
import { SpotifyTrack } from '@/types'
import { spotifyService } from '@/services/spotify'

interface UseRecentlyPlayedReturn {
  tracks: SpotifyTrack[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage user's recently played tracks
 * Handles loading and error states automatically
 */
export function useRecentlyPlayed(limit: number = 20): UseRecentlyPlayedReturn {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentlyPlayed = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await spotifyService.getRecentlyPlayedTracks(limit)
      // Extract just the track from each play history item
      const playedTracks = response.items.map((item) => ({
        ...item.track,
        played_at: item.played_at,
      }))
      setTracks(playedTracks)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recently played tracks'
      setError(errorMessage)
      console.error('Error fetching recently played tracks:', err)
      setTracks([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchRecentlyPlayed()
  }, [fetchRecentlyPlayed])

  return {
    tracks,
    loading,
    error,
    refetch: fetchRecentlyPlayed,
  }
}
