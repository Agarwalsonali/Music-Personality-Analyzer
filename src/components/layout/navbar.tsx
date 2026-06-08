'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
          <span className="gradient-text">🎵 MPA</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/analyzer" className="hidden md:inline">
            <Button variant="ghost" size="sm">
              Analyzer
            </Button>
          </Link>
          <Link href="/about" className="hidden md:inline">
            <Button variant="ghost" size="sm">
              About
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
