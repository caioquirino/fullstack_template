import LogoutCountdown from '@/components/auth/LogoutCountdown'

export default function Logout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LogoutCountdown />
    </div>
  )
}
