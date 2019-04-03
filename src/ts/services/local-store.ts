import { browser } from 'webextension-polyfill-ts'

/**
 * A wrapper for the local store to set and get key(s).
 * Use this to persist data to or read data from the extension local store.
 */
export class LocalStore {

  /**
   * Set the object to the local store to get persisted
   * @param obj
   */
  static set (obj: any): Promise<void> {
    return browser.storage.local.set(obj)
  }

  /**
   * Set the object to the local store and return a value in the promise.
   * Make sure the value is the one set in the store
   *
   * @param obj the object that already contain the value
   * @param value the value to be returned in the promise
   */
  static setValue (obj: any, value: any): Promise<any> {
    return LocalStore.set(obj).then(() => {
      return value
    })
  }
  /**
   * Retrieve the value from the local store for the given key or keys
   * @param keys
   */
  static get (keys?: string | string[] | {[s: string]: any;} | null | undefined):
      Promise<{[s: string]: any}> {
    return browser.storage.local.get(keys)
  }
}
