import { createReducer } from '@reduxjs/toolkit'
import { NetworkInfo } from 'constants/networks'

import { EthereumNetworkInfo } from '../../constants/networks'
import { PopupContent, updateActiveNetworkVersion, updateSubgraphStatus } from './actions'

type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>

export interface InfoapplicationState {
  readonly blockNumber: { readonly [chainId: number]: number }
  readonly popupList: PopupList
  readonly subgraphStatus: {
    available: boolean | null
    syncedBlock?: number
    headBlock?: number
  }
  readonly activeNetworkVersion: NetworkInfo
}

const initialState: InfoapplicationState = {
  blockNumber: {},
  popupList: [],
  subgraphStatus: {
    available: null,
    syncedBlock: undefined,
    headBlock: undefined,
  },
  activeNetworkVersion: EthereumNetworkInfo,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateSubgraphStatus, (state, { payload: { available, syncedBlock, headBlock } }) => {
      state.subgraphStatus = {
        available,
        syncedBlock,
        headBlock,
      }
    })
    .addCase(updateActiveNetworkVersion, (state, { payload: { activeNetworkVersion } }) => {
      state.activeNetworkVersion = activeNetworkVersion
    })
)
