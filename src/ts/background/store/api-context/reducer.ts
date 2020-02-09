import ApiPromise from '@polkadot/api/promise'
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { Reducer } from 'redux'
import { ACTION_TYPES } from './actions'
import { SUCCESS, FAILURE } from '../util'

export interface IApiContext {
  apiReady: boolean
  failed: boolean
  provider?: ProviderInterface
  api?: ApiPromise
}

const initialState: IApiContext = {
  apiReady: false,
  failed: false
}

export const apiContext: Reducer<IApiContext> = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.CREATE):
      return {
        ...state,
        ...action.payload,
        apiReady: true,
        failed: false
      }
    case FAILURE(ACTION_TYPES.CREATE):
      return {
        ...state,
        apiReady: false,
        failed: true
      }
    case ACTION_TYPES.DESTROY:
      return {
        ...state,
        apiReady: false,
        failed: false,
        provider: undefined,
        api: undefined
      }
    default:
      return state
  }
}

export default apiContext
