'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        {/* Hero Section */}
        <section className="container-custom py-20 md:py-32">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
              variants={itemVariants}
            >
              Discover Your Music Personality
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Unlock insights into your musical taste with our AI-powered analysis. Get a personalized
              report inspired by Spotify Wrapped.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
              <Link href="/analyzer">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Analysis
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container-custom py-20 md:py-32">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-lg p-6 text-center"
                variants={itemVariants}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-20 md:py-32">
          <motion.div
            className="glass-effect rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Analyze?</h2>
            <p className="text-muted-foreground mb-6">
              Connect your Spotify account and get instant insights about your music personality.
            </p>
            <Link href="/analyzer">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  )
}

const features = [
  {
    icon: '🎵',
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze your music preferences and listening patterns.',
  },
  {
    icon: '📊',
    title: 'Visual Insights',
    description: 'Beautiful charts and visualizations of your music personality.',
  },
  {
    icon: '✨',
    title: 'Personalized Report',
    description: 'Get a unique report tailored to your musical taste and preferences.',
  },
]
