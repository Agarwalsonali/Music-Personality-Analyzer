/**
 * GET /api/auth/login
 * Initiates Spotify OAuth PKCE flow
 * Returns authorization URL to redirect user to Spotify login
 */

import { NextRequest, NextResponse } from 'next/server'
import { generatePKCEPair, generateState, buildAuthorizationUrl } from '@/lib/auth/pkce'
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from '@/lib/auth/constants'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Generate PKCE pair and state
    const { codeVerifier, codeChallenge } = await generatePKCEPair()
    const state = generateState()

    // Build authorization URL
    const authUrl = buildAuthorizationUrl(SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, codeChallenge, state, SPOTIFY_SCOPES)

    // Create response and set cookies for PKCE pair
    // These will be validated when the callback is received
    const response = NextResponse.json(
      {
        authUrl,
        // Return the URL so client can redirect
      },
      { status: 200 }
    )

    // Store PKCE pair in secure httpOnly cookies
    // The values are only sent to the server, never exposed to JavaScript
    response.cookies.set('pkce_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth login error:', error)
    return NextResponse.json(
      {
        error: 'Failed to initiate login',
      },
      { status: 500 }
    )
  }
}
