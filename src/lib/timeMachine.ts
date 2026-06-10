/**
 * Listening Time Machine
 * 
 * Analyzes listening patterns to determine preferred genres by time of day
 */

export interface TimeOfDay {
  period: 'morning' | 'afternoon' | 'night'
  label: string
  icon: string
  timeRange: string
}

export interface TimeSlot {
  period: TimeOfDay['period']
  genres: string[]
  topGenre: string
  energy: number
  mood: string
  description: string
}

export interface TimeMachineData {
  morning: TimeSlot
  afternoon: TimeSlot
  night: TimeSlot
}

export interface TimeMachineInput {
  genres: string[]
  energy: number
  danceability: number
  valence: number
  acousticness: number
}

// Time period definitions
const TIME_PERIODS: TimeOfDay[] = [
  {
    period: 'morning',
    label: 'Morning',
    icon: '🌅',
    timeRange: '6 AM - 12 PM',
  },
  {
    period: 'afternoon',
    label: 'Afternoon',
    icon: '☀️',
    timeRange: '12 PM - 6 PM',
  },
  {
    period: 'night',
    label: 'Night',
    icon: '🌙',
    timeRange: '6 PM - 6 AM',
  },
]

/**
 * Determine preferred genres for morning based on audio features
 */
function determineMorningGenres(genres: string[], energy: number, acousticness: number): {
  genres: string[]
  topGenre: string
} {
  // Morning typically favors moderate energy, acoustic, uplifting music
  const morningGenres = genres.filter(g => {
    const lower = g.toLowerCase()
    return (
      lower.includes('pop') ||
      lower.includes('folk') ||
      lower.includes('acoustic') ||
      lower.includes('indie') ||
      lower.includes('soft rock') ||
      lower.includes('singer-songwriter') ||
      lower.includes('chill')
    )
  })

  const topGenre = morningGenres.length > 0
    ? morningGenres[0]
    : energy > 0.5
    ? 'Pop'
    : acousticness > 0.5
    ? 'Acoustic'
    : 'Indie'

  return {
    genres: morningGenres.length > 0 ? morningGenres : ['Pop', 'Indie', 'Acoustic'],
    topGenre,
  }
}

/**
 * Determine preferred genres for afternoon based on audio features
 */
function determineAfternoonGenres(genres: string[], energy: number, danceability: number): {
  genres: string[]
  topGenre: string
} {
  // Afternoon typically favors high energy, danceable, upbeat music
  const afternoonGenres = genres.filter(g => {
    const lower = g.toLowerCase()
    return (
      lower.includes('pop') ||
      lower.includes('dance') ||
      lower.includes('electronic') ||
      lower.includes('edm') ||
      lower.includes('house') ||
      lower.includes('rock') ||
      lower.includes('hip hop') ||
      lower.includes('latin')
    )
  })

  const topGenre = afternoonGenres.length > 0
    ? afternoonGenres[0]
    : energy > 0.6
    ? 'Electronic'
    : danceability > 0.6
    ? 'Dance'
    : 'Pop'

  return {
    genres: afternoonGenres.length > 0 ? afternoonGenres : ['Pop', 'Electronic', 'Dance'],
    topGenre,
  }
}

/**
 * Determine preferred genres for night based on audio features
 */
function determineNightGenres(genres: string[], valence: number, acousticness: number): {
  genres: string[]
  topGenre: string
} {
  // Night typically favors lower energy, atmospheric, introspective music
  const nightGenres = genres.filter(g => {
    const lower = g.toLowerCase()
    return (
      lower.includes('ambient') ||
      lower.includes('chill') ||
      lower.includes('lo-fi') ||
      lower.includes('r&b') ||
      lower.includes('soul') ||
      lower.includes('jazz') ||
      lower.includes('electronic') ||
      lower.includes('indie') ||
      lower.includes('dream pop')
    )
  })

  const topGenre = nightGenres.length > 0
    ? nightGenres[0]
    : valence < 0.4
    ? 'Ambient'
    : acousticness > 0.5
    ? 'Jazz'
    : 'Chill'

  return {
    genres: nightGenres.length > 0 ? nightGenres : ['Ambient', 'Chill', 'R&B'],
    topGenre,
  }
}

/**
 * Determine mood based on valence and energy
 */
