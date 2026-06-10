/**
 * Celebrity Music Twin Generator
 * 
 * Matches listening habits to celebrity music profiles with deterministic matching logic
 */

export interface CelebrityProfile {
  id: string
  name: string
  image: string
  genres: string[]
  audioFeatures: {
    energy: number
    danceability: number
    valence: number
    acousticness: number
  }
  description: string
  traits: string[]
}

export interface CelebrityMatch {
  celebrity: CelebrityProfile
  similarity: number
  explanation: string
  sharedGenres: string[]
  featureAlignment: {
    energy: number
    danceability: number
    valence: number
    acousticness: number
  }
}

export interface CelebrityTwinInput {
  genres: string[]
  energy: number
  danceability: number
  valence: number
  acousticness: number
}

// Celebrity music profiles
const CELEBRITY_PROFILES: CelebrityProfile[] = [
  {
    id: 'taylor-swift',
    name: 'Taylor Swift',
    image: '🎤',
    genres: ['pop', 'country pop', 'synth-pop', 'indie pop', 'folk pop'],
    audioFeatures: {
      energy: 0.6,
      danceability: 0.65,
      valence: 0.55,
      acousticness: 0.35,
    },
    description: 'Storytelling through pop with country roots and emotional depth',
    traits: ['Storyteller', 'Emotional', 'Versatile', 'Relatable', 'Authentic'],
  },
  {
    id: 'arctic-monkeys',
    name: 'Arctic Monkeys',
    image: '🎸',
    genres: ['indie rock', 'alternative rock', 'garage rock', 'post-punk'],
    audioFeatures: {
      energy: 0.75,
      danceability: 0.6,
      valence: 0.5,
      acousticness: 0.25,
    },
    description: 'Indie rock with clever lyrics and distinctive guitar riffs',
    traits: ['Indie', 'Witty', 'Cool', 'Alternative', 'Rock'],
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    image: '🖤',
    genres: ['pop', 'electropop', 'alternative pop', 'dark pop', 'indie pop'],
    audioFeatures: {
      energy: 0.45,
      danceability: 0.55,
      valence: 0.35,
      acousticness: 0.4,
    },
    description: 'Dark pop with minimalist production and haunting vocals',
    traits: ['Dark', 'Minimalist', 'Unique', 'Edgy', 'Mysterious'],
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    image: '🌙',
    genres: ['r&b', 'contemporary r&b', 'pop', 'synth-pop', 'alternative r&b'],
    audioFeatures: {
      energy: 0.55,
      danceability: 0.65,
      valence: 0.4,
      acousticness: 0.3,
    },
    description: 'R&B with dark themes and atmospheric production',
    traits: ['Atmospheric', 'Dark', 'Smooth', 'R&B', 'Mysterious'],
  },
  {
    id: 'dua-lipa',
    name: 'Dua Lipa',
    image: '💃',
    genres: ['pop', 'dance pop', 'disco', 'house', 'electropop'],
    audioFeatures: {
      energy: 0.8,
      danceability: 0.75,
      valence: 0.65,
      acousticness: 0.2,
    },
    description: 'Dance-pop with disco influences and empowering anthems',
    traits: ['Dance', 'Empowering', 'Pop', 'Energetic', 'Confident'],
  },
  {
    id: 'harry-styles',
    name: 'Harry Styles',
    image: '🎵',
    genres: ['pop', 'rock', 'soft rock', 'indie pop', 'folk pop'],
    audioFeatures: {
      energy: 0.6,
      danceability: 0.6,
      valence: 0.6,
      acousticness: 0.4,
    },
    description: 'Pop with rock influences and charismatic performances',
    traits: ['Charismatic', 'Versatile', 'Pop', 'Rock', 'Charming'],
  },
  {
    id: 'drake',
    name: 'Drake',
    image: '🔥',
    genres: ['hip hop', 'trap', 'r&b', 'pop rap', 'canadian hip hop'],
    audioFeatures: {
      energy: 0.55,
      danceability: 0.7,
      valence: 0.45,
      acousticness: 0.25,
    },
    description: 'Hip hop with R&B influences and emotional lyrics',
    traits: ['Versatile', 'Emotional', 'Hip Hop', 'R&B', 'Successful'],
  },
  {
    id: 'lana-del-rey',
    name: 'Lana Del Rey',
    image: '🌹',
    genres: ['indie pop', 'dream pop', 'baroque pop', 'alternative pop', 'pop'],
    audioFeatures: {
      energy: 0.4,
      danceability: 0.45,
      valence: 0.35,
      acousticness: 0.5,
    },
    description: 'Dreamy pop with cinematic aesthetics and melancholic themes',
    traits: ['Dreamy', 'Cinematic', 'Melancholic', 'Atmospheric', 'Romantic'],
  },
  {
    id: 'ed-sheeran',
    name: 'Ed Sheeran',
    image: '🎸',
    genres: ['pop', 'folk pop', 'singer-songwriter', 'acoustic pop', 'soft rock'],
    audioFeatures: {
      energy: 0.5,
      danceability: 0.55,
      valence: 0.55,
      acousticness: 0.55,
    },
    description: 'Acoustic pop with heartfelt lyrics and catchy melodies',
    traits: ['Acoustic', 'Heartfelt', 'Pop', 'Singer-songwriter', 'Relatable'],
  },
  {
    id: 'bad-bunny',
    name: 'Bad Bunny',
    image: '🐰',
    genres: ['latin trap', 'reggaeton', 'latin pop', 'trap', 'latin'],
    audioFeatures: {
      energy: 0.75,
      danceability: 0.8,
      valence: 0.6,
      acousticness: 0.2,
    },
    description: 'Latin trap and reggaeton with infectious rhythms',
    traits: ['Latin', 'Energetic', 'Dance', 'Trap', 'Global'],
  },
]

