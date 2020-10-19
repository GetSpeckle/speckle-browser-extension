import * as React from 'react'
import ApiPromise from '@polkadot/api/promise'
import { DeriveBalancesAll, DeriveReferendumExt } from '@polkadot/api-derive/types'
import { ExtrinsicPayloadValue, SignerPayloadJSON } from '@polkadot/types/types'
import {
  Index,
  Extrinsic
} from '@polkadot/types/interfaces'
import { RouteComponentProps, withRouter } from 'react-router'
import { ContentContainer } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import 'react-tippy/dist/tippy.css'
import t from '../../services/i18n'
import AccountDropdown from '../account/AccountDropdown'
import BN = require('bn.js')
import VoteStatus from './VoteStatus'
import styled from 'styled-components'
import { Button, Dimmer, Icon, Loader } from 'semantic-ui-react'
import { formatBalance, formatNumber } from '@polkadot/util'
import { HOME_ROUTE, INITIALIZE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { colorSchemes } from '../styles/themes'
import { isWalletLocked, signExtrinsic } from '../../services/keyring-vault-proxy'
import { setError } from '../../background/store/error'
import { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import { SubmittableResult } from '@polkadot/api'
import { SiDef } from '@polkadot/util/types'
import { chains } from '../../constants/chains'
import VoteAmount from './VoteAmount'

interface IVoteProps extends StateProps, RouteComponentProps, DispatchProps, ILocationState {
}

interface ILocationState {
  referendum: DeriveReferendumExt
}

interface IBallot {
  voteCount: number
  voteCountAye: number
  voteCountNay: number
  votedAye: BN
  votedNay: BN
  votedTotal: BN
}

interface IVoteState {
  id: number | string
  network: string
  ballot: IBallot
  referendum?: DeriveReferendumExt | undefined
  extrinsic?: Extrinsic | null
  tries: number
  voteTries: number
  nextTry?: any
  nextVoteTry?: any
  header: string
  documentation?: string | null
  stusLoading: boolean
  txLoading: boolean
  nonce: Index | null
  tip: string
  fee: BN
  tipSi: SiDef
  tipUnit: string
  amount: string
  amountSi: SiDef
  amountUnit: string
  conviction: string
  senderAvailable: BN
  modalOpen: boolean
}

const tipSi: SiDef = formatBalance.findSi('-')
const amountSi: SiDef = formatBalance.findSi('-')

const TEN = new BN(10)

class Vote extends React.Component<IVoteProps, IVoteState> {

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  public state: IVoteState = {
    amount: '',
    amountSi,
    amountUnit: amountSi.value,
    tip: '',
    tipSi,
    tipUnit: tipSi.value,
    nonce: null,
    fee: new BN(0),
    extrinsic: undefined,
    senderAvailable: new BN(0),
    modalOpen: false,
    conviction: '',
    id: this.props.match.params['proposalId'],
    network: this.props.match.params['network'],
    ballot: {
      voteCount: 0,
      voteCountAye: 0,
      voteCountNay: 0,
      votedAye: new BN(0),
      votedNay: new BN(0),
      votedTotal: new BN(0)
    },
    tries: 0,
    voteTries: 0,
    referendum: undefined,
    header: '',
    documentation: '',
    stusLoading: false,
    txLoading: false
  }

  componentWillMount (): void {
    // console.log(this.state.network)
    // console.log(this.state.id)
    if (this.props.settings.selectedAccount == null) {
      this.props.history.push(INITIALIZE_ROUTE)

    }
    isWalletLocked().then(result => {
      if (result) this.props.history.push(LOGIN_ROUTE)
    })
    if (this.state.id !== ':proposalId') {
      let callback = setInterval(() => {
        if (this.props.apiContext.apiReady) {
          this.updateFromId()
          clearInterval(callback)
        }
      }, 1000)
    } else if (this.props.location.state) {
      this.updateFromProps(this.props.location.state)
    }
  }

  updateVote = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
    } else if (this.state.voteTries <= 10) {
      const nextTry = setTimeout(this.updateVote, 1000)
      this.setState({ ...this.state, voteTries: this.state.voteTries + 1, nextTry: nextTry })
    } else {
      if (this.props.location.state) {
        this.setState({ ...this.state, referendum: this.props.location.state['referendum'] })
      }
    }
  }

  doUpdate = (referendum) => {
    // Parse referendum info
    const proposal = referendum.image!.proposal!
    const registry = referendum.index.registry
    const { header, documentation } = this.parseProposal(proposal, registry)

    const newBallot = {
      voteCount: referendum.voteCount,
      voteCountAye: referendum.voteCountAye,
      voteCountNay: referendum.voteCountNay,
      votedAye: referendum.votedAye,
      votedNay: referendum.votedNay,
      votedTotal: referendum.votedTotal
    }

    if (newBallot !== this.state.ballot) {
      this.setState({
        ...this.state,
        referendum,
        header,
        documentation,
        ballot: newBallot
      })
    }
  }

  parseProposal = (proposal, registry) => {
    const { method, section } = registry.findMetaCall(proposal.callIndex)
    const header = `${section}.${method}`
    const documentation = proposal.meta.documentation[0]
    return { header, documentation }
  }

  updateFromId = () => {
    const id = this.state.id
    this.api.derive.democracy.referendums().then((results) => {
      const filtered = results.filter((result) => result.index.toString() === id.toString())
      const referendum: DeriveReferendumExt = filtered[0]
      this.doUpdate(referendum)
    })
  }

  updateFromProps = (locationState) => {
    console.log('updateFromProps', locationState['referendum'])
    const referendum: DeriveReferendumExt = locationState.referendum
    this.doUpdate(referendum)
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

  vote = (choice: boolean) => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.saveExtrinsic(choice)
      this.confirm()
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.vote, 1000)
      this.setState({ ...this.state, voteTries: this.state.tries + 1, nextVoteTry: nextTry })
    }
  }

  saveExtrinsic = async (choice: boolean) => {
    if (!this.props.account) {
      return
    }

    const amountBn = this.inputValueToBn(this.state.amount, this.state.amountSi)
    const tipBn = this.inputValueToBn(this.state.tip, this.state.tipSi)
    const total = amountBn.add(tipBn).add(this.state.fee)
    const currentAddress = this.props.account.address
    const balancesAll = await this.api.derive.balances.all(currentAddress) as DeriveBalancesAll
    const available = balancesAll.availableBalance
    console.log(available)
    if (available.lt(total)) {
      this.props.setError(t('notEnoughBalance'))
      return
    }
    const extrinsic = this.api.tx.democracy.vote(this.state.id,
      { Standard: { amountBn, vote: { aye: choice , conviction: this.state.conviction } } })
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
      signedExtensions: chains[this.props.settings.chain].registry.signedExtensions
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
    signExtrinsic(this.props.settings.chain, signerPayload).then(signature => {
      const signedExtrinsic = extrinsic.addSignature(
        currentAddress,
        signature,
        payloadValue
      )
      this.setState({ extrinsic: signedExtrinsic, modalOpen: true })
    })
  }

  getTotal = () => {
    const amountBn = this.inputValueToBn(this.state.amount, this.state.amountSi)
    const tipBn = this.inputValueToBn(this.state.tip, this.state.tipSi)
    return amountBn.add(tipBn).add(this.state.fee)
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

    this.setState({ txLoading: true })

    const submittable = this.state.extrinsic as SubmittableExtrinsic
    submittable.send((result: SubmittableResult) => {
      if (result.isInBlock) {
        console.log(`Transaction in block at blockHash ${result.status.asInBlock}`)
        this.setState({ txLoading: false })
        this.props.history.push(HOME_ROUTE)
      } else if (result.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`)
      } else if (result.isError) {
        this.props.setError(t('transactionError'))
        this.setState({ txLoading: false })
      } else if (result.isWarning) {
        console.warn(result.status)
      }
    }).catch((err) => {
      console.log('Error', err)
      this.props.setError(t('transactionError'))
      this.setState({ txLoading: false })
    })
  }

  componentDidMount (): void {
    this.updateVote()
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

  changeConviction = (_event, data) => {
    this.setState({ conviction: data.value })
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

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }
    return this.props.location.state || this.state.id !== ':proposalId' ?
      this.renderProposal() : this.renderPlaceHolder()
  }

  renderPlaceHolder () {
    const {
      chartColorAye,
      chartColorNay,
      backgroundColor
    } = colorSchemes[this.props.settings.color]
    // @ts-ignore
    return (
      <ContentContainer>
        <AccountDropdown/>
        <div style={{ 'marginLeft': '25px', 'marginTop': '-10px' }}>
        <VoteStatus
          values={
            [
              {
                colors: chartColorAye,
                label: `Aye`,
                value: new BN(0)
              },
              {
                colors: chartColorNay,
                label: `Nay`,
                value: new BN(0)
              }
            ]
          }
          votes={0}
          width={225}
          height={150}
          legendColor={backgroundColor}
        />
        </div>
        <ProposalSection>
          <ProposalDetail/>
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <AyeButton color={this.props.settings.color}>
              Aye
            </AyeButton>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <Button>Nay</Button>
          </ButtonSection>
        </ProposalSection>
      </ContentContainer>
    )
  }

  renderProposal () {
    const loadAye = this.state.stusLoading ?
      (
        <div style={{ marginLeft: '6px', marginTop: '1px' }}>
          <Icon loading={true} name='asterisk'/>
        </div>
      )
      : 'Aye'
    const loadNay = this.state.stusLoading ?
      (
        <div style={{ marginLeft: '5px', marginTop: '1px' }}>
          <Icon loading={true} name='asterisk'/>
        </div>
      )
      : 'Nay'
    const {
      chartColorAye,
      chartColorNay,
      backgroundColor
    } = colorSchemes[this.props.settings.color]
    // @ts-ignore
    return (
      <ContentContainer>
        <Dimmer active={this.state.txLoading}>
          <Loader indeterminate={true}>{t('processingTx')}</Loader>
        </Dimmer>
        <AccountDropdown/>
        <div style={{ 'marginLeft': '25px', 'marginTop': '-10px' }}>
          <VoteStatus
            values={
              [
                {
                  colors: chartColorAye,
                  label: `Aye, ${formatBalance(this.state.ballot.votedAye)} (${formatNumber(this.state.ballot.voteCountAye)})`,
                  value: this.state.ballot.voteCount === 0 ?
                    0 :
                    this.state.ballot.votedAye.toNumber()
                    / this.state.ballot.votedTotal.toNumber()  
                    * 100 
                },
                {
                  colors: chartColorNay,
                  label: `Nay, ${formatBalance(this.state.ballot.votedNay)} (${formatNumber(this.state.ballot.voteCountNay)})`,
                  value: this.state.ballot.voteCount === 0 ?
                    0 :
                    this.state.ballot.votedNay.toNumber()
                    / this.state.ballot.votedTotal.toNumber()
                    * 100
                }
              ]
            }
            votes={this.state.ballot.voteCount}
            width={225}
            height={150}
            legendColor={backgroundColor}
          />
        </div>
        <ProposalSection>
          <ProposalDetail>
            <h1>{this.state.header}</h1>
          </ProposalDetail>
        </ProposalSection>
        <ProposalSection>
          <VoteAmount
            handleAmountChange={this.changeAmount}
            handleAmountSiChange={this.changeAmountSi}
            handleConvictionChange={this.changeConviction}
            amountError={this.isAmountValid() ? '' : t('positiveNumber')}
          />
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <AyeButton
              color={this.props.settings.color}
              onClick={() => this.vote(true)}
            >
              {loadAye}
            </AyeButton>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <Button onClick={() => this.vote(false)}>{loadNay}</Button>
          </ButtonSection>
        </ProposalSection>

      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    settings: state.settings,
    account: state.settings.selectedAccount,
  }
}

const mapDispatchToProps = { setError }

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Vote)
)

const ProposalDetail = styled.div`
`

const ProposalSection = styled.div`
  width: 100%;
  margin: 1px 0 9px;
  display: flex;
  justify-content: center;
`

const ButtonSection = styled.div`
  width: 100%;
  margin: 5px 0 9px;
  display: flex;
  justify-content: space-around;
`

const AyeButton = styled(Button)`
{
cursor: pointer
background-color: ${(props) => colorSchemes[props.color].stopColorOne} !important
padding: .78571429em 1.5em .78571429em
margin: 0 0 0 .25em
font-family: nunito
color: #ffffff
border-radius: 5px
border: none
}
:hover {
background-color: ${(props) => colorSchemes[props.color].stopColorTwo} !important
}
`
