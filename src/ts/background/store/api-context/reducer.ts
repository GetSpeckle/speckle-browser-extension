import ApiPromise from '@polkadot/api/promise'
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { AnyAction, Reducer } from 'redux'
import { ACTION_TYPES } from './actions'
import { SUCCESS, FAILURE } from '../util'

export interface IApiContext {
  apiReady: boolean,
  provider?: ProviderInterface
  api?: ApiPromise
}

const initialState: IApiContext = {
  apiReady: false
}

export const apiContext: Reducer<IApiContext, AnyAction> = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.CREATE):
      return { ...state, ...action.payload, apiReady: true }
    case FAILURE(ACTION_TYPES.CREATE):
      return { ...state, apiReady: false }
    case ACTION_TYPES.DESTROY:
      return { ...state, apiReady: false, provider: undefined, api: undefined }
    default:
      return state
  }
}

export default apiContext
