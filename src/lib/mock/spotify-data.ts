import type {
  RecentlyPlayedResponse,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyUserProfile,
  TopArtistsResponse,
  TopTracksResponse,
} from '@/types'

export const mockUser = {
  display_name: 'Sonali',
  email: 'demo@example.com',
}

export const mockTopTracks = [
  {
    name: 'Blinding Lights',
    artists: [{ name: 'The Weeknd' }],
    popularity: 95,
  },
  {
    name: 'Perfect',
    artists: [{ name: 'Ed Sheeran' }],
    popularity: 90,
  },
  {
    name: 'Levitating',
    artists: [{ name: 'Dua Lipa' }],
    popularity: 88,
  },
  {
    name: 'Stay',
    artists: [{ name: 'The Kid LAROI' }, { name: 'Justin Bieber' }],
    popularity: 87,
  },
  {
    name: 'Heat Waves',
    artists: [{ name: 'Glass Animals' }],
    popularity: 85,
  },
]

export const mockTopArtists = [
  { name: 'The Weeknd', genres: ['canadian pop', 'pop'], popularity: 94 },
  { name: 'Ed Sheeran', genres: ['pop', 'soft pop'], popularity: 91 },
  { name: 'Dua Lipa', genres: ['dance pop', 'pop'], popularity: 89 },
  { name: 'Justin Bieber', genres: ['pop'], popularity: 88 },
  { name: 'Glass Animals', genres: ['indie pop', 'alternative'], popularity: 82 },
]

const mockAudioFeaturesByTrackId: Record<
  string,
  {
    energy: number
    danceability: number
    valence: number
    acousticness: number
    instrumentalness: number
    liveness: number
    speechiness: number
  }
> = {
  'mock-track-1': { energy: 0.73, danceability: 0.51, valence: 0.33, acousticness: 0.01, instrumentalness: 0, liveness: 0.09, speechiness: 0.06 },
  'mock-track-2': { energy: 0.43, danceability: 0.58, valence: 0.83, acousticness: 0.75, instrumentalness: 0, liveness: 0.09, speechiness: 0.03 },
  'mock-track-3': { energy: 0.83, danceability: 0.7, valence: 0.79, acousticness: 0.01, instrumentalness: 0, liveness: 0.14, speechiness: 0.06 },
  'mock-track-4': { energy: 0.59, danceability: 0.76, valence: 0.48, acousticness: 0.07, instrumentalness: 0, liveness: 0.12, speechiness: 0.04 },
  'mock-track-5': { energy: 0.76, danceability: 0.76, valence: 0.66, acousticness: 0.01, instrumentalness: 0.02, liveness: 0.19, speechiness: 0.05 },
}

function buildMockArtist(name: string, genres: string[], popularity: number, index: number): SpotifyArtist {
  return {
    id: `mock-artist-${index}`,
    name,
    genres,
    popularity,
    images: [{ url: 'https://via.placeholder.com/300', height: 300, width: 300 }],
    external_urls: { spotify: 'https://open.spotify.com' },
  }
}

function buildMockTrack(
  track: (typeof mockTopTracks)[number],
  index: number
): SpotifyTrack {
  const artistObjects = track.artists.map((artist, artistIndex) =>
    buildMockArtist(artist.name, ['pop'], track.popularity - artistIndex, index * 10 + artistIndex)
  )

  return {
    id: `mock-track-${index + 1}`,
    name: track.name,
    artists: artistObjects,
    album: {
      name: `${track.name} (Album)`,
      images: [{ url: 'https://via.placeholder.com/300', height: 300, width: 300 }],
    },
    duration_ms: 210000,
    popularity: track.popularity,
    preview_url: null,
    external_urls: { spotify: 'https://open.spotify.com' },
  }
}

export function getMockUserProfile(): SpotifyUserProfile {
  return {
    id: 'mock-user-sonali',
    display_name: mockUser.display_name,
    email: mockUser.email,
    external_urls: { spotify: 'https://open.spotify.com' },
    followers: { href: null, total: 128 },
    href: 'https://api.spotify.com/v1/users/mock-user-sonali',
    images: [{ url: 'https://via.placeholder.com/150', height: 150, width: 150 }],
    uri: 'spotify:user:mock-user-sonali',
    product: 'free',
  }
}

export function getMockTopTracksResponse(limit = 20): TopTracksResponse {
  const items = mockTopTracks.slice(0, limit).map(buildMockTrack)

  return {
    href: 'https://api.spotify.com/v1/me/top/tracks',
    limit,
    next: null,
    offset: 0,
    previous: null,
    total: items.length,
    items,
  }
}

export function getMockTopArtistsResponse(limit = 20): TopArtistsResponse {
  const items = mockTopArtists.slice(0, limit).map((artist, index) =>
    buildMockArtist(artist.name, artist.genres, artist.popularity, index + 1)
  )

  return {
    href: 'https://api.spotify.com/v1/me/top/artists',
    limit,
    next: null,
    offset: 0,
    previous: null,
    total: items.length,
    items,
  }
}

export function getMockRecentlyPlayedResponse(limit = 20): RecentlyPlayedResponse {
  const tracks = mockTopTracks.slice(0, limit).map(buildMockTrack)

  return {
    href: 'https://api.spotify.com/v1/me/player/recently-played',
    limit,
    next: null,
    offset: 0,
    previous: null,
    total: tracks.length,
    items: tracks.map((track, index) => ({
      track,
      played_at: new Date(Date.now() - index * 3600000).toISOString(),
      context: null,
    })),
  }
}

export function getMockAudioFeatures(trackIds: string[]) {
  return {
    audio_features: trackIds.map((id) => ({
      id,
      ...mockAudioFeaturesByTrackId[id],
    })),
  }
}

export function getMockSpotifyResponse(path: string, searchParams: URLSearchParams): unknown {
  const limit = Number(searchParams.get('limit') || 20)

  if (path === 'me') {
    return getMockUserProfile()
  }

  if (path === 'me/top/tracks') {
    return getMockTopTracksResponse(limit)
  }

  if (path === 'me/top/artists') {
    return getMockTopArtistsResponse(limit)
  }

  if (path === 'me/player/recently-played') {
    return getMockRecentlyPlayedResponse(limit)
  }

  if (path === 'audio-features') {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean)
    return getMockAudioFeatures(ids)
  }

  if (path.startsWith('audio-features/')) {
    const id = path.replace('audio-features/', '')
    return { id, ...mockAudioFeaturesByTrackId[id] }
  }

  return { error: 'Mock route not found', path }
}
