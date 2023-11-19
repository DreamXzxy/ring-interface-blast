import { ChainId as MockChainId } from '@uniswap/sdk-core'
import {
  DAI as MockDAI,
  USDC_MAINNET as MockUSDC_MAINNET,
  USDC_OPTIMISM as MockUSDC_OPTIMISM,
  USDT as MockUSDT,
  WETH_POLYGON as MockWETH_POLYGON,
} from 'constants/tokens'
import { renderHook } from 'test-utils/render'

import { useAllTokens, useAllTokensMultichain, useDefaultActiveTokens, useIsUserAddedToken } from './Tokens'

jest.mock('../state/lists/hooks.ts', () => {
  return {
    useCombinedTokenMapFromUrls: () => ({
      [MockChainId.MAINNET]: {
        [MockDAI.address]: { token: MockDAI },
        [MockUSDC_MAINNET.address]: { token: MockUSDC_MAINNET },
      },
      [MockChainId.POLYGON]: {
        [MockWETH_POLYGON.address]: { token: MockWETH_POLYGON },
      },
    }),
    useCombinedActiveList: () => ({
      [MockChainId.MAINNET]: {
        [MockDAI.address]: MockDAI,
        [MockUSDT.address]: MockUSDT,
      },
      [MockChainId.OPTIMISM]: {
        [MockUSDC_OPTIMISM.address]: MockUSDC_OPTIMISM,
      },
    }),
  }
})

jest.mock('../state/hooks.ts', () => {
  return {
    useAppSelector: () => ({
      [MockChainId.MAINNET]: {
        [MockDAI.address]: MockDAI,
        [MockUSDT.address]: MockUSDT,
      },
      [MockChainId.OPTIMISM]: {
        [MockUSDC_OPTIMISM.address]: MockUSDC_OPTIMISM,
      },
    }),
  }
})

jest.mock('../state/user/hooks.tsx', () => {
  return {
    deserializeToken: () => MockDAI,
    useUserAddedTokens: () => [MockDAI, MockUSDT],
  }
})

describe('useAllTokensMultichain', () => {
  it('should return multi-chain tokens from lists and userAddedTokens', () => {
    const { result } = renderHook(() => useAllTokensMultichain())

    expect(result.current).toStrictEqual({
      [MockChainId.MAINNET]: {
        [MockDAI.address]: MockDAI,
        [MockUSDC_MAINNET.address]: MockUSDC_MAINNET,
        [MockUSDT.address]: MockDAI,
      },
      10: {
        '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': MockDAI,
      },
      137: {
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': MockWETH_POLYGON,
      },
    })
  })
})

describe('useAllTokens', () => {
  it('should return AllTokens', () => {
    const { result } = renderHook(() => useAllTokens())

    expect(result.current).toStrictEqual({
      [MockDAI.address]: MockDAI,
      [MockUSDT.address]: MockUSDT,
    })
  })
})

describe('useDefaultActiveTokens', () => {
  it('should return DefaultActiveTokens', () => {
    const { result } = renderHook(() => useDefaultActiveTokens(1))

    expect(result.current).toStrictEqual({
      [MockDAI.address]: MockDAI,
      [MockUSDT.address]: MockUSDT,
    })
  })
})

describe('useIsUserAddedToken', () => {
  it('MockDAI is UserAddedToken', () => {
    const { result } = renderHook(() => useIsUserAddedToken(MockDAI))

    expect(result.current).toStrictEqual(true)
  })
})
