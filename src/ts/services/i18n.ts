import { browser } from 'webextension-polyfill-ts'

export default function (key: string) {
  let msg = browser.i18n.getMessage(key)
  if (msg === '') {
    msg = key
  }
  return msg
}
