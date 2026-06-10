'use client'

import { motion } from 'framer-motion'
import type { Aura } from '@/lib/auraGenerator'

interface AuraCardProps {
  aura: Aura
  className?: string
}

function AuraTrait({ trait, index }: { trait: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
      className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium"
    >
      {trait}
    </motion.span>
  )
}

export function AuraCard({ aura, className = '' }: AuraCardProps) {
  const { colors, name, description, traits, intensity } = aura

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white mb-2">Your Music Aura</h2>
        <p className="text-gray-400">The energy your music radiates</p>
      </motion.div>

      {/* Main Aura Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: colors.gradient,
        }}
      >
        {/* Animated background effects */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              colors.gradient,
              `linear-gradient(225deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
              colors.gradient,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: colors.primary }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: colors.secondary }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        <div className="relative">
          {/* Aura Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-32 h-32 rounded-full mx-auto relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"
                  animate={{
                    scale: [1, 0.9, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
            
            <h3 className="text-5xl font-bold text-white mb-3">{name}</h3>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <span className="text-white font-semibold">{intensity}</span>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6"
          >
            <p className="text-white text-lg leading-relaxed text-center">
              {description}
            </p>
          </motion.div>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-4">
              Aura Traits
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {traits.map((trait, index) => (
                <AuraTrait key={trait} trait={trait} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
