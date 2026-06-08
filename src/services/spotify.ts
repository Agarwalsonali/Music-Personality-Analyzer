import { SpotifyArtist, SpotifyTrack, SpotifyUser } from '@/types'

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

class SpotifyService {
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      throw new Error('Access token not set. Please authenticate first.')
    }

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.fetchWithAuth('/me')
  }

  async getTopTracks(limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
    const data = await this.fetchWithAuth(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`)
    return data.items
  }

  async getTopArtists(limit: number = 20, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyArtist[]> {
    const data = await this.fetchWithAuth(`/me/top/artists?limit=${limit}&time_range=${timeRange}`)
    return data.items
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
