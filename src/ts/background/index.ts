import { createStore } from 'redux'
import reducers, { IAppState, loadState } from './store/all'
import { wrapStore, Store } from 'react-chrome-redux'
import { configureApp } from './AppConfig'
import { browser } from 'webextension-polyfill-ts'
import keyringVault from '../services/keyring-vault'

const preloadedState = loadState()
const store: Store<IAppState> = createStore(reducers, preloadedState)

configureApp(store)

wrapStore(store, {
  // Communication port between the background component
  // nd views such as browser tabs.
  portName: 'ExPort'
})

// listen to the port
browser.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === '__SPECKLE__')
  port.onMessage.addListener(function (msg) {
    switch (msg.method) {
      case 'isLocked':
        port.postMessage({ method: 'isLocked', result: keyringVault.isLocked() })
        break
      case 'isUnlocked':
        port.postMessage({ method: 'isUnlocked', result: keyringVault.isUnlocked() })
        break
      case 'unlock':
        keyringVault.unlock(msg.password, msg.addressPrefix).then(keys => {
          port.postMessage({ method: 'unlock', result: keys })
        })
        break
      case 'walletExists':
        keyringVault.walletExists().then((result) => {
          port.postMessage({ method: 'unlock', result: result })
        })
        break
      case 'getAccounts':
        try {
          port.postMessage({
            method: 'getAccounts',
            result: keyringVault.getAccounts()
          })
        } catch (e) {
          port.postMessage({
            method: 'getAccounts',
            error: e
          })
        }
        break
      case 'lock':
        keyringVault.lock()
        port.postMessage({ method: 'lock', result: true })
        break
      case 'generateMnemonic':
        try {
          port.postMessage({ method: 'generateMnemonic', result: keyringVault.generateMnemonic() })
        } catch (e) {
          port.postMessage({ method: 'generateMnemonic', error: e })
        }
        break
      case 'createAccount':
        try {
          keyringVault.createAccount(msg.mnemonic, msg.accountName).then((pairJson) => {
            port.postMessage({ method: 'createAccount', result: pairJson })
          })
        } catch (e) {
          port.postMessage({ method: 'createAccount', error: e })
        }
        break
      case 'updateAccountName':
        try {
          keyringVault.updateAccountName(msg.address, msg.accountName).then((pairJson) => {
            port.postMessage({ method: 'updateAccountName', result: pairJson })
          })
        } catch (e) {
          port.postMessage({ method: 'updateAccountName', error: e })
        }
        break
      case 'removeAccount':
        try {
          keyringVault.removeAccount(msg.address)
        } catch (e) {
          port.postMessage({ method: 'removeAccount', error: e })
        }
        break
      case 'isMnemonicValid':
        port.postMessage({
          method: 'isMnemonicValid',
          result: keyringVault.isMnemonicValid(msg.mnemonic)
        })
        break
      case 'importAccountFromMnemonic':
        try {
          keyringVault.importAccountFromMnemonic(msg.mnemonic, msg.accountName).then((pairJson) => {
            port.postMessage({ method: 'importAccountFromMnemonic', result: pairJson })
          })
        } catch (e) {
          port.postMessage({ method: 'importAccountFromMnemonic', error: e })
        }
        break
      case 'importAccountFromJson':
        try {
          keyringVault.importAccountFromJson(msg.json, msg.password).then((pairJson) => {
            port.postMessage({ method: 'importAccountFromJson', resutl: pairJson })
          })
        } catch (e) {
          port.postMessage({ method: 'importAccountFromJson', error: e })
        }
        break
      default:
        break
    }
  })
})
