import { AuthService } from '@fullstack-template/shared'

export type Session = {
  userId: string
  email: string
}

export type Context = {
  session?: Session
}

export class AuthContext {
  constructor(private readonly authService: AuthService) {}

  async createContext(request: Request): Promise<Context> {
    const cookies = request.headers.get('cookie')

    if (!cookies || !cookies.includes('stytch_session=')) {
      return { session: undefined }
    }

    const stytchSession = cookies.split('stytch_session=')[1]?.split(';')[0]
    if (!stytchSession) {
      return { session: undefined }
    }

    const user = await this.authService.getAuthenticatedUser(stytchSession)
    if (!user) {
      return { session: undefined }
    }

    const email = user.emails[0]?.email

    return {
      session: {
        userId: user.user_id,
        email,
      },
    }
  }

  isAuthenticated(context: Context): boolean {
    return !!context.session
  }

  assertAuthenticated(context: Context): void {
    if (!context.session) {
      throw new Error('Unauthorized')
    }
  }

  getSession(context: Context): Session {
    if (!context.session) {
      throw new Error('Unauthorized')
    }
    return context.session
  }
}
