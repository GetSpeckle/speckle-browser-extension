import { Chain, Polkadot, Substrate } from './chains'

export type Network = {
  chain: Chain,
  name: string,
  rpcServer: string,
  txExplorer: string
}

export const Alexander: Network = {
  chain: Polkadot,
  name: 'Alexander',
  rpcServer: 'wss://poc3-rpc.polkadot.io/',
  txExplorer: 'https://polkadot.js.org/apps/#/explorer'
}

export const CharredCherry: Network = {
  chain: Substrate,
  name: 'Charred Cherry',
  rpcServer: 'wss://substrate-rpc.parity.io/',
  txExplorer: 'https://polkadot.js.org/apps/#/explorer'
}

export const chains: {[chainType: string]: Array<Network>} = {
  'Polkadot': [Alexander],
  'Substrate': [CharredCherry]
}
