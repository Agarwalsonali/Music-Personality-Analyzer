'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuraCard } from './AuraCard'
import type { Aura } from '@/lib/auraGenerator'

interface AuraRevealProps {
  aura: Aura
  className?: string
}

function AuraRevealStage({ stage, onComplete }: { stage: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200)
    return () => clearTimeout(timer)
  }, [stage, onComplete])

  const stages = [
    {
      icon: '🌟',
      text: 'Reading your musical energy...',
    },
    {
      icon: '✨',
      text: 'Detecting color patterns...',
    },
    {
      icon: '🎨',
      text: 'Painting your aura...',
    },
    {
      icon: '💫',
      text: 'Almost revealed...',
    },
  ]

  const currentStage = stages[stage - 1] || stages[stages.length - 1]

  return (
    <motion.div
      key={stage}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-7xl mb-6"
      >
        {currentStage.icon}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-foreground font-semibold"
      >
        {currentStage.text}
      </motion.p>
    </motion.div>
  )
}

export function AuraReveal({ aura, className = '' }: AuraRevealProps) {
  const [stage, setStage] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (stage < 4) {
      const timer = setTimeout(() => {
        setStage(prev => prev + 1)
      }, 1200)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShowResult(true)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [stage])

  return (
    <div className={`min-h-[500px] flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card/50 to-secondary/50 backdrop-blur-sm border border-border p-12"
          >
            <AuraRevealStage stage={stage} onComplete={() => {}} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <AuraCard aura={aura} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
