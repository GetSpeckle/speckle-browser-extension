import { createStore } from 'redux'
import reducers, { IAppState, loadState } from './store/all'
import { wrapStore, Store } from 'react-chrome-redux'
import { configureApp } from './AppConfig'
import { browser } from 'webextension-polyfill-ts'
import keyringVault from '../services/keyring-vault';


const preloadedState = loadState()
const store: Store<IAppState> = createStore(reducers, preloadedState)

configureApp(store)

wrapStore(store, {
  // Communication port between the background component
  // nd views such as browser tabs.
  portName: 'ExPort'
})

// listen to the port
browser.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === '__SPECKLE__');
  port.onMessage.addListener(function(msg) {
    if (msg.method === 'isLocked')
      port.postMessage({method: 'isLocked', result: keyringVault.isLocked()})
    else if (msg.method === 'unlock') {
      keyringVault.unlock(msg.password).then(keys => {
        console.log('got keys: ', keys)
        port.postMessage({result: true})
      })
    }
  })
})
