import { SpotifyArtist, SpotifyTrack, SpotifyUser, SpotifyUserProfile, RecentlyPlayedResponse, TopArtistsResponse, TopTracksResponse } from '@/types'
import { getValidAccessToken } from '@/lib/auth/tokens'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

class SpotifyService {
  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<SpotifyUserProfile> {
    const response = await fetch('/api/auth/user')
    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }
    return response.json()
  }

  /**
   * Get valid access token from server-side cookies
   * For API calls from client that need auth
   */
  private async getAccessToken(): Promise<string> {
    const token = await getValidAccessToken()
    if (!token) {
      throw new Error('Access token not available. Please authenticate first.')
    }
    return token
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // Fetch token from server (which reads from httpOnly cookies)
    const response = await fetch('/api/spotify' + endpoint, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Access token expired. Please log in again.')
      }
      throw new Error(`Spotify API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.fetchWithAuth('/me')
  }

  async getTopTracks(limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<TopTracksResponse> {
    return this.fetchWithAuth(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`)
  }

  async getTopArtists(limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<TopArtistsResponse> {
    return this.fetchWithAuth(`/me/top/artists?limit=${limit}&time_range=${timeRange}`)
  }

  async getRecentlyPlayedTracks(limit: number = 20): Promise<RecentlyPlayedResponse> {
    return this.fetchWithAuth(`/me/player/recently_played?limit=${limit}`)
  }

  async getTrackAudioFeatures(trackId: string) {
    return this.fetchWithAuth(`/audio-features/${trackId}`)
  }

  async getMultipleTracksAudioFeatures(trackIds: string[]) {
    const ids = trackIds.join(',')
    return this.fetchWithAuth(`/audio-features?ids=${ids}`)
  }

  async getRecommendations(seedArtists: string[], seedGenres: string[], seedTracks: string[], limit: number = 20) {
    const params = new URLSearchParams({
      seed_artists: seedArtists.slice(0, 5).join(','),
      seed_genres: seedGenres.slice(0, 5).join(','),
      seed_tracks: seedTracks.slice(0, 5).join(','),
      limit: limit.toString(),
    })

    return this.fetchWithAuth(`/recommendations?${params.toString()}`)
  }
}

export const spotifyService = new SpotifyService()
