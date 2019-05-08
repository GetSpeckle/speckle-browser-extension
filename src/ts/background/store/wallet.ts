import { AnyAction, Reducer } from 'redux'

export interface IWallet {
  accounts?: IAccount[],
  created: boolean,
  locked: boolean,
  newPassword?: string,
  newPhrase?: string,
  newAccountName?: string,
}

export interface IAccount {
  address: string,
  name: string
}

const initialState: IWallet = {
  locked: true,
  created: false
}

export const ACTION_TYPES = {
  SET_CREATED: 'SET_CREATED',
  SET_LOCKED: 'SET_LOCKED',
  SET_NEW_PHRASE: 'SET_NEW_PHRASE',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_NEW_PASSWORD: 'SET_NEW_PASSWORD'
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

/**
 * wallet reducer
 *
 * @param state the current state
 * @param action the action received
 */
const wallet: Reducer<IWallet, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case ACTION_TYPES.SET_LOCKED:
      console.log('set locked status: ', action.payload)
      return { ...state, locked: action.payload }

    case ACTION_TYPES.SET_CREATED:
      console.log('set created status: ', action.payload)
      return { ...state, created: action.payload }

    case ACTION_TYPES.SET_NEW_PHRASE:
      return {
        ...state,
        newPhrase: action.payload.phrase,
        newAccountName: action.payload.accountName }

    case ACTION_TYPES.SET_NEW_PASSWORD:
      console.log('set new password ...')
      return { ...state, newPassword: action.payload }

    case ACTION_TYPES.SET_ACCOUNTS:
      console.log('set accounts ...')
      return { ...state, accounts: action.payload }

    default:
      return state
  }
}

export default wallet
