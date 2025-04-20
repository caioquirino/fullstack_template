import { createClient, cacheExchange, fetchExchange } from '@urql/core'

export const client = createClient({
  url: '/api/graphql', // This assumes your GraphQL endpoint is at /api/graphql
  exchanges: [cacheExchange, fetchExchange],
})
