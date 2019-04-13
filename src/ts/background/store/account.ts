import { AnyAction, Reducer } from 'redux'

export interface IAccountStatus {
  locked: boolean,
  created: boolean,
  newPhrase?: string,
  newAccountName?: string
}

const initialState: IAccountStatus = {
  locked: true,
  created: false
}

export const ACTION_TYPES = {
  SET_LOCKED: 'SET_LOCKED',
  SET_NEW_PHRASE: 'SET_NEW_PHRASE'
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
    payload: {phrase: phrase, accountName: accountName}
  }
}

/**
 * account reducer
 *
 * @param state the current state
 * @param action the action received
 */
const account: Reducer<IAccountStatus, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case ACTION_TYPES.SET_LOCKED:
      console.log('set locked statue: ', action.payload)
      return { ...state, locked: action.payload }

    case ACTION_TYPES.SET_NEW_PHRASE:
      console.log('set new phrase: ', action.payload)
      return { ...state, newPhrase: action.payload.phrase, newAccountName: action.payload.accountName }

    default:
      return state
  }
}

export default account
