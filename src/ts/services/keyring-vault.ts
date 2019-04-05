import {
  KeyringInstance,
  KeyringPair, KeyringPair$Json
} from '@polkadot/keyring/types'
import Keyring from '@polkadot/keyring'
import { Prefix } from '@polkadot/keyring/address/types'
import createPair from '@polkadot/keyring/pair'
import { hexToU8a } from '@polkadot/util'
import { LocalStore } from './local-store'

export class KeyringVault {

  private _vaultKey: string = 'speckle-vault'
  private _keyring?: KeyringInstance
  private _password?: string

  get keyring (): KeyringInstance {
    if (this._keyring) {
      return this._keyring
    }
    throw new Error(`Keyring is not initialised yet`)
  }

  initKeyring (addressPrefix: Prefix): void {
    this._keyring = new Keyring({ addressPrefix, type: 'sr25519' })
  }

  unlock (password: string): Promise<boolean> {
    this._password = password
    return LocalStore.get(this._vaultKey).then((vault) => {
      if (!vault) return false
      let values = Object.values(vault)
      if (values.length === 0) return false
      try {
        return this.restoreAccount(values[0], password).then(() => {
          return true
        })
      } catch (error) {
        this._password = undefined
        return new Promise<boolean>(() => {
          return false
        })
      }
    })
  }

  decodeAddress (key: string | Uint8Array, ignoreChecksum?: boolean): Uint8Array {
    return this.keyring.decodeAddress(key, ignoreChecksum)
  }

  restoreAccount (json: KeyringPair$Json, password: string): Promise<KeyringPair> {
    const pair = createPair(
      this.keyring.type,
      {
        // FIXME Just for the transition period (ignoreChecksum)
        publicKey: this.decodeAddress(json.address, true)
      },
      json.meta,
      hexToU8a(json.encoded)
    )

    // unlock, save account and then lock (locking cleans secretKey, so needs to be last)
    pair.decodePkcs8(password)
    return this.addPair(pair, password).then((result: CreateResult) => {
      result.pair.lock()
      return result.pair
    })
  }

  addPair (pair: KeyringPair, password: string): Promise<CreateResult> {
    this.keyring.addPair(pair)
    return this.saveAccount(pair, password).then((json) => {
      return {
        json,
        pair
      }
    })
  }

  saveAccount (pair: KeyringPair, password?: string): Promise<KeyringPair$Json> {
    this.addTimestamp(pair)
    const json = pair.toJson(password)
    this.keyring.addFromJson(json)
    return this.store(json.address, json).then((json) => {
      return json
    })
  }

  protected addTimestamp (pair: KeyringPair): void {
    if (!pair.getMeta().whenCreated) {
      pair.setMeta({  whenCreated: Date.now() })
    }
  }

  private store (address: string, json: KeyringPair$Json): Promise<KeyringPair$Json> {
    return LocalStore.get(this._vaultKey).then((vault: any) => {
      if (vault) {
        vault[address] = json
        return LocalStore.setValue(this._vaultKey, vault)
      } else {
        vault = {}
        vault[address] = json
        return LocalStore.setValue(this._vaultKey, vault)
      }
    })
  }
}

export type CreateResult = {
  json: KeyringPair$Json,
  pair: KeyringPair
}

const keyringVault = new KeyringVault()

export default keyringVault
