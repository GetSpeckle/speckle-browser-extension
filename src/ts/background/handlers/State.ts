import {
  AuthorizeRequest,
  MessageAuthorize,
  MessageExtrinsicSign,
  MessageExtrinsicSignResponse,
  SigningRequest
} from '../types'
import { Windows } from 'webextension-polyfill-ts'
import extension from 'extensionizer'
import { BehaviorSubject } from 'rxjs'
import { assert } from '@polkadot/util'

type AuthRequest = {
  id: string,
  idStr: string,
  request: MessageAuthorize,
  resolve: (result: boolean) => void,
  reject: (error: Error) => void,
  url: string
}

type AuthUrls = {
  [index: string]: {
    count: number,
    id: string,
    isAllowed: boolean,
    origin: string,
    url: string
  }
}

type SignRequest = {
  id: string,
  request: MessageExtrinsicSign,
  resolve: (result: MessageExtrinsicSignResponse) => void,
  reject: (error: Error) => void,
  url: string
}

let idCounter = 0

function getId (): string {
  return `${Date.now()}.${++idCounter}`
}

export default class State {
  // at the moment, we are keeping the list in memory - this should be persisted
  private _authUrls: AuthUrls = {}
  private _authRequests: { [index: string]: AuthRequest } = {}
  private _signRequests: { [index: string]: SignRequest } = {}
  private _windows: Array<number> = []
  readonly authSubject: BehaviorSubject<Array<AuthorizeRequest>> =
    new BehaviorSubject([] as Array<AuthorizeRequest>)
  readonly signSubject: BehaviorSubject<Array<SigningRequest>> =
    new BehaviorSubject([] as Array<SigningRequest>)

  get numAuthRequests (): number {
    return Object.keys(this._authRequests).length
  }

  get numSignRequests (): number {
    return Object.keys(this._signRequests).length
  }

  get allAuthRequests (): Array<AuthorizeRequest> {
    return Object
      .values(this._authRequests)
      .map(({ id, request, url }) => [id, request, url])
  }

  get allSignRequests (): Array<SigningRequest> {
    return Object
      .values(this._signRequests)
      .map(({ id, request, url }) => [id, request, url])
  }

  private popupClose (): void {
    this._windows.map((id: number) =>
      extension.windows.remove(id)
    )
    this._windows = []
  }

  private popupOpen (height, width): void {
    extension.windows.create({
      focused: true,
      height: height,
      left: Math.floor((window.screen.availWidth - width) / 2),
      top: Math.floor((window.screen.availHeight - height) / 2),
      type: 'popup',
      url: extension.extension.getURL('popup.html'),
      width: width
    }, (window?: Windows.Window) => {
      if (window) {
        this._windows.push(window.id!!)
      }
    })
  }

  private authComplete = (id: string, fn: Function) => {
    return (result: boolean | Error): void => {
      const isAllowed = result === true
      const { idStr, request: { origin }, url } = this._authRequests[id]

      this._authUrls[this.stripUrl(url)] = {
        count: 0,
        id: idStr,
        isAllowed,
        origin,
        url
      }

      delete this._authRequests[id]
      this.updateIconAuth(true)

      fn(result)
    }
  }

  private signComplete = (id: string, fn: Function) => {
    return (result: MessageExtrinsicSignResponse | Error): void => {
      delete this._signRequests[id]
      this.updateIconSign(true)

      fn(result)
    }
  }

  private stripUrl (url: string): string {
    assert(url && (url.indexOf('http:') === 0 || url.indexOf('https:') === 0),
      `Invalid url ${url}, expected to start with http: or https:`)

    const parts = url.split('/')

    return parts[2]
  }

  private updateIcon (shouldClose?: boolean): void {
    const authCount = this.numAuthRequests
    const signCount = this.numSignRequests
    const text = (
      authCount
        ? 'Auth'
        : (signCount ? `${signCount}` : '')
    )

    extension.browserAction.setBadgeText({ text })

    if (shouldClose && text === '') {
      this.popupClose()
    }
  }

  private updateIconAuth (shouldClose?: boolean): void {
    const requests = this.allAuthRequests
    console.log('requests', requests)
    this.authSubject.next(requests)
    this.updateIcon(shouldClose)
  }

  private updateIconSign (shouldClose?: boolean): void {
    this.signSubject.next(this.allSignRequests)
    this.updateIcon(shouldClose)
  }

  public async authorizeUrl (url: string, request: MessageAuthorize): Promise<boolean> {
    const idStr = this.stripUrl(url)

    if (this._authUrls[idStr]) {
      assert(this._authUrls[idStr].isAllowed,
        `The source ${url} is not allowed to interact with this extension`)

      return true
    }

    return new Promise((resolve, reject) => {
      const id = getId()

      this._authRequests[id] = {
        id,
        idStr,
        request,
        resolve: this.authComplete(id, resolve),
        reject: this.authComplete(id, reject),
        url
      }
      console.log('_authRequests', this._authRequests)
      this.updateIconAuth()
      this.popupOpen(600, 375)
    })
  }

  public ensureUrlAuthorized (url: string): boolean {
    const entry = this._authUrls[this.stripUrl(url)]

    assert(entry, `The source ${url} has not been enabled yet`)
    assert(entry.isAllowed, `The source ${url} is not allowed to interact with this extension`)

    return true
  }

  getAuthRequest (id: string): AuthRequest {
    return this._authRequests[id]
  }

  getSignRequest (id: string): SignRequest {
    return this._signRequests[id]
  }

  signQueue (url: string, request: MessageExtrinsicSign): Promise<MessageExtrinsicSignResponse> {
    const id = getId()

    return new Promise((resolve, reject) => {
      this._signRequests[id] = {
        id,
        request,
        resolve: this.signComplete(id, resolve),
        reject: this.signComplete(id, reject),
        url
      }

      this.updateIconSign()
      this.popupOpen(600, 370)
    })
  }
}
