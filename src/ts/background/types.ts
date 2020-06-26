import { InjectedAccount } from '@polkadot/extension-inject/types'
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types'
import { TypeRegistry } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'

type KeysWithDefinedValues<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K
}[keyof T]

type NoUndefinedValues<T> = {
  [K in KeysWithDefinedValues<T>]: T[K]
}

export interface RequestSignatures {
  // private/internal requests, i.e. from a popup
  'pri(accounts.subscribe)': [RequestAccountSubscribe, boolean, AccountJson[]]
  'pri(authorize.approve)': [RequestAuthorizeApprove, boolean]
  'pri(authorize.reject)': [RequestAuthorizeReject, boolean]
  'pri(authorize.subscribe)': [RequestAuthorizeSubscribe, boolean, AuthorizeRequest[]]
  'pri(signing.approve.password)': [RequestSigningApprovePassword, boolean]
  'pri(signing.approve.signature)': [RequestSigningApproveSignature, boolean]
  'pri(signing.cancel)': [RequestSigningCancel, boolean]
  'pri(signing.subscribe)': [RequestSigningSubscribe, boolean, SigningRequest[]]
  'pri(window.open)': [null, boolean]
  // public/external requests, i.e. from a page
  'pub(accounts.list)': [RequestAccountList, InjectedAccount[]]
  'pub(accounts.subscribe)': [RequestAccountSubscribe, boolean, InjectedAccount[]]
  'pub(authorize.tab)': [RequestAuthorizeTab, null]
  'pub(bytes.sign)': [SignerPayloadRaw, ResponseSigning]
  'pub(extrinsic.sign)': [SignerPayloadJSON, ResponseSigning]
}

export type MessageTypes = keyof RequestSignatures

export type SimpleAccounts = InjectedAccount[]

export interface AccountJson {
  address: string
  genesisHash?: string | null
  isExternal?: boolean
  name?: string
}

export interface AuthorizeRequest {
  id: string
  request: RequestAuthorizeTab
  url: string
}

export interface SigningRequest {
  account: AccountJson
  id: string
  request: RequestSign
  url: string
}

export type RequestAccountList = null

export type RequestAccountSubscribe = null

export interface RequestSigningApprovePassword {
  id: string
  password: string
}

export interface RequestSigningApproveSignature {
  id: string
  signature: string
}

export interface RequestSigningCancel {
  id: string
}

export type RequestSigningSubscribe = null

export interface RequestAuthorizeTab {
  origin: string
}

export interface RequestAuthorizeApprove {
  id: string
}

export interface RequestAuthorizeReject {
  id: string
}

export type RequestAuthorizeSubscribe = null

export type RequestTypes = {
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][0]
}

export type ResponseTypes = {
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][1]
}

export type SubscriptionMessageTypes = NoUndefinedValues<{
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][2]
}>

export type MessageTypesWithSubscriptions = keyof SubscriptionMessageTypes

export type MessageTypesWithNoSubscriptions = Exclude<MessageTypes, keyof SubscriptionMessageTypes>

export interface MessageRequest {
  id: string
  message: MessageTypes
  request: any
}

type IsNull<T, K extends keyof T> =
    { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never

type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T]

export type MessageTypesWithNullRequest = NullKeys<RequestTypes>

export interface ResponseSigning {
  id: string
  signature: string
}

export interface RequestSign {
  readonly payload: SignerPayloadJSON | SignerPayloadRaw
  sign (registry: TypeRegistry, pair: KeyringPair): { signature: string }
}
