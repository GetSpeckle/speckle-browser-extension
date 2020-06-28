import {
  AuthorizeRequest,
  MessageTypes,
  RequestAuthorizeApprove,
  RequestAuthorizeReject,
  RequestSigningApprovePassword,
  RequestSigningApproveSignature,
  RequestSigningCancel,
  RequestTypes,
  ResponseTypes,
  SigningRequest
} from '../types'

import { assert } from '@polkadot/util'

import State from './State'
import { createSubscription, unsubscribe } from './subscriptions'
import keyringVault from '../services/keyring-vault'
import { Runtime } from 'webextension-polyfill-ts'
import { TypeRegistry } from '@polkadot/types'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types'
import { findChain } from '../../constants/chains'
import t from '../../services/i18n'

export default class Extension {

  private state: State

  constructor (state: State) {
    this.state = state
  }

  private authorizeSubscribe (id: string, port: Runtime.Port): boolean {
    const cb = createSubscription<'pri(authorize.subscribe)'>(id, port)
    const subscription = this.state.authSubject.subscribe(
      (requests: Array<AuthorizeRequest>) => (cb(requests)))

    port.onDisconnect.addListener(() => {
      unsubscribe(id)
      subscription.unsubscribe()
    })

    return true
  }

  private signingSubscribe (id: string, port: Runtime.Port): boolean {
    const cb = createSubscription<'pri(signing.subscribe)'>(id, port)
    const subscription = this.state.signSubject.subscribe((requests: SigningRequest[]): void =>
      cb(requests)
    )

    port.onDisconnect.addListener(() => {
      unsubscribe(id)
      subscription.unsubscribe()
    })

    return true
  }

  private authorizeApprove ({ id }: RequestAuthorizeApprove): boolean {
    const queued = this.state.getAuthRequest(id)
    assert(queued, t('requestNotFound'))
    const { resolve } = queued
    resolve(true)
    return true
  }

  private authorizeReject ({ id }: RequestAuthorizeReject): boolean {
    const queued = this.state.getAuthRequest(id)
    assert(queued, t('requestNotFound'))
    const { reject } = queued
    reject(new Error('Rejected'))
    return true
  }

  private signingApprovePassword ({ id, password }: RequestSigningApprovePassword): boolean {
    const queued = this.state.getSignRequest(id)
    assert(queued, t('requestNotFound'))
    const { request, resolve, reject } = queued
    if (!keyringVault.accountExists(request.payload.address)) {
      reject(new Error(t('accountNotFound')))
      return false
    }
    keyringVault.unlock(password).then(() => {
      const payload = request.payload
      const pair = keyringVault.getPair(payload.address)
      let registry
      if ((payload as SignerPayloadRaw).data) {
        registry = new TypeRegistry()
      } else {
        const signerPayload = (payload as SignerPayloadJSON)
        const chain = findChain(signerPayload.genesisHash)
        registry = chain.registry
      }
      if (pair.isLocked) {
        pair.decodePkcs8(password)
      }
      const result = request.sign(registry, pair)
      resolve({
        id,
        ...result
      })
    }).catch(error => {
      reject(error)
    })
    return true
  }

  private signingApproveSignature ({ id, signature }: RequestSigningApproveSignature): boolean {
    const queued = this.state.getSignRequest(id)
    assert(queued, t('requestNotFound'))
    const { resolve } = queued
    resolve({ id, signature })
    return true
  }

  private signingCancel ({ id }: RequestSigningCancel): boolean {
    const queued = this.state.getSignRequest(id)
    assert(queued, t('requestNotFound'))
    const { reject } = queued
    reject(new Error('Cancelled'))
    return true
  }

  async handle<TMessageType extends MessageTypes>
    (id: string, type: TMessageType, request: RequestTypes[TMessageType], port: Runtime.Port)
    : Promise<ResponseTypes[keyof ResponseTypes]> {
    switch (type) {
      case 'pri(authorize.approve)':
        return this.authorizeApprove(request as RequestAuthorizeApprove)

      case 'pri(authorize.reject)':
        return this.authorizeReject(request as RequestAuthorizeReject)

      case 'pri(authorize.subscribe)':
        return this.authorizeSubscribe(id, port)

      case 'pri(signing.approve.password)':
        return this.signingApprovePassword(request as RequestSigningApprovePassword)

      case 'pri(signing.approve.signature)':
        return this.signingApproveSignature(request as RequestSigningApproveSignature)

      case 'pri(signing.cancel)':
        return this.signingCancel(request as RequestSigningCancel)

      case 'pri(signing.subscribe)':
        return this.signingSubscribe(id, port)

      default:
        throw new Error(t('unableHandleMessage') + type)
    }
  }
}
