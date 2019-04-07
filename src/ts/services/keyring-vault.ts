import { KeyringInstance, KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types'
import Keyring from '@polkadot/keyring'
import { Prefix } from '@polkadot/keyring/address/types'
import { LocalStore } from './local-store'
import { mnemonicGenerate, cryptoWaitReady, mnemonicValidate } from '@polkadot/util-crypto'
import t from './i18n'

class KeyringVault {

  private _vaultKey: string = 'speckle-vault'
  private _keyring?: KeyringInstance
  private _password?: string
  private _mnemonic?: string

  get keyring (): KeyringInstance {
    if (this._keyring) {
      return this._keyring
    }
    throw new Error(`Keyring is not initialised yet`)
  }

  unlock (password: string, addressPrefix?: Prefix): Promise<Array<KeyringPair$Json>> {
    if (this.isUnlocked()) throw new Error(t('error.wallet.unlocked'))
    if (!password.length) throw new Error(t('error.password'))
    // this will be redundant if we have polkadot js api initialisation
    return cryptoWaitReady().then(async () => {
      this._keyring = new Keyring({ addressPrefix, type: 'sr25519' })
      let vault = await LocalStore.get(this._vaultKey)
      if (vault) {
        let accounts = Object.values(vault[this._vaultKey])
        try {
          accounts.forEach((account) => {
            let pair = this.keyring.addFromJson(account as KeyringPair$Json)
            pair.decodePkcs8(password)
            this.keyring.addPair(pair)
          })
          return accounts as Array<KeyringPair$Json>
        } catch (e) {
          this.keyring.getPairs().forEach((pair) => {
            this.keyring.removePair(pair.address())
          })
          throw new Error(t('error.password'))
        }
      }
      this._password = password
      return []
    })
  }

  getAccounts (): Array<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    let accounts = new Array<KeyringPair$Json>()
    this.keyring.getPairs().forEach((pair) => {
      accounts.push(pair.toJson(this._password))
    })
    return accounts
  }

  lock () {
    this._password = undefined
    this._mnemonic = undefined
    this._keyring = undefined
  }

  generateMnemonic (): string {
    if (this.isLocked()) {
      throw new Error(t('error.wallet.locked'))
    }
    this._mnemonic = mnemonicGenerate()
    return this._mnemonic
  }

  createAccount (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    if (this._mnemonic !== mnemonic) throw new Error(t('error.mnemonic.unmatched'))
    let pair = this.keyring.addFromMnemonic(mnemonic, { name: accountName })
    this._mnemonic = undefined
    return this.saveAccount(pair).then((keyringPair$Json: KeyringPair$Json) => {
      return keyringPair$Json
    })
  }

  updateAccountName (address: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    const pair = this.keyring.getPair(address)
    if (!pair) throw new Error(t('error.account.notFound'))
    let meta = pair.getMeta()
    meta.name = accountName
    pair.setMeta(meta)
    this.keyring.addPair(pair)
    return this.saveAccount(pair).then((json) => {
      return json
    })
  }

  removeAccount (address: string) {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    this.keyring.removePair(address)
    LocalStore.get(this._vaultKey).then((vault) => {
      if (vault && vault[this._vaultKey]) {
        delete vault[this._vaultKey][address]
        return LocalStore.set(vault[this._vaultKey])
      }
      return
    })
  }

  isMnemonicValid (mnemonic: string): boolean {
    return mnemonicValidate(mnemonic)
  }

  importAccountFromMnemonic (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    if (!this.isMnemonicValid(mnemonic)) throw new Error(t('error.mnemonic.invalid'))
    let pair = this.keyring.createFromUri(mnemonic, { name: accountName, imported: true })
    this.keyring.addPair(pair)
    return this.saveAccount(pair).then((keyringPair$Json: KeyringPair$Json) => {
      return keyringPair$Json
    })
  }

  importAccountFromJson (json: KeyringPair$Json, password?: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('error.wallet.locked'))
    let pair = this.keyring.addFromJson(json)
    let meta = pair.getMeta()
    meta.imported = true
    pair.setMeta(meta)
    if (password) {
      pair.decodePkcs8(password)
    }
    this.keyring.addPair(pair)
    return this.saveAccount(pair).then((json) => {
      return json
    })
  }

  isLocked (): boolean {
    return !this._password
  }

  isUnlocked (): boolean {
    return !this.isLocked()
  }

  private saveAccount (pair: KeyringPair): Promise<KeyringPair$Json> {
    this.addTimestamp(pair)
    const json = pair.toJson(this._password)
    return LocalStore.get(this._vaultKey).then((vault: any) => {
      if (!vault) {
        vault = {}
      } else {
        vault = vault[this._vaultKey]
      }
      vault[json.address] = json
      return LocalStore.setValue(this._vaultKey, vault).then(() => {
        return json
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
