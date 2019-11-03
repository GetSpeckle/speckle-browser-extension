import * as React from 'react'
import BN from 'bn.js'
import { signExtrinsic } from '../../services/keyring-vault-proxy'
import { setError } from '../../background/store/error'
import ApiPromise from '@polkadot/api/promise'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  Section,
  ErrorMessage
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import 'react-tippy/dist/tippy.css'
import t from '../../services/i18n'
import formatBalance from '@polkadot/util/format/formatBalance'
import Balance from '../account/Balance'
import { AccountSection } from '../dashboard/Dashboard'
import { Dimmer, Form, Loader } from 'semantic-ui-react'
import Amount from './Amount'
import ToAddress from './ToAddress'
import { ExtrinsicPayloadValue, IExtrinsic } from '@polkadot/types/types'
import { SignerOptions } from '@polkadot/api/types'
import Fee from './Fee'
import Confirm from './Confirm'
import AccountDropdown from '../account/AccountDropdown'
import {
  ITransaction,
  getTransactions,
  upsertTransaction
} from '../../background/store/transaction'
import { SubmittableResult } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import { HOME_ROUTE, QR_ROUTE } from '../../constants/routes'
import { EventRecord, Index, Balance as BalanceType } from '@polkadot/types/interfaces'
import { decodeAddress } from '@polkadot/util-crypto'

interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {}

