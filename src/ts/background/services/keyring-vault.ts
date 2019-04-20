import { KeyringInstance, KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types'
import Keyring from '@polkadot/keyring'
import { Prefix } from '@polkadot/keyring/address/types'
import { LocalStore } from '../../services/local-store'
import { mnemonicGenerate, cryptoWaitReady, mnemonicValidate } from '@polkadot/util-crypto'
import t from '../../services/i18n'

const VAULT_KEY: string = 'speckle-vault'

class KeyringVault {

  private _keyring?: KeyringInstance
  private _password?: string
  private _mnemonic?: string

  private get keyring (): KeyringInstance {
    if (this._keyring) {
      return this._keyring
    }
    throw new Error(`Keyring is not initialised yet`)
  }

  isLocked (): boolean {
    return !this._password
  }

  isUnlocked (): boolean {
    return !this.isLocked()
  }

  lock () {
    this._password = undefined
    this._mnemonic = undefined
    this._keyring = undefined
  }

  unlock (password: string, addressPrefix?: Prefix): Promise<Array<KeyringPair$Json>> {
    if (this.isUnlocked()) {
      return new Promise<Array<KeyringPair$Json>>(
        resolve => {
          resolve(this.keyring.getPairs().map(pair => pair.toJson(this._password)))
        }
      )
    }
    if (!password.length) return Promise.reject(new Error(t('passwordError')))
    // this will be redundant if we have polkadot js api initialisation
    return cryptoWaitReady().then(async () => {
      this._keyring = new Keyring({ addressPrefix, type: 'sr25519' })
      let vault = await LocalStore.getValue(VAULT_KEY)
      if (vault) {
        let accounts = Object.values(vault)
        try {
          accounts.forEach(account => {
            let pair = this.keyring.addFromJson(account as KeyringPair$Json)
            pair.decodePkcs8(password)
            this.keyring.addPair(pair)
          })
          this._password = password
          return accounts as Array<KeyringPair$Json>
        } catch (e) {
          this.keyring.getPairs().forEach(pair => {
            this.keyring.removePair(pair.address())
          })
          return Promise.reject(new Error(t('passwordError')))
        }
      }
      this._password = password
      return []
    })
  }

  walletExists (): Promise<boolean> {
    return LocalStore.getValue(VAULT_KEY).then(value => !!value)
  }

  generateMnemonic (): string {
    this._mnemonic = mnemonicGenerate()
    return this._mnemonic
  }

  isMnemonicValid (mnemonic: string): boolean {
    return mnemonicValidate(mnemonic)
  }

  getAccounts (): Array<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('walletLocked'))
    let accounts = new Array<KeyringPair$Json>()
    this.keyring.getPairs().forEach(pair => {
      accounts.push(pair.toJson(this._password))
    })
    return accounts
  }

  createAccount (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    if (this._mnemonic !== mnemonic) return Promise.reject(new Error(t('mnemonicUnmatched')))
    let pair = this.keyring.addFromMnemonic(mnemonic, { name: accountName })
    this._mnemonic = undefined
    return this.saveAccount(pair)
  }

  updateAccountName (address: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    const pair = this.keyring.getPair(address)
    if (!pair) return Promise.reject(new Error(t('accountNotFound')))
    pair.setMeta({ ...pair.getMeta(), name: accountName })
    return this.saveAccount(pair)
  }

  removeAccount (address: string) {
    if (this.isLocked()) throw new Error(t('walletLocked'))
    this.keyring.removePair(address)
    LocalStore.getValue(VAULT_KEY).then(async (vault) => {
      if (vault) {
        delete vault[address]
        await LocalStore.set({ VAULT_KEY: vault })
      }
    })
  }

  importAccountFromMnemonic (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    if (!this.isMnemonicValid(mnemonic)) return Promise.reject(new Error(t('mnemonicInvalid')))
    let pair = this.keyring.createFromUri(mnemonic, { name: accountName, imported: true })
    return this.saveAccount(pair)
  }

  importAccountFromJson (json: KeyringPair$Json, password?: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    let pair = this.keyring.addFromJson(json)
    pair.setMeta({ ...pair.getMeta(), imported: true })
    if (password) {
      pair.decodePkcs8(password)
    }
    return this.saveAccount(pair)
  }

  private saveAccount (pair: KeyringPair): Promise<KeyringPair$Json> {
    this.addTimestamp(pair)
    const keyringPair$Json: KeyringPair$Json = pair.toJson(this._password)
    return LocalStore.getValue(VAULT_KEY).then(vault => {
      if (!vault) {
        vault = {}
      }
      vault[keyringPair$Json.address] = keyringPair$Json
      return LocalStore.setValue(VAULT_KEY, vault).then(() => {
        this.keyring.addPair(pair)
        return keyringPair$Json
      })
    })
  }

  private addTimestamp (pair: KeyringPair): void {
    if (!pair.getMeta().whenCreated) {
      pair.setMeta({ ...pair.getMeta(), whenCreated: Date.now() })
    }
  }
}

const keyringVault = new KeyringVault()

export default keyringVault
