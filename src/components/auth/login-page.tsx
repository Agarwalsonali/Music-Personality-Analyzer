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
  state_mismatch: 'Spotify Integration Currently Unavailable',
  missing_verifier: 'Spotify Integration Currently Unavailable',
  missing_code: 'Spotify Integration Currently Unavailable',
  invalid_grant: 'Spotify Integration Currently Unavailable',
  invalid_client: 'Spotify Integration Currently Unavailable',
  callback_error: 'Spotify Integration Currently Unavailable',
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
      setError(oauthErrorMessages[errorParam] ?? 'Spotify Integration Currently Unavailable')
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
            <p className="text-foreground/60">Discover your music personality</p>
          </div>

          {(error || authError) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-destructive mb-2">Spotify Integration Currently Unavailable</p>
              <p className="text-xs text-destructive/80 mb-3">
                The Spotify-powered version of this app is temporarily unavailable because Spotify API access is restricted for this deployment.
              </p>
              <p className="text-xs text-destructive/80 mb-3">
                You can still experience the complete Music Personality Analyzer using Demo Mode, which includes realistic listening data and all personality insights.
              </p>
              <Button
                onClick={handleDemoMode}
                size="sm"
                variant="outline"
                className="w-full border-destructive/50 hover:bg-destructive/10"
              >
                <Play className="w-4 h-4 mr-2" />
                Try Demo Mode
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎵</span>
                <p className="text-sm font-semibold text-primary">Demo Mode Recommended</p>
              </div>
              <p className="text-xs text-foreground/70 text-center">
                Spotify integration is currently limited by Spotify developer restrictions.
              </p>
              <p className="text-xs text-foreground/70 text-center">
                Explore the complete Music Personality Analyzer with realistic sample listening data.
              </p>
            </div>

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
                <span className="bg-card px-2 text-muted-foreground">Or connect with</span>
              </div>
            </div>

            <SpotifyLoginButton fullWidth size="default" />

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
