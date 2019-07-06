import { AnyAction, Reducer } from 'redux'
import { SUCCESS } from '../util'
import { ACTION_TYPES, ITransaction } from './actions'

const initialState: ITransaction[] = []

const transactions: Reducer<ITransaction[], AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case SUCCESS(ACTION_TYPES.UPSERT_TRANSACTION):
      console.log('upserted transaction', action.payload)
      return action.payload

    case SUCCESS(ACTION_TYPES.GET_TRANSACTIONS):
      console.log('got the transactions: ', action.payload)
      return action.payload ? action.payload : []

    case SUCCESS(ACTION_TYPES.SAVE_TRANSACTIONS):
      console.log('saved the transactions', action.payload)
      return action.payload

    default:
      return state
  }
}

export default transactions
