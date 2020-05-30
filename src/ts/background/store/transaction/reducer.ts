import { Reducer } from 'redux'
import { SUCCESS } from '../util'
import { ACTION_TYPES, ITransaction } from './actions'

const initialState: ITransaction[] = []

const transactions: Reducer<ITransaction[]> = (state = initialState, action) => {
  switch (action.type) {

    case SUCCESS(ACTION_TYPES.UPSERT_TRANSACTION):
      return action.payload

    case SUCCESS(ACTION_TYPES.GET_TRANSACTIONS):
      return action.payload ? action.payload : []

    case SUCCESS(ACTION_TYPES.SAVE_TRANSACTIONS):
      return action.payload

    default:
      return state
  }
}

export default transactions
