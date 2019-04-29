import { Reducer, AnyAction } from 'redux'
import { ACTION_TYPES } from './actions'
import { SUCCESS, REQUEST } from '../util'
import {
  Color,
  ThemeTypes
} from '../../../components/styles/themes'

/**
 * Settings state
 */
export interface IAppSettings {
  updating: boolean,
  theme: ThemeTypes,
  color: Color,
  // welcome if first time user
  welcome: boolean
}

const initialState: IAppSettings = {
  updating: false,
  theme: 'light',
  color: 'blue',
  welcome: true
}

/**
 * create settings reducer
 *
 * @param state the current state
 * @param action the action received
 */
const settings: Reducer<IAppSettings, AnyAction> = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SETTINGS):
    case REQUEST(ACTION_TYPES.SAVE_SETTINGS):
      return { ...state, updating: true }

    case SUCCESS(ACTION_TYPES.GET_SETTINGS):
      console.log('got the setting', action.payload)
      return { ...state, ...action.payload.settings }

    case SUCCESS(ACTION_TYPES.SAVE_SETTINGS):
      console.log('got the saved settings', action.payload)
      return { ...state, ...action.payload }

    default:
      return state
  }
}

export default settings
