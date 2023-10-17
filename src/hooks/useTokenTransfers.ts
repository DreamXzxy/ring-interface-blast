import { useEffect, useState, useMemo } from 'react';

const CHAINBASE_API = process.env.REACT_APP_CHAIN_BASE_API

export interface TokenTransfers {
  code: number
  count: number
  data: Array<object>
  message: string
  next_page: number
}

function useTokenTransfers(): {
  data: TokenTransfers | null,
  error:null,
  loading: boolean
} {
  const [data, setData] = useState<TokenTransfers | null>(null);
  const [error, setError] = useState<any>(null);  // Replace 'any' with the actual error type
  const [loading, setLoading] = useState(true);

  const url = useMemo(() => (
    'https://api.chainbase.online/v1/token/transfers?' +
    'chain_id=1&' +
    'contract_address=0x3b94440C8c4F69D5C9F47BaB9C5A93064Df460F5&' +
    'from_block=0&' +
    'to_block=latest&' +
    'page=1&' +
    'limit=100'
  ), []);
  
  if (CHAINBASE_API === undefined) {
    throw new Error(`CHAINBASE_API must be a defined environment variable`)
  }

  useEffect(() => {
    setLoading(true);
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-api-key': CHAINBASE_API
      }
    })
    .then(response => response.json())
    .then(responseData => {
      setData(responseData);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [url]);
  
  return { data, error, loading };
}

export default useTokenTransfers;
