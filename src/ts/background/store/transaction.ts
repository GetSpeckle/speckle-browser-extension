import { LocalStore } from '../../services/local-store';
import { AnyAction } from 'redux';

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

export const ACTION_TYPES = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  SAVE_TRNASACTIONS: 'SAVE_TRNASACTIONS',
  ADD_TRNASACTION: 'ADD_TRNASACTION'
}

const PREFIX = 'transactions_'

export function getTransactions (address: string): AnyAction {
  return {
    type: ACTION_TYPES.GET_TRANSACTIONS,
    payload: LocalStore.get(PREFIX + address)
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
