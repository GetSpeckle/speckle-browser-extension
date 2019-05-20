import { Network } from '../../constants/networks'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Keyring from '@polkadot/keyring'

export const transfer = async (
  amount: number,
  keyringPair$Json: KeyringPair$Json,
  toAddress: string,
  network: Network): Promise<string> => {

  const provider = new WsProvider(network.rpcServer)

  // Instantiate the API
  const api = await ApiPromise.create(provider)

  const keyring = new Keyring({ type: 'sr25519' })

  const from = keyring.addFromJson(keyringPair$Json)

  const transfer = api.tx.balances.transfer(toAddress, amount)

  // Sign and send the transaction using our account
  const hash = await transfer.signAndSend(from)

  console.log('Transfer sent with hash', hash.toHex())

  return hash.toHex()
}
