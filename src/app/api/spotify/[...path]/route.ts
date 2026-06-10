/**
 * GET/POST /api/spotify/[...path]
 * Proxy for Spotify API requests with automatic token management
 * Ensures all requests include valid access token from secure cookies
 */

import { NextRequest, NextResponse } from 'next/server'
import { isMockMode } from '@/lib/mock/config'
import { getMockSpotifyResponse } from '@/lib/mock/spotify-data'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  try {
    const path = params.path.join('/')

    if (isMockMode()) {
      const data = getMockSpotifyResponse(path, request.nextUrl.searchParams)
      return NextResponse.json(data, { status: 200 })
    }

    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Build Spotify API URL with query parameters
    const url = new URL(`https://api.spotify.com/v1/${path}`)
    const searchParams = request.nextUrl.searchParams
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }
      return NextResponse.json(
        { error: 'Spotify API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Spotify proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  try {
    const path = params.path.join('/')
    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()

    const url = new URL(`https://api.spotify.com/v1/${path}`)
    const searchParams = request.nextUrl.searchParams
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }
      return NextResponse.json(
        { error: 'Spotify API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Spotify proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  try {
    const path = params.path.join('/')
    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()

    const url = new URL(`https://api.spotify.com/v1/${path}`)
    const searchParams = request.nextUrl.searchParams
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }
      return NextResponse.json(
        { error: 'Spotify API error' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Spotify proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  try {
    const path = params.path.join('/')
    const accessToken = request.cookies.get('spotify_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const url = new URL(`https://api.spotify.com/v1/${path}`)
    const searchParams = request.nextUrl.searchParams
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }
      return NextResponse.json(
        { error: 'Spotify API error' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Spotify proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
