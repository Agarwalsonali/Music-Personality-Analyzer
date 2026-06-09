# Spotify Data Layer Documentation

## Overview

The Spotify Data Layer provides a comprehensive, type-safe interface for fetching and managing user music data from Spotify. It includes:

- **Service Layer** (`src/services/spotify.ts`) - Low-level API communication
- **Data Layer** (`src/lib/spotifyDataLayer.ts`) - High-level data fetching interface
- **Custom Hooks** - React hooks for component integration with loading/error states
- **TypeScript Interfaces** - Complete type definitions for all Spotify API responses

## TypeScript Interfaces

All Spotify API responses are fully typed with comprehensive interfaces:

### Core Data Types

```typescript
// User information
interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email?: string;
  external_urls: { spotify: string };
  followers: { href: string | null; total: number };
  images: Array<{ height: number | null; url: string; width: number | null }>;
  uri: string;
  product?: string;
}

// Artist information
interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
}

// Track information
interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  played_at?: string; // For recently played tracks
}

// Paginated responses
interface PaginatedResponse<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

// Specific paginated responses
type TopTracksResponse = PaginatedResponse<SpotifyTrack>;
type TopArtistsResponse = PaginatedResponse<SpotifyArtist>;
```

## Data Layer API

The data layer provides a unified interface for all Spotify data operations:

### Get User Profile

```typescript
import { spotifyData } from '@/lib/spotifyDataLayer';

const profile = await spotifyData.getProfile();
// Returns: SpotifyUserProfile
```

### Get Top Artists

```typescript
// With defaults (limit=20, timeRange='medium_term')
const topArtists = await spotifyData.getTopArtists();

// Custom options
const topArtists = await spotifyData.getTopArtists(
  50, // limit
  'short_term' // timeRange: 'short_term' | 'medium_term' | 'long_term'
);

// Returns: TopArtistsResponse with items: SpotifyArtist[]
const artists = topArtists.items;
```

### Get Top Tracks

```typescript
// With defaults (limit=20, timeRange='medium_term')
const topTracks = await spotifyData.getTopTracks();

// Custom options
const topTracks = await spotifyData.getTopTracks(50, 'long_term');

// Returns: TopTracksResponse with items: SpotifyTrack[]
const tracks = topTracks.items;
```

### Get Recently Played Tracks

```typescript
// With default limit (20)
const recent = await spotifyData.getRecentlyPlayedTracks();

// Custom limit
const recent = await spotifyData.getRecentlyPlayedTracks(50);

// Returns: RecentlyPlayedResponse
// Each item includes: { track: SpotifyTrack, played_at: string, context: {...} }
const recentTracks = recent.items.map((item) => ({
  ...item.track,
  played_at: item.played_at,
}));
```

### Fetch All Data in Parallel

```typescript
import { fetchAllUserData } from '@/lib/spotifyDataLayer';

const allData = await fetchAllUserData(20, 20); // artistsLimit, tracksLimit
// Returns: {
//   profile: SpotifyUserProfile
//   topArtists: SpotifyArtist[]
//   topTracks: SpotifyTrack[]
//   recentlyPlayed: SpotifyTrack[] (with played_at timestamp)
// }
```

## Custom Hooks

### useSpotifyProfile

Fetch and manage user profile with automatic loading/error handling.

