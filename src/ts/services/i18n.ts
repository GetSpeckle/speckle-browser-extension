import { browser } from 'webextension-polyfill-ts'

const i18n = browser.i18n

export default function (key: string) {
  let msg = i18n.getMessage(key)
  if (msg === '') {
    msg = key
  }
  return msg
}
