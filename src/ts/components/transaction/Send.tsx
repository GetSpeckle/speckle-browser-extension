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
import { ExtrinsicPayloadValue, IExtrinsic, SignerPayloadJSON } from '@polkadot/types/types'
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
import { SiDef } from '@polkadot/util/types'
import recodeAddress from '../../services/address-transformer'
import { networks } from '../../constants/networks'

interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {}

interface ISendState {
  amount: string
  fromAddress: string
  toAddress: string
  hasAvailable: boolean
  isSi: boolean
  isLoading: boolean
  si: SiDef
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

const si: SiDef = formatBalance.findSi('-')

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
      fromAddress: recodeAddress(
        this.props.settings.selectedAccount!.address,
        networks[this.props.settings.network].ss58Format
      ),
      toAddress: '',
      hasAvailable: true,
      isSi: true,
      isLoading: false,
      si: si,
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

  inputValueToBn = (value: string): BN => {
    const parts: string[] = value.split('.')
    const selectedSi: SiDef = this.state.si
    const decimals = formatBalance.getDefaults().decimals
    const bigPart = new BN(parts[0]).mul(TEN.pow(new BN(decimals + selectedSi.power)))
    if (parts.length === 1) {
      return bigPart
    } else if (parts.length === 2) {
      const bn = new BN(decimals + selectedSi.power - parts[1].length)
      const smallPart = new BN(parts[1]).mul(TEN.pow(bn))
      return bigPart.add(smallPart)
    } else { // invalid number
      return new BN(0)
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

  changeSi = (_event, data) => {
    const siDef = formatBalance.findSi(data.value)
    this.setState({ si: siDef, siUnit: siDef.value })
  }

  changeModal = (open) => {
    this.setState({ modalOpen: open })
  }

  saveExtrinsic = async () => {
    if (!this.props.settings.selectedAccount) {
      return
    }

    const BnAmount = this.inputValueToBn(this.state.amount)
    const currentAddress = this.state.fromAddress

    const extrinsic: IExtrinsic = await this.api.tx.balances
      .transfer(this.state.toAddress, BnAmount)

    const currentBlockNumber = await this.api.query.system.number() as unknown as BN
    const currentBlockHash = await this.api.rpc.chain.getBlockHash(currentBlockNumber.toNumber())
    const currentNonce = await this.api.query.system.accountNonce(currentAddress) as Index
    const tip: number = 0
    let signerPayload: SignerPayloadJSON = {
      address: currentAddress,
      blockHash: currentBlockHash.toHex(),
      blockNumber: currentBlockNumber.toString('hex'),
      era: extrinsic.era.toHex(),
      genesisHash: this.api.genesisHash.toHex(),
      method: extrinsic.method.toHex(),
      nonce: currentNonce.toHex(),
      specVersion: this.api.runtimeVersion.specVersion.toHex(),
      tip: tip.toString(16),
      version: extrinsic.version
    }
    const payloadValue: ExtrinsicPayloadValue = {
      era: extrinsic.era,
      method: extrinsic.method,
      blockHash: currentBlockHash,
      genesisHash: this.api.genesisHash,
      nonce: currentNonce,
      tip: tip,
      specVersion: this.api.runtimeVersion.specVersion.toNumber()
    }
    signExtrinsic(signerPayload).then(signature => {
      const signedExtrinsic = extrinsic.addSignature(
        currentAddress,
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

    const address = this.state.fromAddress

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
      this.props.settings.network,
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
          if (method === 'ExtrinsicSuccess') {
            txItem.status = 'Success'
            this.props.upsertTransaction(address, this.props.settings.network,
              txItem, this.props.transactions)
          } else if (method === 'ExtrinsicFailed') {
            txItem.status = 'Failure'
            this.props.upsertTransaction(address, this.props.settings.network,
              txItem, this.props.transactions)
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
        this.props.upsertTransaction(address, this.props.settings.network,
          txItem, this.props.transactions)
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
      this.props.upsertTransaction(address, this.props.settings.network,
        txItem, this.props.transactions)
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
    if (!this.state.fromAddress) {
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
          <Balance address={this.state.fromAddress} />
        </AccountSection>
        <div style={{ height: 27 }} />
        <AccountSection />
        <Form>
          <Amount
            handleAmountChange={this.changeAmount}
            handleDigitChange={this.changeSi}
            options={formatBalance.getOptions()}
          />
          <div style={{ height: 27 }} />
          <ToAddress handleAddressChange={this.changeAddress}/>
          {this.isToAddressValid() || <ErrorMessage>{t('invalidAddress')}</ErrorMessage>}
          <div style={{ height: 27 }} />
          <AccountSection>
            <Fee
              address={this.state.fromAddress}
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
              fromAddress={this.state.fromAddress}
              amount={this.inputValueToBn(this.state.amount)}
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
