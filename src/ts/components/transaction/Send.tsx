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
import { Index, ExtrinsicStatus } from '@polkadot/types'
import AccountDropdown from '../../components/account/AccountDropdown'
import Fee from './Fee'
import { ITransaction, getTransactions, upsertTransaction } from '../../background/store/transaction'

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
      fee: ''
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
    this.setState({ toAddress: event.target.value })
  }

  changeAmount = event => {
    this.setState({ amount: event.target.value })
  }

  changeFee (result) {
    this.setState({ fee: result })
  }

  changeSiUnit = (_event, data) => {
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

      const txItem: ITransaction = {
        txHash: extrinsic.hash.toHex(),
        from: currentAddress,
        to: this.state.toAddress,
        amount: this.state.amount,
        unit: this.state.siUnit,
        type: 'Sent',
        createTime: new Date().getTime(),
        status: 'Pending',
        fee: this.state.fee
      }

      this.props.upsertTransaction(currentAddress, txItem, this.props.transactions)

      this.api.rpc.author.submitAndWatchExtrinsic(extrinsic, (result: ExtrinsicStatus) => {
        console.log(result)
        // save extrinsic here
        if (result) {
          if (result.isFinalized) {
            txItem.status = 'Success'
            txItem.updateTime = new Date().getTime()
            this.props.upsertTransaction(currentAddress, txItem, this.props.transactions)
          } else if (result.isInvalid || result.isDropped || result.isUsurped) {
            txItem.status = 'Failure'
            txItem.updateTime = new Date().getTime()
            this.props.upsertTransaction(currentAddress, txItem, this.props.transactions)
          } else {
            console.log('Status is ', result)
          }
        }
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
          <Fee
            address={this.props.settings.selectedAccount.address}
            toAddress={this.state.toAddress}
            /* tslint:disable-next-line:jsx-no-bind */
            handleFeeChange={this.changeFee.bind(this)}
          />
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
    settings: state.settings,
    transactions: state.transactions
  }
}

const mapDispatchToProps = { getTransactions, upsertTransaction, setError }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Send)
)
