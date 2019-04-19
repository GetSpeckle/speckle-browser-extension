import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import account, { IAccountStatus } from './account'
import error, { IError } from './error'

export interface IAppState {
  settings: IAppSettings
  account: IAccountStatus
  error: IError
}

const reducers = combineReducers<IAppState>({
  settings, account, error
})

export default reducers
