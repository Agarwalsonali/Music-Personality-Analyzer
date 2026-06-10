/**
 * Spotify Data Layer
 * 
 * This module provides a comprehensive interface for fetching Spotify user data
 * including profile information, top artists, top tracks, and recently played tracks.
 * 
 * All data fetching is done through secure API endpoints that validate authentication
 * and manage token refresh automatically.
 */

import { spotifyService } from '@/services/spotify'
import { SpotifyUserProfile, TopArtistsResponse, TopTracksResponse, RecentlyPlayedResponse } from '@/types'

export interface SpotifyDataLayer {
  /**
   * Fetch current user's profile information
   */
  getProfile(): Promise<SpotifyUserProfile>

  /**
   * Fetch user's top artists
   * @param limit Number of artists to return (1-50, default: 20)
   * @param timeRange Time range for the data (default: 'medium_term')
   */
  getTopArtists(
    limit?: number,
    timeRange?: 'short_term' | 'medium_term' | 'long_term'
  ): Promise<TopArtistsResponse>

  /**
   * Fetch user's top tracks
   * @param limit Number of tracks to return (1-50, default: 20)
   * @param timeRange Time range for the data (default: 'medium_term')
   */
  getTopTracks(
    limit?: number,
    timeRange?: 'short_term' | 'medium_term' | 'long_term'
  ): Promise<TopTracksResponse>

  /**
   * Fetch user's recently played tracks
   * @param limit Number of tracks to return (1-50, default: 20)
   */
  getRecentlyPlayedTracks(limit?: number): Promise<RecentlyPlayedResponse>
}

/**
 * Spotify data layer implementation
 */
export const spotifyData: SpotifyDataLayer = {
  async getProfile() {
    return spotifyService.getCurrentUserProfile()
  },

  async getTopArtists(limit = 20, timeRange = 'medium_term') {
    return spotifyService.getTopArtists(limit, timeRange)
  },

  async getTopTracks(limit = 20, timeRange = 'medium_term') {
    return spotifyService.getTopTracks(limit, timeRange)
  },

  async getRecentlyPlayedTracks(limit = 20) {
    return spotifyService.getRecentlyPlayedTracks(limit)
  },
}

/**
 * Utility function to fetch all user data in parallel
 * Useful for comprehensive data analysis
 */
export async function fetchAllUserData(artistsLimit = 20, tracksLimit = 20) {
  const [profile, topArtists, topTracks, recentlyPlayed] = await Promise.all([
    spotifyData.getProfile(),
    spotifyData.getTopArtists(artistsLimit),
    spotifyData.getTopTracks(tracksLimit),
    spotifyData.getRecentlyPlayedTracks(tracksLimit),
  ])

  return {
    profile,
    topArtists: topArtists.items,
    topTracks: topTracks.items,
    recentlyPlayed: recentlyPlayed.items.map((item) => ({
      ...item.track,
      played_at: item.played_at,
    })),
  }
}
