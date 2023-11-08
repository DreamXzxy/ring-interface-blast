import { ChainId } from '@uniswap/sdk-core'
import { InfoToken } from 'graphql/data/TopTokens'
import { unwrapToken } from 'graphql/data/util'
import { useMemo } from 'react'
import { PoolData } from 'state/pools/reducer'

import { useSearchTokens } from './useSearchToken'

interface UseInfoTokensReturnValue {
  infoTokens?: InfoToken[]
  loadingTokens: boolean
}

export function useInfoTokens(poolDatas: PoolData[]): UseInfoTokensReturnValue {
  const { searchTokens, loading } = useSearchTokens()

  const { infoTokens, loadingTokens } = useMemo(() => {
    if (loading || !poolDatas.every((poolData) => poolData !== undefined)) {
      return { infoTokens: undefined, loadingTokens: true }
    }

    const tokensArr: InfoToken[] = []

    poolDatas.forEach((poolData, index) => {
      const { token1, tvlUSD, volumeUSD, volumeUSDWeek } = poolData
      let address1 = token1.address.toLowerCase()

      if (address1 === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        address1 = 'NATIVE'
      }

      if (searchTokens) {
        const infoToken: any = {
          ...searchTokens[index],
          tvlUSD,
          volumeUSD,
          volumeUSDWeek,
        }
        const unwrapInfoToken = unwrapToken(ChainId.MAINNET, infoToken)
        tokensArr.push(unwrapInfoToken)
      }
    })

    return {
      infoTokens: tokensArr.length > 0 ? tokensArr : undefined,
      loadingTokens: tokensArr.length > 0 ? false : true,
    }
  }, [searchTokens, loading, poolDatas])

  return {
    infoTokens,
    loadingTokens,
  }
}
