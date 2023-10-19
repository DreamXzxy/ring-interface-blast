import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { NetworkInfo } from 'constants/networks'

export type PopupContent = {
  listUpdate: {
    listUrl: string
    oldList: TokenList
    newList: TokenList
    auto: boolean
  }
}

export const updateSubgraphStatus = createAction<{
  available: boolean | null
  syncedBlock?: number
  headBlock?: number
}>('infoapplication/updateSubgraphStatus')
export const updateActiveNetworkVersion = createAction<{ activeNetworkVersion: NetworkInfo }>(
  'infoapplication/updateActiveNetworkVersion'
)
