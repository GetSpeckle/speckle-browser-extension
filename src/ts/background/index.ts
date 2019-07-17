import { browser } from 'webextension-polyfill-ts'
import { PORT_POPUP, PORT_CONTENT, PORT_KEYRING } from '../constants/ports'
import { assert } from '@polkadot/util'
import handlers from './handlers'
import keyringVaultHandler from './handlers/KeyringVault'

browser.runtime.onConnect.addListener(port => {
  const ports = [PORT_CONTENT, PORT_POPUP, PORT_KEYRING]
  assert(ports.includes(port.name), `Unknown connection from ${port.name}`)
  if (PORT_KEYRING === port.name) {
    port.onMessage.addListener(msg => keyringVaultHandler(msg, port))
  } else {
    port.onMessage.addListener(data => handlers(data, port))
  }
  port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`))
})
