export type ChainType = 'Polkadot' | 'Substrate' | 'Bitcoin' | 'Ethereum'

export type Chain = {
  chainType: ChainType,
  iconUrl: string
}

export const Polkadot: Chain = {
  chainType: 'Polkadot',
  iconUrl: '/assets/chain-logo/polkadot.png'
}

export const Substrate: Chain = {
  chainType: 'Substrate',
  iconUrl: '/assets/chain-logo/substrate.png'
}

export const Edgeware: Chain = {
  chainType: 'Substrate',
  iconUrl: '/assets/chain-logo/edgeware.png'
}
