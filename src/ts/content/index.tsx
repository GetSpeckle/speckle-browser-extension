import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import SpeckleApp from './SpeckleApp'

import { createDomAnchor } from '../scripts/dom'
import { store } from '../background/store'

createDomAnchor('speckle-root')

ReactDOM.render(<Provider store={store}><SpeckleApp/></Provider>,
  document.getElementById('speckle-root'))
