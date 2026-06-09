/**
 * User Profile Display Component
 */

'use client'

import Link from 'next/link'
import { SpotifyUserProfile } from '@/types/auth'
import { Button } from '@/components/ui/button'

export interface UserProfileProps {
  user: SpotifyUserProfile
  onLogout: () => Promise<void>
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4">
      {user.images && user.images.length > 0 && user.images[0]?.url && (
        <img
          src={user.images[0].url}
          alt={user.display_name}
          className="w-10 h-10 rounded-full"
        />
      )}

      <div>
        <p className="font-semibold text-sm">{user.display_name}</p>
        {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
      </div>

      <Link href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm">
          View Profile
        </Button>
      </Link>

      <Button variant="outline" size="sm" onClick={onLogout}>
        Logout
      </Button>
    </div>
  )
}
