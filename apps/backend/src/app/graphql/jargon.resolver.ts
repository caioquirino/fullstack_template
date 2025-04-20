import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { JargonService, Session } from '@fullstack-template/shared'
import { Jargon } from './jargon.model'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { FastifyRequest } from 'fastify'

// Extend FastifyRequest to include session
interface RequestWithSession extends FastifyRequest {
  session?: Session
}

@Resolver(() => Jargon)
export class JargonResolver {
  constructor(private readonly jargonService: JargonService) {}

  @Query(() => [Jargon])
  @UseGuards(AuthGuard)
  async jargons(): Promise<Jargon[]> {
    return this.jargonService.listJargons()
  }

  @Mutation(() => Jargon)
  @UseGuards(AuthGuard)
  async createJargon(@Args('term') term: string, @Args('description') description: string, @Context() context: any): Promise<Jargon> {
    const req = context.req as RequestWithSession
    const session = req.session || { userId: 'default-user', email: 'default@example.com' }

    return this.jargonService.createJargon({
      term,
      description,
      created_by: session.userId,
    })
  }

  @Mutation(() => Jargon)
  @UseGuards(AuthGuard)
  async updateJargon(@Args('id') id: string, @Args('term') term: string, @Args('description') description: string): Promise<Jargon> {
    return this.jargonService.updateJargon(id, { term, description })
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async deleteJargon(@Args('id') id: string): Promise<boolean> {
    return this.jargonService.deleteJargon(id)
  }
}
