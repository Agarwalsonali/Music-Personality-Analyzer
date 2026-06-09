/**
 * PKCE (Proof Key for Public Clients) Flow Implementation
 * Ensures secure OAuth authentication without exposing client secret
 */

/**
 * Generate a cryptographically random string for code verifier
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }

  return result
}

/**
 * Generate base64url encoded SHA256 hash of the code verifier
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Generate PKCE code verifier and challenge
 */
export async function generatePKCEPair(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = generateRandomString(128)
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  return {
    codeVerifier,
    codeChallenge,
  }
}

/**
 * Generate a random state string for CSRF protection
 */
export function generateState(): string {
  return generateRandomString(64)
}

/**
 * Store PKCE pair in session storage (browser-side only)
 */
export function storePKCESession(codeVerifier: string, state: string): void {
  if (typeof window === 'undefined') {
    throw new Error('storePKCESession can only be called in the browser')
  }

  sessionStorage.setItem('pkce_code_verifier', codeVerifier)
  sessionStorage.setItem('oauth_state', state)
}

/**
 * Retrieve PKCE pair from session storage
 */
export function getPKCESession(): {
  codeVerifier: string | null
  state: string | null
} {
  if (typeof window === 'undefined') {
    throw new Error('getPKCESession can only be called in the browser')
  }

  return {
    codeVerifier: sessionStorage.getItem('pkce_code_verifier'),
    state: sessionStorage.getItem('oauth_state'),
  }
}

/**
 * Clear PKCE session data
 */
export function clearPKCESession(): void {
  if (typeof window === 'undefined') {
    return
  }

  sessionStorage.removeItem('pkce_code_verifier')
  sessionStorage.removeItem('oauth_state')
}

/**
 * Build Spotify authorization URL with PKCE
 */
export function buildAuthorizationUrl(
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
  state: string,
  scopes: string[] = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
  ]
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state,
    scope: scopes.join(' '),
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}
