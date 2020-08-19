import * as React from 'react'
import ApiPromise from '@polkadot/api/promise'
import { DeriveReferendumExt } from '@polkadot/api-derive/types'
import { ExtrinsicPayloadValue, SignerPayloadJSON } from '@polkadot/types/types'
import {
  Index,
  Balance as BalanceType,
  Extrinsic,
  EventRecord
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
import { Button, Icon } from 'semantic-ui-react'
import { formatBalance, formatNumber } from '@polkadot/util'
import { INITIALIZE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { colorSchemes } from '../styles/themes'
import { isWalletLocked, signExtrinsic } from '../../services/keyring-vault-proxy'
import { setError } from '../../background/store/error'
import { SubmittableExtrinsic } from '@polkadot/api/promise/types'
import { SubmittableResult } from '@polkadot/api'
import { SiDef } from '@polkadot/util/types'
import { chains } from '../../constants/chains'

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
  id: number
  ballot: IBallot
  referendum?: DeriveReferendumExt | undefined
  extrinsic?: Extrinsic | null
  tries: number
  voteTries: number
  nextTry?: any
  nextVoteTry?: any
  header: string
  documentation?: string | null
  loading: boolean
  nonce: Index | null
  tip: string
  tipSi: SiDef
  tipUnit: string
}

const tipSi: SiDef = formatBalance.findSi('-')

const TEN = new BN(10)

class Vote extends React.Component<IVoteProps, IVoteState> {

  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  public state: IVoteState = {
    tip: '',
    tipSi,
    tipUnit: '',
    id: this.props.match.params['proposalId'],
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
    loading: false,
    nonce: null
  }

  componentWillMount (): void {
    if (this.props.settings.selectedAccount == null) {
      this.props.history.push(INITIALIZE_ROUTE)
    }
    isWalletLocked().then(result => {
      if (result) this.props.history.push(LOGIN_ROUTE)
    })
    if (this.state.id) {
      this.updateFromId(this.state.id)
    } else if (this.props.location.state) {
      this.updateFromProps(this.props.location.state)
    }
  }

  updateVote = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({...this.state, tries: 1})
    } else if (this.state.voteTries <= 10) {
      const nextTry = setTimeout(this.updateVote, 1000)
      this.setState({...this.state, voteTries: this.state.voteTries + 1, nextTry: nextTry})
    } else {
      this.setState({...this.state, referendum: undefined})
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
    console.log('newBallot', newBallot)

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
    const documentation = proposal.meta.documentation.join(' ')
    return { header, documentation }
  }

  updateFromId = (id) => {
    this.api.derive.democracy.referendums().then((results) => {
      const filtered = results.filter((result) => result.index.toNumber() === id)
      const referendum: DeriveReferendumExt = filtered[0]
      this.doUpdate(referendum)
    })
  }

  updateFromProps = (locationState) => {
    const referendum: DeriveReferendumExt = locationState.referendum
    this.doUpdate(referendum)
  }

  inputValueToBn = (value: string): BN => {
    const parts: string[] = value.split('.')
    const selectedSi: SiDef = this.state.tipSi
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

  vote = (choice: string) => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.voteExt(this.state.id, choice)
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.vote, 1000)
      this.setState({ ...this.state, voteTries: this.state.tries + 1, nextVoteTry: nextTry })
    }
  }

  voteExt = async (id: number, choice: string) => {
    const tipBn = this.inputValueToBn(this.state.tip)
    const currentAddress = this.props.settings.selectedAccount!.address
    const extrinsic = this.api.tx.democracy.vote(id, 'aye')

    const currentBlockNumber = await this.api.query.system.number() as unknown as BN
    const currentBlockHash = await this.api.rpc.chain.getBlockHash(currentBlockNumber.toNumber())
    const currentNonce = await this.api.query.system.accountNonce(currentAddress) as Index
    console.log('currentNonce: ', currentNonce)
    if (this.state.nonce != null && currentNonce[0] > this.state.nonce[0]) {
      this.setState({ nonce: currentNonce })
    } else {
      this.setState({ nonce: currentNonce })
    }

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

    signExtrinsic(this.props.settings.chain, signerPayload).then(async (signature) => {
      const signedExtrinsic = extrinsic.addSignature(
        currentAddress,
        signature,
        payloadValue
      )
      const available = await this.api.query.balances.freeBalance(currentAddress) as BalanceType

      if (available.isZero()) {
        this.props.setError('You account has 0 balance.')
        return
      }

      const submittable = signedExtrinsic as SubmittableExtrinsic

      this.setState({ loading: true })

      submittable.send(({ events, status }: SubmittableResult) => {
        console.log('Transaction status:', status.type)
        if (status.isFinalized) {
          this.setState({ loading: false })
          console.log('Completed at block hash', status.value.toHex())
          console.log('Events:')
          events.forEach(({ phase, event: { data, method, section } }: EventRecord) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
            if (method === 'ExtrinsicSuccess') {
              console.log(`voted ${choice}`)
              this.updateVote()
            } else if (method === 'ExtrinsicFailed') {
              console.log('extrinsic failed')
            }
          })
        } else if (status.isInvalid || status.isDropped || status.isUsurped) {
          this.setState({ loading: false })
          console.log('error')
        }
      }).catch((err) => {
        console.log(err)
      })
    })
  }

  componentDidMount (): void {
    setInterval(this.updateVote, 1000)
  }

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }
    return this.state.referendum !== undefined ?
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
          legendColor={backgroundColor}
        />
        <ProposalSection>
          <ProposalDetail/>
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <Button onClick={() => this.vote('nay')}>Nay</Button>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <AyeButton color={this.props.settings.color} onClick={() => this.vote('aye')}>
              Aye
            </AyeButton>
          </ButtonSection>
        </ProposalSection>
      </ContentContainer>
    )
  }

  renderProposal () {
    const loadAye = this.state.loading ?
      (
        <div style={{ marginLeft: '6px', marginTop: '1px' }}>
          <Icon loading={true} name='asterisk'/>
        </div>
      )
      : 'Aye'
    const loadNay = this.state.loading ?
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
        <AccountDropdown/>
        <VoteStatus
          values={
            [
              {
                colors: chartColorAye,
                label: `Aye, ${formatBalance(this.state.ballot.votedAye)} (${formatNumber(this.state.ballot.voteCountAye)})`,
                value: this.state.ballot.voteCount === 0 ?
                  0 :
                this.state.ballot.votedAye
                  .muln(10000)
                  .div(this.state.ballot.votedTotal)
                  .toNumber() / 100
              },
              {
                colors: chartColorNay,
                label: `Nay, ${formatBalance(this.state.ballot.votedNay)} (${formatNumber(this.state.ballot.voteCountNay)})`,
                value: this.state.ballot.voteCount === 0 ?
                  0 :
                this.state.ballot.votedNay
                  .muln(10000)
                  .div(this.state.ballot.votedTotal)
                  .toNumber() / 100
              }
            ]
          }
          votes={this.state.ballot.voteCount}
          legendColor={backgroundColor}
        />
        <ProposalSection>
          <ProposalDetail>
            <h1>{this.state.header}</h1>
            <summary>{this.state.documentation}</summary>
          </ProposalDetail>
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <Button onClick={() => this.vote('nay')}>{loadNay}</Button>
            {/* tslint:disable-next-line:jsx-no-lambda */}
            <AyeButton
              color={this.props.settings.color}
              onClick={() => this.vote('aye')}
            >
              {loadAye}
            </AyeButton>
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
    transactions: state.transactions
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
  overflow-y: scroll
  height: 150px
  width: 90%
  border: 1px solid #DDD
`

const ProposalSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  display: flex
  justify-content: center
`

const ButtonSection = styled.div`
  width: 90%
  margin: 8px 0 9px
  display: flex
  justify-content: space-between
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
