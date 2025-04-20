import * as stytch from 'stytch'
import { FastifyRequest } from 'fastify'

export type Session = {
  userId: string
  email: string
}

export type Context = {
  session?: Session
}

export class AuthService {
  stytchClient: stytch.Client

  constructor() {
    this.stytchClient = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID as string,
      secret: process.env.STYTCH_SECRET_KEY as string,
      env: stytch.envs[process.env.STYTCH_PROJECT_ENV as 'test' | 'live'],
    })
  }

  async getAuthenticatedUser(sessionToken: string): Promise<stytch.User | undefined> {
    try {
      const resp = await this.stytchClient.sessions.authenticate({ session_token: sessionToken })
      if (resp.status_code !== 200) {
        console.log('Session not authenticated')
        return undefined
      }
      return resp.user
    } catch (error) {
      console.error('Error authenticating session:', error)
      return undefined
    }
  }

  async createContext(req: FastifyRequest): Promise<Context> {
    const cookies = req.headers.cookie

    if (!cookies || !cookies.includes('stytch_session=')) {
      return { session: undefined }
    }

    const stytchSession = cookies.split('stytch_session=')[1]?.split(';')[0]
    if (!stytchSession) {
      return { session: undefined }
    }

    const user = await this.getAuthenticatedUser(stytchSession)
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

  isAuthenticated(req: FastifyRequest): boolean {
    const cookies = req.headers.cookie
    return !!cookies && cookies.includes('stytch_session=')
  }

  getSession(req: FastifyRequest): Session {
    if (!this.isAuthenticated(req)) {
      throw new Error('Not authenticated')
    }

    // This is a placeholder - in a real implementation, you would extract the session from the request
    // For now, we'll return a default session for development purposes
    return {
      userId: 'default-user-id',
      email: 'default@example.com',
    }
  }

  assertAuthenticated(req: FastifyRequest): void {
    if (!this.isAuthenticated(req)) {
      throw new Error('Not authenticated')
    }
  }
}
