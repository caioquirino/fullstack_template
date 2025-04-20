import 'reflect-metadata'

import { createApp } from './app'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult, type Context } from 'aws-lambda'
import awsLambda from '@fastify/aws-lambda'

type ServerlessHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>

let serverlessHandler: ServerlessHandler | undefined

const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  if (typeof serverlessHandler === 'undefined') {
    const { fastifyApp } = await createApp()
    serverlessHandler = awsLambda(fastifyApp)
  }

  return serverlessHandler(event, context)
}

module.exports = { handler }
