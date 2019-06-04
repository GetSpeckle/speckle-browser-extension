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
