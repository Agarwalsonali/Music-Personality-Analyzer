/**
 * Authentication Constants
 * Set these in your environment variables
 */

export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''

export const SPOTIFY_REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
  'https://music-personality-analyzer-un4r.vercel.app/api/auth/callback'

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-read-currently-playing',
]

// Server-side only
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''

if (!SPOTIFY_CLIENT_ID) {
  console.warn('NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set')
}

if (!SPOTIFY_CLIENT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('SPOTIFY_CLIENT_SECRET is not set in production')
}
