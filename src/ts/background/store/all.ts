import { combineReducers } from 'redux'
import settings, { IAppSettings } from './settings/reducer'
import wallet, { IWallet } from './wallet'
import error, { IError } from './error'
import apiContext, { IApiContext } from './api-context/reducer'
import transactions, { IAccountTransactions } from './transaction'

export interface IAppState {
  settings: IAppSettings
  wallet: IWallet
  apiContext: IApiContext
  error: IError
  transactions: IAccountTransactions
}

const reducers = combineReducers<IAppState>({
  settings, wallet, apiContext, error, transactions
})

export default reducers
