'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/genre-dna/AnimatedCounter'
import { getTimePeriodInfo } from '@/lib/timeMachine'
import type { TimeMachineData } from '@/lib/timeMachine'

interface TimeMachineProps {
  data: TimeMachineData
  className?: string
}

function TimeSlotCard({
  period,
  data,
  delay,
}: {
  period: 'morning' | 'afternoon' | 'night'
  data: TimeMachineData[keyof TimeMachineData]
  delay: number
}) {
  const periodInfo = getTimePeriodInfo(period)

  const periodColors = {
    morning: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
    afternoon: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    night: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  }

  const accentColors = {
    morning: 'text-orange-400',
    afternoon: 'text-blue-400',
    night: 'text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: period === 'morning' ? -50 : period === 'afternoon' ? 0 : 50, y: 50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative"
    >
      {/* Timeline connector */}
      {period !== 'night' && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ delay: delay + 0.3, duration: 0.5 }}
          className="absolute left-1/2 top-full w-0.5 bg-gradient-to-b from-border to-muted-foreground/50 -translate-x-1/2"
        />
      )}

      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${periodColors[period]} backdrop-blur-sm border p-6`}>
        {/* Period header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-4xl">{periodInfo.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{periodInfo.label}</h3>
            <p className="text-muted-foreground text-sm">{periodInfo.timeRange}</p>
          </div>
        </motion.div>

        {/* Top genre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
          className="mb-4"
        >
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
            Top Genre
          </p>
          <p className={`text-xl font-bold ${accentColors[period]}`}>{data.topGenre}</p>
        </motion.div>

        {/* Energy level */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.25, duration: 0.4 }}
          className="mb-4"
        >
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
            Energy Level
          </p>
          <div className="flex items-baseline gap-1">
            <AnimatedCounter
              value={data.energy * 100}
              decimals={0}
              suffix="%"
              className="text-lg font-bold text-foreground"
            />
          </div>
        </motion.div>

        {/* Mood */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.4 }}
          className="mb-4"
        >
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
            Mood
          </p>
          <p className="text-foreground font-medium">{data.mood}</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.35, duration: 0.4 }}
        >
          <p className="text-foreground text-sm leading-relaxed">{data.description}</p>
        </motion.div>

        {/* Genre tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.4 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {data.genres.slice(0, 3).map((genre, index) => (
            <span
              key={`${genre}-${index}`}
              className="px-2 py-1 rounded-full bg-secondary/50 border border-border text-xs text-foreground"
            >
              {genre}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function TimeMachine({ data, className = '' }: TimeMachineProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-2">Listening Time Machine</h2>
        <p className="text-muted-foreground">Your musical journey throughout the day</p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-blue-500 to-purple-500 -translate-x-1/2 origin-top"
        />

        {/* Time slots */}
        <div className="relative space-y-8 py-8">
          <div className="flex items-center justify-center">
            <TimeSlotCard period="morning" data={data.morning} delay={0.4} />
          </div>

          <div className="flex items-center justify-center">
            <TimeSlotCard period="afternoon" data={data.afternoon} delay={0.6} />
          </div>

          <div className="flex items-center justify-center">
            <TimeSlotCard period="night" data={data.night} delay={0.8} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/50 to-secondary/50 backdrop-blur-sm border border-border p-6 text-center"
      >
        <p className="text-foreground leading-relaxed">
          Your music taste adapts throughout the day, from{' '}
          <span className="text-orange-400 font-semibold">{data.morning.topGenre}</span> in the morning,
          to <span className="text-blue-400 font-semibold">{data.afternoon.topGenre}</span> in the afternoon,
          and <span className="text-purple-400 font-semibold">{data.night.topGenre}</span> at night.
        </p>
      </motion.div>
    </div>
  )
}