function determineMood(valence: number, energy: number): string {
  if (valence > 0.6 && energy > 0.6) return 'Energetic & Happy'
  if (valence > 0.6 && energy < 0.4) return 'Calm & Positive'
  if (valence < 0.4 && energy > 0.6) return 'Intense & Powerful'
  if (valence < 0.4 && energy < 0.4) return 'Melancholic & Deep'
  return 'Balanced'
}

/**
 * Generate description for time slot
 */
function generateTimeSlotDescription(period: TimeOfDay['period'], topGenre: string, mood: string): string {
  const descriptions: Record<TimeOfDay['period'], string> = {
    morning: `You start your day with ${topGenre}, setting a ${mood.toLowerCase()} tone for the morning hours.`,
    afternoon: `Your afternoon energy peaks with ${topGenre}, keeping you ${mood.toLowerCase()} throughout the day.`,
    night: `You wind down with ${topGenre}, embracing a ${mood.toLowerCase()} atmosphere as night falls.`,
  }

  return descriptions[period]
}

/**
 * Calculate adjusted energy for time slot
 */
function calculateTimeSlotEnergy(baseEnergy: number, period: TimeOfDay['period']): number {
  const adjustments: Record<TimeOfDay['period'], number> = {
    morning: 0.1, // Slightly higher in morning
    afternoon: 0.2, // Highest in afternoon
    night: -0.2, // Lower at night
  }

  const adjusted = baseEnergy + adjustments[period]
  return Math.max(0, Math.min(1, adjusted))
}

/**
 * Calculate adjusted valence for time slot
 */
function calculateTimeSlotValence(baseValence: number, period: TimeOfDay['period']): number {
  const adjustments: Record<TimeOfDay['period'], number> = {
    morning: 0.1, // More positive in morning
    afternoon: 0.05, // Slightly more positive in afternoon
    night: -0.1, // More neutral/melancholic at night
  }

  const adjusted = baseValence + adjustments[period]
  return Math.max(0, Math.min(1, adjusted))
}

/**
 * Main time machine analysis function
 */
export function analyzeTimeMachine(input: TimeMachineInput): TimeMachineData {
  const { genres, energy, danceability, valence, acousticness } = input

  // Morning analysis
  const morningGenres = determineMorningGenres(genres, energy, acousticness)
  const morningEnergy = calculateTimeSlotEnergy(energy, 'morning')
  const morningValence = calculateTimeSlotValence(valence, 'morning')
  const morningMood = determineMood(morningValence, morningEnergy)

  const morning: TimeSlot = {
    period: 'morning',
    genres: morningGenres.genres,
    topGenre: morningGenres.topGenre,
    energy: morningEnergy,
    mood: morningMood,
    description: generateTimeSlotDescription('morning', morningGenres.topGenre, morningMood),
  }

  // Afternoon analysis
  const afternoonGenres = determineAfternoonGenres(genres, energy, danceability)
  const afternoonEnergy = calculateTimeSlotEnergy(energy, 'afternoon')
  const afternoonValence = calculateTimeSlotValence(valence, 'afternoon')
  const afternoonMood = determineMood(afternoonValence, afternoonEnergy)

  const afternoon: TimeSlot = {
    period: 'afternoon',
    genres: afternoonGenres.genres,
    topGenre: afternoonGenres.topGenre,
    energy: afternoonEnergy,
    mood: afternoonMood,
    description: generateTimeSlotDescription('afternoon', afternoonGenres.topGenre, afternoonMood),
  }

  // Night analysis
  const nightGenres = determineNightGenres(genres, valence, acousticness)
  const nightEnergy = calculateTimeSlotEnergy(energy, 'night')
  const nightValence = calculateTimeSlotValence(valence, 'night')
  const nightMood = determineMood(nightValence, nightEnergy)

  const night: TimeSlot = {
    period: 'night',
    genres: nightGenres.genres,
    topGenre: nightGenres.topGenre,
    energy: nightEnergy,
    mood: nightMood,
    description: generateTimeSlotDescription('night', nightGenres.topGenre, nightMood),
  }

  return {
    morning,
    afternoon,
    night,
  }
}

/**
 * Quick time machine analysis from personality data
 */
export function quickTimeMachine(
  genres: string[],
  energy: number,
  danceability: number,
  valence: number,
  acousticness: number
): TimeMachineData {
  return analyzeTimeMachine({
    genres,
    energy,
    danceability,
    valence,
    acousticness,
  })
}

/**
 * Get time period info
 */
export function getTimePeriodInfo(period: TimeOfDay['period']): TimeOfDay {
  return TIME_PERIODS.find(p => p.period === period) || TIME_PERIODS[0]
}
