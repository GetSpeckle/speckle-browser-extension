import extension from 'extensionizer'
import { PORT_CONTENT } from '../constants/ports'
import { ORIGIN_CONTENT, ORIGIN_PAGE } from '../constants/origins'

export const setupPort = () => {
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
}
