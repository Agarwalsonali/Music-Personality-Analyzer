'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download, Share2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AlterEgo } from '@/lib/alterEgoGenerator'
import type { GenreDNAAnalysis } from '@/lib/genreDNA'
import type { MoodSpectrumData } from '@/lib/moodSpectrum'
import type { Aura } from '@/lib/auraGenerator'

interface PremiumPersonalityCardProps {
  userName: string
  alterEgo: AlterEgo
  genreDNA: GenreDNAAnalysis
  moodSpectrum: MoodSpectrumData
  aura: Aura
}

export function PremiumPersonalityCard({
  userName,
  alterEgo,
  genreDNA,
  moodSpectrum,
  aura,
}: PremiumPersonalityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
  if (!cardRef.current) return

  try {
    setIsDownloading(true)

    await document.fonts.ready

    const element = cardRef.current

    // Temporarily set fixed dimensions for export
    const originalStyle = element.style.cssText
    element.style.width = '1080px'
    element.style.height = '1920px'
    element.style.aspectRatio = ''

    console.log('clientHeight', element.clientHeight)
    console.log('scrollHeight', element.scrollHeight)
    console.log('offsetHeight', element.offsetHeight)

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#000000',
      width: 1080,
      height: 1920,
      windowWidth: 1080,
      windowHeight: 1920,
    })

    // Restore original style
    element.style.cssText = originalStyle

    const link = document.createElement('a')
    link.download = `music-personality-${userName}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  } catch (err) {
    console.error(err)
  } finally {
    setIsDownloading(false)
  }
}
  const handleShare = async () => {
    if (!cardRef.current) return

    try {
      await document.fonts.ready

      const element = cardRef.current

      // Temporarily set fixed dimensions for export
      const originalStyle = element.style.cssText
      element.style.width = '1080px'
      element.style.height = '1920px'
      element.style.aspectRatio = ''

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        width: 1080,
        height: 1920,
        windowWidth: 1080,
        windowHeight: 1920,
      })

      // Restore original style
      element.style.cssText = originalStyle

      const dataUrl = canvas.toDataURL('image/png', 1.0)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'music-personality.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Music Personality',
          text: `I'm a ${alterEgo.archetype}! Check out my music personality profile.`,
          files: [file],
        })
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  const moodScore = Math.round(
    ((moodSpectrum.metrics.energy + 
      moodSpectrum.metrics.danceability + 
      moodSpectrum.metrics.valence) / 3) * 100
  )

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download PNG'}
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Premium Card - Instagram Story Friendly */}
      <div
        data-export-card
        ref={cardRef}
        className="relative bg-gradient-to-br from-purple-900 via-black to-pink-900 rounded-3xl overflow-hidden shadow-2xl w-full max-w-md mx-auto"
        style={{
          aspectRatio: '9/16',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/80 text-sm font-medium tracking-widest uppercase">
                Music Personality
              </span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <h1 className="text-white text-4xl font-black tracking-tight">
              {userName}
            </h1>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Archetype */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
                Archetype
              </div>
              <div className="text-white text-xl font-bold">
                {alterEgo.archetype}
              </div>
            </div>

            {/* Mood Score */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
                Mood Score
              </div>
              <div className="text-white text-3xl font-black">
                {moodScore}
              </div>
            </div>
          </div>

          {/* Alter Ego */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30 mb-6">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
              Your Alter Ego
            </div>
            <div className="text-white text-2xl font-black mb-1">
              {alterEgo.name}
            </div>
            <div className="text-white/80 text-sm leading-relaxed">
              {alterEgo.description}
            </div>
          </div>

          {/* Genre DNA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mb-6">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Genre DNA
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Core Genre</span>
                <span className="text-white font-bold">{genreDNA.coreGenre.genre}</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${genreDNA.coreGenre.percentage}%`,
                    backgroundColor: genreDNA.coreGenre.color,
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Secondary</span>
                <span className="text-white font-bold">{genreDNA.secondaryInfluence.genre}</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${genreDNA.secondaryInfluence.percentage}%`,
                    backgroundColor: genreDNA.secondaryInfluence.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mood Spectrum */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mb-6">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Mood Spectrum
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-white/60 text-xs mb-1">Primary</div>
                <div className="text-white font-semibold text-sm">
                  {moodSpectrum.interpretation.primaryMood}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-xs mb-1">Secondary</div>
                <div className="text-white font-semibold text-sm">
                  {moodSpectrum.interpretation.secondaryMood}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-xs mb-1">Intensity</div>
                <div className="text-white font-semibold text-sm">
                  {moodSpectrum.interpretation.intensity}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-xs mb-1">Traits</div>
                <div className="text-white font-semibold text-xs">
                  {moodSpectrum.interpretation.traits.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Aura Colors */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mb-6">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
              Aura Colors
            </div>
            <div className="flex gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: aura.colors.primary }}
              />
              <div
                className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: aura.colors.secondary }}
              />
              <div
                className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg"
                style={{ background: aura.colors.gradient }}
              />
            </div>
            <div className="mt-3 text-white/80 text-sm">
              {aura.name}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-center">
            <div className="text-white/40 text-xs font-medium tracking-widest uppercase">
              Music Personality Analyzer
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
