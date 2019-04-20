import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import account, { IAccount } from './account'
import error, { IError } from './error'

export interface IAppState {
  settings: IAppSettings
  account: IAccount
  error: IError
}

const reducers = combineReducers<IAppState>({
  settings, account, error
})

export default reducers
