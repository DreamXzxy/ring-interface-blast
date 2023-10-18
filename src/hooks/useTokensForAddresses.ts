import { addressesArray } from 'constants/tokens'
import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { InfoToken } from 'graphql/data/TopTokens'
import { supportedChainIdFromGQLChain, unwrapToken } from 'graphql/data/util'
import { useMemo } from 'react'
import { PoolData } from 'state/pools/reducer'

import { useSearchTokens } from '../graphql/data/SearchTokens'
import { CombinedData } from './InfoToken'

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

  const tokens = useMemo(() => {
    const combinedTokens = []

    for (const tokensData of tokensDataArray) {
      if (!tokensData.loading && !tokensData.error) {
        combinedTokens.push(...tokensData.data)
      }
    }

    return combinedTokens
  }, [tokensDataArray])

  const loading = tokensDataArray.some((tokensData) => tokensData.loading)
  const error = tokensDataArray.find((tokensData) => tokensData.error)

  return {
    tokens,
    loading,
    error,
  }
}

export function useInfoTokens(poolDatas: PoolData[], chain: Chain): UseInfoTokensReturnValue {
  const combinedDataArray: CombinedData[] = []
  const addressesToQuery = new Set<string>()
  const chainId = supportedChainIdFromGQLChain(chain)

  const { tokens: allTokens, loading, error } = useTokensForAddresses(addressesArray, chainId)

  const unwrappedTokens = allTokens.map((token) => unwrapToken(chainId ?? 1, token))

  poolDatas.forEach((poolData) => {
    const { token1, token0, tvlUSD, volumeUSD, volumeUSDWeek } = poolData
    const address0 = token0.address.toLowerCase()
    const address1 = token1.address.toLowerCase()
    const symbol0 = token0.symbol
    const symbol1 = token1.symbol

    let addressKey = address1

    if (address1 === '0x3b94440c8c4f69d5c9f47bab9c5a93064df460f5'.toLowerCase()) {
      addressKey = address0
    }

    addressesToQuery.add(addressKey)

    combinedDataArray.push({
      address: addressKey,
      symbol0,
      symbol1,
      tvlUSD,
      volumeUSD,
      volumeUSDWeek,
      tokenData: null, // Initialize tokenData as undefined
    })
  })

  combinedDataArray.forEach((combinedData) => {
    let addressKey = combinedData.address.toLowerCase()

    // weth
    if (addressKey === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
      addressKey = 'NATIVE'
    }
    const matchingToken = unwrappedTokens.find((token) => token.address === addressKey)

    if (matchingToken) {
      // Update tokenData property with additional InfoToken properties
      combinedData.tokenData = {
        ...matchingToken,
        tvlUSD: combinedData.tvlUSD,
        volumeUSD: combinedData.volumeUSD,
        volumeUSDWeek: combinedData.volumeUSDWeek,
      }
    }
  })

  // Extract non-null and non-undefined tokenData values and return as InfoToken[]
  const tokensArray: InfoToken[] = combinedDataArray
    .map((combinedData) => combinedData.tokenData)
    .filter((tokenData): tokenData is InfoToken => tokenData !== null && tokenData !== undefined)

  return useMemo(() => ({ infoTokens: tokensArray, loadingTokens: loading }), [tokensArray, loading])
}
