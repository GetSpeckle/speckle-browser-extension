import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'react-chrome-redux'
import PopupApp from './containers/PopupApp'

const store = new Store({
  // Communication port between the background component and views such as browser tabs.
  portName: 'ExPort'
})

store.ready().then(() => {
  ReactDOM.render(
        <Provider store={store}>
            <PopupApp />
        </Provider>
        , document.getElementById('popup-root'))
})
