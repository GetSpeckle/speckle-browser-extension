import { browser } from 'webextension-polyfill-ts'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import * as FUNCS from '../constants/keyring-vault-funcs'
import { SignerOptions } from '@polkadot/api/types'
import { IExtrinsic } from '@polkadot/types/types'
import { PORT_KEYRING } from '../constants/ports'
import { SimpleAccounts } from '../background/types'

const port = browser.runtime.connect(undefined, { name: PORT_KEYRING })

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

export function unlockWallet (password: string):
  Promise<Array<KeyringPair$Json>> {
  return new Promise<Array<KeyringPair$Json>>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.UNLOCK) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.UNLOCK, password })
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

export function signExtrinsic (extrinsic: IExtrinsic,
                               address: string,
                               signerOption: SignerOptions) {
  return new Promise<any>((resolve, reject) => {
    const { blockHash, genesisHash, nonce, blockNumber } = signerOption
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.SIGN_EXTRINSIC) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({
      method: FUNCS.SIGN_EXTRINSIC,
      messageExtrinsicSign: JSON.parse(JSON.stringify({
        address,
        blockHash,
        genesisHash,
        blockNumber,
        method: extrinsic.method.toHex(),
        era: extrinsic.era,
        nonce,
        version: extrinsic.version
      }))
    })
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

export function getSimpleAccounts (): Promise<SimpleAccounts> {
  return new Promise<SimpleAccounts>((resolve, reject) => {
    port.onMessage.addListener(msg => {
      if (msg.method !== FUNCS.GET_SIMPLE_ACCOUNTS) return
      if (msg.error) {
        reject(msg.error.message)
      }
      resolve(msg.result)
    })
    port.postMessage({ method: FUNCS.GET_SIMPLE_ACCOUNTS })
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
