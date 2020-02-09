import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { AnyAction } from 'redux'
import ApiPromise from '@polkadot/api/promise'
import { ApiOptions } from '@polkadot/api/types'

export const ACTION_TYPES = {
  CREATE: 'CREATE',
  DESTROY: 'DESTROY'
}

type ApiWithProvider = { api: ApiPromise, provider?: ProviderInterface }

function doCreateApi (options: ApiOptions): Promise<ApiWithProvider> {
  return ApiPromise.create(options).then(api => ({ api, provider: options.provider }))
}

export function createApi (options: ApiOptions) {
  return {
    type: ACTION_TYPES.CREATE,
    payload: doCreateApi(options)
  }
}

export function destroyApi (): AnyAction {
  return {
    type: ACTION_TYPES.DESTROY
  }
}
