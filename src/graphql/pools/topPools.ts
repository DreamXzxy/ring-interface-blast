import { useQuery } from '@apollo/client'
import { POOL_HIDE } from 'constants/networks'
import gql from 'graphql-tag'
import { useMemo } from 'react'
import { useActiveNetworkVersion, useClients } from 'state/infoapplication/hooks'
// import { notEmpty } from 'utils'
import { notEmpty } from 'utils/notEmpty'

const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
    }
  }
`

interface TopPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export function useTopPoolAddresses(): {
  loading: boolean
  error: boolean
  addresses?: string[]
} {
  const [currentNetwork] = useActiveNetworkVersion()
  const { dataClient } = useClients()
  const { loading, error, data } = useQuery<TopPoolsResponse>(TOP_POOLS, {
    client: dataClient,
    fetchPolicy: 'cache-first',
  })

  const formattedData = useMemo(() => {
    if (data) {
      return data.pools
        .map((p) => {
          if (POOL_HIDE[currentNetwork.id].includes(p.id.toLocaleLowerCase())) {
            return undefined
          }
          return p.id
        })
        .filter(notEmpty)
    } else {
      return undefined
    }
  }, [currentNetwork.id, data])

  return {
    loading,
    error: Boolean(error),
    addresses: formattedData,
  }
}
