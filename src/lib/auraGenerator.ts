/**
 * Music Aura Generator
 * 
 * Generates aura colors from listening behavior based on audio features and genres
 */

export interface AuraColors {
  primary: string
  secondary: string
  gradient: string
}

export interface Aura {
  colors: AuraColors
  name: string
  description: string
  traits: string[]
  intensity: 'Subtle' | 'Moderate' | 'Vibrant' | 'Intense'
}

export interface AuraInput {
  genres: string[]
  energy: number
  valence: number
  danceability: number
  acousticness: number
}

// Color definitions with meanings
const COLOR_DEFINITIONS = {
  purple: {
    hex: '#9b59b6',
    name: 'Purple',
    meaning: 'Creativity, spirituality, and mystery',
    traits: ['Imaginative', 'Intuitive', 'Artistic'],
  },
  blue: {
    hex: '#3498db',
    name: 'Blue',
    meaning: 'Calm, trust, and emotional depth',
    traits: ['Peaceful', 'Loyal', 'Reflective'],
  },
  orange: {
    hex: '#e67e22',
    name: 'Orange',
    meaning: 'Energy, enthusiasm, and warmth',
    traits: ['Energetic', 'Passionate', 'Social'],
  },
  red: {
    hex: '#e74c3c',
    name: 'Red',
    meaning: 'Power, courage, and intensity',
    traits: ['Bold', 'Confident', 'Determined'],
  },
  green: {
    hex: '#2ecc71',
    name: 'Green',
    meaning: 'Growth, harmony, and balance',
    traits: ['Balanced', 'Growth-oriented', 'Harmonious'],
  },
  gold: {
    hex: '#f1c40f',
    name: 'Gold',
    meaning: 'Success, wisdom, and achievement',
    traits: ['Ambitious', 'Wise', 'Successful'],
  },
  pink: {
    hex: '#e91e63',
    name: 'Pink',
    meaning: 'Love, compassion, and gentleness',
    traits: ['Compassionate', 'Gentle', 'Loving'],
  },
  cyan: {
    hex: '#00bcd4',
    name: 'Cyan',
    meaning: 'Clarity, freshness, and innovation',
    traits: ['Innovative', 'Clear-minded', 'Fresh'],
  },
  indigo: {
    hex: '#3f51b5',
    name: 'Indigo',
    meaning: 'Depth, wisdom, and intuition',
    traits: ['Deep', 'Wise', 'Intuitive'],
  },
  teal: {
    hex: '#009688',
    name: 'Teal',
    meaning: 'Healing, renewal, and balance',
    traits: ['Healing', 'Renewed', 'Balanced'],
  },
}

/**
 * Determine primary color based on energy and valence
 */
function determinePrimaryColor(energy: number, valence: number): keyof typeof COLOR_DEFINITIONS {
  if (energy > 0.7 && valence > 0.6) return 'orange' // High energy, positive
  if (energy > 0.7 && valence < 0.4) return 'red' // High energy, negative
  if (energy < 0.4 && valence > 0.6) return 'cyan' // Low energy, positive
  if (energy < 0.4 && valence < 0.4) return 'indigo' // Low energy, negative
  if (valence > 0.7) return 'pink' // Very positive
  if (energy > 0.5 && energy <= 0.7) return 'purple' // Medium-high energy
  if (energy >= 0.3 && energy <= 0.5) return 'green' // Medium energy
  return 'blue' // Default
}

/**
 * Determine secondary color based on genres and acousticness
 */
function determineSecondaryColor(genres: string[], acousticness: number): keyof typeof COLOR_DEFINITIONS {
  const genreLower = genres.join(' ').toLowerCase()
  
  if (acousticness > 0.6) return 'gold' // High acousticness
  if (genreLower.includes('electronic') || genreLower.includes('edm')) return 'cyan'
  if (genreLower.includes('rock') || genreLower.includes('metal')) return 'red'
  if (genreLower.includes('pop') || genreLower.includes('dance')) return 'pink'
  if (genreLower.includes('folk') || genreLower.includes('country')) return 'green'
  if (genreLower.includes('jazz') || genreLower.includes('blues')) return 'indigo'
  if (genreLower.includes('hip hop') || genreLower.includes('rap')) return 'orange'
  if (genreLower.includes('ambient') || genreLower.includes('chill')) return 'teal'
  
  return 'purple' // Default
}

