/**
 * GET /api/auth/callback
 * Handles OAuth callback from Spotify
 * Exchanges authorization code for access token
 */

import { NextRequest, NextResponse } from 'next/server'
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '@/lib/auth/constants'
import { setTokenCookies } from '@/lib/auth/session'

interface TokenErrorResponse {
  error: string
  error_description?: string
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Retrieve stored PKCE pair from cookies
  const storedVerifier = request.cookies.get('pkce_verifier')?.value
  const storedState = request.cookies.get('oauth_state')?.value

  const appOrigin = new URL(SPOTIFY_REDIRECT_URI).origin

  try {
    // Handle Spotify error response
    if (error) {
      console.error('Spotify authorization error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, appOrigin)
      )
    }

    // Validate parameters
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=missing_code', appOrigin))
    }

    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch in OAuth callback')
      return NextResponse.redirect(new URL('/login?error=state_mismatch', appOrigin))
    }

    if (!storedVerifier) {
      console.error('PKCE verifier not found')
      return NextResponse.redirect(new URL('/login?error=missing_verifier', appOrigin))
    }

    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: storedVerifier,
    })

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody.toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = (await tokenResponse.json()) as TokenErrorResponse
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorData.error)}`, appOrigin)
      )
    }

    const tokenData = await tokenResponse.json()

    const redirectUrl = new URL('/analyzer', appOrigin)
    const response = NextResponse.redirect(redirectUrl)

    setTokenCookies(response, tokenData)

    // Clear PKCE cookies
    response.cookies.delete('pkce_verifier')
    response.cookies.delete('oauth_state')

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=callback_error', appOrigin)
    )
  }
}
