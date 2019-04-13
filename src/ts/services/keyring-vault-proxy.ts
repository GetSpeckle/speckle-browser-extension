import { browser } from 'webextension-polyfill-ts'
import { KeyringPair$Json } from '@polkadot/keyring/types'

export function isWalletLocked (): Promise<boolean> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<boolean>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'isLocked') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'isLocked' })
  })
}

export function isWalletUnlocked (): Promise<boolean> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<boolean>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'isWalletUnlocked') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'isWalletUnlocked' })
  })
}
export function unlockWallet (password: string, addressPrefix?: string):
  Promise<Array<KeyringPair$Json>> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<Array<KeyringPair$Json>>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'unlock') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'unlock', password: password, addressPrefix: addressPrefix })
  })
}

export function walletExists (): Promise<boolean> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<boolean>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'walletExists') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'walletExists' })
  })
}

export function getAccounts (): Promise<Array<KeyringPair$Json>> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<Array<KeyringPair$Json>>((resolve, reject) => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'getAccounts') {
        if (msg.result) resolve(msg.result)
        else reject(msg.error)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'getAccounts' })
  })
}

export function generateMnemonic (): Promise<string> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<string>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'generateMnemonic') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'generateMnemonic' })
  })
}

export function createAccount (mnemonic: string, accountName: string): Promise<KeyringPair$Json> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'createAccount') {
        if (msg.result) resolve(msg.result)
        else reject(msg.error)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'createAccount', mnemonic: mnemonic, accountName: accountName })
  })
}

export function updateAccountName (address: string, accountName: string):
  Promise<KeyringPair$Json> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'updateAccountName') {
        if (msg.result) resolve(msg.result)
        else reject(msg.error)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'updateAccountName', address: address, accountName: accountName })
  })
}

export function removeAccount (address: string): Promise<void> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<void>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'removeAccount') {
        resolve()
        port.disconnect()
      }
    })
    port.postMessage({ method: 'removeAccount', address: address })
  })
}

export function isMnemonicValid (mnemonic: string): Promise<boolean> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<boolean>(resolve => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'isMnemonicValid') {
        resolve(msg.result)
        port.disconnect()
      }
    })
    port.postMessage({ method: 'isMnemonicValid', mnemonic: mnemonic })
  })
}

export function importAccountFromMnemonic (mnemonic: string, accountName: string):
  Promise<KeyringPair$Json> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'importAccountFromMnemonic') {
        if (msg.result) resolve(msg.result)
        else reject(msg.error)
        port.disconnect()
      }
    })
    port.postMessage({
      method: 'importAccountFromMnemonic',
      mnemonic: mnemonic,
      accountName: accountName
    })
  })
}

export function importAccountFromJson (json: KeyringPair$Json, password?: string):
  Promise<KeyringPair$Json> {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  return new Promise<KeyringPair$Json>((resolve, reject) => {
    port.onMessage.addListener((msg) => {
      if (msg.method === 'importAccountFromJson') {
        if (msg.result) resolve(msg.result)
        else reject(msg.error)
        port.disconnect()
      }
    })
    port.postMessage({
      method: 'importAccountFromJson',
      json: json,
      password: password
    })
  })
}
