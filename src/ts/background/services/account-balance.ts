import t from '../../services/i18n'
import { ApiPromise } from '@polkadot/api'
import { WsProvider } from '@polkadot/rpc-provider'
import { Network } from '../../constants/networks'
import { ChainProperties } from '@polkadot/types'
import { formatBalance } from '@polkadot/util'

export async function getBalance (
  address: string,
  network: Network,
  withFormat?: boolean
): Promise<Number | string> {
  const provider = new WsProvider(network.rpcServer)
  try {
    const api = await ApiPromise.create(provider)
    const balance = await api.query.balances.freeBalance(address)
    if (!withFormat) return Number(balance.toString())
    const properties = await api.rpc.system.properties()
    const chainProperties = (properties as ChainProperties)
    formatBalance.setDefaults({
      decimals: chainProperties.tokenDecimals,
      unit: chainProperties.tokenSymbol
    })
    return formatBalance(balance.toString())
  } catch (e) {
    throw new Error(t('rpcError'))
  } finally {
    if (provider.isConnected()) provider.disconnect()
  }
}
