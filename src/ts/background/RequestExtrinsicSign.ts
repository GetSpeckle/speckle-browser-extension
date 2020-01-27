// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType, TypeRegistry } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { RequestSign } from './types'
import { SignerPayloadJSON } from '@polkadot/types/types'

export default class RequestExtrinsicSign implements RequestSign {
  inner: SignerPayloadJSON

  constructor (inner: SignerPayloadJSON) {
    this.inner = inner
  }

  sign (registry: TypeRegistry, pair: KeyringPair): { signature: string } {
    const inner = this.inner as SignerPayloadJSON
    const params = { version: inner.version }
    const extrinsic = createType(registry, 'ExtrinsicPayload', this.inner, params)
    return extrinsic.sign(pair)
  }
}
