import {
  updateTokenData,
  addTokenKeys,
  addPoolAddresses,
} from './actions'
import { createReducer } from '@reduxjs/toolkit'
import { PriceChartEntry, Transaction } from 'types/info'
import { SupportedNetwork } from 'constants/networks'
import { currentTimestamp } from 'utils/data'

export type TokenData = {
  // token is in some pool on uniswap
  exists: boolean

  // basic token info
  name: string
  symbol: string
  address: string

  // volume
  volumeUSD: number
  volumeUSDChange: number
  volumeUSDWeek: number
  txCount: number

  //fees
  feesUSD: number

  // tvl
  tvlToken: number
  tvlUSD: number
  tvlUSDChange: number

  priceUSD: number
  priceUSDChange: number
  priceUSDChangeWeek: number
}

export interface TokenChartEntry {
  date: number
  volumeUSD: number
  totalValueLockedUSD: number
}

export interface TokensState {
  // analytics data from
  byAddress: {
    [networkId: string]: {
      [address: string]: {
        data: TokenData | undefined
        poolAddresses: string[] | undefined
        chartData: TokenChartEntry[] | undefined
        priceData: {
          oldestFetchedTimestamp?: number | undefined
          [secondsInterval: number]: PriceChartEntry[] | undefined
        }
        transactions: Transaction[] | undefined
        lastUpdated: number | undefined
      }
    }
  }
}

export const initialState: TokensState = {
  byAddress: {
    [SupportedNetwork.ETHEREUM]: {},
  },
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateTokenData, (state, { payload: { tokens, networkId } }) => {
      tokens.map(
        (tokenData) =>
          (state.byAddress[networkId][tokenData.address] = {
            ...state.byAddress[networkId][tokenData.address],
            data: tokenData,
            lastUpdated: currentTimestamp(),
          })
      )
    }) // add address to byAddress keys if not included yet
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses, networkId } }) => {
      tokenAddresses.map((address) => {
        if (!state.byAddress[networkId][address]) {
          state.byAddress[networkId][address] = {
            poolAddresses: undefined,
            data: undefined,
            chartData: undefined,
            priceData: {},
            transactions: undefined,
            lastUpdated: undefined,
          }
        }
      })
    })
    // add list of pools the token is included in
    .addCase(addPoolAddresses, (state, { payload: { tokenAddress, poolAddresses, networkId } }) => {
      state.byAddress[networkId][tokenAddress] = { ...state.byAddress[networkId][tokenAddress], poolAddresses }
    })
)
