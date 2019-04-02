import { AnyAction } from 'redux'
import { LocalStore } from '../../../services/local-store'

export const ACTION_TYPES = {
  CHANGE_THEME: 'CHANGE_THEME',
  CHANGE_COLOR: 'CHANGE_COLOR'
}

export function changeTheme (theme: string): AnyAction {
  return {
    type: ACTION_TYPES.CHANGE_THEME,
    payload: LocalStore.setValue('theme', theme)
  }
}

export function changeColor (color: string): AnyAction {
  return {
    type: ACTION_TYPES.CHANGE_COLOR,
    payload: LocalStore.setValue('color', color)
  }
}
