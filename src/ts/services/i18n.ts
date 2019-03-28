import { browser } from 'webextension-polyfill-ts'

export default function (key: string) {
  return browser.i18n.getMessage(key)
}
