import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { fetchPoolsForToken } from 'graphql/tokens/poolsForToken'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveNetworkVersion, useClients } from 'state/infoapplication/hooks'
import { AppState } from 'state/reducer'

import { addPoolAddresses, addTokenKeys, updateTokenData } from './actions'
import { TokenData } from './reducer'
// format dayjs with the libraries that we need
dayjs.extend(utc)

export function useAllTokenData(): {
  [address: string]: { data?: TokenData; lastUpdated?: number }
} {
  const [activeNetwork] = useActiveNetworkVersion()
  return useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id] ?? {})
}

export function useUpdateTokenData(): (tokens: TokenData[]) => void {
  const dispatch = useDispatch()
  const [activeNetwork] = useActiveNetworkVersion()

  return useCallback(
    (tokens: TokenData[]) => {
      dispatch(updateTokenData({ tokens, networkId: activeNetwork.id }))
    },
    [activeNetwork.id, dispatch]
  )
}

export function useAddTokenKeys(): (addresses: string[]) => void {
  const dispatch = useDispatch()
  const [activeNetwork] = useActiveNetworkVersion()
  return useCallback(
    (tokenAddresses: string[]) => dispatch(addTokenKeys({ tokenAddresses, networkId: activeNetwork.id })),
    [activeNetwork.id, dispatch]
  )
}

/**
 * Get top pools addresses that token is included in
 * If not loaded, fetch and store
 * @param address
 */
export function usePoolsForToken(address: string): string[] | undefined {
  const dispatch = useDispatch()
  const [activeNetwork] = useActiveNetworkVersion()
  const token = useSelector((state: AppState) => state.tokens.byAddress[activeNetwork.id]?.[address])

  const poolsForToken = token?.poolAddresses
  const [error, setError] = useState(false)
  const { dataClient } = useClients()

  useEffect(() => {
    // fetch()
    async function fetch() {
      const { loading, error, addresses } = await fetchPoolsForToken(address, dataClient)
      if (!loading && !error && addresses) {
        dispatch(addPoolAddresses({ tokenAddress: address, poolAddresses: addresses, networkId: activeNetwork.id }))
      }
      if (error) {
        setError(error)
      }
    }
    if (!poolsForToken && !error) {
      fetch()
    }
  }, [address, dispatch, error, poolsForToken, dataClient, activeNetwork.id])

  // return data
  return poolsForToken
}
