import { MetadataDef } from '@polkadot/extension-inject/types'
import { Registry } from '@polkadot/types/types'
import { Metadata, TypeRegistry } from '@polkadot/types'
import { IdenticonTheme } from './identicon-theme'
import kusama from './kusama.json'
import polkadot from './polkadot.json'

export type Chain = {
  definition: any,
  genesisHash?: string,
  hasMetadata: boolean,
  isUnknown?: boolean,
  name: string,
  registry: Registry,
  specVersion: number,
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string,
  identiconTheme: IdenticonTheme,
  rpcServer: string,
  txExplorer: string,
  iconUrl: string
}

type ChainExternalInfo = {
  rpcServer: string,
  txExplorer: string,
  iconUrl: string
}

const definitions = new Map<string, any>(
  [kusama, polkadot].map((def) => [def.genesisHash, def])
)

const otherChainInfoMap = new Map<string, ChainExternalInfo>(
  [
    [
      '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      {
        rpcServer: 'wss://rpc.polkadot.io',
        txExplorer: 'https://polkascan.io/polkadot/transaction/',
        iconUrl: '/assets/chain-logo/polkadot.png'
      }
    ],
    [
      '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe',
      {
        rpcServer: 'wss://kusama-rpc.polkadot.io/',
        txExplorer: 'https://polkascan.io/kusama/transaction/',
        iconUrl: '/assets/chain-logo/kusama.png'
      }
    ]
  ]
)

const unknownOtherChainInfo = {
  rpcServer: '',
  txExplorer: '',
  iconUrl: '/assets/chain-logo/substrate.png'
}

const expanded = new Map<string, Chain>()

export function metadataExpand (definition: MetadataDef, isPartial = false): Chain {
  const cached = expanded.get(definition.genesisHash)

  if (cached && cached.specVersion === definition.specVersion) {
    return cached
  }

  const {
    chain, genesisHash, icon, metaCalls,
    specVersion, ss58Format, tokenDecimals,
    tokenSymbol, types
  } = definition
  const registry = new TypeRegistry()

  if (!isPartial) {
    registry.register(types)
  }

  const isUnknown = genesisHash === '0x'

  registry.setChainProperties(registry.createType('ChainProperties', {
    ss58Format,
    tokenDecimals,
    tokenSymbol
  }))

  const metadata = metaCalls && !isPartial
    ? new Metadata(registry, Buffer.from(metaCalls, 'base64'))
    : null

  const otherChainInfo = otherChainInfoMap.get(definition.genesisHash) || unknownOtherChainInfo

  const result = {
    definition,
    genesisHash: isUnknown
      ? undefined
      : genesisHash,
    hasMetadata: !!metadata,
    identiconTheme: (icon || 'substrate') as IdenticonTheme,
    isUnknown,
    name: chain,
    registry,
    specVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    ...otherChainInfo
  }

  if (result.genesisHash && !isPartial) {
    expanded.set(result.genesisHash, result)
  }

  return result
}

export function findChain (genesisHash: string): Chain {
  const def = definitions.get(genesisHash)
  if (def) return metadataExpand(def)
  throw new Error('unsupported chain')
}

export function addMetadata (def: MetadataDef): void {
  definitions.set(def.genesisHash, def)
}

export function knownMetadata (): MetadataDef[] {
  return [...definitions.values()]
}

let byName = {}
definitions.forEach((def) => {
  const chain = metadataExpand(def)
  byName[chain.name] = chain
})

export const chains: {[name: string]: Chain} = byName

export const DEFUALT_CHAIN = kusama.chain
