import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthService, Session } from '@fullstack-template/shared'
import { FastifyRequest } from 'fastify'

// Extend FastifyRequest to include session
interface RequestWithSession extends FastifyRequest {
  session?: Session
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context)
    const { req } = gqlContext.getContext() as { req: RequestWithSession }

    // Create the context with session information
    const authContext = await this.authService.createContext(req)

    // Attach the session to the request for use in resolvers
    req.session = authContext.session

    return this.authService.isAuthenticated(req)
  }
}
