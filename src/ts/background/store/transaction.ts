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

/**
 * Map of account address -> transaction list
 */
export interface IAccountTransactions {
  [index: string]: ITransaction[]
}

const initialState: IAccountTransactions = {}

export const ACTION_TYPES = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  SAVE_TRNASACTIONS: 'SAVE_TRNASACTIONS',
  ADD_TRNASACTION: 'ADD_TRNASACTION'
}

const PREFIX = 'transactions_'

export function getTransactions (address: string): AnyAction {
  console.log('Action: geting tranx for %s', address)

  return {
    type: ACTION_TYPES.GET_TRANSACTIONS,
    address: address,
    payload: LocalStore.get(PREFIX + address)
  }
}

export function addTransaction (address: string,
    tran: ITransaction, list: ITransaction[]): AnyAction {
  // TODO: make some validation
  list.unshift(tran)
  return {
    type: ACTION_TYPES.ADD_TRNASACTION,
    address: address,
    payload: LocalStore.setValue(PREFIX + address, list)
  }
}

export function saveTransactions (address: string, list: ITransaction[]): AnyAction {

  return {
    type: ACTION_TYPES.SAVE_TRNASACTIONS,
    address: address,
    payload: LocalStore.setValue(PREFIX + address, list)
  }
}

/**
 * transaction reducer
 *
 * @param state the current state
 * @param action the action received
 */
const transactions: Reducer<IAccountTransactions, AnyAction> = (state = initialState, action) => {
  switch (action.type) {

    case SUCCESS(ACTION_TYPES.ADD_TRNASACTION):
      console.log('added transaction', action.payload)
      return { ...state, [action.address]: action.payload }

    case SUCCESS(ACTION_TYPES.GET_TRANSACTIONS):
      console.log('got the transactions for %s: %s', action.address, action.payload)
      return { ...state, [action.address]: action.payload }

    case SUCCESS(ACTION_TYPES.SAVE_TRNASACTIONS):
      console.log('saved the transactions', action.payload)
      return { ...state, [action.address]: action.payload }

    default:
      return state
  }
}

export default transactions
