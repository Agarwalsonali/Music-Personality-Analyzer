'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-20">
        <section className="container-custom max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">About Us</h1>
              <p className="text-muted-foreground text-lg">
                Music Personality Analyzer is your gateway to understanding your unique musical taste
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    We believe that music is a universal language that defines who we are. Our mission is to help music lovers discover and understand their unique music personality.
                  </p>
                  <p>
                    By analyzing your listening habits, preferences, and patterns, we provide personalized insights that celebrate your individual musical journey.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex gap-4">
                      <span className="font-bold text-primary">1.</span>
                      <span>Connect your Spotify account securely</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-primary">2.</span>
                      <span>We analyze your top tracks and listening patterns</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-primary">3.</span>
                      <span>Advanced audio features are extracted from your music</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-primary">4.</span>
                      <span>Your music personality profile is generated</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-primary">5.</span>
                      <span>Download your personalized report with visualizations</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Technology</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="mb-4">
                    Built with cutting-edge technology including Next.js 15, TypeScript, and the Spotify Web API.
                  </p>
                  <p>
                    We use machine learning algorithms to analyze audio features and patterns to create your unique personality profile.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4">
                  <p>
                    Your privacy is our top priority. We only request access to read your public profile and listening history.
                  </p>
                  <p>
                    We never store your personal data on our servers. All analysis is done locally, and your Spotify access can be revoked at any time through your Spotify account settings.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                { title: '🎵', subtitle: 'Music Analysis', description: 'Deep insights into your listening habits' },
                { title: '📊', subtitle: 'Beautiful Charts', description: 'Visual representations of your data' },
                { title: '✨', subtitle: 'Personalized', description: 'Unique profile tailored to you' },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="text-3xl mb-2">{feature.title}</div>
                    <CardTitle className="text-lg">{feature.subtitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  )
}
