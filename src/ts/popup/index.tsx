import 'semantic-ui-css/semantic.min.css'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import PopupApp from './containers/PopupApp'
import initializeStore from '../background/store'

const store = initializeStore()
const rootEl = document.getElementById('popup-root')

ReactDOM.render(
  <Provider store={store}>
    <div>
      <PopupApp />
    </div>
  </Provider>
  ,
  rootEl
)
