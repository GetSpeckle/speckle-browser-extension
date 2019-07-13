// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MessageRequest } from '../types'
import { Runtime } from 'webextension-polyfill-ts'

import { PORT_POPUP } from '../../constants/ports'
import Extension from './Extension'
import State from './State'
import Tabs from './Tabs'

const state = new State()
const extension = new Extension(state)
const tabs = new Tabs(state)

export default function handler ({ id, message, request }: MessageRequest,
                                 port: Runtime.Port): void {
  const isPopup = port.name === PORT_POPUP
  const sender = port.sender as chrome.runtime.MessageSender
  const from = isPopup
    ? 'popup'
    : (sender.tab && sender.tab.url) || sender.url || '<unknown>'
  const source = `${from}: ${id}: ${message}`

  console.log(` [in] ${source}`)

  const promise = isPopup
    ? extension.handle(id, message, request, port)
    : tabs.handle(id, message, request, from, port)

  promise
    .then((response) => {
      console.log(`[out] ${source}`)
      port.postMessage({ id, response })
    })
    .catch((error) => {
      console.log(`[err] ${source}:: ${error.message}`)

      port.postMessage({ id, error: error.message })
    })
}
