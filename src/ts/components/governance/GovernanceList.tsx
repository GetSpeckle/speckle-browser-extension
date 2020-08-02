import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions } from '../../background/store/transaction'
import t from '../../services/i18n'
import ApiPromise from '@polkadot/api/promise'
import { DeriveReferendumExt } from '@polkadot/api-derive/types'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
  currentAddress: string,
  currentChain: string,
  referenda: DeriveReferendumExt[]
}

class GovernanceList extends React.Component<ITransactionListProps, ITransactionListState> {
  get api (): ApiPromise {
    const api = this.props.apiContext.api
    if (api) return api
    throw new Error(t('apiError'))
  }

  state = {
    currentAddress: '',
    currentChain: '',
    referenda: []
  }

  componentDidMount (): void {
    this.updateReferenda()
  }

  updateReferenda = () => {
    this.api.derive.democracy.referendums().then((referenda) => {
      if (referenda !== this.state.referenda) {
        console.log(referenda)
        this.setState({ ...this.state, referenda: referenda })
      }
    })
  }

  render () {

    if (!this.props.account) {
      return null
    }

    const panes = [
      { menuItem: t('Referenda'), render:  () => this.renderWithFilter() }
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

  renderWithFilter =

  () => {

    // get  referenda
    const refr = this.state.referenda

    return (
      <Tab.Pane>
        <List className='tran-list'>
          {refr.map((refr, index) => this.renderReferendum(refr, index))}
        </List>
      </Tab.Pane>
    )
  }

  renderReferendum = (ref: DeriveReferendumExt, index: number) => {
    const statusBorderColor = '#51d8a7'
    const borderStyle = {
      borderLeftColor: statusBorderColor,
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderRadius: '2px'
    }
    // const statusBorderColor = tran.status === 'Pending' ? 'grey' :
    //  tran.status === 'Success' ? '#51d8a7' : '#f3536d'

    return (
      // tslint:disable-next-line:block-spacing jsx-no-lambda
      <List.Item key={index} style={borderStyle} onClick={() => {this.props.history.push('vote', { referendum: ref })}}>
        {JSON.stringify(ref)}
      </List.Item>
    )
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
