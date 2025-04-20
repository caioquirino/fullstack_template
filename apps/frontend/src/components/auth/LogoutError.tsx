'use client'

import { useRouter } from 'next/navigation'

export default function LogoutError() {
  const router = useRouter()

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Logout Failed</h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">There was an error while trying to log you out. Please try again or contact support if the problem persists.</p>
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/')}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Return to Home
        </button>
      </div>
    </div>
  )
}
