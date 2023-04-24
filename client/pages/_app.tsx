import { useApollo } from '@/lib/apolloClient'
import '@/styles/globals.css'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

// const client = new ApolloClient({
//   uri:'http://localhost:4000/graphql',
//   cache: new InMemoryCache(),
//   credentials: 'include'
// })
export default function App({ Component, pageProps }: AppProps) {
 const apolloClient= useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
    <Component {...pageProps} />
</ChakraProvider>
  </ApolloProvider>
  )
}
