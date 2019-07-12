import { Hash } from '@polkadot/types'
import { AnyU8a, AnyNumber } from '@polkadot/types/types'

export type MessageTypes = 'authorize.approve' | 'authorize.reject'
  | 'authorize.requests' | 'authorize.subscribe' | 'authorize.tab'
  | 'accounts.list' | 'accounts.subscribe' | 'extrinsic.sign'
  | 'signing.approve' | 'signing.cancel' | 'signing.requests' | 'signing.subscribe'

export type AuthorizeRequest = [string, MessageAuthorize, string]

export type SigningRequest = [string, MessageExtrinsicSign, string]

export type SignerOptions = {
  blockHash: AnyU8a
  genesisHash: Hash
  nonce: AnyNumber
}

export type MessageAuthorize = {
  origin: string
}

export type MessageAuthorizeApprove = {
  id: string
}

export type MessageAuthorizeReject = {
  id: string
}

export type MessageRequest = {
  id: string,
  message: MessageTypes,
  request: any
}

export type MessageExtrinsicSignApprove = {
  id: string,
  password: string
}

export type MessageExtrinsicSignCancel = {
  id: string
}

export type MessageExtrinsicSign = {
  address: string,
  blockHash: string,
  genesisHash: string,
  method: string,
  nonce: string
}

export type MessageExtrinsicSign$Response = {
  id: string,
  signature: string
}

export type MessageSeedCreate$Response = {
  address: string,
  seed: string
}

export type MessageSeedValidate$Response = {
  address: string,
  seed: string
}
