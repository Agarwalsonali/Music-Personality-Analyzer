'use client'

import { useState } from 'react'
import { spotifyService } from '@/services/spotify'
import { useDemo } from '@/contexts/demo-provider'
import {
  getMockTopTracksResponse,
  getMockTopArtistsResponse,
  getMockAudioFeatures,
} from '@/lib/mock/spotify-data'
import type { SpotifyTrack, MusicPersonality } from '@/types'

export function useMusicAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personality, setPersonality] = useState<MusicPersonality | null>(null)
  const { isDemoMode } = useDemo()

  const analyzeMusicPersonality = async () => {
    try {
      setLoading(true)
      setError(null)

      let topTracks: SpotifyTrack[]
      let topArtists: any[]
      let audioFeatures: any

      if (isDemoMode) {
        // Use mock data in demo mode
        const topTracksResponse = getMockTopTracksResponse(50)
        const topArtistsResponse = getMockTopArtistsResponse(50)
        topTracks = topTracksResponse.items
        topArtists = topArtistsResponse.items
        audioFeatures = getMockAudioFeatures(topTracks.map((track) => track.id))
      } else {
        // Fetch real data from Spotify
        const [topTracksResponse, topArtistsResponse] = await Promise.all([
          spotifyService.getTopTracks(50),
          spotifyService.getTopArtists(50),
        ])

        topTracks = topTracksResponse.items
        topArtists = topArtistsResponse.items

        const trackIds = topTracks.map((track: SpotifyTrack) => track.id)
        audioFeatures = await spotifyService.getMultipleTracksAudioFeatures(trackIds)
      }

      // Calculate personality metrics
      const avgEnergy = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.energy, 0) / audioFeatures.audio_features.length
      const avgDanceability = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.danceability, 0) / audioFeatures.audio_features.length
      const avgValence = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.valence, 0) / audioFeatures.audio_features.length
      const avgAcousticness = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.acousticness, 0) / audioFeatures.audio_features.length
      const avgInstrumentalness = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.instrumentalness, 0) / audioFeatures.audio_features.length
      const avgLiveness = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.liveness, 0) / audioFeatures.audio_features.length
      const avgSpeechiness = audioFeatures.audio_features.reduce((sum: number, af: any) => sum + af.speechiness, 0) / audioFeatures.audio_features.length

      // Determine primary genre and mood
      const genres = topArtists.flatMap((artist: any) => artist.genres)
      const genreCount: Record<string, number> = {}
      genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
      const primaryGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed'

      const mood = avgValence > 0.6 ? 'Happy' : avgValence < 0.4 ? 'Melancholic' : 'Balanced'

      const newPersonality: MusicPersonality = {
        id: Date.now().toString(),
        userId: isDemoMode ? 'demo_user' : 'current_user',
        genre: primaryGenre,
        mood,
        energy: avgEnergy,
        danceability: avgDanceability,
        valence: avgValence,
        acousticness: avgAcousticness,
        instrumentalness: avgInstrumentalness,
        liveness: avgLiveness,
        speechiness: avgSpeechiness,
        topTracks: topTracks.slice(0, 10),
        topArtists: topArtists.slice(0, 10),
        createdAt: new Date(),
      }

      setPersonality(newPersonality)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    personality,
    analyzeMusicPersonality,
  }
}
