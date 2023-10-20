import { RNG_ADDRESS, addressesArray } from 'constants/tokens'
import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { InfoToken } from 'graphql/data/TopTokens'
import { supportedChainIdFromGQLChain, unwrapToken } from 'graphql/data/util'
import { useMemo } from 'react'
import { PoolData } from 'state/pools/reducer'
import { useSearchTokens } from '../graphql/data/SearchTokens'

interface UseInfoTokensReturnValue {
  infoTokens?: InfoToken[]
  loadingTokens: boolean
}

function useMultipleSearchTokens(addresses: string[], chainId?: number) {
  const tokensDataArray = addresses.map((address) => useSearchTokens(address, chainId ?? 1))

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
  const { tokens: allTokens, loading } = useTokensForAddresses(addressesArray, chainId)

  const { infoTokens, loadingTokens } = useMemo(() => {
    if (loading || !poolDatas.every(poolData => poolData !== undefined)) {
      return { infoTokens: undefined, loadingTokens: true }
    }

    const unwrappedTokens = allTokens.map((token) => unwrapToken(chainId ?? 1, token))
    const tokensArr: InfoToken[] = []

    poolDatas.forEach((poolData) => {
      const { token1, token0, tvlUSD, volumeUSD, volumeUSDWeek } = poolData
      const address0 = token0.address.toLowerCase()
      const address1 = token1.address.toLowerCase()

      let addressKey = address1

      // sort tokens
      if (address1 === RNG_ADDRESS.toLowerCase()) {
        addressKey = address0
      }

      // weth
      if (addressKey === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        addressKey = 'NATIVE'
      }

      const matchingToken = unwrappedTokens.find((token) => token.address === addressKey)
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
