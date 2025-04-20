import 'reflect-metadata'

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { createApp } from './app'

async function bootstrap() {
  const { nestApp } = await createApp()
  const globalPrefix = 'api'
  nestApp.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 4000
  await nestApp.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
