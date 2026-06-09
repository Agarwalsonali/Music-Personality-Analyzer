// OAuth Token Types
export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

export interface StoredToken {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  scope: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: SpotifyUserProfile | null
  accessToken: string | null
  expiresAt: number | null
  loading: boolean
  error: string | null
}

export interface SpotifyUserProfile {
  id: string
  display_name: string
  email?: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  images: Array<{
    height: number | null
    url: string
    width: number | null
  }>
  uri: string
  product?: string
}

export interface PKCEState {
  codeVerifier: string
  codeChallenge: string
  state: string
}
