import { AnyAction } from 'redux'
import { LocalStore } from '../../../services/local-store'
import { IAppSettings } from './reducer'

export const ACTION_TYPES = {
  GET_SETTINGS: 'GET_SETTINGS',
  SAVE_SETTINGS: 'SAVE_SETTINGS'
}

export function saveSettings (settings: IAppSettings): AnyAction {
  return {
    type: ACTION_TYPES.SAVE_SETTINGS,
    payload: LocalStore.setValue('settings', settings)
  }
}

export function getSettings (): AnyAction {
  return {
    type: ACTION_TYPES.GET_SETTINGS,
    payload: LocalStore.get('settings')
  }
}
