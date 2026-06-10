/**
 * Mood Spectrum Analysis
 * 
 * Analyzes audio features to determine mood characteristics and personality interpretations
 */

export interface MoodMetrics {
  energy: number
  danceability: number
  valence: number
  acousticness: number
}

export interface MoodInterpretation {
  primaryMood: string
  secondaryMood: string
  description: string
  traits: string[]
  intensity: 'Low' | 'Medium' | 'High'
}

export interface MoodSpectrumData {
  metrics: MoodMetrics
  interpretation: MoodInterpretation
  radarData: Array<{ metric: string; value: number; fullMark: number }>
}

/**
 * Normalize audio features to 0-100 scale for radar chart
 */
export function normalizeMetrics(metrics: MoodMetrics): Array<{ metric: string; value: number; fullMark: number }> {
  return [
    { metric: 'Energy', value: metrics.energy * 100, fullMark: 100 },
    { metric: 'Danceability', value: metrics.danceability * 100, fullMark: 100 },
    { metric: 'Valence', value: metrics.valence * 100, fullMark: 100 },
    { metric: 'Acousticness', value: metrics.acousticness * 100, fullMark: 100 },
  ]
}

/**
 * Calculate overall intensity based on metrics
 */
export function calculateIntensity(metrics: MoodMetrics): 'Low' | 'Medium' | 'High' {
  const average = (metrics.energy + metrics.danceability + metrics.valence) / 3
  
  if (average < 0.4) return 'Low'
  if (average < 0.7) return 'Medium'
  return 'High'
}

/**
 * Determine primary mood based on audio features
 */
export function determinePrimaryMood(metrics: MoodMetrics): string {
  const { energy, valence, danceability, acousticness } = metrics
  
  // High energy + high valence = Happy/Energetic
  if (energy > 0.6 && valence > 0.6) {
    return 'Energetic & Happy'
  }
  
  // High energy + low valence = Intense/Aggressive
  if (energy > 0.6 && valence < 0.4) {
    return 'Intense & Powerful'
  }
  
  // Low energy + high valence = Chill/Relaxed
  if (energy < 0.4 && valence > 0.5) {
    return 'Chill & Relaxed'
  }
  
  // Low energy + low valence = Melancholic/Somber
  if (energy < 0.4 && valence < 0.4) {
    return 'Melancholic & Deep'
  }
  
  // High acousticness = Organic/Natural
  if (acousticness > 0.6) {
    return 'Organic & Natural'
  }
  
  // High danceability = Groovy/Rhythmic
  if (danceability > 0.7) {
    return 'Groovy & Rhythmic'
  }
  
  // Default
  return 'Balanced & Versatile'
}

/**
 * Determine secondary mood based on audio features
 */
export function determineSecondaryMood(metrics: MoodMetrics): string {
  const { energy, valence, acousticness, danceability } = metrics
  
  if (acousticness > 0.5) return 'Acoustic'
  if (danceability > 0.6) return 'Danceable'
  if (energy > 0.5) return 'Energetic'
  if (valence > 0.5) return 'Positive'
  if (valence < 0.4) return 'Reflective'
  
  return 'Atmospheric'
}

/**
 * Generate mood description based on metrics
 */
export function generateMoodDescription(_metrics: MoodMetrics, primaryMood: string): string {
  const descriptions: Record<string, string> = {
    'Energetic & Happy': 'Your music taste is characterized by high-energy tracks that boost your mood and keep you motivated. You gravitate toward upbeat sounds that match your positive outlook.',
    'Intense & Powerful': 'You prefer music with raw power and emotional intensity. Your playlist features tracks that match your passionate and driven personality.',
    'Chill & Relaxed': 'Your musical taste leans toward laid-back, soothing sounds. You appreciate music that helps you unwind and find inner peace.',
    'Melancholic & Deep': 'You\'re drawn to emotionally rich music that explores deeper feelings. Your playlist reflects your thoughtful and introspective nature.',
    'Organic & Natural': 'You prefer authentic, acoustic sounds over electronic production. Your taste favors genuine artistry and natural instrumentation.',
    'Groovy & Rhythmic': 'Music with strong beats and infectious rhythms dominates your playlist. You have a natural sense of rhythm and love to move to the music.',
    'Balanced & Versatile': 'Your musical taste is well-rounded and adaptable. You appreciate a wide range of moods and styles, making you a versatile listener.',
  }
  
  return descriptions[primaryMood] || 'Your music taste reflects a unique blend of moods and styles.'
}

/**
 * Generate personality traits based on metrics
 */
export function generateTraits(metrics: MoodMetrics): string[] {
  const traits: string[] = []
  const { energy, valence, danceability, acousticness } = metrics
  
  if (energy > 0.6) traits.push('Energetic')
  if (energy < 0.4) traits.push('Calm')
  if (valence > 0.6) traits.push('Optimistic')
  if (valence < 0.4) traits.push('Introspective')
  if (danceability > 0.6) traits.push('Rhythmic')
  if (acousticness > 0.5) traits.push('Authentic')
  if (acousticness < 0.3) traits.push('Modern')
  
  // Ensure at least 3 traits
  while (traits.length < 3) {
    if (!traits.includes('Open-minded')) traits.push('Open-minded')
    else if (!traits.includes('Curious')) traits.push('Curious')
    else traits.push('Versatile')
  }
  
  return traits.slice(0, 5)
}

/**
 * Complete mood spectrum analysis
 */
export function analyzeMoodSpectrum(metrics: MoodMetrics): MoodSpectrumData {
  const primaryMood = determinePrimaryMood(metrics)
  const secondaryMood = determineSecondaryMood(metrics)
  const intensity = calculateIntensity(metrics)
  const description = generateMoodDescription(metrics, primaryMood)
  const traits = generateTraits(metrics)
  
  return {
    metrics,
    interpretation: {
      primaryMood,
      secondaryMood,
      description,
      traits,
      intensity,
    },
    radarData: normalizeMetrics(metrics),
  }
}

/**
 * Get color for intensity level
 */
export function getIntensityColor(intensity: MoodInterpretation['intensity']): string {
  switch (intensity) {
    case 'Low':
      return '#6272a4' // Blue
    case 'Medium':
      return '#bd93f9' // Purple
    case 'High':
      return '#ff79c6' // Pink
    default:
      return '#1DB954'
  }
}

/**
 * Get metric icon/emoji
 */
export function getMetricIcon(metric: string): string {
  const icons: Record<string, string> = {
    'Energy': '⚡',
    'Danceability': '💃',
    'Valence': '😊',
    'Acousticness': '🎸',
  }
  return icons[metric] || '🎵'
}
