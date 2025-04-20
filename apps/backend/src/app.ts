import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'
import { FastifyInstance } from 'fastify'
import { ValidationPipe } from '@nestjs/common'
import fastify from 'fastify'

// Create NestJS app with Fastify adapter
export async function createApp(appModule: any = AppModule): Promise<{
  nestApp: NestFastifyApplication
  fastifyApp: FastifyInstance
}> {
  const fastifyApp = fastify()

  const adapter = new FastifyAdapter()
  adapter.setInstance(fastifyApp)
  const nestApp = await NestFactory.create<NestFastifyApplication>(appModule, adapter)

  nestApp.useGlobalPipes(new ValidationPipe())

  await nestApp.init()

  return { nestApp, fastifyApp }
}
