/**
 * GET /api/auth/callback
 * Handles OAuth callback from Spotify
 * Exchanges authorization code for access token
 */

import { NextRequest, NextResponse } from 'next/server'
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '@/lib/auth/constants'

interface TokenRequestBody {
  grant_type: 'authorization_code'
  code: string
  redirect_uri: string
  client_id: string
  code_verifier: string
}

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

  // Get the correct origin from the redirect URI
  const redirectOrigin = new URL(SPOTIFY_REDIRECT_URI).origin

  try {
    // Handle Spotify error response
    if (error) {
      console.error('Spotify authorization error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, redirectOrigin)
      )
    }

    // Validate parameters
    if (!code) {
      return NextResponse.redirect(new URL('/login?error=missing_code', redirectOrigin))
    }

    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch in OAuth callback')
      return NextResponse.redirect(new URL('/login?error=state_mismatch', redirectOrigin))
    }

    if (!storedVerifier) {
      console.error('PKCE verifier not found')
      return NextResponse.redirect(new URL('/login?error=missing_verifier', redirectOrigin))
    }

    // Exchange authorization code for access token
    const tokenRequestBody: TokenRequestBody = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      code_verifier: storedVerifier,
    }

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenRequestBody as unknown as Record<string, string>).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = (await tokenResponse.json()) as TokenErrorResponse
      console.error('Token exchange error:', errorData)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorData.error)}`, redirectOrigin)
      )
    }

    const tokenData = await tokenResponse.json()

    // Create response that redirects to success page or dashboard
    const redirectUrl = new URL('/analyzer', redirectOrigin)
    const response = NextResponse.redirect(redirectUrl)

    // Store tokens in httpOnly cookies
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in, // Token expiry from Spotify
      path: '/',
    })

    // Store refresh token if provided
    if (tokenData.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      })
    }

    // Store token expiry
    response.cookies.set('spotify_token_expires_at', (Date.now() + tokenData.expires_in * 1000).toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    })

    // Clear PKCE cookies
    response.cookies.delete('pkce_verifier')
    response.cookies.delete('oauth_state')

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=callback_error', request.nextUrl.origin)
    )
  }
}