/**
 * Generate gradient string from colors
 */
function generateGradient(primary: string, secondary: string): string {
  return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
}

/**
 * Determine aura intensity based on energy and danceability
 */
function determineIntensity(energy: number, danceability: number): Aura['intensity'] {
  const average = (energy + danceability) / 2
  
  if (average < 0.3) return 'Subtle'
  if (average < 0.5) return 'Moderate'
  if (average < 0.7) return 'Vibrant'
  return 'Intense'
}

/**
 * Generate aura name from colors
 */
function generateAuraName(primary: keyof typeof COLOR_DEFINITIONS, secondary: keyof typeof COLOR_DEFINITIONS): string {
  const primaryName = COLOR_DEFINITIONS[primary].name
  const secondaryName = COLOR_DEFINITIONS[secondary].name
  
  return `${primaryName} & ${secondaryName} Aura`
}

/**
 * Generate aura description
 */
function generateAuraDescription(
  primary: keyof typeof COLOR_DEFINITIONS,
  secondary: keyof typeof COLOR_DEFINITIONS,
  intensity: Aura['intensity']
): string {
  const primaryMeaning = COLOR_DEFINITIONS[primary].meaning
  const secondaryMeaning = COLOR_DEFINITIONS[secondary].meaning
  
  const intensityDescriptions = {
    Subtle: 'Your aura has a gentle, understated presence that reveals itself slowly.',
    Moderate: 'Your aura has a balanced presence that influences those around you.',
    Vibrant: 'Your aura has a strong, energetic presence that draws people in.',
    Intense: 'Your aura has a powerful, magnetic presence that leaves a lasting impression.',
  }
  
  return `Your ${primaryMeaning.toLowerCase()}, combined with ${secondaryMeaning.toLowerCase()}. ${intensityDescriptions[intensity]}`
}

/**
 * Generate aura traits from colors
 */
function generateAuraTraits(
  primary: keyof typeof COLOR_DEFINITIONS,
  secondary: keyof typeof COLOR_DEFINITIONS
): string[] {
  const primaryTraits = COLOR_DEFINITIONS[primary].traits
  const secondaryTraits = COLOR_DEFINITIONS[secondary].traits
  
  // Combine and deduplicate traits
  const allTraits = [...primaryTraits, ...secondaryTraits]
  const uniqueTraits = Array.from(new Set(allTraits))
  
  return uniqueTraits.slice(0, 5)
}

/**
 * Main aura generation function
 */
export function generateAura(input: AuraInput): Aura {
  const { genres, energy, valence, danceability, acousticness } = input
  
  // Determine colors
  const primaryColor = determinePrimaryColor(energy, valence)
  const secondaryColor = determineSecondaryColor(genres, acousticness)
  
  // Generate color objects
  const primaryHex = COLOR_DEFINITIONS[primaryColor].hex
  const secondaryHex = COLOR_DEFINITIONS[secondaryColor].hex
  
  const colors: AuraColors = {
    primary: primaryHex,
    secondary: secondaryHex,
    gradient: generateGradient(primaryHex, secondaryHex),
  }
  
  // Determine other properties
  const intensity = determineIntensity(energy, danceability)
  const name = generateAuraName(primaryColor, secondaryColor)
  const description = generateAuraDescription(primaryColor, secondaryColor, intensity)
  const traits = generateAuraTraits(primaryColor, secondaryColor)
  
  return {
    colors,
    name,
    description,
    traits,
    intensity,
  }
}

/**
 * Quick aura generation from personality data
 */
export function quickAura(
  genres: string[],
  energy: number,
  valence: number,
  danceability: number,
  acousticness: number
): Aura {
  return generateAura({
    genres,
    energy,
    valence,
    danceability,
    acousticness,
  })
}
