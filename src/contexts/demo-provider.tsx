'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DemoContextValue {
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  demoUser: {
    display_name: string
    email: string
  } | null
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoUser, setDemoUser] = useState<{ display_name: string; email: string } | null>(null)

  useEffect(() => {
    // Check if demo mode was previously enabled
    const savedDemoMode = localStorage.getItem('demoMode')
    if (savedDemoMode === 'true') {
      setIsDemoMode(true)
      setDemoUser({
        display_name: 'Demo User',
        email: 'demo@example.com',
      })
    }
  }, [])

  const enableDemoMode = () => {
    setIsDemoMode(true)
    setDemoUser({
      display_name: 'Demo User',
      email: 'demo@example.com',
    })
    localStorage.setItem('demoMode', 'true')
  }

  const disableDemoMode = () => {
    setIsDemoMode(false)
    setDemoUser(null)
    localStorage.removeItem('demoMode')
  }

  return (
    <DemoContext.Provider value={{ isDemoMode, enableDemoMode, disableDemoMode, demoUser }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
