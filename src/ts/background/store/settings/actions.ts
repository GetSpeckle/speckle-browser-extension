import { AnyAction } from 'redux'
import { LocalStore } from '../../../services/local-store'

export const ACTION_TYPES = {
  CHANGE_THEME: 'CHANGE_THEME',
  CHANGE_COLOR: 'CHANGE_COLOR',
  GET_SETTINGS: 'GET_SETTINGS'
}

export function changeTheme (theme: string): AnyAction {
  return {
    type: ACTION_TYPES.CHANGE_THEME,
    payload: LocalStore.setValue({ settings: { theme: theme } }, theme)
  }
}

export function changeColor (color: string): AnyAction {
  return {
    type: ACTION_TYPES.CHANGE_COLOR,
    payload: LocalStore.setValue({ settings: { color: color } }, color)
  }
}

export function getSettings (): AnyAction {
  return {
    type: ACTION_TYPES.GET_SETTINGS,
    payload: LocalStore.get('settings')
  }
}
