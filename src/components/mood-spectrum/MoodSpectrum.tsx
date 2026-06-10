'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoodRadarChart } from './MoodRadarChart'
import { MoodLoadingState } from './MoodLoadingState'
import { AnimatedCounter } from '@/components/genre-dna/AnimatedCounter'
import { analyzeMoodSpectrum, getIntensityColor, getMetricIcon } from '@/lib/moodSpectrum'
import type { MoodMetrics } from '@/lib/moodSpectrum'

interface MoodSpectrumProps {
  metrics: MoodMetrics
  className?: string
}

function MetricCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string
  value: number
  icon: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-4"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <AnimatedCounter
            value={value * 100}
            decimals={0}
            suffix="%"
            className="text-xl font-bold text-white"
          />
        </div>
      </div>
    </motion.div>
  )
}

function TraitBadge({ trait, index }: { trait: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
      className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 text-sm text-gray-200"
    >
      {trait}
    </motion.span>
  )
}

export function MoodSpectrum({ metrics, className = '' }: MoodSpectrumProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState(() => analyzeMoodSpectrum(metrics))

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [metrics])

  useEffect(() => {
    setAnalysis(analyzeMoodSpectrum(metrics))
  }, [metrics])

  if (isLoading) {
    return (
      <div className={`min-h-[400px] ${className}`}>
        <MoodLoadingState />
      </div>
    )
  }

  const { interpretation, radarData } = analysis
  const intensityColor = getIntensityColor(interpretation.intensity)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2">Mood Spectrum</h2>
        <p className="text-gray-400">
          Understanding the emotional landscape of your music
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 p-8"
        >
          <div className="aspect-square max-w-[350px] mx-auto">
            <MoodRadarChart data={radarData} color={intensityColor} />
          </div>
        </motion.div>

        {/* Interpretation Section */}
        <div className="space-y-4">
          {/* Primary Mood Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{ background: intensityColor, filter: 'blur(60px)' }}
            />
            
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Primary Mood
            </p>
            
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: intensityColor }}
            >
              {interpretation.primaryMood}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {interpretation.description}
            </p>
          </motion.div>

          {/* Secondary Mood & Intensity */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-4"
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Secondary
              </p>
              <p className="text-white text-lg font-semibold">
                {interpretation.secondaryMood}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-4"
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Intensity
              </p>
              <p
                className="text-lg font-semibold"
                style={{ color: intensityColor }}
              >
                {interpretation.intensity}
              </p>
            </motion.div>
          </div>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-4"
          >
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Personality Traits
            </p>
            <div className="flex flex-wrap gap-2">
              {interpretation.traits.map((trait, index) => (
                <TraitBadge key={trait} trait={trait} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Individual Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <MetricCard
          label="Energy"
          value={metrics.energy}
          icon={getMetricIcon('Energy')}
          delay={0.8}
        />
        <MetricCard
          label="Danceability"
          value={metrics.danceability}
          icon={getMetricIcon('Danceability')}
          delay={0.85}
        />
        <MetricCard
          label="Valence"
          value={metrics.valence}
          icon={getMetricIcon('Valence')}
          delay={0.9}
        />
        <MetricCard
          label="Acousticness"
          value={metrics.acousticness}
          icon={getMetricIcon('Acousticness')}
          delay={0.95}
        />
      </motion.div>
    </div>
  )
}
