import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { Prefix } from '@polkadot/util-crypto/address/types'

export default function (address: string, ss58Format: number): string {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, ss58Format as Prefix)
}

export const displayAddress = (address: string, showFullAddress: boolean): string => {
  if (showFullAddress) return address
  const startOfEnd = address.length - 10
  return address.substring(0, 8) + '...' + address.substring(startOfEnd)
}
