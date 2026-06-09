/**
 * POST /api/auth/refresh
 * Refreshes expired access token using refresh token
 */

import { NextRequest, NextResponse } from 'next/server'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/lib/auth/constants'

interface RefreshTokenRequest {
  refreshToken: string
}

interface TokenErrorResponse {
  error: string
  error_description?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RefreshTokenRequest

    if (!body.refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 400 }
      )
    }

    // Exchange refresh token for new access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: body.refreshToken,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = (await tokenResponse.json()) as TokenErrorResponse
      console.error('Token refresh error:', errorData)

      // If refresh token is invalid, clear it
      if (errorData.error === 'invalid_grant') {
        const response = NextResponse.json(
          { error: 'Refresh token expired' },
          { status: 401 }
        )
        response.cookies.delete('spotify_refresh_token')
        response.cookies.delete('spotify_access_token')
        return response
      }

      return NextResponse.json(
        { error: errorData.error },
        { status: tokenResponse.status }
      )
    }

    const tokenData = await tokenResponse.json()

    // Return new token to client
    const response = NextResponse.json(tokenData)

    // Update access token cookie
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    })

    // Update expiry time cookie
    response.cookies.set(
      'spotify_token_expires_at',
      (Date.now() + tokenData.expires_in * 1000).toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokenData.expires_in,
        path: '/',
      }
    )

    return response
  } catch (error) {
    console.error('Token refresh endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}
