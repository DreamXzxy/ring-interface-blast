// import { InfoToken } from "graphql/data/InfoTokens";
import { InfoToken } from "graphql/data/TopTokens";
import { PoolData } from "state/pools/reducer";

export interface CombinedData {
  address: string,
  tvlUSD: number;
  volumeUSD: number;
  volumeUSDWeek: number;
  symbol0?: string;
  symbol1?: string;
  tokenData?: InfoToken | null;
}

export function combinePoolData(poolDatas: PoolData[]): CombinedData {
  const combinedData: CombinedData = {
    address: '',
    tvlUSD: 0,
    volumeUSD: 0,
    volumeUSDWeek: 0
  };

  poolDatas.forEach((poolData) => {
    const { token1, token0, tvlUSD, volumeUSD, volumeUSDWeek } = poolData;
    const address0 = token0.address.toLowerCase();
    const address1 = token1.address.toLowerCase();
    const symbol0 = token0.symbol;
    const symbol1 = token1.symbol;

    let addressKey = address1;

    if (address1 === '0x3b94440c8c4f69d5c9f47bab9c5a93064df460f5'.toLowerCase()) {
      addressKey = address0;
    }

    // Update cumulative values
    combinedData.tvlUSD = (combinedData.tvlUSD || 0) + tvlUSD;
    combinedData.volumeUSD = (combinedData.volumeUSD || 0) + volumeUSD;
    combinedData.volumeUSDWeek = (combinedData.volumeUSDWeek || 0) + volumeUSDWeek;
    // Create a new entry in combinedData using the addressKey as the key
  });

  return combinedData;
}
