/**
 * GET /api/analyzer
 * Returns a full music personality analysis using mock data (no Spotify Premium required).
 */

import { NextResponse } from 'next/server'
import { isMockMode } from '@/lib/mock/config'
import {
  getMockTopArtistsResponse,
  getMockTopTracksResponse,
  getMockUserProfile,
  getMockAudioFeatures,
} from '@/lib/mock/spotify-data'

export async function GET() {
  if (!isMockMode()) {
    return NextResponse.json(
      { error: 'Mock analyzer is disabled. Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local' },
      { status: 403 }
    )
  }

  const profile = getMockUserProfile()
  const topTracks = getMockTopTracksResponse(50).items
  const topArtists = getMockTopArtistsResponse(50).items
  const audioFeatures = getMockAudioFeatures(topTracks.map((track) => track.id))

  const features = audioFeatures.audio_features
  const count = features.length || 1

  const avg = (key: keyof (typeof features)[number]) =>
    features.reduce((sum, feature) => sum + Number(feature[key] ?? 0), 0) / count

  const genreCount: Record<string, number> = {}
  topArtists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1
    })
  })

  const primaryGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pop'
  const avgValence = avg('valence')
  const mood = avgValence > 0.6 ? 'Happy' : avgValence < 0.4 ? 'Melancholic' : 'Balanced'

  return NextResponse.json({
    profile,
    personality: {
      genre: primaryGenre,
      mood,
      energy: avg('energy'),
      danceability: avg('danceability'),
      valence: avgValence,
      acousticness: avg('acousticness'),
      instrumentalness: avg('instrumentalness'),
      liveness: avg('liveness'),
      speechiness: avg('speechiness'),
      topTracks: topTracks.slice(0, 10),
      topArtists: topArtists.slice(0, 10),
    },
    charts: {
      topGenres: Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, value]) => ({ name, value: value * 10 })),
      audioFeatures: [
        { name: 'Energy', value: Math.round(avg('energy') * 100) },
        { name: 'Danceability', value: Math.round(avg('danceability') * 100) },
        { name: 'Valence', value: Math.round(avg('valence') * 100) },
        { name: 'Acousticness', value: Math.round(avg('acousticness') * 100) },
      ],
      topTracks: topTracks.slice(0, 5).map((track) => ({
        name: track.name,
        streams: track.popularity * 10,
      })),
    },
  })
}
