import { NATIVE_CHAIN_ID } from 'constants/tokens'
import { InfoToken } from 'graphql/data/TopTokens'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'

export default function InfoTokenLogo(
  props: AssetLogoBaseProps & {
    token?: InfoToken
  }
) {
  return (
    <AssetLogo
      isNative={
        // TODO(cartcrom): simplify this check after backend fixes token standard on assetActivities tokens
        !props.token?.address || props.token?.address === NATIVE_CHAIN_ID
      }
      address={props.token?.address}
      symbol={props.token?.symbol}
      backupImg={props.token?.project?.logoUrl}
      {...props}
    />
  )
}