/**
 * Calculate genre overlap between user and celebrity
 */
function calculateGenreOverlap(userGenres: string[], celebrityGenres: string[]): {
  shared: string[]
  overlapScore: number
} {
  const userGenreSet = new Set(userGenres.map(g => g.toLowerCase()))
  const celebrityGenreSet = new Set(celebrityGenres.map(g => g.toLowerCase()))
  
  const shared = [...userGenreSet].filter(genre => celebrityGenreSet.has(genre))
  
  const overlapScore = shared.length / Math.max(userGenreSet.size, celebrityGenreSet.size)
  
  return { shared, overlapScore }
}

/**
 * Calculate audio feature alignment
 */
function calculateFeatureAlignment(
  userFeatures: CelebrityTwinInput,
  celebrityFeatures: CelebrityProfile['audioFeatures']
): CelebrityMatch['featureAlignment'] {
  const alignment = {
    energy: 1 - Math.abs(userFeatures.energy - celebrityFeatures.energy),
    danceability: 1 - Math.abs(userFeatures.danceability - celebrityFeatures.danceability),
    valence: 1 - Math.abs(userFeatures.valence - celebrityFeatures.valence),
    acousticness: 1 - Math.abs(userFeatures.acousticness - celebrityFeatures.acousticness),
  }
  
  return alignment
}

/**
 * Calculate overall similarity score
 */
function calculateSimilarity(
  genreOverlap: number,
  featureAlignment: CelebrityMatch['featureAlignment']
): number {
  // Weight: 40% genre overlap, 60% feature alignment
  const featureScore = Object.values(featureAlignment).reduce((sum, val) => sum + val, 0) / 4
  
  const similarity = (genreOverlap * 0.4) + (featureScore * 0.6)
  
  return Math.round(similarity * 100)
}

/**
 * Generate explanation for the match
 */
function generateExplanation(
  celebrity: CelebrityProfile,
  similarity: number,
  sharedGenres: string[],
  featureAlignment: CelebrityMatch['featureAlignment']
): string {
  const genreText = sharedGenres.length > 0
    ? `You both love ${sharedGenres.slice(0, 3).join(', ')}.`
    : 'Your musical journeys are different but complementary.'
  
  const bestFeature = Object.entries(featureAlignment).sort((a, b) => b[1] - a[1])[0]
  const featureNames: Record<string, string> = {
    energy: 'energy',
    danceability: 'danceability',
    valence: 'mood',
    acousticness: 'acousticness',
  }
  
  const featureText = similarity > 70
    ? `Your ${featureNames[bestFeature[0]]} levels are remarkably similar.`
    : `You share similar ${featureNames[bestFeature[0]]} preferences.`
  
  const introText = similarity > 85
    ? `You're practically musical twins with ${celebrity.name}!`
    : similarity > 70
    ? `You have strong musical chemistry with ${celebrity.name}.`
    : similarity > 50
    ? `You share some musical DNA with ${celebrity.name}.`
    : `Your music taste has hints of ${celebrity.name}.`
  
  return `${introText} ${genreText} ${featureText} ${celebrity.description}`
}

/**
 * Find best celebrity match
 */
export function findCelebrityTwin(input: CelebrityTwinInput): CelebrityMatch {
  const matches = CELEBRITY_PROFILES.map(celebrity => {
    const { shared, overlapScore } = calculateGenreOverlap(input.genres, celebrity.genres)
    const featureAlignment = calculateFeatureAlignment(input, celebrity.audioFeatures)
    const similarity = calculateSimilarity(overlapScore, featureAlignment)
    const explanation = generateExplanation(celebrity, similarity, shared, featureAlignment)
    
    return {
      celebrity,
      similarity,
      explanation,
      sharedGenres: shared,
      featureAlignment,
    }
  })
  
  // Sort by similarity and return best match
  matches.sort((a, b) => b.similarity - a.similarity)
  
  return matches[0]
}

/**
 * Quick celebrity twin match from personality data
 */
export function quickCelebrityTwin(
  genres: string[],
  energy: number,
  danceability: number,
  valence: number,
  acousticness: number
): CelebrityMatch {
  return findCelebrityTwin({
    genres,
    energy,
    danceability,
    valence,
    acousticness,
  })
}

/**
 * Get all available celebrity profiles
 */
export function getAllCelebrityProfiles(): CelebrityProfile[] {
  return CELEBRITY_PROFILES
}
