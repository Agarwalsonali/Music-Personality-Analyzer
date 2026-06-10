/**
 * GET /api/auth/user
 * Fetches current authenticated user's profile from Spotify
 * Requires valid access token
 */

import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies, resolveAccessToken } from '@/lib/auth/session'
import { isMockMode } from '@/lib/mock/config'
import { getMockUserProfile } from '@/lib/mock/spotify-data'

interface SpotifyUser {
  id: string
  display_name: string
  email?: string
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
  product?: string
}

async function fetchSpotifyProfile(accessToken: string): Promise<Response> {
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })
}

function unauthorizedResponse(message: string, clearCookies = false): NextResponse {
  const response = NextResponse.json({ error: 'Not authenticated', message }, { status: 401 })
  if (clearCookies) {
    clearAuthCookies(response)
  }
  return response
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (isMockMode()) {
      return NextResponse.json(getMockUserProfile(), { status: 200 })
    }

    const { accessToken, applyCookies } = await resolveAccessToken(request)

    if (!accessToken) {
      return unauthorizedResponse('No valid Spotify session found')
    }

    let spotifyResponse = await fetchSpotifyProfile(accessToken)
    let cookieUpdater = applyCookies

    if (spotifyResponse.status === 401) {
      const refreshed = await resolveAccessToken(request, { forceRefresh: true })
      if (refreshed.accessToken) {
        cookieUpdater = refreshed.applyCookies
        spotifyResponse = await fetchSpotifyProfile(refreshed.accessToken)
      }
    }

    if (!spotifyResponse.ok) {
      if (spotifyResponse.status === 401 || spotifyResponse.status === 403) {
        const spotifyError = await spotifyResponse.json().catch(() => ({}))
        const message =
          spotifyResponse.status === 403
            ? 'Spotify denied access. In Development mode, add your Spotify email under User Management in the Spotify Developer Dashboard, then log in again.'
            : ((spotifyError as { error?: { message?: string } }).error?.message ?? 'Spotify session expired')

        return unauthorizedResponse(message, true)
      }

      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: spotifyResponse.status }
      )
    }

    const user = (await spotifyResponse.json()) as SpotifyUser
    const response = NextResponse.json(user, { status: 200 })
    cookieUpdater(response)

    return response
  } catch (error) {
    console.error('Get user endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
