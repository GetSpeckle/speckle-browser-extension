import * as FUNCS from '../../constants/keyring-vault-funcs'
import keyringVault from '../services/keyring-vault'
import { Runtime } from 'webextension-polyfill-ts'

const handle = (msg, port: Runtime.Port) => {
  switch (msg.method) {
    case FUNCS.INIT:
      keyringVault.init().then((result) => {
        port.postMessage({ method: FUNCS.INIT, result: result })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.INIT,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.IS_LOCKED:
      port.postMessage({
        method: FUNCS.IS_LOCKED,
        result: keyringVault.isLocked()
      })
      break
    case FUNCS.LOCK:
      keyringVault.lock()
      port.postMessage({ method: FUNCS.LOCK, result: true })
      break
    case FUNCS.UNLOCK:
      keyringVault.unlock(msg.password).then(keys => {
        port.postMessage({ method: FUNCS.UNLOCK, result: keys })
      }).catch(err => {
        port.postMessage({ method: FUNCS.UNLOCK, error: { message: err.message } })
      })
      break
    case FUNCS.WALLET_EXISTS:
      keyringVault.walletExists().then((result) => {
        port.postMessage({ method: FUNCS.WALLET_EXISTS, result: result })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.WALLET_EXISTS,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.GET_ACCOUNTS:
      try {
        port.postMessage({
          method: FUNCS.GET_ACCOUNTS,
          result: keyringVault.getAccounts()
        })
      } catch (err) {
        port.postMessage({
          method: FUNCS.GET_ACCOUNTS,
          error: { message: err.message }
        })
      }
      break
    case FUNCS.GET_SIMPLE_ACCOUNTS:
      keyringVault.getSimpleAccounts().then(result => {
        port.postMessage({
          method: FUNCS.GET_SIMPLE_ACCOUNTS,
          result: result
        })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.GET_SIMPLE_ACCOUNTS,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.GENERATE_MNEMONIC:
      try {
        port.postMessage({
          method: FUNCS.GENERATE_MNEMONIC,
          result: keyringVault.generateMnemonic()
        })
      } catch (err) {
        port.postMessage({
          method: FUNCS.GENERATE_MNEMONIC,
          error: { message: err.message }
        })
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
        port.postMessage({
          method: FUNCS.CREATE_ACCOUNT,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.UPDATE_ACCOUNT_NAME:
      keyringVault.updateAccountName(msg.address, msg.accountName).then((pairJson) => {
        port.postMessage({ method: FUNCS.UPDATE_ACCOUNT_NAME, result: pairJson })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.UPDATE_ACCOUNT_NAME,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.REMOVE_ACCOUNT:
      try {
        keyringVault.removeAccount(msg.address)
        port.postMessage({ method: FUNCS.REMOVE_ACCOUNT })
      } catch (err) {
        port.postMessage({
          method: FUNCS.REMOVE_ACCOUNT,
          error: { message: err.message }
        })
      }
      break
    case FUNCS.SIGN_EXTRINSIC:
      try {
        keyringVault.signExtrinsic(msg.signerPayload).then(signature => {
          port.postMessage({ method: FUNCS.SIGN_EXTRINSIC, result: signature })
        })
      } catch (err) {
        port.postMessage({
          method: FUNCS.SIGN_EXTRINSIC,
          error: { message: err.message }
        })
      }
      break
    case FUNCS.IMPORT_MNEMONIC:
      keyringVault.importAccountFromMnemonic(msg.mnemonic, msg.accountName).then((pairJson) => {
        port.postMessage({ method: FUNCS.IMPORT_MNEMONIC, result: pairJson })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.IMPORT_MNEMONIC,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.IMPORT_JSON:
      keyringVault.importAccountFromJson(msg.json, msg.password).then((pairJson) => {
        port.postMessage({ method: FUNCS.IMPORT_JSON, result: pairJson })
      }).catch(err => {
        port.postMessage({
          method: FUNCS.IMPORT_JSON,
          error: { message: err.message }
        })
      })
      break
    case FUNCS.GET_TEMP_PASSWORD:
      port.postMessage({
        method: FUNCS.GET_TEMP_PASSWORD,
        result: keyringVault.getTempPassword()
      })
      break
    case FUNCS.SET_TEMP_PASSWORD:
      keyringVault.setTempPassword(msg.tempPassword)
      break
    case FUNCS.GET_MNEMONIC:
      port.postMessage({
        method: FUNCS.GET_MNEMONIC,
        result: keyringVault.getMnemonic()
      })
      break
    case FUNCS.GET_ACCOUNT_SETUP_TIMEOUT:
      port.postMessage({
        method: FUNCS.GET_ACCOUNT_SETUP_TIMEOUT,
        result: keyringVault.getAccountSetupTimeout()
      })
      break
    case FUNCS.GET_TEMP_ACCOUNT_NAME:
      port.postMessage({
        method: FUNCS.GET_TEMP_ACCOUNT_NAME,
        result: keyringVault.getTempAccountName()
      })
      break
    case FUNCS.SET_TEMP_ACCOUNT_NAME:
      keyringVault.setTempAccountName(msg.tempAccountName)
      break
    case FUNCS.CANCEL_ACCOUNT_SETUP:
      keyringVault.cancelAccountSetup()
      break
    default:
      break
  }
}

export default handle
