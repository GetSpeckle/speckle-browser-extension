import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import account, { IAccountStatus } from './account'

export interface IAppState {
  settings: IAppSettings,
  accountStatus: IAccountStatus
}

const reducers = combineReducers({
  settings, account
})

export default reducers
