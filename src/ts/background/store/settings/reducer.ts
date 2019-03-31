import { Reducer } from 'redux'
import { SettingsAction } from './actions'
import { ThemeTypes } from './../../../components/styles/themes'

export interface IAppSettings {
  theme: ThemeTypes,
  color: string
}

const initialState: IAppSettings = {
  theme: 'light',
  color: 'blue'
}

const settings: Reducer<IAppSettings, SettingsAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_THEME':
      return { ...state, theme: action.payload }

    case 'CHANGE_COLOR':
      return { ...state, color: action.payload }

    default:
      return state
  }
}

export default settings
