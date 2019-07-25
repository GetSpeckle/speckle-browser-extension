import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import SpeckleApp from './containers/SpeckleApp'

import { createDomAnchor, createPageScript } from '../scripts/dom'
import { store } from '../background/store'
import { setupPort } from './port'
import { modifyTweets } from './injection'

createDomAnchor('speckle-root')

ReactDOM.render(<Provider store={store}><SpeckleApp/></Provider>,
  document.getElementById('speckle-root'))

setupPort()

createPageScript()

modifyTweets()
