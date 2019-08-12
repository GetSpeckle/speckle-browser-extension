import {
  AuthorizeRequest,
  MessageTypes,
  MessageAuthorizeApprove,
  MessageAuthorizeReject,
  MessageExtrinsicSignApprove,
  MessageExtrinsicSignCancel,
  SigningRequest
} from '../types'

import { createType } from '@polkadot/types'
import { assert } from '@polkadot/util'

import State from './State'
import { createSubscription, unsubscribe } from './subscriptions'
import keyringVault from '../services/keyring-vault'
import { Runtime } from 'webextension-polyfill-ts'

export default class Extension {
  state: State

  constructor (state: State) {
    this.state = state
  }

  private authorizeSubscribe (id: string, port: Runtime.Port): boolean {
    const cb = createSubscription(id, port)
    const subscription = this.state.authSubject.subscribe(
      (requests: Array<AuthorizeRequest>) => (cb(requests)))

    port.onDisconnect.addListener(() => {
      unsubscribe(id)
      subscription.unsubscribe()
    })

    return true
  }

  private signingSubscribe (id: string, port: Runtime.Port): boolean {
    const cb = createSubscription(id, port)
    const subscription = this.state.signSubject.subscribe((requests: Array<SigningRequest>) =>
      cb(requests)
    )

    port.onDisconnect.addListener(() => {
      unsubscribe(id)
      subscription.unsubscribe()
    })

    return true
  }

  private authorizeApprove ({ id }: MessageAuthorizeApprove): boolean {
    const queued = this.state.getAuthRequest(id)
    assert(queued, 'Unable to find request')
    const { resolve } = queued
    resolve(true)
    return true
  }

  private authorizeReject ({ id }: MessageAuthorizeReject): boolean {
    const queued = this.state.getAuthRequest(id)
    assert(queued, 'Unable to find request')
    const { reject } = queued
    reject(new Error('Rejected'))
    return true
  }

  private signingApprove ({ id, password }: MessageExtrinsicSignApprove): boolean {
    const queued = this.state.getSignRequest(id)
    assert(queued, 'Unable to find request')
    const { request, resolve, reject } = queued
    if (!keyringVault.accountExists(request.address)) {
      reject(new Error('Unable to find account'))
      return false
    }
    const payload = createType('ExtrinsicPayload', request, { version: request.version })
    keyringVault.unlock(password).then(() => {
      const pair = keyringVault.getPair(request.address)
      const signature = payload.sign(pair)
      resolve({
        id,
        ...signature
      })
    })
    return true
  }

  private signingCancel ({ id }: MessageExtrinsicSignCancel): boolean {
    const queued = this.state.getSignRequest(id)
    assert(queued, 'Unable to find request')
    const { reject } = queued
    reject(new Error('Cancelled'))
    return true
  }

  async handle (id: string, type: MessageTypes, request: any, port: Runtime.Port)
    : Promise<any> {
    switch (type) {
      case 'authorize.approve':
        return this.authorizeApprove(request)

      case 'authorize.reject':
        return this.authorizeReject(request)

      case 'authorize.subscribe':
        return this.authorizeSubscribe(id, port)

      case 'signing.approve':
        return this.signingApprove(request)

      case 'signing.cancel':
        return this.signingCancel(request)

      case 'signing.subscribe':
        return this.signingSubscribe(id, port)

      default:
        throw new Error(`Unable to handle message of type ${type}`)
    }
  }
}
