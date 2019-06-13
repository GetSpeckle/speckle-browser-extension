import * as React from 'react'
import BN from 'bn.js'
import { signExtrinsic } from '../../services/keyring-vault-proxy'
import { setError } from '../../background/store/error'
import ApiPromise from '@polkadot/api/promise'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button as StyledButton, ContentContainer, Section } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import 'react-tippy/dist/tippy.css'
import t from '../../services/i18n'
import formatBalance from '@polkadot/util/format/formatBalance'
import Balance from '../account/Balance'
import { AccountSection } from '../dashboard/Dashboard'
import { Form } from 'semantic-ui-react'
import Amount from './Amount'
import ToAddress from './ToAddress'
import { IExtrinsic } from '@polkadot/types/types'
import { SignerOptions } from '../../background/types'
import { Index } from '@polkadot/types'
import { SubmittableResult } from '@polkadot/api'
import AccountDropdown from '../../components/account/AccountDropdown'
import Fee from './Fee'

interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {}

interface ISendState {
  amount: string
  toAddress: string
  hasAvailable: boolean
  isSi: boolean
  siUnit: string
  fee: any
}

const TEN = new BN(10)

const si = formatBalance.findSi('-')

class Send extends React.Component<ISendProps, ISendState> {
  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  constructor (props) {
    super(props)

    this.state = {
      amount: '',
      toAddress: '',
      hasAvailable: true,
      isSi: true,
      siUnit: si.value,
      fee: 0
    }
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

      // tslint:disable-next-line:max-line-length
      return div.mul(TEN.pow(siPower)).add(mod.mul(TEN.pow(new BN(basePower + siUnitPower - mod.toString().length))))
    } else {
      return new BN(value.replace(/[^\d]/g, '')).mul(TEN.pow(siPower))
    }
  }

  changeAddress = event => {
    const val = event.target.value
    // console.log(val) TODO: remove this after testing
    this.setState({ toAddress: val })
    console.log(this.state.toAddress)
  }

  changeAmount = event => {
    // console.log(event.target.value) TODO: remove this after testing
    this.setState({ amount: event.target.value })
  }

  changeSiUnit = (_event, data) => {
    // console.log(data.value) TODO: remove this after testing
    const val = formatBalance.findSi(data.value).value
    this.setState({ siUnit: val })
  }

  confirm = async () => {
    this.props.setError('')
    if (!this.props.settings.selectedAccount) {
      return
    }

    const BnAmount = this.inputValueToBn(this.state.amount, this.state.siUnit)
    const currentAddress = this.props.settings.selectedAccount.address

    const extrinsic: IExtrinsic = await this.api.tx.balances
      .transfer(this.state.toAddress, BnAmount)

    const signOptions: SignerOptions = {
      blockHash: await this.api.genesisHash,
      genesisHash: await this.api.genesisHash,
      nonce: await this.api.query.system.accountNonce(currentAddress) as Index
    }

    signExtrinsic(extrinsic, currentAddress, signOptions).then(signature => {
      extrinsic.addSignature(currentAddress as any, signature, signOptions.nonce)
      this.api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result: SubmittableResult) => {
        console.log(result)
        // save extrinsic here
      })
    }).catch(err => {
      this.props.setError(err.message)
    })
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }

    return (
      <ContentContainer>
        <AccountDropdown/>
        <AccountSection>
          <Balance address={this.props.settings.selectedAccount.address} />
        </AccountSection>
        <div style={{ height: 27 }} />
        <AccountSection />
        <Form>
          <Amount handleAmountChange={this.changeAmount} handleDigitChange={this.changeSiUnit}/>
          <div style={{ height: 27 }} />
          <ToAddress handleAddressChange={this.changeAddress}/>
          <div style={{ height: 27 }} />
          <AccountSection>
          <Fee/>
          </AccountSection>
          <Section>
            <StyledButton onClick={this.confirm}>Confirm</StyledButton>
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

const mapDispatchToProps = { setError }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Send)
)
