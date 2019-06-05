import * as React from 'react'
import BN from 'bn.js'
import { signExtrinsic } from '../../services/keyring-vault-proxy'
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
import formatBalance from '@polkadot/util/format/formatBalance'
import { IExtrinsic } from '@polkadot/types/types'
import { SignerOptions } from '../../background/types'
import { Index } from '@polkadot/types'
import { SubmittableResult } from '@polkadot/api'

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

  confirm = async () => {
    if (!this.props.settings.selectedAccount) {
      return
    }

    const currentAddress = this.props.settings.selectedAccount.address

    const extrinsic: IExtrinsic = this.api.tx.balances
      .transfer(this.state.toAddress, this.state.amount)

    const signOptions: SignerOptions = {
      blockHash: await this.api.genesisHash,
      genesisHash: await this.api.genesisHash,
      nonce: await this.api.query.system.accountNonce(currentAddress) as Index
    }

    signExtrinsic(extrinsic, currentAddress, signOptions).then(signature => {
      extrinsic.addSignature(currentAddress as any, signature, signOptions.nonce)
      this.api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result: SubmittableResult) => {
        // save extrinsic here
      })
    })
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
