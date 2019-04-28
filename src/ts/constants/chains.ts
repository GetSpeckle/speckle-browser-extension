export type ChainType = 'Polkadot' | 'Substrate' | 'Bitcoin' | 'Ethereum'

export type Chain = {
  chainType: ChainType,
  iconUrl: string
}

export const Polkadot: Chain = {
  chainType: 'Polkadot',
  iconUrl: ''
}

export const Substrate: Chain = {
  chainType: 'Substrate',
  iconUrl: ''
}
