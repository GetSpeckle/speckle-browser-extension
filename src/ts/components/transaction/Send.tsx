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
import { Index } from '@polkadot/types/interfaces'
import { SiDef } from '@polkadot/util/types'
import styled from 'styled-components'
import { isAddressValid } from '../../services/address-transformer'
import { defaultExtensions } from '@polkadot/types/extrinsic/signedExtensions'

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
  senderAvailable: BN
  modalOpen: boolean
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
      senderAvailable: new BN(0),
      modalOpen: false
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
    }
    const bn = new BN(decimals + selectedSi.power - parts[1].length)
    const smallPart = new BN(parts[1]).mul(TEN.pow(bn))
    return bigPart.add(smallPart)
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

  changeFee = (fee) => {
    this.setState({ fee: fee })
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

  getTotal = () => {
    const amountBn = this.inputValueToBn(this.state.amount, this.state.amountSi)
    const tipBn = this.inputValueToBn(this.state.tip, this.state.tipSi)
    return amountBn.add(tipBn).add(this.state.fee)
  }

  saveExtrinsic = async () => {
    if (!this.props.account) {
      return
    }

    const amountBn = this.inputValueToBn(this.state.amount, this.state.amountSi)
    const tipBn = this.inputValueToBn(this.state.tip, this.state.tipSi)
    const total = amountBn.add(tipBn).add(this.state.fee)
    const currentAddress = this.props.account.address
    const balancesAll = await this.api.derive.balances.all(currentAddress) as DeriveBalancesAll
    const available = balancesAll.availableBalance
    if (available.lt(total)) {
      this.props.setError(t('notEnoughBalance'))
      return
    }
    const extrinsic = this.api.tx.balances.transfer(this.state.toAddress, amountBn)
    const currentBlockNumber = await this.api.query.system.number()
    const currentBlockHash = await this.api.rpc.chain.getBlockHash(currentBlockNumber)

    this.setState({ senderAvailable: balancesAll.availableBalance })
    const currentNonce = balancesAll.accountNonce
    this.setState({ nonce: currentNonce })
    let signerPayload: SignerPayloadJSON = {
      address: currentAddress,
      blockHash: currentBlockHash.toHex(),
      blockNumber: currentBlockNumber.toString(),
      era: extrinsic.era.toHex(),
      genesisHash: this.api.genesisHash.toHex(),
      method: extrinsic.method.toHex(),
      nonce: (this.state.nonce! as Index).toHex(),
      specVersion: this.api.runtimeVersion.specVersion.toHex(),
      transactionVersion: this.api.runtimeVersion.transactionVersion.toHex(),
      tip: tipBn.toString(),
      version: extrinsic.version,
      signedExtensions: defaultExtensions
    }
    const payloadValue: ExtrinsicPayloadValue = {
      era: extrinsic.era,
      method: extrinsic.method,
      blockHash: currentBlockHash,
      genesisHash: this.api.genesisHash,
      nonce: this.state.nonce!.toNumber(),
      tip: tipBn.toNumber(),
      specVersion: this.api.runtimeVersion.specVersion.toNumber(),
      transactionVersion: this.api.runtimeVersion.transactionVersion.toNumber()
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

  confirm = async () => {

    if (!this.state.extrinsic || !this.props.settings.selectedAccount) {
      this.props.setError(t('transactionError'))
      return
    }

    const { address } = this.props.settings.selectedAccount

    const balancesAll = await this.api.derive.balances.all(address) as DeriveBalancesAll
    const available = balancesAll.availableBalance
    if (available.lt(this.getTotal())) {
      this.props.setError(t('notEnoughBalance'))
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
    submittable.send((result: SubmittableResult) => {
      if (result.isInBlock) {
        console.log(`Transaction in block at blockHash ${result.status.asInBlock}`)
        this.setState({ isLoading: false })
        this.props.history.push(HOME_ROUTE)
      } else if (result.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`)
        txItem.updateTime = new Date().getTime()
        txItem.status = 'Success'
        this.updateList(address, this.props.settings.network, txItem)
      } else if (result.isError) {
        txItem.updateTime = new Date().getTime()
        txItem.status = 'Failure'
        this.updateList(address, this.props.settings.network, txItem)
        this.props.setError(t('transactionError'))
        this.setState({ isLoading: false })
      } else if (result.isWarning) {
        console.warn(result.status)
      }
    }).catch((err) => {
      console.log('Error', err)
      txItem.updateTime = new Date().getTime()
      txItem.status = 'Failure'
      this.updateList(address, this.props.settings.network, txItem)
      this.props.setError(t('transactionError'))
      this.setState({ isLoading: false })
    })
  }

  updateList = (address, network, txItem) => {
    this.props.getTransactions(address, network).then((getTxs) => {
      const txs = getTxs.value
      this.props.upsertTransaction(address, network,
        txItem, txs)
    })
  }

  readyToSubmit = (): boolean => {
    return isAddressValid(this.state.toAddress)
      && !!this.state.amount
      && this.state.hasAvailable
      && this.isAmountValid()
      && this.isTipValid()
  }

  isAmountValid = (): boolean => {
    const n = Number(this.state.amount)
    return !isNaN(n) && n > 0
  }

  isTipValid = (): boolean => {
    if (this.state.tip) {
      const n = Number(this.state.tip)
      return !isNaN(n) && n >= 0
    }
    return true
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
          <Loader indeterminate={true}>{t('processingTx')}</Loader>
        </Dimmer>
        <AccountDropdown qrDestination={QR_ROUTE} />
        <DividerSection>
          <Balance address={this.props.account.address} />
        </DividerSection>
        <div style={{ height: 27 }} />
        <DividerSection />
        <Form>
          <div>
            <Amount
              handleAmountChange={this.changeAmount}
              handleAmountSiChange={this.changeAmountSi}
              handleTipChange={this.changeTip}
              handleTipSiChange={this.changeTipSi}
              amountError={this.isAmountValid() ? '' : t('positiveNumber')}
              tipError={this.isTipValid() ? '' : t('notNegative')}
            />
            <ToAddress handleAddressChange={this.changeAddress}/>
            {/* tslint:disable-next-line:max-line-length */}
            {isAddressValid(this.state.toAddress) || <ErrorMessage>{t('invalidAddress')}</ErrorMessage>}
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
                senderAvailable={this.state.senderAvailable}
                confirm={this.confirm}
                open={this.state.modalOpen}
                handleModal={this.changeModal}
              />
            </Section>
          </div>
        </Form>

      </ContentContainer>
    )
  }
}

const DividerSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`

const FeeSection = styled.div`
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
