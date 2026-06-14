/**
 * Music Personality Engine
 * 
 * Analyzes artist genres to determine listening archetypes with weighted scoring,
 * confidence metrics, and detailed trait analysis.
 */

import type { SpotifyArtist, SpotifyTrack } from '@/types'

// ============================================================================
// TYPES
// ============================================================================

export type ArchetypeId =
  | 'night_wanderer'
  | 'main_character'
  | 'explorer'
  | 'rebel'
  | 'dreamer'
  | 'firestarter'
  | 'romantic'
  | 'old_soul'

export interface Archetype {
  id: ArchetypeId
  name: string
  description: string
  traits: string[]
  genreWeights: Record<string, number>
  audioFeatureWeights: {
    energy?: number
    danceability?: number
    valence?: number
    acousticness?: number
    instrumentalness?: number
  }
}

export interface GenreScore {
  genre: string
  count: number
  weight: number
  weightedScore: number
}

export interface ArchetypeScore {
  archetype: Archetype
  score: number
  genreMatches: string[]
  featureAlignment: number
}

export interface PersonalityAnalysisResult {
  archetype: Archetype
  traits: string[]
  description: string
  confidenceScore: number
  genreBreakdown: GenreScore[]
  allScores: ArchetypeScore[]
  topGenres: string[]
  audioFeatureProfile: {
    energy: number
    danceability: number
    valence: number
    acousticness: number
    instrumentalness: number
  }
}

