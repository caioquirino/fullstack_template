'use client'

import React from 'react'
import { MDXContent } from '@/components/docs/MDXContent'

interface LayoutProps {
  children: React.ReactNode
}

export default function DevelopersLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
          <MDXContent>{children}</MDXContent>
        </div>
      </div>
    </div>
  )
}
