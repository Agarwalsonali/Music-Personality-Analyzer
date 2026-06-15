'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface MoodRadarChartProps {
  data: Array<{ metric: string; value: number; fullMark: number }>
  color?: string
  className?: string
}


export function MoodRadarChart({ data, color = '#1DB954', className = '' }: MoodRadarChartProps) {
  console.log("Mood Radar Data:", data)
  return (
    <div className={`relative h-[350px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid
            stroke="#333"
            strokeWidth={1}
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#888', fontSize: 12 }}
            tickLine={{ stroke: '#333' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#666', fontSize: 10 }}
            tickLine={{ stroke: '#333' }}
            axisLine={{ stroke: '#333' }}
          />
          <Radar
            name="Mood Profile"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.4}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>

  )
}