interface ISendState {
  amount: string
  toAddress: string
  hasAvailable: boolean
  isSi: boolean
  isLoading: boolean
  siUnit: string
  fee: BN
  extrinsic?: IExtrinsic | null
  creationFee: BN
  existentialDeposit: BN
  recipientAvailable: BN
  modalOpen: boolean,
  isTimeout: boolean
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
      isLoading: false,
      siUnit: si.value,
      fee: new BN(0),
      extrinsic: undefined,
      creationFee: new BN(0),
      existentialDeposit: new BN(0),
      recipientAvailable: new BN(0),
      modalOpen: false,
      isTimeout: false
    }
  }

  componentWillUnmount () {
    this.props.setError(null)
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

  changeFee = (fee, creationFee, existentialDeposit, recipientAvailable) => {
    this.setState({
      fee: fee,
      creationFee: creationFee,
      existentialDeposit: existentialDeposit,
      recipientAvailable: recipientAvailable
    })
  }

  changeSiUnit = (_event, data) => {
    const val = formatBalance.findSi(data.value).value
    this.setState({ siUnit: val })
  }

  changeModal = (open) => {
    this.setState({ modalOpen: open })
  }

  saveExtrinsic = async () => {
    if (!this.props.settings.selectedAccount) {
      return
    }

    const BnAmount = this.inputValueToBn(this.state.amount, this.state.siUnit)
    const currentAddress = this.props.settings.selectedAccount.address

    const extrinsic: IExtrinsic = await this.api.tx.balances
      .transfer(this.state.toAddress, BnAmount)

    const signOptions: SignerOptions = {
      blockNumber: await this.api.query.system.number() as unknown as BN,
      blockHash: this.api.genesisHash,
      genesisHash: this.api.genesisHash,
      nonce: await this.api.query.system.accountNonce(currentAddress) as Index,
      runtimeVersion: this.api.runtimeVersion
    }
    const payloadValue: ExtrinsicPayloadValue = {
      era: extrinsic.era,
      method: extrinsic.method.toHex(),
      blockHash: signOptions.blockHash,
      genesisHash: signOptions.genesisHash,
      nonce: signOptions.nonce,
      tip: 0,
      specVersion: this.api.runtimeVersion.specVersion.toNumber()
    }
    signExtrinsic(extrinsic, currentAddress, signOptions).then(signature => {
      const signedExtrinsic = extrinsic.addSignature(
        currentAddress as any,
        signature,
        payloadValue
      )
      this.setState({ extrinsic: signedExtrinsic, modalOpen: true })
    })
  }

  confirm = async (done) => {

    if (!this.state.extrinsic || !this.props.settings.selectedAccount) {
      this.props.setError('Error occurred when processing your transaction.')
      return
    }

    const address = this.props.settings.selectedAccount.address

    const available = await this.api.query.balances.freeBalance(address) as BalanceType

    if (available.isZero()) {
      this.props.setError('You account has 0 balance.')
      return
    }

    this.setState({ isLoading: true })

    const txItem: ITransaction = {
      txHash: this.state.extrinsic.hash.toHex(),
      from: address,
      to: this.state.toAddress,
      amount: this.state.amount,
      unit: this.state.siUnit === '-' ? '' : this.state.siUnit,
      type: 'Sent',
      createTime: new Date().getTime(),
      status: 'Pending',
      fee: formatBalance(this.state.fee)
    }

    this.props.upsertTransaction(
      address,
      txItem,
      this.props.transactions
    )

    const submittable = this.state.extrinsic as SubmittableExtrinsic
    const sendTimer = this.startSendTimer()
    submittable.send(({ events, status }: SubmittableResult) => {
      const { history } = this.props
      console.log('Transaction status:', status.type)
      if (status.isFinalized) {
        this.setState({ isLoading: false })
        txItem.updateTime = new Date().getTime()
        console.log('Completed at block hash', status.value.toHex())
        console.log('Events:')
        events.forEach(({ phase, event: { data, method, section } }: EventRecord) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
          // TODO: const the value
          if (method === 'ExtrinsicSuccess') {
            txItem.status = 'Success'
            this.props.upsertTransaction(address, txItem, this.props.transactions)
          } else if (method === 'ExtrinsicFailed') {
            txItem.status = 'Failure'
            this.props.upsertTransaction(address, txItem, this.props.transactions)
          }
        })
        done && done()
        if (!this.state.isTimeout) {
          clearTimeout(sendTimer)
          history.push(HOME_ROUTE)
        }
      } else if (status.isInvalid || status.isDropped || status.isUsurped) {
        this.setState({ isLoading: false })
        txItem.status = 'Failure'
        txItem.updateTime = new Date().getTime()
        this.props.upsertTransaction(address, txItem, this.props.transactions)
        this.props.setError('Failed to send the transaction')
        if (!this.state.isTimeout) {
          clearTimeout(sendTimer)
        }
      }
    }).catch((err) => {
      console.log('Error', err)
      txItem.status = 'Failure'
      this.setState({ isLoading: false })
      txItem.updateTime = new Date().getTime()
      this.props.upsertTransaction(address, txItem, this.props.transactions)
      this.props.setError('Failed to send the transaction')
      if (!this.state.isTimeout) {
        clearTimeout(sendTimer)
      }
    })
  }

  startSendTimer = () => {
    const { history } = this.props
    const timer = setTimeout(() => {
      this.setState({ isLoading: false, isTimeout: true })
      history.push(HOME_ROUTE)
    }, 6000)
    return timer
  }

  readyToSubmit = (): boolean => {
    return this.isToAddressValid() && !!this.state.amount && this.state.hasAvailable
  }

  isToAddressValid = (): boolean => {
    try {
      return decodeAddress(this.state.toAddress).length === 32
    } catch (e) {
      return false
    }
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }

    const submitButton = (
      <StyledButton
        type={'submit'}
        disabled={!this.readyToSubmit()}
        onClick={this.saveExtrinsic}
      >
        Confirm
      </StyledButton>
    )

    return (
      <ContentContainer>
        <Dimmer active={this.state.isLoading}>
          <Loader indeterminate={true}> Processing transaction, please wait ...</Loader>
        </Dimmer>
        <AccountDropdown qrDestination={QR_ROUTE} />
        <AccountSection>
          <Balance address={this.props.settings.selectedAccount.address} />
        </AccountSection>
        <div style={{ height: 27 }} />
        <AccountSection />
        <Form>
          <Amount handleAmountChange={this.changeAmount} handleDigitChange={this.changeSiUnit}/>
          <div style={{ height: 27 }} />
          <ToAddress handleAddressChange={this.changeAddress}/>
          {this.isToAddressValid() || <ErrorMessage>{t('invalidAddress')}</ErrorMessage>}
          <div style={{ height: 27 }} />
          <AccountSection>
            <Fee
              address={this.props.settings.selectedAccount.address}
              toAddress={this.state.toAddress}
              handleFeeChange={this.changeFee}
            />
          </AccountSection>
          <Section>
            <Confirm
              network={this.props.settings.network}
              color={this.props.settings.color}
              extrinsic={this.state.extrinsic}
              trigger={submitButton}
              fromAddress={this.props.settings.selectedAccount.address}
              amount={this.inputValueToBn(this.state.amount, this.state.siUnit)}
              toAddress={this.state.toAddress}
              fee={this.state.fee!}
              creationFee={this.state.creationFee}
              existentialDeposit={this.state.existentialDeposit}
              recipientAvailable={this.state.recipientAvailable}
              confirm={this.confirm}
              open={this.state.modalOpen}
              handleModal={this.changeModal}
            />
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
