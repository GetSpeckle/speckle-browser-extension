// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeRegistry } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { RequestSign } from './types'
import { SignerPayloadJSON } from '@polkadot/types/types'

export default class RequestExtrinsicSign implements RequestSign {
  public readonly payload: SignerPayloadJSON

  constructor (payload: SignerPayloadJSON) {
    this.payload = payload
  }

  sign (registry: TypeRegistry, pair: KeyringPair): { signature: string } {
    // inject the current signed extensions for encoding
    registry.setSignedExtensions(this.payload.signedExtensions)
    return registry
      .createType('ExtrinsicPayload', this.payload, { version: this.payload.version })
      .sign(pair)
  }
}
