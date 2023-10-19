import { addressesArray, RNG_ADDRESS } from 'constants/tokens'
import { Chain } from 'graphql/data/__generated__/types-and-hooks'
import { InfoToken } from 'graphql/data/TopTokens'
import { supportedChainIdFromGQLChain, unwrapToken } from 'graphql/data/util'
import { useEffect, useMemo, useReducer } from 'react'
import { PoolData } from 'state/pools/reducer'

import { useSearchTokens } from '../graphql/data/SearchTokens'

interface UseInfoTokensReturnValue {
  infoTokens?: InfoToken[]
  loadingTokens: boolean
}

interface State {
  loading: boolean;
  infoTokens: InfoToken[] | undefined;  // Updated type here
}

interface Action {
  type: string;
  payload?: InfoToken[];
}

function useMultipleSearchTokens(addresses: string[], chainId?: number) {
  const tokensDataArray = addresses.map((address) => useSearchTokens(address, chainId ?? 1))

  return tokensDataArray
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'SET_INFO_TOKENS':
            return { ...state, loading: false, infoTokens: action.payload || undefined };  // Updated fallback value here
        default:
            throw new Error();
    }
}

function useTokensForAddresses(addresses: string[], chainId?: number) {
  const tokensDataArray = useMultipleSearchTokens(addresses, chainId)

  const tokens = useMemo(() => {
    const combinedTokens = []

    for (const tokensData of tokensDataArray) {
      if (!tokensData.loading && !tokensData.error) {
        combinedTokens.push(...tokensData.data)
      }
    }

    return combinedTokens
  }, [tokensDataArray])

  const loading = tokensDataArray.some((tokensData) => tokensData.loading)
  const error = tokensDataArray.find((tokensData) => tokensData.error)

  return {
    tokens,
    loading,
    error,
  }
}

export function useInfoTokens(poolDatas: PoolData[], chain: Chain): UseInfoTokensReturnValue {
  const [state, dispatch] = useReducer(reducer, { loading: true, infoTokens: undefined });
  const chainId = supportedChainIdFromGQLChain(chain);
  const { tokens: allTokens, loading: loadingTokens } = useTokensForAddresses(addressesArray, chainId);
  const unwrappedTokens = allTokens.map((token: any) => unwrapToken(chainId ?? 1, token));

  // Directly create tokensArray in useMemo
  const tokensArray = useMemo(() => {
    const tokensArr: InfoToken[] = [];
    poolDatas.forEach((poolData) => {
      const { token1, token0, tvlUSD, volumeUSD, volumeUSDWeek } = poolData;
      const address0 = token0.address.toLowerCase();
      const address1 = token1.address.toLowerCase();
      
      let addressKey = address1;

      // sort tokens
      if (address1 === RNG_ADDRESS.toLowerCase()) {
        addressKey = address0;
      }

      // weth
      if (addressKey === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        addressKey = 'NATIVE'
      }

      const matchingToken = unwrappedTokens.find((token: any) => token.address === addressKey);  // Consider providing a proper type for 'token' instead of 'any'

      if (matchingToken) {
        const infoToken = {
          ...matchingToken,
          tvlUSD,
          volumeUSD,
          volumeUSDWeek,
        };
        tokensArr.push(infoToken);
      }
    });
    return tokensArr;
  }, [poolDatas, unwrappedTokens]);

  useEffect(() => {
    if (!loadingTokens && tokensArray.length > 0) {
      dispatch({ type: 'SET_INFO_TOKENS', payload: tokensArray });
    }
  }, [loadingTokens, tokensArray]);

  return {
    infoTokens: state.loading ? undefined : state.infoTokens,
    loadingTokens: state.loading,
  };
}
