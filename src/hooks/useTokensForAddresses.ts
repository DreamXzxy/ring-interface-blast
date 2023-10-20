import { RNG_PAIR_TOKENS } from 'constants/tokens'
import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { InfoToken } from 'graphql/data/TopTokens'
import { supportedChainIdFromGQLChain, unwrapToken } from 'graphql/data/util'
import { useMemo } from 'react'
import { PoolData } from 'state/pools/reducer'
import { useSearchTokens } from '../graphql/data/SearchTokens'
import { ChainId } from '@uniswap/sdk-core'

interface UseInfoTokensReturnValue {
  infoTokens?: InfoToken[]
  loadingTokens: boolean
}

function useMultipleSearchTokens(addresses: string[], chainId?: number) {
  const tokensDataArray = addresses.map((address) => useSearchTokens(address, chainId ?? ChainId.MAINNET))

  return tokensDataArray
}

function useTokensForAddresses(addresses: string[], chainId?: number) {
  const tokensDataArray = useMultipleSearchTokens(addresses, chainId)

  const { tokens, loading, error } = useMemo(() => {
    const combinedTokens = []
    let loading = false
    let error = null
    for (const tokensData of tokensDataArray) {
      if (tokensData.loading) {
        loading = true
      } else if (tokensData.error) {
        error = tokensData.error
      } else {
        combinedTokens.push(...tokensData.data)
      }
    }
    return {
      tokens: combinedTokens,
      loading,
      error,
    }
  }, [tokensDataArray])

  return { tokens, loading, error }
}

export function useInfoTokens(poolDatas: PoolData[], chain: Chain): UseInfoTokensReturnValue {
  const chainId = supportedChainIdFromGQLChain(chain)
  const { tokens: allTokens, loading } = useTokensForAddresses(RNG_PAIR_TOKENS, chainId)

  const { infoTokens, loadingTokens } = useMemo(() => {
    if (loading || !poolDatas.every(poolData => poolData !== undefined)) {
      return { infoTokens: undefined, loadingTokens: true }
    }

    const unwrappedTokens = allTokens.map((token) => unwrapToken(chainId ?? ChainId.MAINNET, token))
    const tokensArr: InfoToken[] = []

    poolDatas.forEach((poolData) => {
      const { token1, tvlUSD, volumeUSD, volumeUSDWeek } = poolData
      let address1 = token1.address.toLowerCase()

      // weth
      if (address1 === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        address1 = 'NATIVE'
      }

      const matchingToken = unwrappedTokens.find((token) => token.address === address1)
      if (matchingToken) {
        const infoToken = {
          ...matchingToken,
          tvlUSD,
          volumeUSD,
          volumeUSDWeek,
        }
        tokensArr.push(infoToken)
      }
    })

    return {
      infoTokens: tokensArr.length > 0 ? tokensArr : undefined,
      loadingTokens: tokensArr.length === 0,
    }
  }, [allTokens, loading, poolDatas, chainId])

  return {
    infoTokens,
    loadingTokens,
  }
}
