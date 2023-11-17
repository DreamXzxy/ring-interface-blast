export interface OpenSeaCollection {
  name: string
  slug: string
  image_url: string
  description: string
  external_url: string
  featured: boolean
  hidden: boolean
  safelist_request_status: string
  is_subject_to_whitelist: boolean
  large_image_url: string
  only_proxied_transfers: boolean
  payout_address: string
}

export interface OpenSeaAsset {
  id?: number
  image_url?: string
  image_preview_url?: string
  name?: string
  token_id?: string
  last_sale?: {
    total_price: string
  }
  asset_contract?: {
    address: string
    schema_name: 'ERC1155' | 'ERC721' | string
    asset_contract_type: string
    created_date: string
    name: string
    symbol: string
    description: string
    external_link: string
    image_url: string
    default_to_fiat: boolean
    only_proxied_transfers: boolean
    payout_address: string
  }
  collection?: OpenSeaCollection
}

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  Dust = 'Dust',
  Cryptopunk = 'Cryptopunk',
}

export interface PriceInfo {
  ETHPrice: string
  USDPrice?: string
  baseAsset: string
  baseDecimals: string
  basePrice: string
}

export interface AssetSellOrder {
  ammFeePercent: number
  ethReserves: number
  tokenReserves: number
}

export interface Rarity {
  primaryProvider: string
  providers?: { provider: string; rank?: number; url?: string; score?: number }[]
}

export interface Trait {
  trait_type: string
  trait_value: string
  display_type?: any
  max_value?: any
  trait_count?: number
  order?: any
}

export enum ToolTipType {
  pool,
  sus,
}

export enum DetailsOrigin {
  COLLECTION = 'collection',
  PROFILE = 'profile',
  EXPLORE = 'explore',
}
