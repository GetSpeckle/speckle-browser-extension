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
   * Retrieve the objects from the local store for the given key or keys
   * @param keys
   */
  static get (keys?: string | string[] | {[s: string]: any;} | null | undefined):
      Promise<{[s: string]: any}> {
    return browser.storage.local.get(keys)
  }

  /**
   * Set the value to the local store using the given key
   * and return the promise that resolves to the value.
   *
   * @param key the key mapped to the value
   * @param value the value to be set and returned in the promise
   */
  static setValue (key: string, value: any): Promise<any> {
    return LocalStore.set({ [key]: value }).then(() => {
      // make sure to return a copy (even shallow copy)
      if (Array.isArray(value)) {
        return [ ...value ]
      } else if (typeof value === 'object') {
        return { ...value }
      } else {
        return value
      }
    })
  }

  /**
   * Get the value to the local store using the given key
   * and return the promise that resolves to the value.
   *
   * @param key the key mapped to the value
   */
  static getValue (key: string): Promise<any> {
    return browser.storage.local.get(key).then(obj => obj ? obj[key] : undefined)
  }
}
