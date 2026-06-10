'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Music, Brain, Sparkles, TrendingUp, Users, Zap, Play, ArrowRight } from 'lucide-react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            variants={glowVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            variants={glowVariants}
            animate="animate"
            transition={{ delay: 1.5 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
            variants={glowVariants}
            animate="animate"
            transition={{ delay: 0.75 }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative container-custom py-20 md:py-32 min-h-screen flex items-center">
          <motion.div
            style={{ opacity, scale }}
            className="max-w-5xl mx-auto text-center relative z-10"
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 1.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Music Analysis</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? 'visible' : 'hidden'}
            >
              <motion.span variants={itemVariants} className="block">
                Your Music,
              </motion.span>
              <motion.span variants={itemVariants} className="block bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
                Your Story
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
              variants={itemVariants}
              initial="hidden"
              animate={isLoaded ? 'visible' : 'hidden'}
            >
              Discover your unique music personality with AI-powered insights. 
              Like Spotify Wrapped, but deeper and more personal.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
              initial="hidden"
              animate={isLoaded ? 'visible' : 'hidden'}
            >
              <Link href="/analyzer">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-full font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 border-white/20 hover:border-white/40 backdrop-blur-sm transition-all hover:scale-105"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 left-10 text-6xl"
              variants={floatVariants}
              animate="animate"
            >
              🎵
            </motion.div>
            <motion.div
              className="absolute bottom-20 right-10 text-6xl"
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 1 }}
            >
              🎧
            </motion.div>
            <motion.div
              className="absolute top-40 right-20 text-4xl"
              variants={floatVariants}
              animate="animate"
              transition={{ delay: 2 }}
            >
              ✨
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative container-custom py-32">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand your musical identity
            </p>
          </motion.div>

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
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="relative container-custom py-32">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three simple steps to discover your music personality
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-purple-500 transform -translate-y-1/2 opacity-30" />

            <motion.div
              className="grid md:grid-cols-3 gap-8 relative"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative text-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-black relative z-10"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {index + 1}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Example Personality Card Section */}
        <section className="relative container-custom py-32">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your Personality Card
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A beautiful, shareable snapshot of your musical identity
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50 rounded-3xl p-8 md:p-12 border border-white/10 backdrop-blur-sm overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.3),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.3),transparent_50%)]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black mb-2">The Explorer</h3>
                    <p className="text-gray-300">Your musical archetype</p>
                  </div>
                  <div className="text-6xl">🚀</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Top Genre</span>
                    </div>
                    <p className="text-2xl font-bold">Indie Rock</p>
                  </div>
                  <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="font-semibold">Listening Style</span>
                    </div>
                    <p className="text-2xl font-bold">Curated Explorer</p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">Personality Traits</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Curious', 'Open-minded', 'Adventurous', 'Creative', 'Eclectic'].map((trait, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 text-sm font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Spotify Login CTA Section */}
        <section className="relative container-custom py-32">
          <motion.div
            className="max-w-4xl mx-auto relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-purple-500/30 blur-3xl rounded-3xl"
              variants={glowVariants}
              animate="animate"
            />

            <div className="relative bg-gradient-to-br from-black to-gray-900 rounded-3xl p-8 md:p-16 border border-white/10 backdrop-blur-sm overflow-hidden">
              {/* Spotify Logo Animation */}
              <motion.div
                className="absolute top-8 right-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <div className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-8"
                >
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Powered by Spotify</span>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Ready to Discover
                  <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Your Music Personality?
                  </span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  Connect your Spotify account in seconds and get instant insights about your unique musical identity.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/analyzer">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-xl px-12 py-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full font-bold shadow-lg shadow-green-500/25 transition-all"
                    >
                      <Music className="w-6 h-6 mr-3" />
                      Connect with Spotify
                    </Button>
                  </Link>
                </motion.div>

                <p className="mt-6 text-sm text-gray-500">
                  Secure authentication • No data stored • Free to use
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  )
}

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your music preferences and listening patterns to reveal your unique personality.',
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-accent" />,
    title: 'Visual Insights',
    description: 'Beautiful, interactive charts and visualizations that bring your music personality to life in stunning detail.',
  },
  {
  icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    title: 'Personalized Report',
    description: 'Get a comprehensive, shareable report tailored specifically to your musical taste and listening habits.',
  },
]

const steps = [
  {
    title: 'Connect Spotify',
    description: 'Securely link your Spotify account to access your listening history and preferences.',
  },
  {
    title: 'AI Analysis',
    description: 'Our advanced AI analyzes your music to uncover patterns and personality traits.',
  },
  {
    title: 'Get Results',
    description: 'Receive your personalized music personality card with detailed insights and visualizations.',
  },
]
