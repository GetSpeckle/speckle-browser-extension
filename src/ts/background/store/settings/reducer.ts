import { Reducer, AnyAction } from 'redux'
import { ThemeTypes } from './../../../components/styles/themes'
import { ACTION_TYPES } from './actions'
import { SUCCESS, REQUEST } from '../util'

/**
 * Settings state
 */
export interface IAppSettings {
  updating: boolean,
  theme: ThemeTypes,
  color: string
}

const initialState: IAppSettings = {
  updating: false,
  theme: 'light',
  color: 'blue'
}

/**
 * create settings reducer
 *
 * @param state the current state
 * @param action the action received
 */
const settings: Reducer<IAppSettings, AnyAction> = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CHANGE_COLOR):
      return { ...state, updating: true }

    case SUCCESS(ACTION_TYPES.CHANGE_COLOR):
      console.log('new color is %s', action.payload)
      return { ...state, color: action.payload, updating: false }

    default:
      return state
  }
}

export default settings
