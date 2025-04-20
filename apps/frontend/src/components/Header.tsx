'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { APP_NAME } from '@/constants/app'
import { useStytchUser } from '@stytch/nextjs'

export default function Header() {
  const { user } = useStytchUser()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/in/dashboard' },
    { name: 'Profile', href: '/in/profile' },
  ]

  const isActive = (path: string) => pathname === path

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={user ? '/in/dashboard' : '/'} className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {APP_NAME}
              </Link>
            </div>
            {/* Desktop Navigation */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href) ? 'border-blue-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            {user ? (
              <Link href="/logout" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Sign Out
              </Link>
            ) : (
              <Link href="/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          {user && (
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {user && isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-700 dark:text-blue-200'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}>
                {item.name}
              </Link>
            ))}
            <div className="pl-3 pr-4 py-2 border-l-4 border-transparent">
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark')
                  setIsMobileMenuOpen(false)
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
            <Link
              href="/logout"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}>
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
