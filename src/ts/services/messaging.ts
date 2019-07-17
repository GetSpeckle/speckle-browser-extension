import { AuthorizeRequest, MessageTypes, SigningRequest } from '../background/types'

import extension from 'extensionizer'
import { PORT_POPUP } from '../constants/ports'

type Handler = {
  resolve: (data: any) => void,
  reject: (error: Error) => void,
  subscriber?: (data: any) => void
}

type Handlers = {
  [index: string]: Handler
}

const port = extension.runtime.connect({ name: PORT_POPUP })
const handlers: Handlers = {}
let idCounter = 0

// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data) => {
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

function sendMessage (message: MessageTypes, request: any = {}, subscriber?: (data: any) => void)
  : Promise<any> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}.${++idCounter}`

    handlers[id] = { resolve, reject, subscriber }

    port.postMessage({ id, message, request })
  })
}

export async function rejectAuthRequest (id: string): Promise<boolean> {
  return sendMessage('authorize.reject', { id })
}

export async function approveAuthRequest (id: string): Promise<boolean> {
  return sendMessage('authorize.approve', { id })
}

export async function cancelSignRequest (id: string): Promise<boolean> {
  return sendMessage('signing.cancel', { id })
}

export async function approveSignRequest (id: string, password: string): Promise<boolean> {
  return sendMessage('signing.approve', { id, password })
}

export async function subscribeAuthorize (cb: (accounts: Array<AuthorizeRequest>) => void)
  : Promise<boolean> {
  return sendMessage('authorize.subscribe', {}, cb)
}

export async function subscribeSigning (cb: (accounts: Array<SigningRequest>) => void)
  : Promise<boolean> {
  return sendMessage('signing.subscribe', {}, cb)
}
