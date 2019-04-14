import { createStore } from 'redux'
import reducers, { IAppState } from './store/all'
import { wrapStore, Store } from 'react-chrome-redux'
import { browser } from 'webextension-polyfill-ts'
import keyringVault from '../services/keyring-vault'
import * as FUNCS from '../constants/keyring-vault-funcs'

const store: Store<IAppState> = createStore(reducers)

wrapStore(store, {
  // Communication port between the background component
  // nd views such as browser tabs.
  portName: 'ExPort'
})

// listen to the port
browser.runtime.onConnect.addListener(function (port) {
  if (port.name !== '__SPECKLE__') return
  port.onMessage.addListener(function (msg) {
    switch (msg.method) {
      case FUNCS.IS_LOCKED:
        port.postMessage({ method: FUNCS.IS_LOCKED, result: keyringVault.isLocked() })
        break
      case FUNCS.IS_UNLOCKED:
        port.postMessage({ method: FUNCS.IS_UNLOCKED, result: keyringVault.isUnlocked() })
        break
      case FUNCS.LOCK:
        keyringVault.lock()
        port.postMessage({ method: FUNCS.UNLOCK, result: true })
        break
      case FUNCS.UNLOCK:
        keyringVault.unlock(msg.password, msg.addressPrefix).then(keys => {
          port.postMessage({ method: FUNCS.UNLOCK, result: keys })
        }).catch(err => {
          port.postMessage({ method: FUNCS.UNLOCK, error: err })
        })
        break
      case FUNCS.WALLET_EXISTS:
        keyringVault.walletExists().then((result) => {
          port.postMessage({ method: FUNCS.WALLET_EXISTS, result: result })
        }).catch(err => {
          port.postMessage({ method: FUNCS.WALLET_EXISTS, error: err })
        })
        break
      case FUNCS.GET_ACCOUNTS:
        try {
          port.postMessage({
            method: FUNCS.GET_ACCOUNTS,
            result: keyringVault.getAccounts()
          })
        } catch (e) {
          port.postMessage({
            method: FUNCS.GET_ACCOUNTS,
            error: e
          })
        }
        break
      case FUNCS.GENERATE_MNEMONIC:
        try {
          port.postMessage({
            method: FUNCS.GENERATE_MNEMONIC,
            result: keyringVault.generateMnemonic()
          })
        } catch (e) {
          port.postMessage({ method: FUNCS.GENERATE_MNEMONIC, error: e })
        }
        break
      case FUNCS.IS_MNEMONIC_VALID:
        port.postMessage({
          method: FUNCS.IS_MNEMONIC_VALID,
          result: keyringVault.isMnemonicValid(msg.mnemonic)
        })
        break
      case FUNCS.CREATE_ACCOUNT:
        keyringVault.createAccount(msg.mnemonic, msg.accountName).then((pairJson) => {
          port.postMessage({ method: FUNCS.CREATE_ACCOUNT, result: pairJson })
        }).catch(err => {
          port.postMessage({ method: FUNCS.CREATE_ACCOUNT, error: err })
        })
        break
      case FUNCS.UPDATE_ACCOUNT_NAME:
        keyringVault.updateAccountName(msg.address, msg.accountName).then((pairJson) => {
          port.postMessage({ method: FUNCS.UPDATE_ACCOUNT_NAME, result: pairJson })
        }).catch(err => {
          port.postMessage({ method: FUNCS.UPDATE_ACCOUNT_NAME, error: err })
        })
        break
      case FUNCS.REMOVE_ACCOUNT:
        try {
          keyringVault.removeAccount(msg.address)
          port.postMessage({ method: FUNCS.REMOVE_ACCOUNT })
        } catch (e) {
          port.postMessage({ method: FUNCS.REMOVE_ACCOUNT, error: e })
        }
        break
      case FUNCS.IMPORT_MNEMONIC:
        keyringVault.importAccountFromMnemonic(msg.mnemonic, msg.accountName).then((pairJson) => {
          port.postMessage({ method: FUNCS.IMPORT_MNEMONIC, result: pairJson })
        }).catch(err => {
          port.postMessage({ method: FUNCS.IMPORT_MNEMONIC, error: err })
        })
        break
      case FUNCS.IMPORT_JSON:
        keyringVault.importAccountFromJson(msg.json, msg.password).then((pairJson) => {
          port.postMessage({ method: FUNCS.IMPORT_JSON, result: pairJson })
        }).catch(err => {
          port.postMessage({ method: FUNCS.IMPORT_JSON, error: err })
        })
        break
      default:
        break
    }
  })
})
