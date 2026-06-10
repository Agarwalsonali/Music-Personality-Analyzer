'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import type { GenreSegment } from '@/lib/genreDNA'

interface GenreDonutChartProps {
  data: GenreSegment[]
  className?: string
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white font-medium text-sm">{payload[0].name}</p>
        <p className="text-gray-300 text-xs">{payload[0].value.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export function GenreDonutChart({ data, className = '' }: GenreDonutChartProps) {
  const chartData = data.map(item => ({
    name: item.genre,
    value: item.percentage,
    color: item.color,
  }))

  return (
    <div className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Genre
          </p>
          <p className="text-white text-lg font-bold">DNA</p>
        </motion.div>
      </div>
    </div>
  )
}
