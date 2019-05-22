import { Chain, Polkadot, Substrate, Edgeware } from './chains'

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
  txExplorer: 'https://polkascan.io/pre/alexander/system/extrinsic/'
}

export const CharredCherry: Network = {
  chain: Substrate,
  name: 'Charred-Cherry',
  rpcServer: 'wss://substrate-rpc.parity.io/',
  txExplorer: 'https://polkadot.js.org/apps/#/explorer'
}

export const TestNode: Network = {
  chain: Edgeware,
  name: 'Edgeware(test)',
  rpcServer: 'wss://testnode.edgewa.re/',
  txExplorer: 'https://polkascan.io/pre/edgeware-testnet/system/extrinsic/'
}

export const chains: {[chainType: string]: Array<Network>} = {
  [Polkadot.chainType]: [Alexander],
  [Substrate.chainType]: [CharredCherry]
}

export const networks: {[name: string]: Network} = {
  [Alexander.name]: Alexander,
  [CharredCherry.name]: CharredCherry,
  [TestNode.name]: TestNode
}
