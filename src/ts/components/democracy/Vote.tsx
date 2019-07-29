import * as React from 'react'
import ApiPromise from '@polkadot/api/promise'
import { DerivedReferendumVote } from '@polkadot/api-derive/types'
import { ReferendumInfo, ChainProperties, Method, Option } from '@polkadot/types'
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
import { INITIALIZE_ROUTE } from '../../constants/routes'
import { colorSchemes } from '../styles/themes'

interface IVoteProps extends StateProps, RouteComponentProps {
  chain_bestNumber?: BN
  democracy_referendumVotesFor?: DerivedReferendumVote[]
  democracy_publicDelay?: BN
  value: ReferendumInfo
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
  referendumInfo?: ReferendumInfo | null
  ballot: IBallot
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

  constructor (props) {
    super(props)

    this.state = {
      idNumber: this.props.match.params['proposalId'],
      ballot: {
        voteCount: 0,
        voteCountAye: 0,
        voteCountNay: 0,
        votedAye: new BN(0),
        votedNay: new BN(0),
        votedTotal: new BN(0)
      },
      tries: 0,
      header: '',
      documentation: ''
    }
  }

  componentWillMount (): void {
    if (this.props.settings.selectedAccount == null) {
      this.props.history.push(INITIALIZE_ROUTE)
    }
  }

  updateVote = () => {
    if (this.props.apiContext.apiReady) {
      this.setState({ ...this.state, tries: 1 })
      this.api.rpc.system.properties().then(properties => {
        const chainProperties = (properties as ChainProperties)
        formatBalance.setDefaults({
          decimals: chainProperties.tokenDecimals,
          unit: chainProperties.tokenSymbol
        })
        this.doUpdate()
      })
    } else if (this.state.tries <= 10) {
      const nextTry = setTimeout(this.updateVote, 1000)
      this.setState({ ...this.state, tries: this.state.tries + 1, nextTry: nextTry })
    } else {
      this.setState({ ...this.state, referendumInfo: null })
    }
  }

  private doUpdate = () => {
    this.api.query.democracy.referendumInfoOf(this.props.match.params['proposalId'], (referendum: Option<ReferendumInfo>) => {
      const referendumInfo: ReferendumInfo | null = referendum.unwrapOr(null)
      if (referendumInfo !== this.state.referendumInfo && referendumInfo !== null) {
        // Parse referendum info
        const { meta, method, section } = Method.findFunction(referendumInfo.proposal.callIndex)
        const header = `#${this.state.idNumber}: ${section}.${method}`
        const documentation = (meta && meta.documentation) ? (
            meta.documentation.join(' '))
          : null

        // Get votes
        const votes: DerivedReferendumVote[] = this.api.derive.referendumVotesFor(this.state.idNumber)
        const newBallot = votes.reduce((ballot: IBallot, { balance, vote }): IBallot => {
          if (vote.isAye) {
            ballot.voteCountAye++
            ballot.votedAye = ballot.votedAye.add(balance)
          } else {
            ballot.voteCountNay++
            ballot.votedNay = ballot.votedNay.add(balance)
          }

          ballot.voteCount++
          ballot.votedTotal = ballot.votedTotal.add(balance)
        }, {
          voteCount: 0,
          voteCountAye: 0,
          voteCountNay: 0,
          votedAye: new BN(0),
          votedNay: new BN(0),
          votedTotal: new BN(0)
        })

        this.setState({
          ...this.state,
          referendumInfo: referendumInfo,
          header: header,
          documentation: documentation,
          ballot: newBallot
        })
      }
    })
  }

  voteAye () {
    this.api.tx.democracy.vote(this.state.idNumber, true)
  }

  voteNay () {
    this.api.tx.democracy.vote(this.state.idNumber, false)
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
    return this.state.referendumInfo !== undefined ? this.renderProposal() : this.renderPlaceHolder()
  }

  renderProposal () {
    const { voteCount, votedAye, voteCountAye, votedNay, voteCountNay, votedTotal } = this.state.ballot
    return (
      <ContentContainer>
        <AccountDropdown/>
        <VoteStatus
          values={[
            {
              colors: colorSchemes[this.props.settings.color].chartColorAye,
              label: `Aye, ${formatBalance(votedAye)} (${formatNumber(voteCountAye)})`,
              value: votedAye.muln(10000).div(votedTotal).toNumber() / 100
            },
            {
              colors: colorSchemes[this.props.settings.color].chartColorNay,
              label: `Nay, ${formatBalance(votedNay)} (${formatNumber(voteCountNay)})`,
              value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
            }
          ]}
          votes={voteCount}
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
              color={colorSchemes[this.props.settings.color].stopColorOne}
            >
              Aye
            </AyeButton>
            <Button>Nay</Button>
          </ButtonSection>
        </ProposalSection>
      </ContentContainer>
    )
  }

  renderPlaceHolder () {
    return (
      <ContentContainer>
        <AccountDropdown/>
        <VoteStatus
          values={[
            {
              colors: ['#44C5EE', '#4AABE0'],
              label: `Aye`,
              value: new BN(0)
            },
            {
              colors: ['#C7EBF9', '#C7EBFF'],
              label: `Nay`,
              value: new BN(0)
            }
          ]}
          votes={0}
        />
        <ProposalSection>
          <ProposalDetail/>
        </ProposalSection>
        <ProposalSection>
          <ButtonSection>
            <AyeButton
              color={colorSchemes[this.props.settings.color].stopColorOne}
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

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(
  connect(
    mapStateToProps
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

const AyeButton = styled.button`
background-color: ${props => props.color}
`
