import { Reducer, AnyAction } from 'redux'
import { ACTION_TYPES } from './actions'
import { SUCCESS, REQUEST } from '../util'
import {
  Color,
  ThemeTypes
} from '../../../components/styles/themes'
import { IAccount } from '../wallet'

export interface IAppSettings {
  updating: boolean,
  theme: ThemeTypes,
  color: Color,
  // welcome if first time user
  welcome: boolean,
  network: string,
  selectedAccount?: IAccount
}

const initialState: IAppSettings = {
  updating: false,
  theme: 'light',
  color: 'blue',
  welcome: true,
  network: 'Kusama'
}

const settings: Reducer<IAppSettings, AnyAction> = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SETTINGS):
    case REQUEST(ACTION_TYPES.SAVE_SETTINGS):
      return { ...state, updating: true }

    case SUCCESS(ACTION_TYPES.GET_SETTINGS):
      return { ...state, ...action.payload.settings }

    case SUCCESS(ACTION_TYPES.SAVE_SETTINGS):
      return { ...state, ...action.payload }

    default:
      return state
  }
}

export default settings
