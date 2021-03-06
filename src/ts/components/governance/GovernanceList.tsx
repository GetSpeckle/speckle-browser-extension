import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List, Loader } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions } from '../../background/store/transaction'
import t from '../../services/i18n'
import ApiPromise from '@polkadot/api/promise'
import { DeriveReferendumExt, DeriveProposal } from '@polkadot/api-derive/types'
import styled from 'styled-components'
import { browser } from 'webextension-polyfill-ts'
import VoteStatus from './VoteStatus'
import { colorSchemes } from '../styles/themes'
import { formatBalance, formatNumber } from '@polkadot/util/index'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
  currentAddress: string,
  currentChain: string,
  referenda: DeriveReferendumExt[],
  proposals: DeriveProposal[],
  loading: boolean
}

class GovernanceList extends React.Component<ITransactionListProps, ITransactionListState> {
  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.account && nextProps.account.address !== prevState.currentAddress) {
      return { currentAddress: nextProps.account.address }
    } else if (nextProps.chain !== prevState.currentChain) {
      return { currentChain: nextProps.chain }
    } else {
      return null
    }
  }

  state = {
    currentAddress: '',
    currentChain: '',
    referenda: [],
    proposals: [],
    loading: true
  }

  componentDidUpdate (_prevProps, prevState) {
    if (prevState.currentChain !== this.state.currentChain
      || prevState.currentAddress !== this.state.currentAddress) {
      this.setState({ ...this.state, referenda: [], proposals: [], loading: true })
      this.loadGov()
    }
  }

  componentDidMount (): void {
    this.loadGov()
  }

  loadGov = () => {
    let callback = setInterval(() => {
      if (this.props.apiContext.apiReady) {
        this.loadGovernance()
        clearInterval(callback)
      }
    }, 10)
  }

  loadGovernance = () => {
    this.api.derive.democracy.referendums().then((referenda) => {
      if (referenda !== this.state.referenda) {
        // console.log('refr', referenda)
        this.setState({ ...this.state, referenda: referenda })
      }
    }).then(() => {
      this.api.derive.democracy.proposals().then((proposals) => {
        if (proposals !== this.state.proposals) {
          // console.log('proposals', proposals)
          this.setState({ ...this.state, proposals: proposals })
        }
      })
      this.setState({ ...this.state, loading: false })
    })
  }

  render () {

    if (!this.props.account) {
      return null
    }

    const panes = [
      { menuItem: t('referenda'), render:  () => this.renderItems(this.state.referenda) },
      { menuItem: t('proposals'), render: () => this.renderItems(this.state.proposals) }
    ]

    const color = this.props.color

    return (
      <div>
        <Tab
          menu={{ color: color, secondary: true, pointing: true }}
          panes={panes}
          style={{ 'zIndex': 0 }}
        />
      </div>
    )
  }

  renderItems =

  (items) => {
    return (
      <Tab.Pane>
        <List className='gov-list'>
          {
            items.length !== 0 ? items.map((item, index) => this.renderItem(item, index)) :
              <div style={{ 'height': '100px' }}>
                <Loader active={this.state.loading} style={{ 'zIndex': 100 }} size='small' inline='centered' />
              </div>
          }
        </List>
      </Tab.Pane>
    )
  }

  parseProposal = (proposal, registry) => {
    const { method, section } = registry.findMetaCall(proposal.callIndex)
    const header = `${section}.${method}`
    const documentation = proposal.meta.documentation[0]
    return { header, documentation }
  }

  renderItem = (ref: DeriveReferendumExt | DeriveProposal, index: number) => {
    const statusBorderColor = '#ebeeef'
    const borderStyle = {
      borderBottomColor: statusBorderColor,
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderRadius: '2px',
      marginTop: '5px',
      minHeight: '130px'
    }
    if ('votes' in ref && ref.votes) {
      const location = {
        pathname: '/vote/:network/:proposalId',
        state: { referendum: ref }
      }
      const {
        chartColorAye,
        chartColorNay,
        backgroundColor
      } = colorSchemes[this.props.color]
      const ballot = {
        voteCount: ref.voteCount,
        voteCountAye: ref.voteCountAye,
        voteCountNay: ref.voteCountNay,
        votedAye: ref.votedAye,
        votedNay: ref.votedNay,
        votedTotal: ref.votedTotal
      }
      const proposal = ref.image!.proposal!
      const registry = ref.index.registry
      const { header, documentation } = this.parseProposal(proposal, registry)
      return (
        // tslint:disable-next-line:block-spacing jsx-no-lambda max-line-length
        <List.Item key={index} style={borderStyle} onClick={() => {this.props.history.push(location)}}>
          <ReferendumContainer>
            <RefrIndexContainer>
              <RefrIndex>
                {`#${ref.index}`}
              </RefrIndex>
              <Action>
                {`${header}`}
              </Action>
              <RefrLink onClick={() => {
                browser.tabs.create({ url: `https://${this.state.currentChain}.polkassembly.io/referendum/${ref.index}`, active: true })
              }}
              />
            </RefrIndexContainer>
            <Documentation>{`${documentation}`}</Documentation>
            <Status>
              <VoteStatus
                values={
                  [
                    {
                      colors: chartColorAye,
                      label: `Aye, ${formatBalance(ballot.votedAye)} (${formatNumber(ballot.voteCountAye)})`,
                      value: ballot.voteCount === 0 ?
                        0 :
                        ballot.votedAye
                          .muln(10000)
                          .div(ballot.votedTotal)
                          .toNumber() / 100
                    },
                    {
                      colors: chartColorNay,
                      label: `Nay, ${formatBalance(ballot.votedNay)} (${formatNumber(ballot.voteCountNay)})`,
                      value: ballot.voteCount === 0 ?
                        0 :
                        ballot.votedNay
                          .muln(10000)
                          .div(ballot.votedTotal)
                          .toNumber() / 100
                    }
                  ]
                }
                votes={ballot.voteCount}
                legendColor={backgroundColor}
                width={150}
                height={100}
              />
            </Status>
          </ReferendumContainer>
        </List.Item>
      )
    } else {
      const image = ref.image!
      const registry = ref.index.registry
      const { header, documentation } = image !== undefined ?
        this.parseProposal(image.proposal!, registry) : { header: `Title not edited`, documentation: `preimage ${ref.imageHash}` }
      return (
        // tslint:disable-next-line:block-spacing jsx-no-lambda max-line-length
        <List.Item key={index} style={borderStyle}>
          <ReferendumContainer>
            <RefrIndexContainer>
              <PropIndex>
                {`#${ref.index}`}
              </PropIndex>
              <Action>
                {`${header}`}
              </Action>
              <RefrLink onClick={() => {
                browser.tabs.create({ url: `https://${this.state.currentChain}.polkassembly.io/proposal/${ref.index}`, active: true })
              }}
              />
            </RefrIndexContainer>
            <Documentation><span>{`${documentation}`}</span></Documentation>
          </ReferendumContainer>
        </List.Item>
      )
    }

  }

}

