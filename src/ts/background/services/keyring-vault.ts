import { KeyringInstance, KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types'
import Keyring, { decodeAddress } from '@polkadot/keyring'
import { LocalStore } from '../../services/local-store'
import { mnemonicGenerate, cryptoWaitReady, mnemonicValidate } from '@polkadot/util-crypto'
import t from '../../services/i18n'
import { SimpleAccounts } from '../types'
import { SignerPayloadJSON } from '@polkadot/types/types'
import { VALIDITY_INTERVAL } from '../../constants/config'
import { getPubkeyHex } from '../../services/address-transformer'
import { chains } from '../../constants/chains'

const VAULT_KEY: string = 'speckle-vault'

class KeyringVault {

  private _keyring?: KeyringInstance
  private _password?: string
  private _tempPassword?: string
  private _tempAccountName?: string
  private _mnemonic?: string
  private simpleAccounts?: SimpleAccounts
  private _accountSetupTimeout = 0
  private _accountSetupTimeoutTimerId = 0
  private _mnemonicTimeoutId = 0

  private get keyring (): KeyringInstance {
    if (this._keyring) {
      return this._keyring
    }
    throw new Error(t('keyringNotInit'))
  }

  init (): Promise<boolean> {
    return cryptoWaitReady().then(() => {
      this._keyring = new Keyring({ type: 'sr25519' })
      return LocalStore.getValue(VAULT_KEY).then(vault => {
        if (vault) {
          let accounts = Object.values(vault)
          try {
            accounts.forEach(account => {
              let pair = this.keyring.addFromJson(account as KeyringPair$Json)
              this.keyring.addPair(pair)
            })
            return true
          } catch (e) {
            this.keyring.getPairs().forEach(pair => {
              this.keyring.removePair(pair.address)
            })
            return Promise.reject(new Error(t('passwordError')))
          }
        }
        return true
      })
    })
  }

  getTempPassword (): string {
    return this._tempPassword || ''
  }

  setTempPassword (tempPassword: string): void {
    // Update the password and start the timer only if user has changed the password
    if (this._tempPassword !== tempPassword) {
      this._tempPassword = tempPassword

      // Start timer for password expiry
      this.startExpiryTimer()
    }
  }

  clearTempPassword (): void {
    this._tempPassword = undefined
  }

  getTempAccountName (): string {
    return this._tempAccountName || ''
  }

  setTempAccountName (tempAccountName: string): void {
    // Update the account name
    if (this._tempAccountName !== tempAccountName) {
      this._tempAccountName = tempAccountName
    }
  }

  getAccountSetupTimeout (): number {
    return this._accountSetupTimeout
  }

  cancelAccountSetup (): void {
    this.clearExpiryTimer()
    this.clearTempPassword()
    this.clearMnemonic(true)
  }

  startExpiryTimer (): void {
    this._accountSetupTimeout = VALIDITY_INTERVAL

    this._accountSetupTimeoutTimerId = window.setInterval(() => {
      this._accountSetupTimeout = (this._accountSetupTimeout as number) - 1
    }, 1000)
  }

  clearExpiryTimer (): void {
    clearInterval(this._accountSetupTimeoutTimerId)
    this._accountSetupTimeout = 0
    this._accountSetupTimeoutTimerId = 0
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

  async unlock (password: string): Promise<KeyringPair$Json[]> {
    if (this.isUnlocked()) {
      return new Promise<Array<KeyringPair$Json>>(
        resolve => {
          resolve(this.keyring.getPairs().map(pair => pair.toJson(this._password)))
        }
      )
    }
    if (!password.length) return Promise.reject(new Error(t('passwordError')))
    if (!this._keyring) await this.init()
    return LocalStore.getValue(VAULT_KEY).then(vault => {
      if (vault) {
        let accounts = Object.values(vault)
        try {
          accounts.forEach(account => {
            let pair = this.keyring.addFromJson(account as KeyringPair$Json)
            pair.decodePkcs8(password)
            this.keyring.addPair(pair)
          })
          this._password = password
          return accounts as KeyringPair$Json[]
        } catch (e) {
          this.keyring.getPairs().forEach(pair => {
            this.keyring.removePair(pair.address)
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
    if (!this._mnemonic) {
      this._mnemonic = mnemonicGenerate()

      if (this._accountSetupTimeoutTimerId === 0) {
        // Start timer for mnemonic expiry
        this.startExpiryTimer()
      }

      // Work-around to avoid timer elapsing before time left on the UI.
      // Root cause: Upon re-opening the Popup, background service is paused for a moment.
      const timeout = (this._accountSetupTimeout + 1) * 1000

      this._mnemonicTimeoutId = window.setTimeout(() => {
        this.clearTempPassword()
        this.clearMnemonic(false)
        this.clearExpiryTimer()
        this._mnemonicTimeoutId = 0
      }, timeout)
    }
    return this._mnemonic
  }

  getMnemonic (): string {
    return this._mnemonic || ''
  }

  clearMnemonic (isCancelled: boolean): void {
    this._mnemonic = undefined
    this._tempAccountName = undefined

    // On cancelling account setup, remove `setTimeout` timer
    if (isCancelled) {
      window.clearTimeout(this._mnemonicTimeoutId)
      this._mnemonicTimeoutId = 0
    }
  }

  isMnemonicValid (mnemonic: string): boolean {
    return mnemonicValidate(mnemonic)
  }

  getAccounts (): Array<KeyringPair$Json> {
    if (this.isLocked()) throw new Error(t('walletLocked'))
    return this.keyring.getPairs().map(pair => pair.toJson(this._password))
  }

  getSimpleAccounts (): Promise<SimpleAccounts> {
    return LocalStore.getValue(VAULT_KEY).then(vault => {
      if (!vault) return []
      let accounts = Object.values(vault)
      this.simpleAccounts = accounts.map(account => {
        const keyringPairJson = (account as KeyringPair$Json)
        return {
          address: keyringPairJson.address,
          genesisHash: keyringPairJson.meta.genesisHash as string,
          name: keyringPairJson.meta.name as string
        }
      })
      return this.simpleAccounts
    })
  }

  createAccount (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    if (this._mnemonic !== mnemonic) return Promise.reject(new Error(t('mnemonicUnmatched')))
    return cryptoWaitReady().then(() => {
      let pair = this.keyring.addFromUri(mnemonic, { name: accountName })
      this.clearTempPassword()
      this.clearMnemonic(false)
      this.clearExpiryTimer()
      return this.saveAccount(pair)
    })
  }

  updateAccountName (address: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    const pair = this.keyring.getPair(address)
    if (!pair) return Promise.reject(new Error(t('accountNotFound')))
    pair.setMeta({ ...pair.meta, name: accountName })
    return this.saveAccount(pair)
  }

  removeAccount (address: string) {
    if (this.isLocked()) throw new Error(t('walletLocked'))
    this.keyring.removePair(address)
    LocalStore.getValue(VAULT_KEY).then(async (vault) => {
      if (vault) {
        delete vault[getPubkeyHex(address)]
        await LocalStore.set({ VAULT_KEY: vault })
      }
    })
  }

  importAccountFromMnemonic (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    if (!this.isMnemonicValid(mnemonic)) return Promise.reject(new Error(t('mnemonicInvalid')))
    return cryptoWaitReady().then(() => {
      let pair = this.keyring.addFromUri(mnemonic, { name: accountName, imported: true })
      return this.saveAccount(pair)
    })
  }

  importAccountFromJson (json: KeyringPair$Json, password?: string): Promise<KeyringPair$Json> {
    if (this.isLocked()) return Promise.reject(new Error(t('walletLocked')))
    let pair: KeyringPair | undefined
    try {
      this.keyring.decodeAddress(json.address)
      pair = this.keyring.getPair(json.address)
      if (pair) return Promise.resolve(json)
    } catch (e) {
      // ignore Checksum error
    }
    try {
      pair = this.keyring.addFromJson(json, true)
      if (password) {
        pair.decodePkcs8(password)
      }
      pair.setMeta({ ...pair.meta, imported: true })
      return this.saveAccount(pair)
    } catch (e) {
      console.log(e)
      if (pair) this.keyring.removePair(pair.address)
      return Promise.reject(new Error(t('importKeystoreError')))
    }
  }

  signExtrinsic = async (chain: string, signerPayload: SignerPayloadJSON): Promise<string> => {
    const { address } = signerPayload
    const pair = this.keyring.getPair(address)
    if (!pair) {
      return Promise.reject(new Error(t('accountNotFound')))
    }
    const registry = chains[chain].registry
    registry.setSignedExtensions(signerPayload.signedExtensions)
    let params = { version: signerPayload.version }
    const payload = registry.createType('ExtrinsicPayload', signerPayload, params)
    if (pair.isLocked) {
      pair.decodePkcs8(this._password)
    }
    const result = payload.sign(pair)
    return Promise.resolve(result.signature)
  }

  accountExists = (address: string): boolean => {
    return !!this.simpleAccounts &&
      this.simpleAccounts!!.filter(
        account => decodeAddress(account.address).toString() === decodeAddress(address).toString()
      ).length > 0
  }

  getPair = (address: string): KeyringPair => {
    return this.keyring.getPair(address)
  }

  private saveAccount (pair: KeyringPair): Promise<KeyringPair$Json> {
    KeyringVault.addTimestamp(pair)
    const keyringPair$Json: KeyringPair$Json = pair.toJson(this._password)
    return LocalStore.getValue(VAULT_KEY).then(vault => {
      if (!vault) {
        vault = {}
      }
      vault[getPubkeyHex(keyringPair$Json.address)] = keyringPair$Json
      return LocalStore.setValue(VAULT_KEY, vault).then(() => {
        this.keyring.addPair(pair)
        return keyringPair$Json
      })
    })
  }

  private static addTimestamp (pair: KeyringPair): void {
    if (!pair.meta.whenCreated) {
      pair.setMeta({ ...pair.meta, whenCreated: Date.now() })
    }
  }
}

const keyringVault = new KeyringVault()

export default keyringVault
