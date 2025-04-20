import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { serializeAuthState } from '@/utils/authState'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the path is a protected route
  const isLoggedRoute = pathname.startsWith('/in')

  if (isLoggedRoute) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('stytch_session_jwt')

    // If no session token is found, redirect to login
    if (!sessionToken) {
      // Get the current URL and query string to redirect back after login
      const currentUrl = pathname
      const queryString = request.nextUrl.search

      // Create state object with returnUrl and queryString
      const state = {
        returnUrl: currentUrl,
        queryString: queryString,
      }

      // Redirect to login page with the state parameter
      return NextResponse.redirect(new URL(`/login?state=${serializeAuthState(state)}`, request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes that should be protected
    '/in/:path*',
  ],
}
