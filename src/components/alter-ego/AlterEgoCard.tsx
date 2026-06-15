'use client'

import { motion } from 'framer-motion'
import type { AlterEgo } from '@/lib/alterEgoGenerator'

interface AlterEgoCardProps {
  alterEgo: AlterEgo
  className?: string
}

function ColorSwatch({ color, label, delay }: { color: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </motion.div>
  )
}

export function AlterEgoCard({ alterEgo, className = '' }: AlterEgoCardProps) {
  const { name, description, strength, weakness, colorPalette, soundtrack, archetype } = alterEgo

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-2">Your Music Alter Ego</h2>
        <p className="text-muted-foreground">Based on your unique listening patterns</p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: `linear-gradient(135deg, ${colorPalette.background} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-3xl"
          style={{ backgroundColor: colorPalette.accent }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 opacity-20 blur-3xl"
          style={{ backgroundColor: colorPalette.primary }}
        />

        <div className="relative">
          {/* Alter Ego Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-6"
          >
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: colorPalette.accent }}>
              {archetype}
            </p>
            <h3 className="text-5xl font-bold text-foreground mb-4">{name}</h3>
            <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Strength & Weakness */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💪</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1">
                    Strength
                  </p>
                  <p className="text-foreground font-medium">{strength}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-1">
                    Weakness
                  </p>
                  <p className="text-foreground font-medium">{weakness}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Color Palette */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-4 text-center">
              Color Palette
            </p>
            <div className="flex justify-center gap-6">
              <ColorSwatch color={colorPalette.primary} label="Primary" delay={0.6} />
              <ColorSwatch color={colorPalette.secondary} label="Secondary" delay={0.65} />
              <ColorSwatch color={colorPalette.accent} label="Accent" delay={0.7} />
              <ColorSwatch color={colorPalette.background} label="Background" delay={0.75} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Soundtrack Recommendation */}
      {soundtrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-border p-6"
        >
          <div className="flex items-center gap-4">
            {soundtrack.album?.images[0] && (
              <img
                src={soundtrack.album.images[0].url}
                alt={soundtrack.album.name}
                className="w-16 h-16 rounded-lg object-cover shadow-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Theme Song
              </p>
              <p className="text-foreground font-semibold truncate">{soundtrack.name}</p>
              <p className="text-muted-foreground text-sm truncate">
                {soundtrack.artists.map(a => a.name).join(', ')}
              </p>
            </div>
            <a
              href={soundtrack.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-foreground font-semibold rounded-lg transition-colors"
            >
              Listen
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
