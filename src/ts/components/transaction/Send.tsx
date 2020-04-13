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
import { Dimmer, Form, Loader } from 'semantic-ui-react'
import Amount from './Amount'
import ToAddress from './ToAddress'
import { ExtrinsicPayloadValue, IExtrinsic, SignerPayloadJSON } from '@polkadot/types/types'
import { DeriveBalancesAll } from '@polkadot/api-derive/types'
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
import { EventRecord, Index, BlockNumber } from '@polkadot/types/interfaces'
import { decodeAddress } from '@polkadot/util-crypto'
import { SiDef } from '@polkadot/util/types'
import styled from 'styled-components'

interface ISendProps extends StateProps, RouteComponentProps, DispatchProps {}

interface ISendState {
  amount: string
  amountSi: SiDef
  amountUnit: string
  tip: string
  tipSi: SiDef
  tipUnit: string
  nonce: Index | null
  toAddress: string
  hasAvailable: boolean
  isLoading: boolean
  fee: BN
  extrinsic?: IExtrinsic | null
  creationFee: BN
  existentialDeposit: BN
  recipientAvailable: BN
  modalOpen: boolean,
  isTimeout: boolean
}

const TEN = new BN(10)

const amountSi: SiDef = formatBalance.findSi('-')

const tipSi: SiDef = formatBalance.findSi('-')

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
      amountSi,
      amountUnit: amountSi.value,
      tip: '',
      tipSi,
      tipUnit: tipSi.value,
      nonce: null,
      toAddress: '',
      hasAvailable: true,
      isLoading: false,
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

  inputValueToBn = (value: string, selectedSi: SiDef): BN => {
    const parts: string[] = value.split('.')
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

  changeTip = event => {
    this.setState({ tip: event.target.value })
  }

  changeFee = (fee, creationFee, existentialDeposit) => {
    this.setState({
      fee: fee,
      creationFee: creationFee,
      existentialDeposit: existentialDeposit
    })
  }

  changeAmountSi = (_event, data) => {
    const siDef = formatBalance.findSi(data.value)
    this.setState({ amountSi: siDef, amountUnit: siDef.value })
  }

  changeTipSi = (_event, data) => {
    const siDef = formatBalance.findSi(data.value)
    this.setState({ tipSi: siDef, tipUnit: siDef.value })
  }

  changeModal = (open) => {
    this.setState({ modalOpen: open })
  }

  saveExtrinsic = async () => {
    if (!this.props.account) {
      return
    }

    const amountBn = this.inputValueToBn(this.state.amount, this.state.amountSi)
    const tipBn = this.inputValueToBn(this.state.tip, this.state.tipSi)
    const currentAddress = this.props.account.address
    const extrinsic: IExtrinsic = await this.api.tx.balances
      .transfer(this.state.toAddress, amountBn)

    const currentBlockNumber = await this.api.query.system.number() as unknown as BlockNumber
    const currentBlockHash = await this.api.rpc.chain.getBlockHash(currentBlockNumber)
    const balancesAll = await this.api.derive.balances.all(currentAddress) as DeriveBalancesAll
    const currentNonce = balancesAll.accountNonce
    this.setState({ nonce: currentNonce })
    console.log('currentNonce: ', currentNonce.toNumber())
    let signerPayload: SignerPayloadJSON = {
      address: currentAddress,
      blockHash: currentBlockHash.toHex(),
      blockNumber: currentBlockNumber.toString(),
      era: extrinsic.era.toHex(),
      genesisHash: this.api.genesisHash.toHex(),
      method: extrinsic.method.toHex(),
      nonce: (this.state.nonce! as Index).toHex(),
      specVersion: this.api.runtimeVersion.specVersion.toHex(),
      tip: tipBn.toString(),
      version: extrinsic.version
    }
    const payloadValue: ExtrinsicPayloadValue = {
      era: extrinsic.era,
      method: extrinsic.method,
      blockHash: currentBlockHash,
      genesisHash: this.api.genesisHash,
      nonce: this.state.nonce!.toNumber(),
      tip: tipBn.toNumber(),
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

    const { address } = this.props.settings.selectedAccount

    const balancesAll = await this.api.derive.balances.all(address) as DeriveBalancesAll
    const available = balancesAll.freeBalance

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
      unit: this.state.amountUnit === '-' ? '' : this.state.amountUnit,
      type: 'Sent',
      createTime: new Date().getTime(),
      status: 'Pending',
      fee: formatBalance(this.state.fee)
    }

    this.updateList(address, this.props.settings.network, txItem)

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
            this.updateList(address, this.props.settings.network, txItem)
          } else if (method === 'ExtrinsicFailed') {
            txItem.status = 'Failure'
            this.updateList(address, this.props.settings.network, txItem)
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
        this.updateList(address, this.props.settings.network, txItem)
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
      this.updateList(address, this.props.settings.network, txItem)
      this.props.setError('Failed to send the transaction')
      if (!this.state.isTimeout) {
        clearTimeout(sendTimer)
      }
    })
  }

  updateList = (address, network, txItem) => {
    this.props.getTransactions(address, network).then((getTxs) => {
      console.log(getTxs)
      const txs = getTxs.value
      console.log('list input: ', txs)
      this.props.upsertTransaction(address, network,
        txItem, txs)
    })
  }

  startSendTimer = () => {
    const { history } = this.props
    return setTimeout(() => {
      this.setState({ isLoading: false, isTimeout: true })
      history.push(HOME_ROUTE)
    }, 6000)
  }

  readyToSubmit = (): boolean => {
    return this.isToAddressValid()
      && !!this.state.amount
      && this.state.hasAvailable
      && this.isAmountValid() === ''
      && this.isTipValid() === ''
  }

  isToAddressValid = (): boolean => {
    try {
      return decodeAddress(this.state.toAddress).length === 32
    } catch (e) {
      return false
    }
  }

  validateAmount (str: String): string {
    let result = ''
    str.split('').map((ch) => {
      if ('a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch === '_') {
        result = 'Letters not allowed'
      } else if (ch === '-') {
        result = 'Negatives or hyphens not allowed'
      }
    })
    return result
  }

  isAmountValid = (): string => {
    return this.validateAmount(this.state.amount)
  }

  isTipValid = (): string => {
    return this.validateAmount(this.state.tip)
  }

  render () {
    if (!this.props.account) {
      return null
    }
    if (!this.props.account.address) {
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
        <DividerSection>
          <Balance address={this.props.account.address} />
        </DividerSection>
        <div style={{ height: 27 }} />
        <DividerSection />
        <Form>
          <Amount
            handleAmountChange={this.changeAmount}
            handleAmountSiChange={this.changeAmountSi}
            handleTipChange={this.changeTip}
            handleTipSiChange={this.changeTipSi}
            amountValid={this.isAmountValid()}
            tipValid={this.isTipValid()}
          />
          <ToAddress handleAddressChange={this.changeAddress}/>
          {this.isToAddressValid() || <ErrorMessage>{t('invalidAddress')}</ErrorMessage>}
          <div style={{ height: 17 }} />
          <FeeSection>
            <Fee
              address={this.props.account.address}
              toAddress={this.state.toAddress}
              handleFeeChange={this.changeFee}
            />
          </FeeSection>
          <Section>
            <Confirm
              network={this.props.settings.network}
              color={this.props.settings.color}
              extrinsic={this.state.extrinsic}
              trigger={submitButton}
              fromAddress={this.props.account.address}
              amount={this.inputValueToBn(this.state.amount, this.state.amountSi)}
              tip={this.inputValueToBn(this.state.tip, this.state.tipSi)}
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

export const DividerSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`

export const FeeSection = styled.div`
  width: 100%
  margin: -5px 0 -4px
  text-align: center
`

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    settings: state.settings,
    account: state.settings.selectedAccount,
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
