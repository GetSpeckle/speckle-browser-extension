import * as React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import SpeckleApp from './containers/SpeckleApp'

import { createDomAnchor } from '../scripts/dom'
import { store } from '../background/store'
import extension from 'extensionizer'

import { PORT_CONTENT } from '../constants/ports'
import { ORIGIN_CONTENT, ORIGIN_PAGE } from '../constants/origins'

createDomAnchor('speckle-root')

ReactDOM.render(<Provider store={store}><SpeckleApp/></Provider>,
  document.getElementById('speckle-root'))

// connect to the extension
const port = extension.runtime.connect({ name: PORT_CONTENT })

// send any messages from the extension back to the page
port.onMessage.addListener((data) => {
  window.postMessage({ ...data, origin: ORIGIN_CONTENT }, '*')
})

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }) => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== ORIGIN_PAGE) {
    return
  }

  port.postMessage(data)
})

// inject our data injector
const script = document.createElement('script')

script.src = extension.extension.getURL('speckle.js')
script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script)
  }
}

(document.head || document.documentElement).appendChild(script)
