/**
 * Spotify Login Button Component
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export interface SpotifyLoginButtonProps {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

export function SpotifyLoginButton({
  variant = 'default',
  size = 'md',
  className,
  fullWidth = false,
}: SpotifyLoginButtonProps) {
  const { login, loading, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await login()
    setIsLoading(false)
  }

  return (
    <>
      <Button
        onClick={handleLogin}
        disabled={loading || isLoading}
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}
      >
        {isLoading || loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting to Spotify...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.491 17.237c-.203.33-.637.429-.974.214-2.666-1.63-6.018-1.992-9.975-.977-.361.088-.721-.133-.81-.492-.088-.361.133-.721.492-.81 4.315-1.093 8.011-.693 11.044 1.128.331.205.429.637.214.974zm1.465-3.265c-.255.415-.795.54-1.21.285-3.053-1.876-7.7-2.42-11.313-1.325-.465.139-.957-.116-1.096-.58-.139-.465.116-.957.58-1.096 4.123-1.209 9.016-.639 12.425 1.512.415.255.54.795.285 1.21zm.127-3.403c-3.663-2.174-9.707-2.373-13.2-.732-.559.269-1.232-.06-1.501-.618-.269-.559.06-1.232.618-1.501 4.011-1.92 10.718-1.697 14.987.847.487.295.651.959.357 1.446-.294.487-.959.651-1.446.357z" />
            </svg>
            Login with Spotify
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </>
  )
}
