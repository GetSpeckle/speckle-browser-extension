import { Runtime } from 'webextension-polyfill-ts'

type Subscriptions = {
  [index: string]: Runtime.Port
}

const subscriptions: Subscriptions = {}

// return a subscription callback, that will send the data to the caller via the port
export function createSubscription (id: string, port: Runtime.Port): (data: any) => void {
  subscriptions[id] = port

  return (subscription: any) => {
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
