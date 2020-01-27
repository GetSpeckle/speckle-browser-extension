import { Runtime } from 'webextension-polyfill-ts'

import { SubscriptionMessageTypes, MessageTypesWithSubscriptions } from '../types'

type Subscriptions = Record<string, Runtime.Port>

const subscriptions: Subscriptions = {}

// return a subscription callback, that will send the data to the caller via the port
export function createSubscription<TMessageType extends MessageTypesWithSubscriptions>
  (id: string, port: Runtime.Port): (data: SubscriptionMessageTypes[TMessageType]) => void {
  subscriptions[id] = port

  return (subscription: any): void => {
    if (subscriptions[id]) {
      port.postMessage({ id, subscription })
    }
  }
}

// clear a previous subscriber
export function unsubscribe (id: string): void {
  if (subscriptions[id]) {
    console.log(`Unsubscribing from ${id}`)

    delete subscriptions[id]
  } else {
    console.error(`Unable to unsubscribe from ${id}`)
  }
}