```typescript
'use client'

import { useSpotifyProfile } from '@/hooks'

export function UserProfileCard() {
  const { profile, loading, error, refetch } = useSpotifyProfile()

  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile data</div>

  return (
    <div>
      <h1>{profile.display_name}</h1>
      <p>{profile.followers.total} followers</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

**Return Type:**

```typescript
interface UseSpotifyProfileReturn {
  profile: SpotifyUserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

### useTopArtists

Fetch and manage top artists with time range selection.

```typescript
'use client'

import { useTopArtists } from '@/hooks'

export function TopArtistsSection() {
  const {
    artists,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch
  } = useTopArtists(20, 'medium_term')

  if (loading) return <div>Loading artists...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
        <option value="short_term">Last 4 weeks</option>
        <option value="medium_term">Last 6 months</option>
        <option value="long_term">All time</option>
      </select>

      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name} ({artist.popularity}%)</li>
        ))}
      </ul>

      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

**Return Type:**

```typescript
interface UseTopArtistsReturn {
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  setTimeRange: (range: TimeRange) => void;
  refetch: () => Promise<void>;
}
```

### useTopTracks

Fetch and manage top tracks with time range selection.

```typescript
'use client'

import { useTopTracks } from '@/hooks'

export function TopTracksSection() {
  const {
    tracks,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch
  } = useTopTracks(20, 'medium_term')

  if (loading) return <div>Loading tracks...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
        <option value="short_term">Last 4 weeks</option>
        <option value="medium_term">Last 6 months</option>
        <option value="long_term">All time</option>
      </select>

      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>

      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

**Return Type:**

```typescript
interface UseTopTracksReturn {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  setTimeRange: (range: TimeRange) => void;
  refetch: () => Promise<void>;
}
```

### useRecentlyPlayed

Fetch and manage recently played tracks.

```typescript
'use client'

import { useRecentlyPlayed } from '@/hooks'

export function RecentlyPlayedSection() {
  const { tracks, loading, error, refetch } = useRecentlyPlayed(20)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.name}
            {track.played_at && (
              <small> - {new Date(track.played_at).toLocaleString()}</small>
            )}
          </li>
        ))}
      </ul>

      <button onClick={refetch}>Refresh</button>
    </div>
  )
}
```

**Return Type:**

```typescript
interface UseRecentlyPlayedReturn {
  tracks: SpotifyTrack[]; // with played_at timestamp
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

## Error Handling

All data layer operations include comprehensive error handling:

1. **Network Errors** - Caught and converted to user-friendly messages
2. **Auth Errors** - 401 responses trigger "Please log in again" message
3. **Invalid Data** - Empty results handled gracefully
4. **Automatic Cleanup** - Data cleared on error, states reset on retry

Example error handling in components:

```typescript
const { tracks, loading, error, refetch } = useTopTracks()

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  )
}
```

## Time Ranges

The Spotify API supports three time ranges for top artists and tracks:

| Range         | Description                |
| ------------- | -------------------------- |
| `short_term`  | Last ~4 weeks              |
| `medium_term` | Last ~6 months (default)   |
| `long_term`   | All available data (years) |

## Performance Considerations

1. **Limits** - Each request supports 1-50 items (default 20)
2. **Pagination** - For more items, use limit parameter and manage pagination
3. **Caching** - Hooks re-fetch on mount; use `refetch()` for updates
4. **Parallel Fetching** - Use `fetchAllUserData()` for simultaneous requests

## Usage Examples

### Complete Analyzer Component

```typescript
'use client'

import { useSpotifyProfile, useTopArtists, useTopTracks, useRecentlyPlayed } from '@/hooks'

export function MusicAnalyzer() {
  const { profile, loading: profileLoading, error: profileError } = useSpotifyProfile()
  const { artists, loading: artistsLoading } = useTopArtists(10)
  const { tracks, loading: tracksLoading } = useTopTracks(10)
  const { tracks: recentTracks, loading: recentLoading } = useRecentlyPlayed(5)

  const isLoading = profileLoading || artistsLoading || tracksLoading || recentLoading

  if (isLoading) return <div>Loading your music data...</div>

  return (
    <div>
      <section>
        <h2>{profile?.display_name}'s Music Profile</h2>
      </section>

      <section>
        <h3>Top Artists</h3>
        <ul>
          {artists.map((artist) => (
            <li key={artist.id}>{artist.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Top Tracks</h3>
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Recently Played</h3>
        <ul>
          {recentTracks.map((track) => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
```

## File Structure

```
src/
├── services/
│   └── spotify.ts                 # Low-level Spotify API service
├── lib/
│   └── spotifyDataLayer.ts        # High-level data fetching interface
├── hooks/
│   ├── useSpotifyProfile.ts       # User profile hook
│   ├── useTopArtists.ts           # Top artists hook
│   ├── useTopTracks.ts            # Top tracks hook
│   ├── useRecentlyPlayed.ts       # Recently played hook
│   └── index.ts                   # Exports all hooks
└── types/
    └── index.ts                   # TypeScript interfaces
```

## API Endpoints Used

The data layer leverages these Spotify Web API endpoints via the `/api/spotify/*` proxy:

- `GET /v1/me` - User profile
- `GET /v1/me/top/artists` - Top artists
- `GET /v1/me/top/tracks` - Top tracks
- `GET /v1/me/player/recently_played` - Recently played tracks

All requests are authenticated using httpOnly cookies and automatic token refresh.
