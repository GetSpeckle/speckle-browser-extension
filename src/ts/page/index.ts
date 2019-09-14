// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MessageTypes } from '../background/types'

import { injectExtension } from '@polkadot/extension-inject'

import Injected from './Injected'

import { ORIGIN_PAGE, ORIGIN_CONTENT } from '../constants/origins'

// when sending a message from the injector to the extension, we
//  - create an event - this we send to the loader
//  - the loader takes this event and uses port.postMessage to background
//  - on response, the loader creates a response event
//  - this injector, listens on the events, maps it to the original
//  - resolves/rejects the promise with the result (or sub data)

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void
  reject: (error: Error) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void
}

type Handlers = Record<string, Handler>

const handlers: Handlers = {}
let idCounter = 0

// a generic message sender that creates an event, returning a promise that will
// resolve once the event is resolved (by the response listener just below this)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendMessage (message: MessageTypes, request: any = null, subscriber?: (data: any) => void):
  Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`

    handlers[id] = { resolve, reject, subscriber }

    window.postMessage({ id, message, origin: ORIGIN_PAGE, request }, '*')
  })
}

// the enable function, called by the dapp to allow access
async function enable (origin: string): Promise<Injected> {
  await sendMessage('authorize.tab', { origin })

  return new Injected(sendMessage)
}

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== ORIGIN_CONTENT) {
    return
  }

  const handler = handlers[data.id]

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`)
    return
  }

  if (!handler.subscriber) {
    delete handlers[data.id]
  }

  if (data.subscription) {
    (handler.subscriber as Function)(data.subscription)
  } else if (data.error) {
    handler.reject(new Error(data.error))
  } else {
    handler.resolve(data.response)
  }
})

injectExtension(enable, {
  name: 'speckle',
  version: process.env.PKG_VERSION as string
})
