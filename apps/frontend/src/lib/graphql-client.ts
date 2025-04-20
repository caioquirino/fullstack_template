import { Client, cacheExchange, fetchExchange, gql } from '@urql/core'

// GraphQL endpoint URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql'

const client = new Client({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
})

/**
 * Execute a GraphQL query against the backend
 * @param query The GraphQL query string or gql tagged template literal
 * @param variables Variables for the query
 * @param headers Optional headers to forward to the GraphQL request
 * @returns The query result
 */
export async function executeGraphQLQuery<T = any>(query: ReturnType<typeof gql>, variables: Record<string, any> = {}, headers: Record<string, string> = {}): Promise<T> {
  const result = await client.query(query, variables, {
    fetchOptions: {
      headers: {
        'Content-Type': 'application/json',
        ...headers, // Include any forwarded headers
      },
    },
  })

  // Check for GraphQL errors
  if (result.error) {
    throw new Error(`GraphQL error: ${result.error.message}`)
  }

  return result.data as T
}

/**
 * Helper function to create a type-safe GraphQL query
 * @param query The GraphQL query as a template literal
 * @returns A gql tagged template literal
 */
export function createQuery(query: TemplateStringsArray, ...values: any[]) {
  return gql(query, ...values)
}
