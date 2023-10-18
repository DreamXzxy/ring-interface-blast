import { createAction } from '@reduxjs/toolkit'
import { TokenData } from './reducer'
import { SupportedNetwork } from 'constants/networks'

// protocol wide info
export const updateTokenData = createAction<{ tokens: TokenData[]; networkId: SupportedNetwork }>(
  'tokens/updateTokenData'
)

// add token address to byAddress
export const addTokenKeys = createAction<{ tokenAddresses: string[]; networkId: SupportedNetwork }>(
  'tokens/addTokenKeys'
)

// add list of pools token is in
export const addPoolAddresses = createAction<{
  tokenAddress: string
  poolAddresses: string[]
  networkId: SupportedNetwork
}>('tokens/addPoolAddresses')
