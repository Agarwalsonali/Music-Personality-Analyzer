/**
 * Music Alter Ego Generator
 * 
 * Generates unique alter egos based on Spotify listening data including:
 * - Alter ego name
 * - Description
 * - Strength
 * - Weakness
 * - Color palette
 * - Soundtrack recommendation
 */

import type { SpotifyArtist, SpotifyTrack } from '@/types'

export interface AlterEgo {
  name: string
  description: string
  strength: string
  weakness: string
  colorPalette: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  soundtrack: SpotifyTrack | null
  archetype: string
}

export interface AlterEgoInput {
  artists: SpotifyArtist[]
  tracks: SpotifyTrack[]
  energy: number
  danceability: number
  valence: number
  acousticness: number
}

// Name components for generating alter ego names
const PREFIXES = [
  'Midnight', 'Neon', 'Velvet', 'Cosmic', 'Electric', 'Silent',
  'Golden', 'Crystal', 'Shadow', 'Solar', 'Lunar', 'Digital',
  'Vintage', 'Futuristic', 'Ethereal', 'Mystic', 'Urban', 'Wild',
  'Crimson', 'Azure', 'Obsidian', 'Radiant', 'Phantom', 'Stellar',
]

const NOUNS = [
  'Astronaut', 'Dreamer', 'Rebel', 'Storyteller', 'Voyager', 'Nomad',
  'Architect', 'Warrior', 'Poet', 'Sorcerer', 'Explorer', 'Guardian',
  'Artist', 'Visionary', 'Pioneer', 'Maverick', 'Prodigy', 'Legend',
  'Phantom', 'Specter', 'Oracle', 'Sage', 'Knight', 'Ranger',
]

const ADJECTIVES = [
  'of the Void', 'of Echoes', 'of Dreams', 'of Stars', 'of Shadows',
  'of Light', 'of Sound', 'of Time', 'of Space', 'of Mystery',
  'of the Night', 'of Dawn', 'of Twilight', 'of Infinity',
]

// Archetype definitions
const ARCHETYPES = [
  {
    id: 'night_wanderer',
    name: 'Night Wanderer',
    patterns: ['ambient', 'chill', 'electronic', 'lo-fi'],
    energyRange: [0, 0.5],
    valenceRange: [0, 0.5],
  },
  {
    id: 'main_character',
    name: 'Main Character',
    patterns: ['pop', 'dance', 'electropop'],
    energyRange: [0.6, 1],
    valenceRange: [0.6, 1],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    patterns: ['world', 'experimental', 'folk'],
    energyRange: [0.4, 0.7],
    valenceRange: [0.4, 0.7],
  },
  {
    id: 'rebel',
    name: 'Rebel',
    patterns: ['punk', 'metal', 'rock', 'hardcore'],
    energyRange: [0.7, 1],
    valenceRange: [0, 0.5],
  },
  {
    id: 'dreamer',
    name: 'Dreamer',
    patterns: ['dream pop', 'shoegaze', 'ambient'],
    energyRange: [0, 0.4],
    valenceRange: [0.5, 0.8],
  },
  {
    id: 'firestarter',
    name: 'Firestarter',
    patterns: ['edm', 'house', 'techno'],
    energyRange: [0.8, 1],
    valenceRange: [0.5, 0.8],
  },
  {
    id: 'romantic',
    name: 'Romantic',
    patterns: ['r&b', 'soul', 'love song'],
    energyRange: [0.3, 0.6],
    valenceRange: [0.6, 1],
  },
  {
    id: 'old_soul',
    name: 'Old Soul',
    patterns: ['classic rock', 'folk', 'jazz', 'blues'],
    energyRange: [0.3, 0.6],
    valenceRange: [0.3, 0.6],
  },
]

/**
 * Generate alter ego name based on listening patterns
 */
