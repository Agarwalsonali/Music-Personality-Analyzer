/**
 * Server-side session helpers for Spotify OAuth cookies
 */

import { NextRequest, NextResponse } from 'next/server'
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@/lib/auth/constants'

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
}

export function getCanonicalOrigin(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/api/auth/callback').origin
  } catch {
    return 'http://127.0.0.1:3000'
  }
}

function setTokenCookies(response: NextResponse, tokenData: TokenResponse): void {
  response.cookies.set('spotify_access_token', tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokenData.expires_in,
    path: '/',
  })

  if (tokenData.refresh_token) {
    response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }

  response.cookies.set('spotify_token_expires_at', (Date.now() + tokenData.expires_in * 1000).toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokenData.expires_in,
    path: '/',
  })
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete('spotify_access_token')
  response.cookies.delete('spotify_refresh_token')
  response.cookies.delete('spotify_token_expires_at')
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID,
  })

  if (SPOTIFY_CLIENT_SECRET) {
    body.set('client_secret', SPOTIFY_CLIENT_SECRET)
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!tokenResponse.ok) {
    return null
  }

  return (await tokenResponse.json()) as TokenResponse
}

export interface ResolvedAccessToken {
  accessToken: string | null
  applyCookies: (response: NextResponse) => void
}

/**
 * Returns a valid access token from cookies, refreshing when expired.
 */
export async function resolveAccessToken(
  request: NextRequest,
  options?: { forceRefresh?: boolean }
): Promise<ResolvedAccessToken> {
  const accessToken = request.cookies.get('spotify_access_token')?.value
  const refreshToken = request.cookies.get('spotify_refresh_token')?.value
  const expiresAt = Number(request.cookies.get('spotify_token_expires_at')?.value || 0)

  const isExpired = !expiresAt || Date.now() >= expiresAt - 60_000

  if (accessToken && !isExpired && !options?.forceRefresh) {
    return {
      accessToken,
      applyCookies: () => undefined,
    }
  }

  if (!refreshToken) {
    return {
      accessToken: null,
      applyCookies: () => undefined,
    }
  }

  const tokenData = await refreshAccessToken(refreshToken)
  if (!tokenData) {
    return {
      accessToken: null,
      applyCookies: () => undefined,
    }
  }

  return {
    accessToken: tokenData.access_token,
    applyCookies: (response) => setTokenCookies(response, tokenData),
  }
}

export { setTokenCookies }
