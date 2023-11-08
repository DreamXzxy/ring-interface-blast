import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { RNG_PAIR_TOKENS } from 'constants/tokens'
import { Chain, TokenPriceQueryVariables } from 'graphql/data/__generated__/types-and-hooks'
import { apolloClient } from 'graphql/data/apollo'
import { TokenPriceQuery } from 'graphql/data/TokenPrice'
import {
  isPricePoint,
  PricePoint,
  supportedChainIdFromGQLChain,
  TimePeriod,
  toHistoryDuration,
  unwrapToken,
} from 'graphql/data/util'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'

const TOKEN_PRICE = gql`
  query TokenPrice($chain: Chain!, $address: String = null, $duration: HistoryDuration!) {
    token(chain: $chain, address: $address) {
      id
      address
      chain
      market(currency: USD) {
        id
        price {
          id
          value
        }
        priceHistory(duration: $duration) {
          id
          timestamp
          value
        }
      }
    }
  }
`

async function fetchTokensPrices(
  client: ApolloClient<NormalizedCacheObject>,
  chain: Chain,
  addresses: string[]
): Promise<{ data?: TokenPriceQuery[]; error: boolean }> {
  const tokenPriceQueries: Promise<{ data?: TokenPriceQuery; error: boolean }>[] = addresses.map((address) =>
    client
      .query<TokenPriceQuery, TokenPriceQueryVariables>({
        query: TOKEN_PRICE,
        variables: {
          chain,
          address,
          duration: toHistoryDuration(TimePeriod.DAY),
        },
        errorPolicy: 'all',
      })
      .then((response) => {
        if (response.error) {
          console.error(response.error, `Error fetching price for address: ${address}`)
          return { data: undefined, error: true }
        }
        return { data: response.data, error: false }
      })
      .catch((error) => {
        // Catch any errors during the query or processing
        console.error(error, `Error in query or processing for address: ${address}`)
        return { data: undefined, error: true }
      })
  )

  try {
    const results = await Promise.all(tokenPriceQueries)
    const data = results
      .filter((result) => !result.error)
      .map((result) => result.data)
      .filter((data): data is TokenPriceQuery => data !== undefined)

    if (data.length > 0) {
      return { data, error: false }
    } else {
      return { data: undefined, error: true }
    }
  } catch (e) {
    console.error(e)
    return { data: undefined, error: true }
  }
}

export function useTokensSparkLine(chain: Chain): SparklineMap {
  const [sparkLineMap, setSparkLineMap] = useState<SparklineMap>({})
  const [error, setError] = useState(false)

  const client = apolloClient
  const chainId = supportedChainIdFromGQLChain(chain)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await fetchTokensPrices(client, Chain.Ethereum, RNG_PAIR_TOKENS)

      if (error) {
        setError(true)
      } else if (data) {
        const sparklineMap: SparklineMap = {}
        RNG_PAIR_TOKENS.forEach((address, index) => {
          const token = data[index].token
          const unwrappedTokens = chainId && unwrapToken(chainId, token ?? null)

          if (unwrappedTokens?.address) {
            const priceHistory = unwrappedTokens?.market?.priceHistory?.filter(isPricePoint)
            sparklineMap[unwrappedTokens.address] = priceHistory
          }
        })

        setSparkLineMap(sparklineMap)
      }
    }
    if (!error) {
      fetch()
    }
  }, [client, chainId, error])

  return sparkLineMap
}

type SparklineMap = {
  [key: string]: PricePoint[] | undefined
}
