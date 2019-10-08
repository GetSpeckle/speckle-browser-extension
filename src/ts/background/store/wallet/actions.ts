import { AnyAction } from 'redux'

export const ACTION_TYPES = {
  SET_CREATED: 'SET_CREATED',
  SET_LOCKED: 'SET_LOCKED',
  SET_NEW_PHRASE: 'SET_NEW_PHRASE',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_NEW_PASSWORD: 'SET_NEW_PASSWORD',
  SET_IS_CREATING_ACCOUNT: 'SET_IS_CREATING_ACCOUNT',
  SET_ACCOUNT_SETUP_TIMEOUT: 'SET_ACCOUNT_SETUP_TIMEOUT'
}

export interface IAccount {
  address: string,
  name: string
}

export function setLocked (locked: boolean): AnyAction {
  return {
    type: ACTION_TYPES.SET_LOCKED,
    payload: locked
  }
}

export function setNewPhrase (phrase: string, accountName?: string): AnyAction {
  return {
    type: ACTION_TYPES.SET_NEW_PHRASE,
    payload: { phrase: phrase, accountName: accountName }
  }
}

export function setAccounts (account: IAccount[]): AnyAction {
  return {
    type: ACTION_TYPES.SET_ACCOUNTS,
    payload: account
  }
}

export function setNewPassword (password: string): AnyAction {
  return {
    type: ACTION_TYPES.SET_NEW_PASSWORD,
    payload: password
  }
}

export function setCreated (accountCreated: boolean): AnyAction {
  return {
    type: ACTION_TYPES.SET_CREATED,
    payload: accountCreated
  }
}

export function setIsCreatingAccount (isCreatingAccount: boolean): AnyAction {
  return {
    type: ACTION_TYPES.SET_IS_CREATING_ACCOUNT,
    payload: isCreatingAccount
  }
}

export function setAccountSetupTimeout (accountSetupTimeout: number): AnyAction {
  return {
    type: ACTION_TYPES.SET_ACCOUNT_SETUP_TIMEOUT,
    payload: accountSetupTimeout
  }
}
