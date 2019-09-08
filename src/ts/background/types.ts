// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerPayloadJSON } from '@polkadot/types/types'

export type MessageTypes = 'authorize.approve' | 'authorize.reject'
  | 'authorize.requests' | 'authorize.subscribe' | 'authorize.tab'
  | 'accounts.list' | 'accounts.subscribe' | 'extrinsic.sign'
  | 'signing.approve' | 'signing.cancel' | 'signing.requests' | 'signing.subscribe'

export type SimpleAccounts = Array<{ address: string, name?: string }>

export type AuthorizeRequest = [string, MessageAuthorize, string]

export type SigningRequest = [string, MessageExtrinsicSign, string]

export interface MessageAuthorize {
  origin: string
}

export interface MessageAuthorizeApprove {
  id: string
}

export interface MessageAuthorizeReject {
  id: string
}

export interface MessageRequest {
  id: string
  message: MessageTypes
  request: any
}

export interface MessageResponse {
  error?: string
  id: string
  response?: any
  subscription?: any
}

export interface MessageExtrinsicSignApprove {
  id: string
  password: string
}

export interface MessageExtrinsicSignCancel {
  id: string
}

export type MessageExtrinsicSign = SignerPayloadJSON

export interface MessageExtrinsicSignResponse {
  id: string
  signature: string
}
