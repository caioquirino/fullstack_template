'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStytch } from '@stytch/nextjs'
import { ErrorBoundary } from '../common/ErrorBoundary'
import LogoutError from './LogoutError'

function LogoutCountdownContent() {
  const router = useRouter()
  const stytch = useStytch()

  const [countdown, setCountdown] = useState(3)
  useEffect(() => {
    // Remove authentication state
    if (stytch) {
      // Revoke the session which will clear cookies and storage
      if (stytch.session && stytch.session.getTokens()) {
        ;(async () => {
          try {
            await stytch.session.revoke()
          } catch (error) {
            console.log('Error revoking session:', error)
            // If the session is already revoked, we don't need to do anything
          }
        })()
      }
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    // Redirect to landing page after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => {
      clearTimeout(timeout)
      clearInterval(countdownInterval)
    }
  }, [router, stytch])

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Logging out...</h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">You will be redirected to the landing page in {countdown} seconds.</p>
    </div>
  )
}

export default function LogoutCountdown() {
  return (
    <ErrorBoundary fallback={<LogoutError />}>
      <LogoutCountdownContent />
    </ErrorBoundary>
  )
}
