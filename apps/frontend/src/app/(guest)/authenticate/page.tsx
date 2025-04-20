'use client'

import { Suspense } from 'react'
import Authenticate from '@/components/auth/Authenticate'

function AuthenticateContent() {
  return <Authenticate />
}

export default function AuthenticatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthenticateContent />
    </Suspense>
  )
}
