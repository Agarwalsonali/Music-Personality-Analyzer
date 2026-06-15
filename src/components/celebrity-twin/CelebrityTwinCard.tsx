'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/genre-dna/AnimatedCounter'
import type { CelebrityMatch } from '@/lib/celebrityTwin'

interface CelebrityTwinCardProps {
  match: CelebrityMatch
  className?: string
}

function TraitBadge({ trait, index }: { trait: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
      className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-foreground text-sm font-medium"
    >
      {trait}
    </motion.span>
  )
}

function FeatureBar({
  label,
  value,
  delay,
}: {
  label: string
  value: number
  delay: number
}) {
  const percentage = Math.round(value * 100)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}

export function CelebrityTwinCard({ match, className = '' }: CelebrityTwinCardProps) {
  const { celebrity, similarity, explanation, sharedGenres, featureAlignment } = match

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-2">Your Celebrity Music Twin</h2>
        <p className="text-muted-foreground">Based on your listening patterns</p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 p-8 dark:from-purple-900/30 dark:to-pink-900/30 dark:border-purple-500/30 from-purple-500/10 to-pink-500/10 border-purple-500/20"
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
        />

        <div className="relative">
          {/* Celebrity Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-6 mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl shadow-2xl"
            >
              {celebrity.image}
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-4xl font-bold text-foreground mb-2">{celebrity.name}</h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block"
              >
                <AnimatedCounter
                  value={similarity}
                  decimals={0}
                  suffix="% Match"
                  className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border mb-8"
          >
            <p className="text-foreground text-lg leading-relaxed">{explanation}</p>
          </motion.div>

          {/* Feature Alignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border mb-8"
          >
            <h4 className="text-foreground font-semibold mb-4">Feature Alignment</h4>
            <div className="space-y-4">
              <FeatureBar label="Energy" value={featureAlignment.energy} delay={0.6} />
              <FeatureBar label="Danceability" value={featureAlignment.danceability} delay={0.65} />
              <FeatureBar label="Mood" value={featureAlignment.valence} delay={0.7} />
              <FeatureBar label="Acousticness" value={featureAlignment.acousticness} delay={0.75} />
            </div>
          </motion.div>

          {/* Shared Genres */}
          {sharedGenres.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border mb-8"
            >
              <h4 className="text-muted-foreground font-semibold mb-4">Shared Genres</h4>
              <div className="flex flex-wrap gap-2">
                {sharedGenres.map((genre, index) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.85 + index * 0.05, duration: 0.3 }}
                    className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-foreground text-sm"
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Celebrity Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <h4 className="text-muted-foreground font-semibold mb-4 text-center">Celebrity Traits</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {celebrity.traits.map((trait, index) => (
                <TraitBadge key={trait} trait={trait} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
