import { browser } from 'webextension-polyfill-ts'

export function isWalletLocked (cb: Function) {
  const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
  port.postMessage({ method: 'isLocked' })
  port.onMessage.addListener((msg) => {
    if (msg.method === 'isLocked') {
      cb(msg.result)
      port.disconnect()
    }
  })
}
