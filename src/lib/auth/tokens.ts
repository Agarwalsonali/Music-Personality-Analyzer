/**
 * Token Management Utilities
 * Handles secure token storage and retrieval
 */

import { StoredToken, TokenResponse } from '@/types/auth'

const TOKEN_STORAGE_KEY = 'spotify_token'
const TOKEN_EXPIRY_BUFFER = 300 // 5 minutes buffer before actual expiry

/**
 * Store token data in localStorage (in production, use httpOnly cookies via server)
 * For development: stored in localStorage with expiry tracking
 * For production: implement server-side session/cookie storage
 */
export function storeToken(tokenData: TokenResponse): void {
  if (typeof window === 'undefined') {
    throw new Error('storeToken can only be called in the browser')
  }

  const expiresAt = Date.now() + tokenData.expires_in * 1000

  const storedToken: StoredToken = {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt,
    scope: tokenData.scope,
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(storedToken))
}

/**
 * Retrieve stored token from localStorage
 */
export function getStoredToken(): StoredToken | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as StoredToken
  } catch {
    return null
  }
}

/**
 * Check if token is expired or about to expire
 */
export function isTokenExpired(storedToken: StoredToken | null): boolean {
  if (!storedToken) {
    return true
  }

  const now = Date.now()
  const expiryWithBuffer = storedToken.expiresAt - TOKEN_EXPIRY_BUFFER * 1000

  return now > expiryWithBuffer
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const storedToken = getStoredToken()

  if (!storedToken) {
    return null
  }

  // If token is still valid, return it
  if (!isTokenExpired(storedToken)) {
    return storedToken.accessToken
  }

  // Try to refresh the token
  if (storedToken.refreshToken) {
    try {
      const newToken = await refreshAccessToken(storedToken.refreshToken)
      if (newToken) {
        storeToken(newToken)
        return newToken.access_token
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearToken()
      return null
    }
  }

  // Token expired and no refresh token available
  clearToken()
  return null
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      console.error('Token refresh failed:', response.statusText)
      return null
    }

    return (await response.json()) as TokenResponse
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

/**
 * Clear stored token
 */
export function clearToken(): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

/**
 * Get time until token expiry (in seconds)
 */
export function getTimeUntilExpiry(storedToken: StoredToken | null): number {
  if (!storedToken) {
    return 0
  }

  const secondsUntilExpiry = Math.floor((storedToken.expiresAt - Date.now()) / 1000)
  return Math.max(0, secondsUntilExpiry)
}
