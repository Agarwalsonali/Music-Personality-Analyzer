'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { AuthGuard } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useMusicAnalysis } from '@/hooks/useMusicAnalysis'
import { GenreDNA } from '@/components/genre-dna'
import { MoodSpectrum } from '@/components/mood-spectrum'
import { AlterEgoReveal } from '@/components/alter-ego'
import { AuraReveal } from '@/components/music-aura'
import { quickAlterEgo } from '@/lib/alterEgoGenerator'
import { quickAura } from '@/lib/auraGenerator'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#1DB954', '#191414', '#1ed760', '#a0ddce']

function AnalyzerContent() {
  const { user } = useAuth()
  const { loading, error, personality, analyzeMusicPersonality } = useMusicAnalysis()

  const alterEgo = personality
    ? quickAlterEgo(
        personality.topArtists,
        personality.topTracks,
        personality.energy,
        personality.danceability,
        personality.valence,
        personality.acousticness
      )
    : null

  const aura = personality
    ? quickAura(
        personality.topArtists.flatMap(a => a.genres),
        personality.energy,
        personality.valence,
        personality.danceability,
        personality.acousticness
      )
    : null

  const genreChartData = personality
    ? Object.entries(
        personality.topArtists.reduce<Record<string, number>>((acc, artist) => {
          artist.genres.forEach((genre) => {
            acc[genre] = (acc[genre] || 0) + 1
          })
          return acc
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, value]) => ({ name, value: value * 10 }))
    : []

  const audioFeaturesChart = personality
    ? [
        { name: 'Energy', value: Math.round(personality.energy * 100) },
        { name: 'Danceability', value: Math.round(personality.danceability * 100) },
        { name: 'Valence', value: Math.round(personality.valence * 100) },
        { name: 'Acousticness', value: Math.round(personality.acousticness * 100) },
      ]
    : []

  const topTracksChart = personality
    ? personality.topTracks.slice(0, 5).map((track) => ({
        name: track.name,
        streams: track.popularity * 10,
      }))
    : []

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
              <p className="text-muted-foreground text-lg">
                {user?.display_name
                  ? `Welcome, ${user.display_name}! Discover your unique music profile`
                  : 'Discover your unique music profile'}
              </p>
              {process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' && (
                <p className="text-sm text-primary mt-2">Demo mode — using mock Spotify data</p>
              )}
            </div>

            {!personality ? (
              <div className="glass-effect rounded-lg p-8 text-center">
                <div className="mb-8">
                  <div className="text-6xl mb-4">🎵</div>
                  <h2 className="text-2xl font-semibold mb-2">Ready to explore your music personality?</h2>
                  <p className="text-muted-foreground">
                    Run the analysis using demo listening data — no Spotify Premium required
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-destructive mb-4">{error}</p>
                )}
                <Button
                  size="lg"
                  onClick={analyzeMusicPersonality}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Analyzing...' : 'Analyze My Music Personality'}
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Primary Genre', value: personality.genre },
                    { label: 'Mood', value: personality.mood },
                    { label: 'Top Artist', value: personality.topArtists[0]?.name ?? '—' },
                    { label: 'Top Tracks', value: String(personality.topTracks.length) },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>{item.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold capitalize">{item.value}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <GenreDNA artists={personality.topArtists} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <MoodSpectrum
                    metrics={{
                      energy: personality.energy,
                      danceability: personality.danceability,
                      valence: personality.valence,
                      acousticness: personality.acousticness,
                    }}
                  />
                </motion.div>

                {alterEgo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AlterEgoReveal alterEgo={alterEgo} />
                  </motion.div>
                )}

                {aura && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <AuraReveal aura={aura} />
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
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
                              data={genreChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}%`}
                              outerRadius={80}
                              fill="#1DB954"
                              dataKey="value"
                            >
                              {genreChartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

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
                          <BarChart data={audioFeaturesChart}>
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Tracks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={topTracksChart}>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Your Top Tracks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {personality.topTracks.map((track, index) => (
                        <li key={track.id} className="flex items-center justify-between border-b border-border pb-2">
                          <span>
                            {index + 1}. {track.name} — {track.artists.map((a) => a.name).join(', ')}
                          </span>
                          <span className="text-muted-foreground text-sm">{track.popularity}% popular</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    📥 Download Report
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={analyzeMusicPersonality}
                    disabled={loading}
                  >
                    🔄 Run Again
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
