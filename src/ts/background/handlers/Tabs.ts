import {
  SimpleAccounts,
  RequestAuthorizeTab,
  RequestTypes,
  ResponseTypes,
  MessageTypes, ResponseSigning
} from '../types'

import { assert } from '@polkadot/util'
import State from './State'
import { createSubscription, unsubscribe } from './subscriptions'
import keyringVault from '../services/keyring-vault'
import { Runtime } from 'webextension-polyfill-ts'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types'
import RequestBytesSign from '../RequestBytesSign'
import { KeyringPair } from '@polkadot/keyring/types'
import RequestExtrinsicSign from '../RequestExtrinsicSign'
import t from '../../services/i18n'

export default class Tabs {

  private state: State

  public constructor (state: State) {
    this.state = state
  }

  private authorize (url: string, request: RequestAuthorizeTab): Promise<boolean> {
    console.log(url, request)
    return this.state.authorizeUrl(url, request)
  }

  // @ts-ignore
  private accountsList (url: string): Promise<SimpleAccounts> {
    return keyringVault.getSimpleAccounts()
  }

  private accountsSubscribe (url: string, id: string, port: Runtime.Port): boolean {
    console.log(url)
    const cb = createSubscription<'pub(accounts.subscribe)'>(id, port)
    keyringVault.getSimpleAccounts().then(accounts => cb(accounts))
    port.onDisconnect.addListener((): void => {
      unsubscribe(id)
    })
    return true
  }

  private getSigningPair (address: string): KeyringPair {
    const accountExists = keyringVault.accountExists(address)
    assert(accountExists, t('accountNotFound'))
    return keyringVault.getPair(address)
  }

  private bytesSign (url: string, request: SignerPayloadRaw): Promise<ResponseSigning> {
    const address = request.address
    const pair = this.getSigningPair(address)
    return this.state.sign(url, new RequestBytesSign(request), { address, ...pair.meta })
  }

  private extrinsicSign (url: string, request: SignerPayloadJSON): Promise<ResponseSigning> {
    const address = request.address
    const pair = this.getSigningPair(address)
    return this.state.sign(url, new RequestExtrinsicSign(request), { address, ...pair.meta })
  }

  public async handle<TMessageType extends MessageTypes> (id: string, type: TMessageType,
                                                          request: RequestTypes[TMessageType],
                                                          url: string, port: Runtime.Port):
    Promise<ResponseTypes[keyof ResponseTypes]> {
    if (type !== 'pub(authorize.tab)') {
      this.state.ensureUrlAuthorized(url)
    }

    switch (type) {
      case 'pub(authorize.tab)':
        return this.authorize(url, request as RequestAuthorizeTab)

      case 'pub(accounts.list)':
        return this.accountsList(url)

      case 'pub(accounts.subscribe)':
        return this.accountsSubscribe(url, id, port)

      case 'pub(bytes.sign)':
        return this.bytesSign(url, request as SignerPayloadRaw)

      case 'pub(extrinsic.sign)':
        return this.extrinsicSign(url, request as SignerPayloadJSON)

      default:
        throw new Error(t('unableHandleMessage') + type)
    }
  }
}