export interface PersonalityEngineInput {
  artists: SpotifyArtist[]
  tracks?: SpotifyTrack[]
  audioFeatures?: {
    energy: number
    danceability: number
    valence: number
    acousticness: number
    instrumentalness: number
  }
}

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  night_wanderer: {
    id: 'night_wanderer',
    name: 'The Night Wanderer',
    description: 'You find solace in the quiet hours, drawn to atmospheric and introspective music that accompanies your midnight thoughts. Your playlist is a sanctuary for the soulful and the sublime.',
    traits: [
      'Introspective',
      'Nocturnal',
      'Atmospheric',
      'Melancholic',
      'Deep thinker',
      'Solitary',
    ],
    genreWeights: {
      'ambient': 1.0,
      'chill': 0.9,
      'lo-fi': 0.9,
      'electronic': 0.7,
      'trip hop': 0.8,
      'downtempo': 0.9,
      'shoegaze': 0.8,
      'dream pop': 0.8,
      'post-rock': 0.7,
      'dark wave': 0.8,
      'synthwave': 0.7,
      'neo-psychedelic': 0.7,
      'art pop': 0.6,
      'experimental': 0.6,
    },
    audioFeatureWeights: {
      energy: 0.3,
      danceability: 0.2,
      valence: 0.4,
      acousticness: 0.6,
      instrumentalness: 0.7,
    },
  },

  main_character: {
    id: 'main_character',
    name: 'The Main Character',
    description: 'Your music is the soundtrack to your life\'s most cinematic moments. You gravitate toward anthemic, emotionally charged tracks that make every day feel like a movie scene.',
    traits: [
      'Confident',
      'Dramatic',
      'Expressive',
      'Bold',
      'Center stage',
      'Emotional',
    ],
    genreWeights: {
      'pop': 1.0,
      'dance pop': 0.9,
      'electropop': 0.9,
      'synth-pop': 0.8,
      'indie pop': 0.7,
      'contemporary r&b': 0.7,
      'hip hop': 0.6,
      'trap': 0.6,
      'latin pop': 0.7,
      'k-pop': 0.8,
      'rock': 0.5,
      'alternative rock': 0.6,
    },
    audioFeatureWeights: {
      energy: 0.8,
      danceability: 0.7,
      valence: 0.7,
      acousticness: 0.2,
      instrumentalness: 0.1,
    },
  },

  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    description: 'You\'re a musical adventurer, constantly seeking new sounds and undiscovered artists. Your curiosity drives you to explore genres from every corner of the world.',
    traits: [
      'Curious',
      'Adventurous',
      'Open-minded',
      'Eclectic',
      'Global',
      'Discovery-driven',
    ],
    genreWeights: {
      'world': 1.0,
      'electronic': 0.7,
      'experimental': 0.9,
      'ambient': 0.6,
      'folk': 0.7,
      'indie': 0.8,
      'alternative': 0.7,
      'jazz': 0.7,
      'classical': 0.6,
      'afrobeat': 0.8,
      'reggae': 0.7,
      'latin': 0.7,
      'k-pop': 0.6,
      'j-pop': 0.6,
    },
    audioFeatureWeights: {
      energy: 0.5,
      danceability: 0.5,
      valence: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5,
    },
  },

  rebel: {
    id: 'rebel',
    name: 'The Rebel',
    description: 'Your music defies convention and challenges the status quo. You\'re drawn to raw, aggressive sounds that reflect your nonconformist spirit and anti-establishment views.',
    traits: [
      'Nonconformist',
      'Edgy',
      'Defiant',
      'Raw',
      'Anti-establishment',
      'Intense',
    ],
    genreWeights: {
      'punk': 1.0,
      'hardcore': 0.9,
      'metal': 0.9,
      'heavy metal': 0.9,
      'thrash metal': 0.8,
      'grunge': 0.8,
      'alternative rock': 0.7,
      'indie rock': 0.6,
      'hip hop': 0.7,
      'trap': 0.7,
      'hard rock': 0.8,
      'industrial': 0.8,
      'noise': 0.7,
    },
    audioFeatureWeights: {
      energy: 0.9,
      danceability: 0.4,
      valence: 0.3,
      acousticness: 0.1,
      instrumentalness: 0.3,
    },
  },

  dreamer: {
    id: 'dreamer',
    name: 'The Dreamer',
    description: 'Your music exists in the space between reality and fantasy. Ethereal vocals and lush soundscapes transport you to worlds of imagination and wonder.',
    traits: [
      'Imaginative',
      'Ethereal',
      'Whimsical',
      'Romantic',
      'Fantasy-prone',
      'Soft-spoken',
    ],
    genreWeights: {
      'dream pop': 1.0,
      'shoegaze': 0.9,
      'ambient': 0.8,
      'indie pop': 0.7,
      'art pop': 0.8,
      'folk': 0.6,
      'indie folk': 0.7,
      'chamber pop': 0.7,
      'baroque pop': 0.7,
      'neo-psychedelic': 0.8,
      'psychedelic rock': 0.7,
      'post-rock': 0.6,
    },
    audioFeatureWeights: {
      energy: 0.3,
      danceability: 0.3,
      valence: 0.6,
      acousticness: 0.7,
      instrumentalness: 0.6,
    },
  },

  firestarter: {
    id: 'firestarter',
    name: 'The Firestarter',
    description: 'High energy and unstoppable drive define your musical taste. You need beats that fuel your ambition and tracks that match your intensity and passion.',
    traits: [
      'Energetic',
      'Driven',
      'Passionate',
      'Intense',
      'Motivated',
      'Powerful',
    ],
    genreWeights: {
      'edm': 1.0,
      'electro house': 0.9,
      'progressive house': 0.9,
      'dubstep': 0.8,
      'trap': 0.8,
      'hip hop': 0.7,
      'drill': 0.7,
      'hard rock': 0.7,
      'metal': 0.6,
      'dance pop': 0.8,
      'techno': 0.8,
      'trance': 0.8,
    },
    audioFeatureWeights: {
      energy: 1.0,
      danceability: 0.8,
      valence: 0.6,
      acousticness: 0.1,
      instrumentalness: 0.4,
    },
  },

  romantic: {
    id: 'romantic',
    name: 'The Romantic',
    description: 'Every song in your library tells a love story. You\'re drawn to heartfelt lyrics, sweeping melodies, and music that celebrates the beauty of human connection.',
    traits: [
      'Sentimental',
      'Passionate',
      'Loving',
      'Emotional',
      'Heart-centered',
      'Nostalgic',
    ],
    genreWeights: {
      'contemporary r&b': 1.0,
      'soul': 0.9,
      'r&b': 0.9,
      'indie pop': 0.7,
      'folk': 0.7,
      'indie folk': 0.7,
      'country': 0.6,
      'pop': 0.7,
      'ballad': 0.8,
      'soft rock': 0.6,
      'adult contemporary': 0.7,
      'love song': 0.9,
    },
    audioFeatureWeights: {
      energy: 0.4,
      danceability: 0.5,
      valence: 0.7,
      acousticness: 0.6,
      instrumentalness: 0.2,
    },
  },

  old_soul: {
    id: 'old_soul',
    name: 'The Old Soul',
    description: 'You appreciate the timeless classics and music with depth, history, and craftsmanship. Your taste transcends trends, favoring authenticity and artistic merit.',
    traits: [
      'Wise',
      'Nostalgic',
      'Appreciative',
      'Thoughtful',
      'Timeless',
      'Authentic',
    ],
    genreWeights: {
      'classic rock': 1.0,
      'rock': 0.8,
      'folk': 0.8,
      'blues': 0.9,
      'jazz': 0.9,
      'soul': 0.8,
      'country': 0.7,
      'classical': 0.8,
      'singer-songwriter': 0.8,
      'americana': 0.8,
      'roots rock': 0.7,
      'bluegrass': 0.7,
    },
    audioFeatureWeights: {
      energy: 0.5,
      danceability: 0.4,
      valence: 0.5,
      acousticness: 0.7,
      instrumentalness: 0.4,
    },
  },
}

