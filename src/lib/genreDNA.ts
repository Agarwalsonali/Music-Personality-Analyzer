/**
 * Genre DNA Analysis
 * 
 * Analyzes top artists' genres to calculate percentages and determine:
 * - Core Genre (dominant genre)
 * - Secondary Influence (second most influential)
 * - Hidden Trait (lesser-known but significant genre)
 */

import type { SpotifyArtist } from '@/types'

export interface GenreSegment {
  genre: string
  percentage: number
  color: string
}

export interface GenreDNAAnalysis {
  coreGenre: GenreSegment
  secondaryInfluence: GenreSegment
  hiddenTrait: GenreSegment
  allGenres: GenreSegment[]
  totalArtists: number
}

// Genre color palette (Spotify-inspired)
const GENRE_COLORS = [
  '#1DB954', // Spotify Green
  '#1ed760', // Light Green
  '#50fa7b', // Neon Green
  '#8be9fd', // Cyan
  '#bd93f9', // Purple
  '#ff79c6', // Pink
  '#ffb86c', // Orange
  '#f1fa8c', // Yellow
  '#ff5555', // Red
  '#6272a4', // Blue
  '#44475a', // Dark Blue
  '#282a36', // Dark
]

/**
 * Normalize genre names for grouping similar genres
 */
function normalizeGenreName(genre: string): string {
  const lower = genre.toLowerCase().trim()
  
  // Group similar genres
  const genreGroups: Record<string, string> = {
    'pop': 'pop',
    'dance pop': 'pop',
    'electropop': 'pop',
    'synth-pop': 'pop',
    'indie pop': 'indie pop',
    
    'rock': 'rock',
    'classic rock': 'rock',
    'alternative rock': 'rock',
    'indie rock': 'rock',
    'hard rock': 'rock',
    
    'hip hop': 'hip hop',
    'trap': 'hip hop',
    'rap': 'hip hop',
    
    'r&b': 'r&b',
    'contemporary r&b': 'r&b',
    'soul': 'r&b',
    
    'electronic': 'electronic',
    'edm': 'electronic',
    'house': 'electronic',
    'techno': 'electronic',
    'dubstep': 'electronic',
    
    'metal': 'metal',
    'heavy metal': 'metal',
    'thrash metal': 'metal',
    
    'folk': 'folk',
    'indie folk': 'folk',
    
    'jazz': 'jazz',
    
    'classical': 'classical',
    
    'country': 'country',
    
    'ambient': 'ambient',
    'chill': 'ambient',
    'lo-fi': 'ambient',
  }
  
  return genreGroups[lower] || lower
}

/**
 * Assign a color to a genre based on its name
 */
function getGenreColor(genre: string, index: number): string {
  const genreLower = genre.toLowerCase()
  
  // Specific genre colors
  if (genreLower.includes('pop')) return GENRE_COLORS[6]
  if (genreLower.includes('rock')) return GENRE_COLORS[8]
  if (genreLower.includes('hip hop') || genreLower.includes('rap')) return GENRE_COLORS[9]
  if (genreLower.includes('r&b') || genreLower.includes('soul')) return GENRE_COLORS[5]
  if (genreLower.includes('electronic') || genreLower.includes('edm')) return GENRE_COLORS[0]
  if (genreLower.includes('metal')) return GENRE_COLORS[7]
  if (genreLower.includes('folk')) return GENRE_COLORS[4]
  if (genreLower.includes('jazz')) return GENRE_COLORS[3]
  if (genreLower.includes('classical')) return GENRE_COLORS[2]
  if (genreLower.includes('country')) return GENRE_COLORS[1]
  if (genreLower.includes('ambient')) return GENRE_COLORS[10]
  
  // Default to palette rotation
  return GENRE_COLORS[index % GENRE_COLORS.length]
}

/**
 * Analyze genres from top artists
 */
export function analyzeGenreDNA(artists: SpotifyArtist[]): GenreDNAAnalysis {
  const genreCounts: Record<string, number> = {}
  const totalArtists = artists.length
  
  // Count genres (each artist can have multiple genres)
  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      const normalized = normalizeGenreName(genre)
      genreCounts[normalized] = (genreCounts[normalized] || 0) + 1
    })
  })
  
  // Calculate percentages
  const totalGenreCount = Object.values(genreCounts).reduce((sum, count) => sum + count, 0)
  
  const genreSegments: GenreSegment[] = Object.entries(genreCounts)
    .map(([genre, count], index) => ({
      genre,
      percentage: (count / totalGenreCount) * 100,
      color: getGenreColor(genre, index),
    }))
    .sort((a, b) => b.percentage - a.percentage)
  
  // Determine core genre (top genre)
  const coreGenre = genreSegments[0] || {
    genre: 'Unknown',
    percentage: 0,
    color: GENRE_COLORS[0],
  }
  
  // Determine secondary influence (second genre)
  const secondaryInfluence = genreSegments[1] || {
    genre: 'Mixed',
    percentage: 0,
    color: GENRE_COLORS[1],
  }
  
  // Determine hidden trait (third genre or interesting smaller genre)
  // Look for a genre that's significant but not in top 2
  const hiddenTrait = genreSegments.find(
    (segment, index) => 
      index >= 2 && 
      segment.percentage >= 5 && 
      segment.percentage <= 15
  ) || genreSegments[2] || {
    genre: 'Eclectic',
    percentage: 0,
    color: GENRE_COLORS[2],
  }
  
  return {
    coreGenre,
    secondaryInfluence,
    hiddenTrait,
    allGenres: genreSegments.slice(0, 8), // Top 8 genres for chart
    totalArtists,
  }
}

/**
 * Format genre name for display
 */
export function formatGenreName(genre: string): string {
  return genre
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get genre description
 */
export function getGenreDescription(genre: string): string {
  const descriptions: Record<string, string> = {
    'pop': 'Catchy melodies and mainstream appeal',
    'rock': 'Electric guitars and powerful rhythms',
    'hip hop': 'Rhythmic speech and beat-driven production',
    'r&b': 'Soulful vocals and smooth grooves',
    'electronic': 'Synthesized sounds and digital production',
    'metal': 'Heavy distortion and intense energy',
    'folk': 'Acoustic instruments and storytelling',
    'jazz': 'Improvisation and complex harmonies',
    'classical': 'Orchestral arrangements and timeless compositions',
    'country': 'Narrative songs and acoustic instrumentation',
    'ambient': 'Atmospheric soundscapes and textures',
    'indie pop': 'DIY ethos with melodic sensibilities',
    'indie rock': 'Alternative approach to rock music',
    'indie folk': 'Acoustic folk with independent spirit',
  }
  
  return descriptions[genre.toLowerCase()] || 'Unique and distinctive sound'
}
