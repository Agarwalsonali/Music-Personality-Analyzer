/**
 * POST /api/auth/user
 * Fetches current authenticated user's profile from Spotify
 * Requires valid access token
 */

import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch user profile from Spotify API
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try to refresh
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: response.status }
      )
    }

    const user = (await response.json()) as SpotifyUser

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Get user endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
