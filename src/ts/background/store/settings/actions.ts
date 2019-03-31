import { SpeckleAction } from '../util';

export type SettingsActionType = 'CHANGE_THEME' | 'CHANGE_COLOR'

export type SettingsAction = SpeckleAction<SettingsActionType>

export function changeTheme(theme: string): SettingsAction {
  return {
    type: 'CHANGE_THEME',
    payload: theme
  }
}

export function changeColor(color: string): SettingsAction {
  return {
    type: 'CHANGE_COLOR',
    payload: color
  }
}
