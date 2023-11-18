import { NetworkStatus } from '@apollo/client'
import { Currency } from '@uniswap/sdk-core'
import { Chain } from 'graphql/data/graphqlTypes'
import { useEffect, useMemo, useState } from 'react'

type TokenSpotPriceQuery = {
  __typename?: 'Query'
  token?: {
    __typename?: 'Token'
    address?: string
    chain: Chain
    name?: string
    symbol?: string
    project?: {
      __typename?: 'TokenProject'
      markets?: Array<{
        __typename?: 'TokenProjectMarket'
        price?: {
          __typename?: 'Amount'
          value: number
        }
      }>
    }
  }
}

const fetchPrice = async (currency?: Currency): Promise<{ data?: any; loading?: boolean; error: boolean }> => {
  const currencySymbol = currency?.symbol ?? 'ETH'

  try {
    const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${currencySymbol}`)
    return response.json().then((response) => {
      if (response.error) {
        console.error(response.error, `Error fetching price from tokenSpotPriceQuery: ${currencySymbol}`)
        return { data: undefined, error: true }
      }
      return { data: response.data, loading: false, error: false }
    })
  } catch (error) {
    console.error(error, `Error in query or processing from tokenSpotPriceQuery: ${currencySymbol}`)
    return { data: undefined, error: true }
  }
}

export function useTokenSpotPriceQuery(
  chain: Chain,
  currency?: Currency
): {
  data?: TokenSpotPriceQuery
  networkStatus: NetworkStatus
  error: boolean
} {
  const tokenSpotPriceQuery: TokenSpotPriceQuery = useMemo(() => {
    return {
      __typename: 'Query',
      token: {
        __typename: 'Token',
        address: currency?.wrapped.address,
        chain,
        name: currency?.name,
        symbol: currency?.symbol,
        project: {
          __typename: 'TokenProject',
          markets: [
            {
              __typename: 'TokenProjectMarket',
              price: {
                __typename: 'Amount',
                value: 0,
              },
            },
          ],
        },
      },
    }
  }, [chain, currency])
  const [data, setTokenSpotPrice] = useState<TokenSpotPriceQuery | undefined>(undefined)
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(NetworkStatus.loading)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isCancelled = false

    const fetch = async () => {
      setNetworkStatus(NetworkStatus.loading)
      setError(false)
      try {
        const { data, error } = await fetchPrice(currency)

        if (!isCancelled) {
          if (error) {
            setError(true)
          } else {
            if (
              tokenSpotPriceQuery.token &&
              tokenSpotPriceQuery.token.project &&
              tokenSpotPriceQuery.token.project.markets
            ) {
              tokenSpotPriceQuery.token.project.markets.push({
                __typename: 'TokenProjectMarket',
                price: {
                  __typename: 'Amount',
                  value: data.rates.USD,
                },
              })
            }
            setTokenSpotPrice(tokenSpotPriceQuery)
            setNetworkStatus(NetworkStatus.ready)
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setError(true)
        }
      }
    }

    fetch()

    return () => {
      isCancelled = true
    }
  }, [currency, tokenSpotPriceQuery])

  return { data, networkStatus, error }
}
