// Re-export auth types
export type { SpotifyUserProfile, AuthState, TokenResponse, StoredToken, PKCEState } from './auth'

// Spotify API Types
export interface SpotifyArtist {
  id: string
  name: string
  images: Array<{
    url: string
    height: number
    width: number
  }>
  genres: string[]
  popularity: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: {
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  popularity: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  played_at?: string
}

export interface SpotifyUser {
  id: string
  display_name: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  images: Array<{
    height: number | null
    url: string
    width: number | null
  }>
  uri: string
}

// Paginated Response Wrappers
export interface PaginatedResponse<T> {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: T[]
}

export interface TopTracksResponse extends PaginatedResponse<SpotifyTrack> {}

export interface TopArtistsResponse extends PaginatedResponse<SpotifyArtist> {}

export interface RecentlyPlayedResponse extends PaginatedResponse<{
  track: SpotifyTrack
  played_at: string
  context: {
    type: string
    href: string
    external_urls: {
      spotify: string
    }
    uri: string
  } | null
}> {}

// Music Personality Types
export interface MusicPersonality {
  id: string
  userId: string
  genre: string
  mood: string
  energy: number
  danceability: number
  valence: number
  acousticness: number
  instrumentalness: number
  liveness: number
  speechiness: number
  topTracks: SpotifyTrack[]
  topArtists: SpotifyArtist[]
  createdAt: Date
}

export interface AnalysisResult {
  personality: MusicPersonality
  insights: string[]
  recommendations: SpotifyTrack[]
}

// UI Component Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}
