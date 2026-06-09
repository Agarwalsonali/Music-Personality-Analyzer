'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { AuthGuard } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const mockData = {
  topGenres: [
    { name: 'Pop', value: 35 },
    { name: 'Hip-Hop', value: 25 },
    { name: 'Electronic', value: 20 },
    { name: 'Indie', value: 20 },
  ],
  audioFeatures: [
    { name: 'Energy', value: 75 },
    { name: 'Danceability', value: 65 },
    { name: 'Valence', value: 55 },
    { name: 'Acousticness', value: 30 },
  ],
  topTracks: [
    { name: 'Track 1', streams: 1000 },
    { name: 'Track 2', streams: 850 },
    { name: 'Track 3', streams: 720 },
    { name: 'Track 4', streams: 680 },
    { name: 'Track 5', streams: 600 },
  ],
}

const COLORS = ['#1DB954', '#191414', '#1ed760', '#a0ddce']

function AnalyzerContent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
    setAnalyzed(true)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-20">
        <section className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Music Personality Analysis</h1>
              <p className="text-muted-foreground text-lg">Connect your Spotify account and discover your unique music profile</p>
            </div>

            {!analyzed ? (
              <div className="glass-effect rounded-lg p-8 text-center">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🎵</div>
                  <h2 className="text-2xl font-semibold mb-2">Ready to explore your music personality?</h2>
                  <p className="text-muted-foreground">Click the button below to connect your Spotify account and start the analysis</p>
                </div>
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Connect Spotify & Analyze'}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Primary Genre', value: 'Indie Pop' },
                    { label: 'Mood', value: 'Energetic' },
                    { label: 'Top Artist', value: 'Artist Name' },
                    { label: 'Total Tracks', value: '4,523' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>{item.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{item.value}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Genre Distribution */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Genre Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={mockData.topGenres}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}%`}
                              outerRadius={80}
                              fill="#1DB954"
                              dataKey="value"
                            >
                              {mockData.topGenres.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Audio Features */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Audio Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={mockData.audioFeatures}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                            <Bar dataKey="value" fill="#1DB954" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Top Tracks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Tracks Streams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockData.topTracks}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                          <Legend />
                          <Line type="monotone" dataKey="streams" stroke="#1DB954" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    📥 Download Report
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setAnalyzed(false)}>
                    🔄 New Analysis
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>
    </>
  )
}

export default function AnalyzerPage() {
  return (
    <AuthGuard>
      <AnalyzerContent />
    </AuthGuard>
  )
}
