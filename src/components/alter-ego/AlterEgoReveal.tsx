'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlterEgoCard } from './AlterEgoCard'
import type { AlterEgo } from '@/lib/alterEgoGenerator'

interface AlterEgoRevealProps {
  alterEgo: AlterEgo
  className?: string
}

function RevealStage({ stage, onComplete }: { stage: number; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500)
    return () => clearTimeout(timer)
  }, [stage, onComplete])

  const stages = [
    {
      icon: '🎵',
      text: 'Analyzing your music...',
    },
    {
      icon: '🔮',
      text: 'Discovering patterns...',
    },
    {
      icon: '✨',
      text: 'Crafting your alter ego...',
    },
    {
      icon: '🎭',
      text: 'Almost there...',
    },
  ]

  const currentStage = stages[stage - 1] || stages[stages.length - 1]

  return (
    <motion.div
      key={stage}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-6xl mb-4"
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

export function AlterEgoReveal({ alterEgo, className = '' }: AlterEgoRevealProps) {
  const [stage, setStage] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (stage < 4) {
      const timer = setTimeout(() => {
        setStage(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShowResult(true)
      }, 500)
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
            <RevealStage stage={stage} onComplete={() => {}} />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <AlterEgoCard alterEgo={alterEgo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
