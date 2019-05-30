import { LocalStore } from '../../services/local-store'
import { AnyAction, Reducer } from 'redux'
import { SUCCESS } from './util'

export type TransactionType = 'Sent' | 'Received' | 'Staked'
export type TransactionStatus = 'Pending' | 'Success' | 'Failure'

/**
 * Transaction model
 */
export interface ITransaction {
  id: string // uuid
  from: string
  to: string
  amount: Number
  fee: Number
  type: TransactionType
  status: TransactionStatus
  txHash?: string
  createTime: Date
  updateTime?: Date
}

const initialState: ITransaction[] = []

export const ACTION_TYPES = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  SAVE_TRNASACTIONS: 'SAVE_TRNASACTIONS',
  ADD_TRNASACTION: 'ADD_TRNASACTION'
}

const PREFIX = 'transactions_'

export function getTransactions (address: string): AnyAction {
  return {
    type: ACTION_TYPES.GET_TRANSACTIONS,
    payload: LocalStore.getValue(PREFIX + address)
  }
}

export function addTransaction (address: string,
    tran: ITransaction, list: ITransaction[]): AnyAction {
  // TODO: make some validation
  list.unshift(tran)
  return {
    type: ACTION_TYPES.ADD_TRNASACTION,
    payload: LocalStore.setValue(PREFIX + address, list)
  }
}

export function saveTransactions (address: string, list: ITransaction[]): AnyAction {

  return {
    type: ACTION_TYPES.SAVE_TRNASACTIONS,
    payload: LocalStore.setValue(PREFIX + address, list)
  }
}

/**
 * transaction reducer
 *
 * @param state the current state
 * @param action the action received
 */
const transactions: Reducer<ITransaction[], AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case SUCCESS(ACTION_TYPES.ADD_TRNASACTION):
      console.log('added transaction', action.payload)
      return action.payload

    case SUCCESS(ACTION_TYPES.GET_TRANSACTIONS):
      console.log('got the transactions: ', action.payload)
      return action.payload ? action.payload : []

    case SUCCESS(ACTION_TYPES.SAVE_TRNASACTIONS):
      console.log('saved the transactions', action.payload)
      return action.payload

    default:
      return state
  }
}

export default transactions
