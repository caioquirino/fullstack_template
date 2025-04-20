import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { JargonRepository, JargonService } from '@fullstack-template/shared'

// Initialize AWS clients
const dynamoDb = new DynamoDBClient({})
const jargonRepository = new JargonRepository(dynamoDb)
const jargonService = new JargonService(jargonRepository)

export type GraphQLContext = {
  jargonService: JargonService
  domain: string
}

export function createContext(event: any): GraphQLContext {
  // TODO: Get domain from auth context/headers
  const domain = event.headers?.['x-domain'] ?? 'default'

  return {
    jargonService,
    domain,
  }
}
