import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import wallet, { IWallet } from './wallet'
import error, { IError } from './error'

export interface IAppState {
  settings: IAppSettings
  wallet: IWallet
  error: IError
}

const reducers = combineReducers<IAppState>({
  settings, wallet, error
})

export default reducers
