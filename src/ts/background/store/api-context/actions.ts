import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { AnyAction } from 'redux'
import ApiPromise from '@polkadot/api/promise'

export const ACTION_TYPES = {
  CONNECT: 'CONNECT',
  DISCONNECT: 'DISCONNECT'
}

type ApiWithProvider = { api: ApiPromise, provider: ProviderInterface }

function createApi (provider: ProviderInterface): Promise<ApiWithProvider> {
  return ApiPromise.create(provider).then(api => ({ api, provider }))
}

export function connectApi (provider: ProviderInterface) {
  return {
    type: ACTION_TYPES.CONNECT,
    payload: createApi(provider)
  }
}

export function disconnectApi (): AnyAction {
  return {
    type: ACTION_TYPES.DISCONNECT
  }
}
