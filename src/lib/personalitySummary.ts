/**
 * Personality Summary Generator
 * 
 * Generates engaging personality summaries from:
 * - Archetype
 * - Genres
 * - Mood spectrum
 * - Alter ego
 * 
 * Output: 2-3 engaging, human-sounding, shareable, positive paragraphs
 */

import type { AlterEgo } from './alterEgoGenerator'
import type { GenreDNAAnalysis } from './genreDNA'
import type { MoodSpectrumData } from './moodSpectrum'

export interface PersonalitySummaryInput {
  alterEgo: AlterEgo
  genreDNA: GenreDNAAnalysis
  moodSpectrum: MoodSpectrumData
}

export interface PersonalitySummary {
  paragraphs: string[]
  shareableText: string
  highlights: string[]
}

/**
 * Generate opening paragraph that introduces the user's musical identity
 */
function generateOpeningParagraph(input: PersonalitySummaryInput): string {
  const { alterEgo, genreDNA, moodSpectrum } = input
  
  const archetype = alterEgo.archetype
  const coreGenre = genreDNA.coreGenre.genre
  const primaryMood = moodSpectrum.interpretation.primaryMood
  const intensity = moodSpectrum.interpretation.intensity
  
  const intensityAdjectives: Record<string, string> = {
    'Low': 'gentle',
    'Medium': 'balanced',
    'High': 'vibrant',
  }
  
  const adjective = intensityAdjectives[intensity]
  
  const openings: string[] = [
    `As a ${archetype.toLowerCase()}, your musical identity is beautifully ${adjective}. Your love for ${coreGenre} music creates a foundation that's both authentic and expressive. The ${primaryMood.toLowerCase()} energy in your playlists reflects a personality that's deeply connected to the emotional power of sound.`,
    `Your ${archetype.toLowerCase()} nature shines through your ${coreGenre}-focused playlist. With a ${primaryMood.toLowerCase()} vibe that feels ${adjective} and intentional, you've curated a musical landscape that's uniquely yours. This isn't just background noise—it's the soundtrack to your authentic self.`,
    `Being a ${archetype.toLowerCase()} means you approach music with passion and purpose. Your ${coreGenre} preferences, combined with that ${primaryMood.toLowerCase()} atmosphere, create a listening experience that's ${adjective} and deeply personal. You don't just hear music—you feel it.`,
  ]
  
  return openings[Math.floor(Math.random() * openings.length)]
}

/**
 * Generate middle paragraph that explores the deeper personality traits
 */
function generateMiddleParagraph(input: PersonalitySummaryInput): string {
  const { alterEgo, genreDNA, moodSpectrum } = input
  
  const secondaryGenre = genreDNA.secondaryInfluence.genre
  const hiddenTrait = genreDNA.hiddenTrait.genre
  const secondaryMood = moodSpectrum.interpretation.secondaryMood
  const traits = moodSpectrum.interpretation.traits
  const strength = alterEgo.strength
  
  const traitText = traits.slice(0, 3).join(', ')
  
  const middles: string[] = [
    `What makes your taste truly special is how it balances ${secondaryGenre} influences with subtle hints of ${hiddenTrait}. This ${secondaryMood.toLowerCase()} touch reveals your ${traitText} nature. ${strength}—this quality sets you apart as someone who listens with intention and heart.`,
    `Beyond the ${secondaryGenre} beats, there's a fascinating ${hiddenTrait} undertone to your selections. This ${secondaryMood.toLowerCase()} layer showcases your ${traitText} personality. ${strength}—it's clear that you approach music as more than just entertainment, but as a form of self-expression.`,
    `Your playlist tells a story of ${traitText} character. The blend of ${secondaryGenre} energy with ${hiddenTrait} nuances creates something uniquely yours. ${strength}—this is the mark of a true music lover who understands that every track adds to their personal narrative.`,
  ]
  
  return middles[Math.floor(Math.random() * middles.length)]
}

/**
 * Generate closing paragraph that offers insight and positivity
 */
function generateClosingParagraph(input: PersonalitySummaryInput): string {
  const { alterEgo, genreDNA } = input
  
  const alterEgoName = alterEgo.name
  const coreGenre = genreDNA.coreGenre.genre
  
  const closings: string[] = [
    `In the world of music, you're your own ${alterEgoName}. Your ${coreGenre} journey is just beginning, and the best part? There's always another song to discover, another artist to love, another moment where the perfect track finds you at the perfect time. Keep listening, keep exploring—your musical story is far from over.`,
    `Embrace your identity as ${alterEgoName}. Your ${coreGenre} preferences are valid, valuable, and wonderfully you. Music has this magical way of connecting us to our truest selves, and your playlist is proof that you're on the right path. Keep trusting your ears—they know what they're doing.`,
    `Remember: you're not just a listener—you're ${alterEgoName}. Your ${coreGenre} choices reflect a thoughtful, engaged mind that understands the transformative power of music. Every skip, every repeat, every new discovery is part of your unique journey. Keep being authentically you.`,
  ]
  
  return closings[Math.floor(Math.random() * closings.length)]
}

/**
 * Generate shareable short text for social media
 */
function generateShareableText(input: PersonalitySummaryInput): string {
  const { alterEgo, genreDNA, moodSpectrum } = input
  
  const archetype = alterEgo.archetype
  const coreGenre = genreDNA.coreGenre.genre
  const primaryMood = moodSpectrum.interpretation.primaryMood
  
  return `I'm a ${archetype} with a ${coreGenre} soul and ${primaryMood.toLowerCase()} vibes. 🎵 What does your music say about you?`
}

/**
 * Generate key highlights from the personality analysis
 */
function generateHighlights(input: PersonalitySummaryInput): string[] {
  const { alterEgo, genreDNA, moodSpectrum } = input
  
  return [
    `Archetype: ${alterEgo.archetype}`,
    `Core Genre: ${genreDNA.coreGenre.genre}`,
    `Primary Mood: ${moodSpectrum.interpretation.primaryMood}`,
    `Musical Strength: ${alterEgo.strength}`,
    `Hidden Musical Trait: ${genreDNA.hiddenTrait.genre}`,
  ]
}

/**
 * Main personality summary generation function
 */
export function generatePersonalitySummary(input: PersonalitySummaryInput): PersonalitySummary {
  const opening = generateOpeningParagraph(input)
  const middle = generateMiddleParagraph(input)
  const closing = generateClosingParagraph(input)
  
  const paragraphs = [opening, middle, closing]
  const shareableText = generateShareableText(input)
  const highlights = generateHighlights(input)
  
  return {
    paragraphs,
    shareableText,
    highlights,
  }
}

/**
 * Quick personality summary from raw data
 */
export function quickPersonalitySummary(
  alterEgo: AlterEgo,
  genreDNA: GenreDNAAnalysis,
  moodSpectrum: MoodSpectrumData
): PersonalitySummary {
  return generatePersonalitySummary({
    alterEgo,
    genreDNA,
    moodSpectrum,
  })
}
