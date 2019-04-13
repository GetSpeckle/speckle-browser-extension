import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import account, { IAccountStatus } from './account'

export interface IAppState {
  settings: IAppSettings
  account: IAccountStatus
}

const reducers = combineReducers<IAppState>({
  settings, account
})

export default reducers
