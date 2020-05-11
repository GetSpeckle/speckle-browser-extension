import {
  AccountJson,
  AuthorizeRequest,
  ResponseSigning,
  RequestAuthorizeTab,
  SigningRequest,
  RequestSign
} from '../types'
import { Windows, browser } from 'webextension-polyfill-ts'
import { BehaviorSubject } from 'rxjs'
import { assert } from '@polkadot/util'

interface AuthRequest {
  id: string
  idStr: string
  request: RequestAuthorizeTab
  resolve: (result: boolean) => void
  reject: (error: Error) => void
  url: string
}

type AuthUrls = Record<string, {
  count: number
  id: string
  isAllowed: boolean
  origin: string
  url: string
}>

interface SignRequest {
  account: AccountJson
  id: string
  request: RequestSign
  resolve: (result: ResponseSigning) => void
  reject: (error: Error) => void
  url: string
}

let idCounter = 0

// tslint:disable-next-line:no-empty
const NOOP = () => {}

function getId (): string {
  return `${Date.now()}.${++idCounter}`
}

export default class State {
  // at the moment, we are keeping the list in memory - this should be persisted
  private _authUrls: AuthUrls = {}
  private _authRequests: Record<string, AuthRequest> = {}
  private _signRequests: Record<string, SignRequest> = {}
  private _windows: number[] = []
  public readonly authSubject: BehaviorSubject<AuthorizeRequest[]> =
    new BehaviorSubject([] as AuthorizeRequest[])
  public readonly signSubject: BehaviorSubject<SigningRequest[]> =
    new BehaviorSubject([] as SigningRequest[])

  get numAuthRequests (): number {
    return Object.keys(this._authRequests).length
  }

  get numSignRequests (): number {
    return Object.keys(this._signRequests).length
  }

  get allAuthRequests (): AuthorizeRequest[] {
    return Object
      .values(this._authRequests)
      .map(({ id, request, url }): AuthorizeRequest => ({ id, request, url }))
  }

  get allSignRequests (): SigningRequest[] {
    return Object
      .values(this._signRequests)
      .map(({ account, id, request, url }): SigningRequest => ({ account, id, request, url }))
  }

  private popupClose (): void {
    this._windows.forEach((id: number) =>
      browser.windows.remove(id).then(NOOP)
    )
    this._windows = []
  }

  private popupOpen (height, width): void {
    browser.windows.create({
      height: height,
      width: width,
      left: Math.floor((window.screen.availWidth - width) / 2),
      top: Math.floor((window.screen.availHeight - height) / 2),
      type: 'popup',
      url: browser.extension.getURL('popup.html')
    }).then((window: Windows.Window) => this._windows.push(window.id!!))
  }

  private authComplete = (id: string, fn: Function): (result: boolean | Error) => void => {
    return (result: boolean | Error): void => {
      const isAllowed = result === true
      const { idStr, request: { origin }, url } = this._authRequests[id]

      this._authUrls[State.stripUrl(url)] = {
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

  private signComplete = (id: string, fn: Function):
    (result: ResponseSigning | Error) => void => {
    return (result: ResponseSigning | Error): void => {
      delete this._signRequests[id]
      this.updateIconSign(true)

      fn(result)
    }
  }

  private static stripUrl (url: string): string {
    assert(url && (url.startsWith('http:') || url.startsWith('https:')),
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

    browser.browserAction.setBadgeText({ text }).then(NOOP)

    if (shouldClose && text === '') {
      this.popupClose()
    }
  }

  private updateIconAuth (shouldClose?: boolean): void {
    this.authSubject.next(this.allAuthRequests)
    this.updateIcon(shouldClose)
  }

  private updateIconSign (shouldClose?: boolean): void {
    this.signSubject.next(this.allSignRequests)
    this.updateIcon(shouldClose)
  }

  public async authorizeUrl (url: string, request: RequestAuthorizeTab): Promise<boolean> {
    const idStr = State.stripUrl(url)

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
    const entry = this._authUrls[State.stripUrl(url)]

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

  sign (url: string, request: RequestSign, account: AccountJson):
    Promise<ResponseSigning> {
    const id = getId()

    return new Promise((resolve, reject) => {
      this._signRequests[id] = {
        account,
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
