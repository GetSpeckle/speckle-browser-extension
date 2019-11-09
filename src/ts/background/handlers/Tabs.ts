import {
  SimpleAccounts,
  RequestAuthorizeTab,
  RequestExtrinsicSign,
  ResponseExtrinsicSign,
  RequestTypes,
  ResponseTypes,
  MessageTypes
} from '../types'

import { assert } from '@polkadot/util'
import State from './State'
import { createSubscription, unsubscribe } from './subscriptions'
import keyringVault from '../services/keyring-vault'
import { Runtime } from 'webextension-polyfill-ts'

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

  private extrinsicSign (url: string, request: RequestExtrinsicSign):
    Promise<ResponseExtrinsicSign> {
    const { address } = request
    const accountExists = keyringVault.accountExists(address)
    assert(accountExists, 'Unable to find account')
    const pair = keyringVault.getPair(address)
    return this.state.signQueue(url, request, { address, ...pair.meta })
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

      case 'pub(extrinsic.sign)':
        return this.extrinsicSign(url, request as RequestExtrinsicSign)

      default:
        throw new Error(`Unable to handle message of type ${type}`)
    }
  }
}
