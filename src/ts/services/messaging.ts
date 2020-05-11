import {
  AuthorizeRequest,
  MessageTypes, MessageTypesWithNoSubscriptions, MessageTypesWithSubscriptions,
  RequestTypes, ResponseTypes,
  SigningRequest,
  SubscriptionMessageTypes
} from '../background/types'

import { browser } from 'webextension-polyfill-ts'
import { PORT_POPUP } from '../constants/ports'

type Handler = {
  resolve: (data: any) => void,
  reject: (error: Error) => void,
  subscriber?: (data: any) => void
}

type Handlers = Record<string, Handler>

const port = browser.runtime.connect(undefined,{ name: PORT_POPUP })
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

function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions> (
  message: TMessageType, request: RequestTypes[TMessageType]): Promise<ResponseTypes[TMessageType]>
function sendMessage<TMessageType extends MessageTypesWithSubscriptions> (
  message: TMessageType,
  request: RequestTypes[TMessageType],
  subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void):
  Promise<ResponseTypes[TMessageType]>
function sendMessage<TMessageType extends MessageTypes> (
  message: TMessageType,
  request?: RequestTypes[TMessageType],
  subscriber?: (data: any) => void)
  : Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}.${++idCounter}`

    handlers[id] = { resolve, reject, subscriber }

    port.postMessage({ id, message, request })
  })
}

export async function rejectAuthRequest (id: string): Promise<boolean> {
  return sendMessage('pri(authorize.reject)', { id })
}

export async function approveAuthRequest (id: string): Promise<boolean> {
  return sendMessage('pri(authorize.approve)', { id })
}

export async function cancelSignRequest (id: string): Promise<boolean> {
  return sendMessage('pri(signing.cancel)', { id })
}

export async function approveSignPassword (id: string, password: string): Promise<boolean> {
  return sendMessage('pri(signing.approve.password)', { id, password })
}

export async function approveSignSignature (id: string, signature: string): Promise<boolean> {
  return sendMessage('pri(signing.approve.signature)', { id, signature })
}

export async function subscribeAuthorize (cb: (accounts: AuthorizeRequest[]) => void)
  : Promise<boolean> {
  return sendMessage('pri(authorize.subscribe)', null, cb)
}

export async function subscribeSigning (cb: (accounts: SigningRequest[]) => void)
  : Promise<boolean> {
  return sendMessage('pri(signing.subscribe)', null, cb)
}
