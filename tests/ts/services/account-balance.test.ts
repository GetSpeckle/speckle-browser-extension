import { getBalance } from '../../../src/ts/services/account-balance'
import { Alexander } from '../../../src/ts/constants/networks'

const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
const EMPTY_ACCOUNT = '5F5BvRY9MJc74UUc8tLV9XAvitPNNeEWZ6TVfXwH7cpf8mox'

describe('Testing account-balance', () => {

  test('getBalance', async () => {
    const balance = await getBalance(ALICE, Alexander)
    expect(balance).toBeGreaterThanOrEqual(0)
  })

  test('getBalanceOfEmptyAccount', async () => {
    const balance = await getBalance(EMPTY_ACCOUNT, Alexander)
    expect(balance).toEqual(0)
  })
})
