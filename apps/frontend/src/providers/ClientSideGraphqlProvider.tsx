'use client'

import { Provider as UrqlProvider, createClient, cacheExchange, fetchExchange } from 'urql'

const client = createClient({
  url: typeof window !== 'undefined' ? `${window.location.origin}/graphql` : 'http://localhost:3000/graphql',
  exchanges: [cacheExchange, fetchExchange],
})

interface ClientSideGraphqlProviderProps {
  children: React.ReactNode
}

export function ClientSideGraphqlProvider({ children }: ClientSideGraphqlProviderProps) {
  return <UrqlProvider value={client}>{children}</UrqlProvider>
}
