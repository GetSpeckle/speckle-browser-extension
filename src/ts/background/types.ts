import { Hash } from '@polkadot/types'
import { AnyU8a, AnyNumber } from '@polkadot/types/types'

export type SignerOptions = {
  blockHash: AnyU8a;
  genesisHash: Hash;
  nonce: AnyNumber;
}

export type MessageExtrinsicSign = {
  address: string,
  blockHash: string,
  genesisHash: string,
  method: string,
  nonce: string
}

export type MessageTypes = 'authorize.approve' | 'authorize.reject'
  | 'authorize.requests' | 'authorize.subscribe' | 'authorize.tab'
  | 'accounts.create' | 'accounts.edit' | 'accounts.forget' | 'accounts.list'
  | 'accounts.subscribe' | 'extrinsic.sign' | 'seed.create' | 'seed.validate'
  | 'signing.approve' | 'signing.cancel' | 'signing.requests' | 'signing.subscribe'
