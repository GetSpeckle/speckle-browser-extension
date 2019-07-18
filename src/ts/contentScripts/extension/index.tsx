import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'react-chrome-redux'
import SpeckleApp from './containers/SpeckleApp'
import '../../../assets/injection.css'
import { modifyTweets } from './injection'

const store = new Store({
  // Communication port between the background component and views such as browser tabs.
  portName: 'ExPort'
})

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <SpeckleApp />v
    </Provider>,
    document.getElementById('speckle-root'))
})

modifyTweets()
