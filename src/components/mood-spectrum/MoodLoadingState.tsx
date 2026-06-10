'use client'

import { motion } from 'framer-motion'

interface MoodLoadingStateProps {
  className?: string
}

export function MoodLoadingState({ className = '' }: MoodLoadingStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <motion.div
          className="flex justify-center gap-2"
          initial="hidden"
          animate="visible"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-green-500"
              variants={{
                hidden: { opacity: 0, y: 0 },
                visible: {
                  opacity: [0.3, 1, 0.3],
                  y: [0, -10, 0],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  },
                },
              }}
            />
          ))}
        </motion.div>
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Analyzing mood spectrum...
        </motion.p>
      </div>
    </div>
  )
}
