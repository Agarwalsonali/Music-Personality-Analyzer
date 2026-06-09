/**
 * POST /api/auth/logout
 * Clears authentication tokens and logs out user
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  )

  // Clear all auth-related cookies
  response.cookies.delete('spotify_access_token')
  response.cookies.delete('spotify_refresh_token')
  response.cookies.delete('spotify_token_expires_at')
  response.cookies.delete('pkce_verifier')
  response.cookies.delete('oauth_state')

  return response
}
