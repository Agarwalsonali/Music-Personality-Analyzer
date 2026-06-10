'use client'

import { motion } from 'framer-motion'
import { GenreDonutChart } from './GenreDonutChart'
import { AnimatedCounter } from './AnimatedCounter'
import { analyzeGenreDNA, formatGenreName, getGenreDescription } from '@/lib/genreDNA'
import type { SpotifyArtist } from '@/types'
import type { GenreDNAAnalysis } from '@/lib/genreDNA'

interface GenreDNAProps {
  artists: SpotifyArtist[]
  className?: string
}

function GenreCard({
  title,
  genre,
  percentage,
  color,
  description,
  delay,
}: {
  title: string
  genre: string
  percentage: number
  color: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{ background: color, filter: 'blur(60px)' }}
      />
      
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </p>
      
      <h3
        className="text-2xl font-bold mb-1"
        style={{ color }}
      >
        {formatGenreName(genre)}
      </h3>
      
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      
      <div className="flex items-baseline gap-1">
        <AnimatedCounter
          value={percentage}
          decimals={1}
          className="text-3xl font-bold"
          style={{ color }}
        />
      </div>
    </motion.div>
  )
}

function GenreLegendItem({
  genre,
  percentage,
  color,
  index,
}: {
  genre: string
  percentage: number
  color: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
      className="flex items-center gap-3 py-2"
    >
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {formatGenreName(genre)}
        </p>
      </div>
      <AnimatedCounter
        value={percentage}
        decimals={1}
        className="text-gray-400 text-sm font-medium"
      />
    </motion.div>
  )
}

export function GenreDNA({ artists, className = '' }: GenreDNAProps) {
  const analysis: GenreDNAAnalysis = analyzeGenreDNA(artists)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2">Genre DNA</h2>
        <p className="text-gray-400">
          Based on your top {analysis.totalArtists} artists
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 p-8"
        >
          <div className="aspect-square max-w-[300px] mx-auto">
            <GenreDonutChart data={analysis.allGenres} />
          </div>
        </motion.div>

        {/* Genre Cards */}
        <div className="space-y-4">
          <GenreCard
            title="Core Genre"
            genre={analysis.coreGenre.genre}
            percentage={analysis.coreGenre.percentage}
            color={analysis.coreGenre.color}
            description={getGenreDescription(analysis.coreGenre.genre)}
            delay={0.3}
          />
          
          <GenreCard
            title="Secondary Influence"
            genre={analysis.secondaryInfluence.genre}
            percentage={analysis.secondaryInfluence.percentage}
            color={analysis.secondaryInfluence.color}
            description={getGenreDescription(analysis.secondaryInfluence.genre)}
            delay={0.4}
          />
          
          <GenreCard
            title="Hidden Trait"
            genre={analysis.hiddenTrait.genre}
            percentage={analysis.hiddenTrait.percentage}
            color={analysis.hiddenTrait.color}
            description={getGenreDescription(analysis.hiddenTrait.genre)}
            delay={0.5}
          />
        </div>
      </div>

      {/* Genre Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 p-6"
      >
        <h3 className="text-white font-semibold mb-4">Full Genre Breakdown</h3>
        <div className="space-y-1">
          {analysis.allGenres.map((segment, index) => (
            <GenreLegendItem
              key={segment.genre}
              genre={segment.genre}
              percentage={segment.percentage}
              color={segment.color}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
