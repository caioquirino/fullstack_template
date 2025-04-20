import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { JargonModule } from './graphql/jargon.module'
import { AuthModule } from './auth/auth.module'
import { FastifyRequest } from 'fastify'
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs'
import { AuthService, Session } from '@fullstack-template/shared'

// Extend FastifyRequest to include session
interface RequestWithSession extends FastifyRequest {
  session?: Session
}

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: true,
      context: async ({ req }: { req: RequestWithSession }) => {
        // Create a new instance of AuthService
        const authService = new AuthService()

        // Create the context with session information
        const authContext = await authService.createContext(req)

        // Attach the session to the request
        req.session = authContext.session

        return { req }
      },
    }),
    JargonModule,
    AuthModule,
  ],
})
export class AppModule {}
