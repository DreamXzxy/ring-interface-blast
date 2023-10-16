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

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  MENU,
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('infoapplication/updateBlockNumber')
export const setOpenModal = createAction<ApplicationModal | null>('infoapplication/setOpenModal')
export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>(
  'infoapplication/addPopup'
)
export const removePopup = createAction<{ key: string }>('infoapplication/removePopup')
export const updateSubgraphStatus = createAction<{
  available: boolean | null
  syncedBlock: number | undefined
  headBlock: number | undefined
}>('infoapplication/updateSubgraphStatus')
export const updateActiveNetworkVersion = createAction<{ activeNetworkVersion: NetworkInfo }>(
  'infoapplication/updateActiveNetworkVersion'
)
