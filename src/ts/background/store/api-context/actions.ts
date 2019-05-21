import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { AnyAction } from 'redux'
import ApiPromise from '@polkadot/api/promise'

export const ACTION_TYPES = {
  CREATE: 'CREATE',
  DESTROY: 'DESTROY'
}

type ApiWithProvider = { api: ApiPromise, provider: ProviderInterface }

function doCreateApi (provider: ProviderInterface): Promise<ApiWithProvider> {
  return ApiPromise.create(provider).then(api => ({ api, provider }))
}

export function createApi (provider: ProviderInterface) {
  return {
    type: ACTION_TYPES.CREATE,
    payload: doCreateApi(provider)
  }
}

export function destroyApi (provider: ProviderInterface): AnyAction {
  provider && provider.isConnected() && provider.disconnect()
  return {
    type: ACTION_TYPES.DESTROY
  }
}
