import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveNetworkVersion } from 'state/infoapplication/hooks'
import { notEmpty } from 'utils/notEmpty'

import { addPoolKeys, updatePoolData } from './actions'
import { AppState } from '../reducer'
import { PoolData } from './reducer'

export function useAllPoolData(): {
  [address: string]: { data?: PoolData; lastUpdated?: number }
} {
  const [network] = useActiveNetworkVersion()
  return useSelector((state: AppState) => state.pools.byAddress[network.id] ?? {})
}

export function useUpdatePoolData(): (pools: PoolData[]) => void {
  const dispatch = useDispatch()
  const [network] = useActiveNetworkVersion()
  return useCallback(
    (pools: PoolData[]) => dispatch(updatePoolData({ pools, networkId: network.id })),
    [dispatch, network.id]
  )
}

export function useAddPoolKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch()
  const [network] = useActiveNetworkVersion()
  return useCallback(
    (poolAddresses: string[]) => dispatch(addPoolKeys({ poolAddresses, networkId: network.id })),
    [dispatch, network.id]
  )
}

// Custom Hook 1: useUntrackedPoolAddresses
function useUntrackedPoolAddresses(
  poolAddresses: string[],
  allPoolData: { [address: string]: { data?: PoolData; lastUpdated?: number } }
): string[] {
  return poolAddresses.filter((address) => !Object.keys(allPoolData).includes(address))
}

// Custom Hook 2: useUpdatePoolKeys
function useUpdatePoolKeys(untrackedAddresses: string[], addPoolKeys: any) {
  useEffect(() => {
    if (untrackedAddresses.length > 0) {
      addPoolKeys(untrackedAddresses)
    }
  }, [addPoolKeys, untrackedAddresses])
}

// Custom Hook 3: usePoolsWithData
function usePoolsWithData(
  poolAddresses: string[],
  allPoolDataallPoolData: { [address: string]: { data?: PoolData; lastUpdated?: number } }
) {
  return poolAddresses
    .map((address) => {
      const poolData = allPoolDataallPoolData[address]?.data
      return poolData ?? undefined
    })
    .filter(notEmpty)
}

export function usePoolDatas(poolAddresses: string[]) {
  const allPoolData = useAllPoolData()
  const addPoolKeys = useAddPoolKeys()

  const untrackedAddresses = useUntrackedPoolAddresses(poolAddresses, allPoolData)

  useUpdatePoolKeys(untrackedAddresses, addPoolKeys)

  const poolsWithData = usePoolsWithData(poolAddresses, allPoolData)

  return poolsWithData
}
