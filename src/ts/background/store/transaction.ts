import { LocalStore } from '../../services/local-store'
import { AnyAction, Reducer } from 'redux'
import { SUCCESS } from './util'

export type TransactionType = 'Sent' | 'Received' | 'Staked'
export type TransactionStatus = 'Pending' | 'Success' | 'Failure'

/**
 * Transaction model
 */
export interface ITransaction {
  txHash: string
  from: string
  to: string
  amount: string
  unit: string
  fee: string
  type: TransactionType
  status: TransactionStatus
  createTime: number
  updateTime?: number
}

const initialState: ITransaction[] = []

export const ACTION_TYPES = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  SAVE_TRNASACTIONS: 'SAVE_TRNASACTIONS',
  UPSERT_TRNASACTION: 'UPSERT_TRNASACTION'
}

const PREFIX = 'transactions_'

export function getTransactions (address: string): AnyAction {
  return {
    type: ACTION_TYPES.GET_TRANSACTIONS,
    payload: LocalStore.getValue(PREFIX + address)
  }
}

export function upsertTransaction (address: string,
    tran: ITransaction, list: ITransaction[]): AnyAction {
  const idx = list.findIndex(item => item.txHash === tran.txHash)
  let updated = [tran]
  if (idx < 0) {
    console.log('Insert tran: ', tran)
    updated = updated.concat(list)
  } else {
    console.log('Update tran: ', tran)
    updated = [...list.slice(0, idx), tran, ...list.slice(idx + 1)]
  }
  return {
    type: ACTION_TYPES.UPSERT_TRNASACTION,
    payload: LocalStore.setValue(PREFIX + address, updated)
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

    case SUCCESS(ACTION_TYPES.UPSERT_TRNASACTION):
      console.log('upserted transaction', action.payload)
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
