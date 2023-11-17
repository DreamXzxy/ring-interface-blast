import { ChainId } from '@uniswap/sdk-core'
import { NATIVE_CHAIN_ID } from 'constants/tokens'

import { Chain } from './graphqlTypes'

export enum TimePeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

const GQL_MAINNET_CHAINS = [
  Chain.Ethereum,
  Chain.Polygon,
  Chain.Celo,
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Bnb,
  Chain.Avalanche,
  Chain.Base,
] as const

const GQL_TESTNET_CHAINS = [Chain.EthereumGoerli, Chain.EthereumSepolia] as const

const UX_SUPPORTED_GQL_CHAINS = [...GQL_MAINNET_CHAINS, ...GQL_TESTNET_CHAINS] as const
type InterfaceGqlChain = (typeof UX_SUPPORTED_GQL_CHAINS)[number]

const GQL_CHAINS = [ChainId.MAINNET, ChainId.OPTIMISM, ChainId.POLYGON, ChainId.ARBITRUM_ONE, ChainId.CELO] as const
type GqlChainsType = (typeof GQL_CHAINS)[number]

export function isGqlSupportedChain(chainId: number | undefined): chainId is GqlChainsType {
  return !!chainId && GQL_CHAINS.includes(chainId)
}

const URL_CHAIN_PARAM_TO_BACKEND: { [key: string]: InterfaceGqlChain } = {
  ethereum: Chain.Ethereum,
  polygon: Chain.Polygon,
  celo: Chain.Celo,
  arbitrum: Chain.Arbitrum,
  optimism: Chain.Optimism,
  bnb: Chain.Bnb,
  avalanche: Chain.Avalanche,
  base: Chain.Base,
}

/**
 * @param chainName parsed in chain name from url query parameter
 * @returns if chainName is a valid chain name supported by the backend, returns the backend chain name, otherwise returns Chain.Ethereum
 */
export function validateUrlChainParam(chainName: string | undefined) {
  const isValidChainName = chainName && URL_CHAIN_PARAM_TO_BACKEND[chainName]
  const isValidBackEndChain =
    isValidChainName && (BACKEND_SUPPORTED_CHAINS as ReadonlyArray<Chain>).includes(isValidChainName)
  return isValidBackEndChain ? URL_CHAIN_PARAM_TO_BACKEND[chainName] : Chain.Ethereum
}

const CHAIN_NAME_TO_CHAIN_ID: { [key in InterfaceGqlChain]: ChainId } = {
  [Chain.Ethereum]: ChainId.MAINNET,
  [Chain.EthereumGoerli]: ChainId.GOERLI,
  [Chain.EthereumSepolia]: ChainId.SEPOLIA,
  [Chain.Polygon]: ChainId.POLYGON,
  [Chain.Celo]: ChainId.CELO,
  [Chain.Optimism]: ChainId.OPTIMISM,
  [Chain.Arbitrum]: ChainId.ARBITRUM_ONE,
  [Chain.Bnb]: ChainId.BNB,
  [Chain.Avalanche]: ChainId.AVALANCHE,
  [Chain.Base]: ChainId.BASE,
}

export function isSupportedGQLChain(chain: Chain): chain is InterfaceGqlChain {
  return (UX_SUPPORTED_GQL_CHAINS as ReadonlyArray<Chain>).includes(chain)
}

export function supportedChainIdFromGQLChain(chain: InterfaceGqlChain): ChainId
export function supportedChainIdFromGQLChain(chain: Chain): ChainId | undefined
export function supportedChainIdFromGQLChain(chain: Chain): ChainId | undefined {
  return isSupportedGQLChain(chain) ? CHAIN_NAME_TO_CHAIN_ID[chain] : undefined
}

const BACKEND_SUPPORTED_CHAINS = [
  Chain.Ethereum,
  Chain.Polygon,
  Chain.Arbitrum,
  Chain.Optimism,
  Chain.Celo,
  Chain.Base,
] as const

export function getInfoTokenSwapURL({ address }: { address?: string | null }) {
  const tokenAddress = address ?? NATIVE_CHAIN_ID
  return `/swap/?inputCurrency=ETH&outputCurrency=${tokenAddress}`
}
