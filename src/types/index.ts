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
