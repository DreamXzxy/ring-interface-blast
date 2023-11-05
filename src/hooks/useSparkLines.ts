import { Chain, useTokenPriceQuery } from 'graphql/data/__generated__/types-and-hooks'
import { SparklineMap } from 'graphql/data/TopTokens'
import {
  isPricePoint,
  supportedChainIdFromGQLChain,
  TimePeriod,
  toHistoryDuration,
  unwrapToken,
} from 'graphql/data/util'

export function useSparkLines(addresses: string[], chain: Chain): SparklineMap {
  const chainId = supportedChainIdFromGQLChain(chain)

  const tokenPrices: { [key: string]: any } = {}

  addresses.forEach((address) => {
    const { data: tokenPriceQuery } = useTokenPriceQuery({
      variables: {
        address,
        chain,
        duration: toHistoryDuration(TimePeriod.DAY),
      },
      errorPolicy: 'all',
    })

    tokenPrices[address] = tokenPriceQuery
  })

  const sparklines: SparklineMap = {}

  addresses.forEach((address) => {
    const unwrappedTokens = chainId && unwrapToken(chainId, tokenPrices[address]?.token ?? null)

    if (unwrappedTokens?.address) {
      sparklines[unwrappedTokens.address] = unwrappedTokens?.market?.priceHistory?.filter(isPricePoint)
    }
  })

  return sparklines
}
