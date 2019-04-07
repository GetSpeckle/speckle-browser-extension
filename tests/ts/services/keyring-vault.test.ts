import { mnemonicGenerate, cryptoWaitReady } from '@polkadot/util-crypto'
import Keyring from '@polkadot/keyring'

describe('Testing keyring', () => {

  beforeEach(async () => {
    await cryptoWaitReady()
  })

  test('keyring tests', async () => {
    let keyring = new Keyring({ type: 'sr25519' })

    let mnemonic = mnemonicGenerate()
    expect(mnemonic).toBeDefined()

    let pair = keyring.addFromMnemonic(mnemonic)
    expect(pair).toBeDefined()
    expect(pair.isLocked()).toBeFalsy()

    let keyringPair$Json = pair.toJson()
    let pair2 = keyring.addFromJson(keyringPair$Json)
    expect(pair2.isLocked()).toBeTruthy()

    let encryptedJson = pair.toJson('password')
    expect(encryptedJson === keyringPair$Json).toBeFalsy()

    const pair3 = keyring.addFromJson(encryptedJson)
    expect(pair3.isLocked()).toBeTruthy()

    pair3.decodePkcs8('password')
    expect(pair3.isLocked()).toBeFalsy()

    const pair4 = keyring.addFromUri(`${mnemonic}///password`)
    expect(pair4.isLocked()).toBeFalsy()
  })
})
