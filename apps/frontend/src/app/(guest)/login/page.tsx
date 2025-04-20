'use client'

import { useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStytchUser } from '@stytch/nextjs'
import Login from '@/components/auth/Login'
import { deserializeAuthState, buildRedirectUrl } from '@/utils/authState'

function LoginContent() {
  const { user, isInitialized } = useStytchUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const queryParams = useMemo(() => {
    const state = searchParams.get('state')
    return deserializeAuthState(state)
  }, [searchParams])

  // If the Stytch SDK detects a User then redirect to the returnUrl or dashboard
  useEffect(() => {
    if (isInitialized && user) {
      router.replace(buildRedirectUrl(queryParams))
    }
  }, [user, isInitialized, router, queryParams])

  return <Login queryParams={queryParams} />
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
