import { ChainId } from '@uniswap/sdk-core'
import { InfoToken } from 'components/InfoTokens/TokenTable/TokenRow'
import { RNG_ADDRESS, RNG_PAIR_TOKENS } from 'constants/tokens'
import { getAddress } from 'ethers/lib/utils'
import { chainIdToNetworkName } from 'lib/hooks/useCurrencyLogoURIs'
import { useMemo } from 'react'
import {
  useAddPoolKeys,
  useAllPoolData,
  usePoolsWithData,
  useUntrackedPoolAddresses,
  useUpdatePoolKeys,
} from 'state/pools/hooks'
import { useTokenDatas } from 'state/tokens/hooks'

interface UseInfoTokensReturnValue {
  infoTokens?: InfoToken[]
  loadingTokens: boolean
}

const getTokenLogoURL = ({ address, chainId }: { address: string; chainId: ChainId }) => {
  return `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/${chainIdToNetworkName(
    chainId
  )}/assets/${address}/logo.png`
}

export function useInfoTokens(poolAddresses: string[]): UseInfoTokensReturnValue {
  const allPoolData = useAllPoolData()
  const addPoolKeys = useAddPoolKeys()
  const tokenDatas = useTokenDatas(RNG_PAIR_TOKENS)

  const untrackedAddresses = useUntrackedPoolAddresses(poolAddresses, allPoolData)

  useUpdatePoolKeys(untrackedAddresses, addPoolKeys)

  const poolsWithData = usePoolsWithData(poolAddresses, allPoolData)

  const sortedTokens = useMemo(() => {
    const lowerCaseRNG = RNG_ADDRESS.toLowerCase()

    return poolsWithData.map((poolData) => {
      let { token0, token1 } = poolData

      if (token1.address.toLowerCase() === lowerCaseRNG) {
        ;[token0, token1] = [token1, token0]
      }

      return { ...poolData, token0, token1 }
    })
  }, [poolsWithData])

  const infoTokens: InfoToken[] = useMemo(() => {
    return sortedTokens.reduce<InfoToken[]>((acc, poolData) => {
      const tokenData = tokenDatas?.find(
        (token) => token.address.toLowerCase() === poolData.token1.address.toLowerCase()
      )

      if (tokenData) {
        const formattedAddress = getAddress(tokenData.address)
        acc.push({
          address: formattedAddress,
          name: tokenData.name,
          symbol: tokenData.symbol,
          market: {
            price: tokenData.priceUSD,
            pricePercentChange: tokenData.priceUSDChange,
          },
          project: {
            logoUrl: getTokenLogoURL({ address: formattedAddress, chainId: ChainId.MAINNET }),
          },
          tvlUSD: poolData.tvlUSD,
          volumeUSD: poolData.volumeUSD,
          volumeUSDWeek: poolData.volumeUSDWeek,
        })
      }
      return acc
    }, [])
  }, [tokenDatas, sortedTokens])

  return {
    infoTokens: infoTokens.length > 0 ? infoTokens : undefined,
    loadingTokens: infoTokens.length > 0 ? false : true,
  }
}
