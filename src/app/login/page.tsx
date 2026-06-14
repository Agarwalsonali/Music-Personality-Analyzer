/**
 * Login Page
 */

import { Suspense } from 'react'
import { LoginPage } from '@/components/auth'

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}
