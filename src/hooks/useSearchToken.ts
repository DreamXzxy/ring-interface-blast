import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { RNG_PAIR_TOKENS } from 'constants/tokens'
import { SearchTokensQuery, SearchTokensQueryVariables } from 'graphql/data/__generated__/types-and-hooks'
import { apolloClient } from 'graphql/data/apollo'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'

const SEARCH_TOKENS = gql`
  query SearchTokens($searchQuery: String!) {
    searchTokens(searchQuery: $searchQuery) {
      id
      decimals
      name
      chain
      standard
      address
      symbol
      market(currency: USD) {
        id
        price {
          id
          value
          currency
        }
        pricePercentChange(duration: DAY) {
          id
          value
        }
        volume24H: volume(duration: DAY) {
          id
          value
          currency
        }
      }
      project {
        id
        logoUrl
        safetyLevel
      }
    }
  }
`

async function fetchSearchTokens(
  client: ApolloClient<NormalizedCacheObject>,
  searchQuerys: string[]
): Promise<{ data?: any; loading?: boolean; error: boolean }> {
  const searchTokensQueries: Promise<{ data?: SearchTokensQuery; error: boolean }>[] = searchQuerys.map((searchQuery) =>
    client
      .query<SearchTokensQuery, SearchTokensQueryVariables>({
        query: SEARCH_TOKENS,
        variables: {
          searchQuery,
        },
      })
      .then((response) => {
        if (response.error) {
          console.error(response.error, `Error fetching price for searchQuery: ${searchQuery}`)
          return { data: undefined, error: true }
        }
        return { data: response.data, loading: false, error: false }
      })
      .catch((error) => {
        console.error(error, `Error in query or processing for searchQuery: ${searchQuery}`)
        return { data: undefined, error: true }
      })
  )
  try {
    const results = await Promise.all(searchTokensQueries)
    const data = results.flatMap((result) => (result.error || !result.data ? [] : result.data.searchTokens))

    if (data.length > 0) {
      return { data, loading: false, error: false }
    } else {
      return { data: undefined, loading: false, error: true }
    }
  } catch (e) {
    console.error(e)
    return { data: undefined, error: true }
  }
}

export function useSearchTokens(): {
  searchTokens?: SearchTokensQuery[]
  loading: boolean
  error: boolean
} {
  const [searchTokens, setSearchTokens] = useState<SearchTokensQuery[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const client = apolloClient

  useEffect(() => {
    let isCancelled = false

    const fetch = async () => {
      setLoading(true)
      setError(false)
      try {
        const { data, error } = await fetchSearchTokens(client, RNG_PAIR_TOKENS)
        if (!isCancelled) {
          if (error) {
            setError(true)
          } else {
            setSearchTokens(data)
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setError(true)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      isCancelled = true
    }
  }, [client])

  return { searchTokens, loading, error }
}