function generateAlterEgoName(_genres: string[], energy: number, valence: number): string {
  // Select prefix based on energy level
  let prefixIndex: number
  if (energy < 0.3) {
    prefixIndex = Math.floor(Math.random() * 8) // Calm prefixes
  } else if (energy > 0.7) {
    prefixIndex = 8 + Math.floor(Math.random() * 8) // Energetic prefixes
  } else {
    prefixIndex = Math.floor(Math.random() * PREFIXES.length)
  }

  // Select noun based on valence (mood)
  let nounIndex: number
  if (valence < 0.4) {
    nounIndex = Math.floor(Math.random() * 8) // Darker nouns
  } else if (valence > 0.7) {
    nounIndex = 8 + Math.floor(Math.random() * 8) // Brighter nouns
  } else {
    nounIndex = Math.floor(Math.random() * NOUNS.length)
  }

  // Randomly add adjective
  const hasAdjective = Math.random() > 0.6
  const adjective = hasAdjective ? ` ${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}` : ''

  return `${PREFIXES[prefixIndex]} ${NOUNS[nounIndex]}${adjective}`
}

/**
 * Determine archetype based on genres and audio features
 */
function determineArchetype(genres: string[], energy: number, valence: number): string {
  const genreSet = new Set(genres.map(g => g.toLowerCase()))
  
  for (const archetype of ARCHETYPES) {
    const patternMatch = archetype.patterns.some(pattern =>
      [...genreSet].some(genre => genre.includes(pattern))
    )
    const energyMatch = energy >= archetype.energyRange[0] && energy <= archetype.energyRange[1]
    const valenceMatch = valence >= archetype.valenceRange[0] && valence <= archetype.valenceRange[1]
    
    if (patternMatch && energyMatch && valenceMatch) {
      return archetype.name
    }
  }
  
  return 'Maverick' // Default archetype
}

/**
 * Generate description based on archetype and traits
 */
function generateDescription(archetype: string, _genres: string[], _energy: number): string {
  const descriptions: Record<string, string> = {
    'Night Wanderer': 'You navigate the shadows with grace, finding beauty in the quiet moments. Your music is a sanctuary for the soulful and the sublime.',
    'Main Character': 'Every day is a movie scene with you as the star. Your playlist is the soundtrack to your most cinematic moments.',
    'Explorer': 'You\'re a musical adventurer, constantly seeking new sounds from every corner of the world. Your curiosity knows no bounds.',
    'Rebel': 'Your music defies convention and challenges the status quo. You\'re drawn to raw, aggressive sounds that reflect your nonconformist spirit.',
    'Dreamer': 'Your music exists in the space between reality and fantasy. Ethereal sounds transport you to worlds of imagination.',
    'Firestarter': 'High energy and unstoppable drive define you. You need beats that fuel your ambition and match your intensity.',
    'Romantic': 'Every song tells a love story. You\'re drawn to heartfelt melodies that celebrate the beauty of human connection.',
    'Old Soul': 'You appreciate timeless classics with depth and history. Your taste transcends trends, favoring authenticity.',
    'Maverick': 'You blaze your own trail, unbound by convention. Your unique taste sets you apart from the crowd.',
  }
  
  return descriptions[archetype] || descriptions['Maverick']
}

/**
 * Generate strength based on listening patterns
 */
function generateStrength(_genres: string[], energy: number, valence: number): string {
  const strengths = [
    'Unwavering authenticity in musical taste',
    'Ability to find beauty in diverse genres',
    'Emotional depth and introspection',
    'Boundless energy and enthusiasm',
    'Curiosity for new sounds and discoveries',
    'Strong connection to rhythm and groove',
    'Appreciation for artistic craftsmanship',
    'Open-mindedness and versatility',
    'Passionate and intense musical engagement',
    'Peaceful and contemplative nature',
  ]
  
  // Select strength based on dominant trait
  if (energy > 0.7) return strengths[3]
  if (valence < 0.4) return strengths[2]
  if (valence > 0.7) return strengths[4]
  if (_genres.some((g: string) => g.includes('rock') || g.includes('metal'))) return strengths[8]
  if (_genres.some((g: string) => g.includes('folk') || g.includes('jazz'))) return strengths[6]
  
  return strengths[Math.floor(Math.random() * strengths.length)]
}

