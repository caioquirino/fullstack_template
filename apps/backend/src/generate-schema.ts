import 'reflect-metadata'

import { printSchema } from 'graphql'
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql'
import { JargonResolver } from './app/graphql/jargon.resolver'
import { Jargon } from './app/graphql/jargon.model'
import { createApp } from './app'
import { writeFileSync } from 'fs'

async function generateSchema() {
  const { nestApp } = await createApp(GraphQLSchemaBuilderModule)
  const schemaFactory = nestApp.get(GraphQLSchemaFactory)
  const schema = await schemaFactory.create([JargonResolver], [Jargon])
  writeFileSync('schema.graphql', printSchema(schema))
  console.log('Schema generated successfully')
}

generateSchema().catch((err) => {
  console.error('Error generating schema:', err)
  process.exit(1)
})
