/**
 * Login Page Component
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useDemo } from '@/contexts/demo-provider'
import { Button } from '@/components/ui/button'
import { SpotifyLoginButton } from './spotify-login-button'
import { Play } from 'lucide-react'

const oauthErrorMessages: Record<string, string> = {
  state_mismatch:
    'Login session expired or the app URL does not match your Spotify redirect URI. Open the app at http://127.0.0.1:3000 and try again.',
  missing_verifier:
    'Login session expired before Spotify returned. Open the app using the same URL as NEXT_PUBLIC_SPOTIFY_REDIRECT_URI and try again.',
  missing_code: 'Spotify did not return an authorization code. Please try logging in again.',
  invalid_grant:
    'Spotify rejected the authorization code. Check that your redirect URI in .env matches the Spotify Developer Dashboard exactly.',
  callback_error: 'Something went wrong completing login. Please try again.',
}

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, loading, error: authError } = useAuth()
  const { enableDemoMode } = useDemo()
  const [error, setError] = useState<string | null>(null)

  // Check for OAuth errors
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(oauthErrorMessages[errorParam] ?? `Authentication error: ${errorParam}`)
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/analyzer')
    }
  }, [isAuthenticated, loading, router])

  const handleDemoMode = () => {
    enableDemoMode()
    router.push('/analyzer')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 md:p-12 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold gradient-text">Music Personality</h1>
            <p className="text-foreground/60">Discover your music personality through Spotify</p>
          </div>

          {(error || authError) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive mb-3">{error ?? authError}</p>
              <Button
                onClick={handleDemoMode}
                size="sm"
                variant="outline"
                className="w-full border-destructive/50 hover:bg-destructive/10"
              >
                <Play className="w-4 h-4 mr-2" />
                Try Demo Mode Instead
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleDemoMode}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Demo Mode
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <SpotifyLoginButton fullWidth size="lg" />

            <p className="text-xs text-foreground/50 text-center">
              We only access your Spotify profile and music history to analyze your music personality.
              We don&apos;t store or share any personal data.
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs text-foreground/60 text-center">
              Don&apos;t have a Spotify account?{' '}
              <a
                href="https://www.spotify.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