// ============================================================================
// GENRE ANALYSIS UTILITIES
// ============================================================================

/**
 * Extract and count all genres from a list of artists
 */
export function extractGenres(artists: SpotifyArtist[]): Record<string, number> {
  const genreCounts: Record<string, number> = {}
  
  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      const normalizedGenre = normalizeGenre(genre)
      genreCounts[normalizedGenre] = (genreCounts[normalizedGenre] || 0) + 1
    })
  })
  
  return genreCounts
}

/**
 * Normalize genre names for better matching
 */
export function normalizeGenre(genre: string): string {
  return genre.toLowerCase().trim()
}

/**
 * Get top genres by frequency
 */
export function getTopGenres(
  genreCounts: Record<string, number>,
  limit: number = 10
): string[] {
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre)
}

/**
 * Calculate weighted genre scores for a specific archetype
 */
export function calculateGenreScore(
  genreCounts: Record<string, number>,
  archetype: Archetype
): GenreScore[] {
  const scores: GenreScore[] = []
  const totalArtists = Object.values(genreCounts).reduce((sum, count) => sum + count, 0)
  
  Object.entries(genreCounts).forEach(([genre, count]) => {
    const weight = archetype.genreWeights[normalizeGenre(genre)] || 0
    const frequency = count / totalArtists
    const weightedScore = weight * frequency
    
    if (weight > 0) {
      scores.push({
        genre,
        count,
        weight,
        weightedScore,
      })
    }
  })
  
  return scores.sort((a, b) => b.weightedScore - a.weightedScore)
}

// ============================================================================
// AUDIO FEATURE ANALYSIS
// ============================================================================

/**
 * Calculate audio feature alignment with archetype preferences
 */
export function calculateFeatureAlignment(
  audioFeatures: PersonalityEngineInput['audioFeatures'],
  archetype: Archetype
): number {
  if (!audioFeatures) return 0.5
  
  const weights = archetype.audioFeatureWeights
  let alignment = 0
  let weightSum = 0
  
  Object.entries(weights).forEach(([feature, weight]) => {
    if (weight > 0) {
      const featureValue = audioFeatures[feature as keyof typeof audioFeatures] || 0.5
      // Calculate how close the feature is to the preferred range
      // Higher weight means we prefer higher values for that feature
      const alignmentScore = featureValue * weight
      alignment += alignmentScore
      weightSum += weight
    }
  })
  
  return weightSum > 0 ? alignment / weightSum : 0.5
}

/**
 * Extract average audio features from tracks
 */
export function extractAudioFeatures(
  tracks: SpotifyTrack[],
  audioFeaturesMap?: Map<string, any>
): PersonalityEngineInput['audioFeatures'] {
  if (!tracks.length || !audioFeaturesMap) return undefined
  
  const features = {
    energy: 0,
    danceability: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
  }
  
  let count = 0
  
  tracks.forEach(track => {
    const trackFeatures = audioFeaturesMap.get(track.id)
    if (trackFeatures) {
      features.energy += trackFeatures.energy || 0
      features.danceability += trackFeatures.danceability || 0
      features.valence += trackFeatures.valence || 0
      features.acousticness += trackFeatures.acousticness || 0
      features.instrumentalness += trackFeatures.instrumentalness || 0
      count++
    }
  })
  
  if (count === 0) return undefined
  
  return {
    energy: features.energy / count,
    danceability: features.danceability / count,
    valence: features.valence / count,
    acousticness: features.acousticness / count,
    instrumentalness: features.instrumentalness / count,
  }
}

// ============================================================================
// ARCHETYPE SCORING
// ============================================================================

/**
 * Calculate overall score for an archetype based on genre and feature alignment
 */
