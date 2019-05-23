import { browser } from 'webextension-polyfill-ts'
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types'
import * as FUNCS from '../constants/keyring-vault-funcs'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import Keyring from '@polkadot/keyring'

const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })

export function isWalletLocked (): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    port.onMessage.addListener(msg => {
      if (msg.method === FUNCS.IS_LOCKED) {
        resolve(msg.result)
      }
    })
    port.postMessage({ method: FUNCS.IS_LOCKED })
  })
}

export function lockWallet (): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.LOCK) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.LOCK })
  })
}

export function isWalletUnlocked (): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.IS_UNLOCKED) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.IS_UNLOCKED })
  })
}

export function unlockWallet (password: string, addressPrefix?: string):
  Promise<Array<KeyringPair$Json>> {
  return new Promise<Array<KeyringPair$Json>>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.UNLOCK) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.UNLOCK, password: password, addressPrefix: addressPrefix })
  })
}

export function walletExists (): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.WALLET_EXISTS) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.WALLET_EXISTS })
  })
}

export function getAccounts (): Promise<Array<KeyringPair$Json>> {
  return new Promise<Array<KeyringPair$Json>>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.GET_ACCOUNTS) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.GET_ACCOUNTS })
  })
}

export function generateMnemonic (): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.GENERATE_MNEMONIC) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.GENERATE_MNEMONIC })
  })
}

export function createAccount (mnemonic: string, accountName?: string): Promise<KeyringPair$Json> {
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.CREATE_ACCOUNT) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.CREATE_ACCOUNT, mnemonic: mnemonic, accountName: accountName })
  })
}

export function updateAccountName (address: string, accountName: string):
  Promise<KeyringPair$Json> {
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.UPDATE_ACCOUNT_NAME) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({
      method: FUNCS.UPDATE_ACCOUNT_NAME,
      address: address,
      accountName: accountName
    })
  })
}

export function getAccount (address: string): Promise<KeyringPair> {
  return new Promise<KeyringPair>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.GET_ACCOUNT) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({
      method: FUNCS.GET_ACCOUNT,
      address: address
    })
  })
}

export function removeAccount (address: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.REMOVE_ACCOUNT) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.REMOVE_ACCOUNT, address: address })
  })
}

export function isMnemonicValid (mnemonic: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.IS_MNEMONIC_VALID) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.IS_MNEMONIC_VALID, mnemonic: mnemonic })
  })
}

export function importAccountFromMnemonic (mnemonic: string, accountName: string):
  Promise<KeyringPair$Json> {
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.IMPORT_MNEMONIC) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({
      method: FUNCS.IMPORT_MNEMONIC,
      mnemonic: mnemonic,
      accountName: accountName
    })
  })
}

export function importAccountFromJson (json: KeyringPair$Json, password?: string):
  Promise<KeyringPair$Json> {
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.IMPORT_JSON) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({
      method: FUNCS.IMPORT_JSON,
      json: json,
      password: password
    })
  })
}

// TODO check if ignoreChecksum is necessary anymore
export function decodeAddress (key: string | Uint8Array, ignoreChecksum?: boolean):
  Promise<Uint8Array> {
  return cryptoWaitReady().then(() => {
    return new Keyring({ type: 'sr25519' }).decodeAddress(key, ignoreChecksum)
  })
}
