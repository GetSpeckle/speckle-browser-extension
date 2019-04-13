import settings, { IAppSettings } from './settings/reducer'
import { combineReducers } from 'redux'
import account, { IAccountStatus } from './account'

export interface IAppState {
  settings: IAppSettings
  account: IAccountStatus
}

/**
 * @deprecated we do not use localStorage any more
 */
export const loadState = (): IAppState | undefined => {
  try {
    const serializedState = localStorage.getItem('appstate')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

/**
 * @deprecated we do not use localStorage any more
 */
export const saveState = (appstate: IAppState,
						  success: () => void = () => {},
						  error: (e: Error) => void = () => {}) => {
  try {
    const serializedState = JSON.stringify(appstate)
    localStorage.setItem('appstate', serializedState)
    success()
  } catch (e) {
    error(e)
  }
}

const reducers = combineReducers<IAppState>({
  settings, account
})

export default reducers
