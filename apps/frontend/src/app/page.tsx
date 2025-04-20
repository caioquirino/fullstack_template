'use client'

import { useRouter } from 'next/navigation'
import { APP_NAME } from '@/constants/app'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Teach all your apps your unique vocabulary, <span className="text-blue-600 dark:text-blue-400">effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            A powerful monorepo template featuring Next.js, GraphQL, and modern development tools. Build scalable applications with a robust architecture and developer experience.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why You'll Love {APP_NAME}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">NX</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Monorepo Management</h3>
            <p className="text-gray-600 dark:text-gray-300">Efficiently manage multiple applications and libraries in a single repository.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Next</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Next.js 14</h3>
            <p className="text-gray-600 dark:text-gray-300">Server components, app router, and modern React features.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">GQL</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">GraphQL API</h3>
            <p className="text-gray-600 dark:text-gray-300">Type-safe API development with GraphQL and code generation.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">TS</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">TypeScript</h3>
            <p className="text-gray-600 dark:text-gray-300">End-to-end type safety across your entire application.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-50">Start your next project with a production-ready full-stack template.</p>
          <button onClick={() => router.push('/login')} className="bg-white text-blue-600 dark:bg-blue-50 dark:text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-blue-100 transition-colors">
            Demo Log In
          </button>
        </div>
      </div>

      {/* Integration Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Build on {APP_NAME}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">Built with developer productivity in mind, featuring modern tools and best practices.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Hot Reload</h3>
              <p className="text-gray-600 dark:text-gray-300">Instant feedback with fast refresh and hot module replacement.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Code Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">Automated type generation for GraphQL and API endpoints.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Testing</h3>
              <p className="text-gray-600 dark:text-gray-300">Built-in testing setup with Jest and React Testing Library.</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/developers')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Developer Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