/**
 * Generate weakness based on listening patterns
 */
function generateWeakness(_genres: string[], _energy: number, _valence: number): string {
  const weaknesses = [
    'Can get lost in musical rabbit holes',
    'Sometimes too intense for casual listeners',
    'May overlook mainstream hits',
    'Tendency to overanalyze lyrics',
    'Difficulty settling on a single genre',
    'Can be emotionally overwhelmed by music',
    'Obsessive about discovering new artists',
    'Reluctant to embrace change in taste',
    'May alienate others with niche preferences',
    'Perfectionist about playlist curation',
  ]
  
  // Select weakness based on dominant trait
  if (_energy > 0.7) return weaknesses[1]
  if (_valence < 0.4) return weaknesses[5]
  if (_genres.length > 10) return weaknesses[4]
  if (_genres.some((g: string) => g.includes('indie') || g.includes('experimental'))) return weaknesses[6]
  
  return weaknesses[Math.floor(Math.random() * weaknesses.length)]
}

/**
 * Generate color palette based on audio features
 */
function generateColorPalette(energy: number, valence: number, acousticness: number): AlterEgo['colorPalette'] {
  // Generate colors based on audio features
  const hue = valence * 360 // Valence determines hue
  const saturation = 50 + (energy * 40) // Energy affects saturation
  const lightness = 30 + (acousticness * 30) // Acousticness affects lightness
  
  const primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const secondary = `hsl(${(hue + 30) % 360}, ${saturation - 10}%, ${lightness + 10}%)`
  const accent = `hsl(${(hue + 180) % 360}, ${saturation + 20}%, ${lightness + 20}%)`
  const background = `hsl(${hue}, ${saturation - 30}%, ${lightness - 10}%)`
  
  return {
    primary,
    secondary,
    accent,
    background,
  }
}

/**
 * Select soundtrack recommendation from top tracks
 */
function selectSoundtrack(tracks: SpotifyTrack[], _energy: number, _valence: number): SpotifyTrack | null {
  if (!tracks.length) return null
  
  // Score tracks based on alignment with user's profile
  const scoredTracks = tracks.map(track => ({
    track,
    score: Math.random(), // In production, use actual audio features
  }))
  
  scoredTracks.sort((a, b) => b.score - a.score)
  
  return scoredTracks[0].track
}

/**
 * Main alter ego generation function
 */
export function generateAlterEgo(input: AlterEgoInput): AlterEgo {
  const { artists, tracks, energy, danceability: _danceability, valence, acousticness } = input
  
  // Extract all genres
  const genres = artists.flatMap(artist => artist.genres)
  
  // Generate components
  const name = generateAlterEgoName(genres, energy, valence)
  const archetype = determineArchetype(genres, energy, valence)
  const description = generateDescription(archetype, genres, energy)
  const strength = generateStrength(genres, energy, valence)
  const weakness = generateWeakness(genres, energy, valence)
  const colorPalette = generateColorPalette(energy, valence, acousticness)
  const soundtrack = selectSoundtrack(tracks, energy, valence)
  
  return {
    name,
    description,
    strength,
    weakness,
    colorPalette,
    soundtrack,
    archetype,
  }
}

/**
 * Quick alter ego generation from personality data
 */
export function quickAlterEgo(
  artists: SpotifyArtist[],
  tracks: SpotifyTrack[],
  energy: number,
  _danceability: number,
  valence: number,
  acousticness: number
): AlterEgo {
  return generateAlterEgo({
    artists,
    tracks,
    energy,
    danceability: _danceability,
    valence,
    acousticness,
  })
}
