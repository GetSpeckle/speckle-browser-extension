import * as React from 'react'
import ApiPromise from '@polkadot/api/promise'
import { DerivedReferendumVote } from '@polkadot/api-derive/types'
import {ReferendumInfo, Method, Option, Index, Balance as BalanceType} from '@polkadot/types'
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
import { Button } from 'semantic-ui-react'
import { formatBalance, formatNumber } from '@polkadot/util'
import { INITIALIZE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { colorSchemes } from '../styles/themes'
import { isWalletLocked, signExtrinsic } from '../../services/keyring-vault-proxy'
import { SignerOptions } from '@polkadot/api/types'
import { IExtrinsic } from '@polkadot/types/types'
import { setError } from '../../background/store/error'
import {SubmittableExtrinsic} from '@polkadot/api/promise/types'

interface IVoteProps extends StateProps, RouteComponentProps, DispatchProps {
  democracy_referendumVotesFor?: DerivedReferendumVote[]
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
  idNumber: number
  ballot: IBallot
  referendumInfo?: ReferendumInfo | null
  extrinsic?: IExtrinsic | null
  tries: number
  nextTry?: any
  header: string
  documentation?: string | null
}

class Vote extends React.Component<IVoteProps, IVoteState> {
  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  set api (api: ApiPromise) {
    this.api = api
  }

  public ballot: IBallot = {
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  }

  public state: IVoteState = {
    idNumber: this.props.match.params['proposalId'],
    ballot: this.ballot,
    tries: 0,
    header: '',
    documentation: ''
  }

  componentWillMount (): void {
    if (this.props.settings.selectedAccount == null) {
      this.props.history.push(INITIALIZE_ROUTE)
    }
    isWalletLocked().then(result => {
      if (result) this.props.history.push(LOGIN_ROUTE)
    })
  }

  updateVote = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.doUpdate(this.state.idNumber)
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.updateVote, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, referendumInfo: null })
    }
  }

  updateStats (id: number) {
    // Get votes
    this.api.derive.democracy.referendumVotesFor(id).then((votes: DerivedReferendumVote[]) => {
      const newBallot = votes.reduce((ballot: IBallot, { balance, vote }: DerivedReferendumVote): IBallot => {
        if (vote.isAye) {
          ballot.voteCountAye++
          ballot.votedAye = ballot.votedAye.add(balance)
        } else {
          ballot.voteCountNay++
          ballot.votedNay = ballot.votedNay.add(balance)
        }

        ballot.voteCount++
        ballot.votedTotal = ballot.votedTotal.add(balance)

        return ballot
      }, {
        voteCount: 0,
        voteCountAye: 0,
        voteCountNay: 0,
        votedAye: new BN(0),
        votedNay: new BN(0),
        votedTotal: new BN(0)
      })
      if (newBallot !== this.state.ballot) {
        this.setState({
          ...this.state,
          ballot: newBallot
        })
      }
    })
  }

  doUpdate = (id) => {
    this.api.query.democracy.referendumInfoOf(id, (referendum: Option<ReferendumInfo>) => {
      const referendumInfo: ReferendumInfo | null = referendum.unwrapOr(null)
      if (referendumInfo !== this.state.referendumInfo && referendumInfo !== null) {
        // Parse referendum info
        const { meta, method, section } = Method.findFunction(referendumInfo.proposal.callIndex)
        const header = `#${this.state.idNumber}: ${section}.${method}`
        const documentation = (meta && meta.documentation) ? (
            meta.documentation.join(' '))
          : null
        this.setState({
          ...this.state,
          header: header,
          documentation: documentation
        })
        this.updateStats(id)
      }
    })
  }

  voteAye = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.doVote(this.state.idNumber, true)
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.voteAye, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, referendumInfo: null })
    }
  }

  voteNay = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.doVote(this.state.idNumber, false)
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.voteAye, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, referendumInfo: null })
    }
  }

  doVote = async (id: number, choice: boolean) => {
    const extrinsic = this.api.tx.democracy.vote(id, choice)
    extrinsic.send().then(() => {
      this.updateVote()
    })
  }

  componentDidMount (): void {
    this.updateVote()
  }

  componentWillUnmount (): void {
    this.state.nextTry && clearTimeout(this.state.nextTry)
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }
    return this.state.referendumInfo === undefined ? this.renderPlaceHolder() : this.renderProposal()
  }

  renderPlaceHolder () {
    const { chartColorAye, chartColorNay, backgroundColor } = colorSchemes[this.props.settings.color]
    return (
      <ContentContainer>
        <AccountDropdown/>
        <VoteStatus
          values={[
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
          ]}
          votes={0}
          legendColor={backgroundColor}
        />
        <ProposalSection>
          <ProposalDetail/>
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            <AyeButton
              color={this.props.settings.color}
              onClick={this.voteAye}
            >
              Aye
            </AyeButton>
            <Button onClick={this.voteNay}>Nay</Button>
          </ButtonSection>
        </ProposalSection>
      </ContentContainer>
    )
  }

  renderProposal () {
    const { chartColorAye, chartColorNay, backgroundColor } = colorSchemes[this.props.settings.color]
    return (
      <ContentContainer>
        <AccountDropdown/>
        <VoteStatus
          values={[
            {
              colors: chartColorAye,
              label: `Aye, ${formatBalance(this.state.ballot.votedAye)} (${formatNumber(this.state.ballot.voteCountAye)})`,
              value: this.state.ballot.voteCount === 0 ? 0 : this.state.ballot.votedAye.muln(10000).div(this.state.ballot.votedTotal).toNumber() / 100
            },
            {
              colors: chartColorNay,
              label: `Nay, ${formatBalance(this.state.ballot.votedNay)} (${formatNumber(this.state.ballot.voteCountNay)})`,
              value: this.state.ballot.voteCount === 0 ? 0 : this.state.ballot.votedNay.muln(10000).div(this.state.ballot.votedTotal).toNumber() / 100
            }
          ]}
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
            <AyeButton
              color={this.props.settings.color}
              onClick={this.voteAye}
            >
              Aye
            </AyeButton>
            <Button onClick={this.voteNay}>Nay</Button>
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
