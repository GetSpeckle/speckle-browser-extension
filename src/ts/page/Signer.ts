import { SignerOptions } from '@polkadot/api/types'
import { InjectedSigner } from '@polkadot/extension-dapp/types'
import { IExtrinsic } from '@polkadot/types/types'
import { SendRequest } from './types'

let sendRequest: SendRequest

export default class Signer implements InjectedSigner {
  public constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest
  }

  public async sign (extrinsic: IExtrinsic, address: string,
              { blockHash, blockNumber, era, genesisHash, nonce }: SignerOptions): Promise<number> {
    // Bit of a hack - with this round-about way, we skip any keyring deps
    const { id, signature } = await sendRequest('extrinsic.sign', JSON.parse(JSON.stringify({
      address,
      blockHash,
      blockNumber: blockNumber.toNumber(),
      era,
      genesisHash,
      method: extrinsic.method.toHex(),
      nonce
    })))

    extrinsic.addSignature(address, signature, nonce)

    return id
  }
}
