import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { Prefix } from '@polkadot/util-crypto/address/types'
import { u8aToHex } from '@polkadot/util'

export default function (address: string, ss58Format: number | undefined): string {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, ss58Format as Prefix)
}

export const getPubkeyHex = (address: string): string => {
  return u8aToHex(decodeAddress(address))
}

export const displayAddress = (address: string, showFullAddress: boolean): string => {
  if (showFullAddress) return address
  const startOfEnd = address.length - 10
  return address.substring(0, 8) + '......' + address.substring(startOfEnd)
}

export const isAddressValid = (address: string): boolean => {
  try {
    return decodeAddress(address).length === 32
  } catch (e) {
    return false
  }
}
