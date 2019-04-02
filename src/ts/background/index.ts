import { createStore } from 'redux'
import reducers, { IAppState, loadState } from './store/all'
import { wrapStore, Store } from 'react-chrome-redux'
import { configureApp } from './AppConfig'

const preloadedState = loadState()
const store: Store<IAppState> = createStore(reducers, preloadedState)

configureApp(store)

wrapStore(store, {
  // Communication port between the background component
  // nd views such as browser tabs.
  portName: 'ExPort'
})
