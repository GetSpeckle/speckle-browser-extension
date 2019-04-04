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

  static setValue (key: string, value: any): Promise<any> {
    const obj = { [key]: value }
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