const mapStateToProps = (state: IAppState) => {
  return {
    apiContext: state.apiContext,
    chain: state.settings.chain,
    color: state.settings.color,
    account: state.settings.selectedAccount
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GovernanceList))

const ReferendumContainer = styled.div`
  top: 10px;
  width: 80%;
  min-height: 100px;
  overflow: visible;
`
const RefrIndex = styled.div`
  width: 38px;
  height: 24px;
  text-align: center;
  vertical-align: middle;
  border-radius: 4px;
  background-image: radial-gradient(circle at 50% 19%, #51dfb0, #52c48d 71%);
  font-family: Nunito;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.8;
  letter-spacing: normal;
  color: #ffffff;
`

const PropIndex = styled.div`
  width: 38px;
  height: 24px;
  text-align: center;
  vertical-align: middle;
  border-radius: 4px;
  background-image: radial-gradient(circle at 50% 2%,#d8d8d8,#808080 71%);
  font-family: Nunito;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.8;
  letter-spacing: normal;
  color: #ffffff;
`

const RefrLink = styled.div`
  display: inline-block;
  margin-top: 4px;
  margin-left: auto;
  margin-right: 6px;
  width: 16px;
  height: 16px;
  object-fit: contain;
  background: url(assets/link.svg)
`

const Action = styled.div`
  margin-left: 12px;
  font-family: Nunito;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #30383b;
`
const RefrIndexContainer = styled.div`
  width: 300px;
  left: 4px;
  top: 4px;
  display: flex;
`

const Status = styled.div`
  position: absolute;
  right: -20px;
  top: 20px;
`

const Documentation = styled.div`
  width: 180px;
  min-height: 60px;
  margin-left: 4px;
  margin-top: 10px;
  font-family: Nunito;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #3e5860;

  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
  }
`
