import { combineReducers } from 'redux'
import settings, { IAppSettings } from './settings/reducer'
import wallet, { IWallet } from './wallet/reducer'
import error, { IError } from './error/reducer'
import apiContext, { IApiContext } from './api-context/reducer'
import transactions from './transaction/reducer'
import { ITransaction } from './transaction'

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
