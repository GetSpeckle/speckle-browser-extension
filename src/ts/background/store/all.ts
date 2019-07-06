import { combineReducers } from 'redux'
import settings, { IAppSettings } from './settings/reducer'
import wallet, { IWallet } from './wallet'
import { IError } from './error'
import error from './error/reducer'
import apiContext, { IApiContext } from './api-context/reducer'
import transactions, { ITransaction } from './transaction'

export interface IAppState {
  settings: IAppSettings
  wallet: IWallet
  apiContext: IApiContext
  error: IError
  transactions: ITransaction[]
}

const reducers = combineReducers<IAppState>({
  settings, wallet, apiContext, error, transactions
})

export default reducers
