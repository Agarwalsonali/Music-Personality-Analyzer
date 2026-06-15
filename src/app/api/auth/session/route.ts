/**
 * GET /api/auth/session
 * Checks login state without returning 401 for guests (avoids noisy console errors).
 */

import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookies, resolveAccessToken } from '@/lib/auth/session'
import { isMockMode } from '@/lib/mock/config'
import { getMockUserProfile } from '@/lib/mock/spotify-data'

export const dynamic = 'force-dynamic'

interface SpotifyUser {
  id: string
  display_name: string
  email?: string
  external_urls: { spotify: string }
  followers: { href: string | null; total: number }
  href: string
  images: Array<{ height: number | null; url: string; width: number | null }>
  uri: string
  product?: string
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if user has explicitly logged out (even in mock mode)
    const hasLoggedOut = request.cookies.has('logged_out')
    
    if (isMockMode() && !hasLoggedOut) {
      return NextResponse.json({ authenticated: true, user: getMockUserProfile() }, { status: 200 })
    }
    
    if (hasLoggedOut) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const hasSession =
      request.cookies.has('spotify_access_token') || request.cookies.has('spotify_refresh_token')

    if (!hasSession) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const { accessToken, applyCookies } = await resolveAccessToken(request)

    if (!accessToken) {
      const response = NextResponse.json({ authenticated: false }, { status: 200 })
      clearAuthCookies(response)
      return response
    }

    let cookieUpdater = applyCookies
    let spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (spotifyResponse.status === 401) {
      const refreshed = await resolveAccessToken(request, { forceRefresh: true })
      if (refreshed.accessToken) {
        cookieUpdater = refreshed.applyCookies
        spotifyResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${refreshed.accessToken}` },
          cache: 'no-store',
        })
      }
    }

    if (!spotifyResponse.ok) {
      const body = await spotifyResponse.text()
    
      console.error('Spotify /me failed')
      console.error('Status:', spotifyResponse.status)
      console.error('Body:', body)
    
      const response = NextResponse.json(
        {
          authenticated: false,
          status: spotifyResponse.status,
          body,
        },
        { status: 200 }
      )
    
      clearAuthCookies(response)
      return response
    }

    const user = (await spotifyResponse.json()) as SpotifyUser
    const response = NextResponse.json({ authenticated: true, user }, { status: 200 })
    cookieUpdater(response)
    response.cookies.delete('logged_out')
    return response
  } catch (error) {
    console.error('Session endpoint error:', error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}
