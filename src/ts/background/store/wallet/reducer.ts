import { AnyAction, Reducer } from 'redux'
import { ACTION_TYPES, IAccount } from './actions'

export interface IWallet {
  accounts?: IAccount[],
  created: boolean,
  locked: boolean,
  newPassword?: string,
  newPhrase?: string,
  newAccountName?: string,
}

const initialState: IWallet = {
  locked: true,
  created: false
}

const wallet: Reducer<IWallet, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case ACTION_TYPES.SET_LOCKED:
      return { ...state, locked: action.payload }

    case ACTION_TYPES.SET_CREATED:
      return { ...state, created: action.payload }

    case ACTION_TYPES.SET_NEW_PHRASE:
      return {
        ...state,
        newPhrase: action.payload.phrase,
        newAccountName: action.payload.accountName }

    case ACTION_TYPES.SET_NEW_PASSWORD:
      return { ...state, newPassword: action.payload }

    case ACTION_TYPES.SET_ACCOUNTS:
      return { ...state, accounts: action.payload }

    default:
      return state
  }
}

export default wallet
