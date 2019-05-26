import * as React from 'react'
import BN from 'bn.js'
import { getPassword, getAccount } from '../../services/keyring-vault-proxy'
import ApiPromise from '@polkadot/api/promise'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import 'react-tippy/dist/tippy.css'
import { Form } from 'semantic-ui-react'
import t from '../../services/i18n'
import Keyring from '@polkadot/keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import formatBalance from '@polkadot/util/format/formatBalance'
interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface ISendState {
  amount: BN,
  toAddress: string,
  hasAvailable: boolean,
  isSi: boolean,
  siUnit: string
}

const TEN = new BN(10)

const si = formatBalance.findSi('m')

class Send extends React.Component<ISendProps, ISendState> {

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  constructor (props) {
    super(props)

    this.state = {
      amount: new BN(0),
      toAddress: '',
      hasAvailable: true,
      isSi: true,
      siUnit: si.value
    }
  }

  changeAmount = event => {
    this.setState({ amount: this.inputValueToBn(event.target.value) })
  }

  getSiPowers = (siUnit = this.state.siUnit): [BN, number, number] => {
    const { isSi } = this.state

    const basePower = isSi ? formatBalance.getDefaults().decimals : 0
    const siUnitPower = isSi ? formatBalance.findSi(siUnit).power : 0

    return [new BN(basePower + siUnitPower), basePower, siUnitPower]
  }

  inputValueToBn = (value: string, siUnit?: string): BN => {
    const [siPower, basePower, siUnitPower] = this.getSiPowers(siUnit)

    const isDecimalValue = value.match(/^(\d+)\.(\d+)$/)

    if (isDecimalValue) {
      if (siUnitPower - isDecimalValue[2].length < -basePower) {
        return new BN(-1)
      }

      const div = new BN(value.replace(/\.\d*$/, ''))
      const mod = new BN(value.replace(/^\d+\./, ''))

      return div
        .mul(TEN.pow(siPower))
        .add(mod.mul(TEN.pow(new BN(basePower + siUnitPower - mod.toString().length))))
    } else {
      return new BN(value.replace(/[^\d]/g, ''))
        .mul(TEN.pow(siPower))
    }
  }

  changeAddress = event => {
    const val = event.target.value
    this.setState({ toAddress: val })
  }

  confirm = () => {
    if (!this.props.settings.selectedAccount) {
      return
    }
    getAccount(this.props.settings.selectedAccount.address).then(
      keyringPairJson => {
        getPassword().then(password => {
          const keyring = new Keyring({ type: 'sr25519' })

          let pair: KeyringPair = keyring.addFromJson(keyringPairJson)
          pair.decodePkcs8(password)
          // Do the transfer and track the actual status
          this.api.tx.balances
            .transfer(this.state.toAddress, this.state.amount)
            .signAndSend(pair, ({ events = [], status }) => {
              console.log('Transaction status:', status.type)

              if (status.isFinalized) {
                console.log(`Completed transfer of ${this.state.amount} to ${this.state.toAddress} at block hash`, status.asFinalized.toHex())
                console.log('Events:')

                events.forEach(({ phase, event: { data, method, section } }) => {
                  console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
                })
              } else {
                console.log(`Status of transfer: ${status.type}`)
              }
            }
          )
        }
        )
      }
      )
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return (null)
    }

    return (
      <ContentContainer>
        <Form>
          <Form.Input
            label='Amount (milli)'
            onChange={this.changeAmount}
          />
          <Form.TextArea
            label='toAddress'
            value={this.state.toAddress}
            onChange={this.changeAddress}
          />
          <Section>
            <StyledButton onClick={this.confirm}>
              Confirm
            </StyledButton>
          </Section>
        </Form>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    settings: state.settings
  }
}

const mapDispatchToProps = {}
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Send))
