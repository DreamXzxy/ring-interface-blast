// import { fetchPoolChartData } from 'graphql/data/pools/chartData'
// import { PoolTickData } from 'graphql/data/pools/tickData'
// import { fetchPoolTransactions } from 'graphql/data/pools/transactions'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveNetworkVersion, useClients } from 'state/infoapplication/hooks'
import { addPoolKeys, updatePoolChartData, updatePoolTransactions } from 'state/pools/actions'
import { Transaction } from 'types/info'
import { notEmpty } from 'utils/notEmpty'
// import { notEmpty } from 'utils'

import { AppState } from '../reducer'
import { updatePoolData } from './actions'
import { PoolChartEntry, PoolData } from './reducer'

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

// /**
//  * Get top pools addresses that token is included in
//  * If not loaded, fetch and store
//  * @param address
//  */
// export function usePoolChartData(address: string): PoolChartEntry[] | undefined {
//   const dispatch = useDispatch()
//   const [activeNetwork] = useActiveNetworkVersion()

//   const pool = useSelector((state: AppState) => state.pools.byAddress[activeNetwork.id]?.[address])
//   const chartData = pool?.chartData
//   const [error, setError] = useState(false)
//   const { dataClient } = useClients()

//   useEffect(() => {
//     async function fetch() {
//       const { error, data } = await fetchPoolChartData(address, dataClient)
//       if (!error && data) {
//         dispatch(updatePoolChartData({ poolAddress: address, chartData: data, networkId: activeNetwork.id }))
//       }
//       if (error) {
//         setError(error)
//       }
//     }
//     if (!chartData && !error) {
//       fetch()
//     }
//   }, [address, dispatch, error, chartData, dataClient, activeNetwork.id])

//   // return data
//   return chartData
// }

// /**
//  * Get all transactions on pool
//  * @param address
//  */
// export function usePoolTransactions(address: string): Transaction[] | undefined {
//   const dispatch = useDispatch()
//   const [activeNetwork] = useActiveNetworkVersion()
//   const pool = useSelector((state: AppState) => state.pools.byAddress[activeNetwork.id]?.[address])
//   const transactions = pool?.transactions
//   const [error, setError] = useState(false)
//   const { dataClient } = useClients()

//   useEffect(() => {
//     async function fetch() {
//       const { error, data } = await fetchPoolTransactions(address, dataClient)
//       if (error) {
//         setError(true)
//       } else if (data) {
//         dispatch(updatePoolTransactions({ poolAddress: address, transactions: data, networkId: activeNetwork.id }))
//       }
//     }
//     if (!transactions && !error) {
//       fetch()
//     }
//   }, [address, dispatch, error, transactions, dataClient, activeNetwork.id])

//   // return data
//   return transactions
// }

// export function usePoolTickData(
//   address: string
// ): [PoolTickData | undefined, (poolAddress: string, tickData: PoolTickData) => void] {
//   const dispatch = useDispatch()
//   const [activeNetwork] = useActiveNetworkVersion()
//   const pool = useSelector((state: AppState) => state.pools.byAddress[activeNetwork.id]?.[address])
//   const tickData = pool.tickData

//   const setPoolTickData = useCallback(
//     (address: string, tickData: PoolTickData) =>
//       dispatch(updateTickData({ poolAddress: address, tickData, networkId: activeNetwork.id })),
//     [activeNetwork.id, dispatch]
//   )

//   return [tickData, setPoolTickData]
// }