export function calculateArchetypeScore(
  genreCounts: Record<string, number>,
  audioFeatures: PersonalityEngineInput['audioFeatures'],
  archetype: Archetype
): ArchetypeScore {
  const genreScores = calculateGenreScore(genreCounts, archetype)
  const genreScore = genreScores.reduce((sum, score) => sum + score.weightedScore, 0)
  
  const featureAlignment = calculateFeatureAlignment(audioFeatures, archetype)
  
  // Combine genre score (70%) and feature alignment (30%)
  const totalScore = (genreScore * 0.7) + (featureAlignment * 0.3)
  
  const genreMatches = genreScores
    .filter(score => score.weight > 0)
    .map(score => score.genre)
  
  return {
    archetype,
    score: totalScore,
    genreMatches,
    featureAlignment,
  }
}

/**
 * Calculate scores for all archetypes
 */
export function calculateAllArchetypeScores(
  genreCounts: Record<string, number>,
  audioFeatures: PersonalityEngineInput['audioFeatures']
): ArchetypeScore[] {
  return Object.values(ARCHETYPES).map(archetype =>
    calculateArchetypeScore(genreCounts, audioFeatures, archetype)
  ).sort((a, b) => b.score - a.score)
}

// ============================================================================
// CONFIDENCE CALCULATION
// ============================================================================

/**
 * Calculate confidence score for archetype assignment
 */
export function calculateConfidence(
  topScore: ArchetypeScore,
  allScores: ArchetypeScore[]
): number {
  if (allScores.length === 0) return 0
  
  const secondScore = allScores[1]?.score || 0
  const scoreGap = topScore.score - secondScore
  
  // Confidence based on:
  // 1. Gap between top and second score (60%)
  // 2. Absolute top score (20%)
  // 3. Number of matching genres (20%)
  
  const gapConfidence = Math.min(scoreGap * 2, 1) // Normalize to 0-1
  const scoreConfidence = Math.min(topScore.score * 2, 1)
  const genreConfidence = Math.min(topScore.genreMatches.length / 5, 1)
  
  const confidence = (gapConfidence * 0.6) + (scoreConfidence * 0.2) + (genreConfidence * 0.2)
  
  return Math.round(confidence * 100) / 100 // Round to 2 decimal places
}

// ============================================================================
// MAIN PERSONALITY ENGINE
// ============================================================================

/**
 * Analyze music data and determine personality archetype
 */
export function analyzePersonality(
  input: PersonalityEngineInput
): PersonalityAnalysisResult {
  const { artists, audioFeatures } = input
  
  // Extract and analyze genres
  const genreCounts = extractGenres(artists)
  const topGenres = getTopGenres(genreCounts, 10)
  
  // Calculate scores for all archetypes
  const allScores = calculateAllArchetypeScores(genreCounts, audioFeatures)
  
  // Get top archetype
  const topScore = allScores[0]
  if (!topScore) {
    throw new Error('Unable to determine archetype')
  }
  
  const archetype = topScore.archetype
  
  // Calculate confidence
  const confidenceScore = calculateConfidence(topScore, allScores)
  
  // Generate genre breakdown
  const genreBreakdown = calculateGenreScore(genreCounts, archetype)
  
  // Get audio feature profile
  const audioFeatureProfile = audioFeatures || {
    energy: 0.5,
    danceability: 0.5,
    valence: 0.5,
    acousticness: 0.5,
    instrumentalness: 0.5,
  }
  
  return {
    archetype,
    traits: archetype.traits,
    description: archetype.description,
    confidenceScore,
    genreBreakdown,
    allScores,
    topGenres,
    audioFeatureProfile,
  }
}

/**
 * Quick personality analysis from artists only
 */
export function quickPersonalityAnalysis(
  artists: SpotifyArtist[]
): PersonalityAnalysisResult {
  return analyzePersonality({ artists })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get archetype by ID
 */
export function getArchetypeById(id: ArchetypeId): Archetype | undefined {
  return ARCHETYPES[id]
}

/**
 * Get all available archetypes
 */
export function getAllArchetypes(): Archetype[] {
  return Object.values(ARCHETYPES)
}

/**
 * Check if a genre matches any archetype
 */
export function findMatchingArchetypes(genre: string): Archetype[] {
  const normalized = normalizeGenre(genre)
  return Object.values(ARCHETYPES).filter(archetype =>
    archetype.genreWeights[normalized] > 0
  )
}

/**
 * Get genre affinity for all archetypes
 */
export function getGenreAffinity(genre: string): Record<ArchetypeId, number> {
  const normalized = normalizeGenre(genre)
  const affinity: Record<ArchetypeId, number> = {} as any
  
  Object.entries(ARCHETYPES).forEach(([id, archetype]) => {
    affinity[id as ArchetypeId] = archetype.genreWeights[normalized] || 0
  })
  
  return affinity
}
