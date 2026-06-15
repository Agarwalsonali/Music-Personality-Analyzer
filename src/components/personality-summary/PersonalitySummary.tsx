'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Download } from 'lucide-react'
import { useState } from 'react'
import type { PersonalitySummary } from '@/lib/personalitySummary'

interface PersonalitySummaryProps {
  summary: PersonalitySummary
}

export function PersonalitySummary({ summary }: PersonalitySummaryProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = summary.paragraphs.join('\n\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'What My Taste Says About Me',
          text: summary.shareableText,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    }
  }

  const handleDownload = () => {
    const text = summary.paragraphs.join('\n\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'music-personality-summary.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl">What Your Taste Says About You</CardTitle>
          <CardDescription>
            A personalized insight into your musical personality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {summary.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-lg leading-relaxed text-foreground"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Key Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {summary.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-secondary/50 rounded-lg px-3 py-2 text-sm"
                >
                  {highlight}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy Summary'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
