import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List, Grid, Icon } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions, TransactionType, ITransaction } from '../../background/store/transaction'
import t from '../../services/i18n'
import { networks } from '../../constants/networks';

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
  currentAddress: string
}

class TransactionList extends React.Component<ITransactionListProps, ITransactionListState> {

  state = {
    currentAddress: ''
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.account && nextProps.account.address !== prevState.currentAddress) {
      return { currentAddress: nextProps.account.address }
    } else {
      return null
    }
  }

  componentDidUpdate (_prevProps, prevState) {
    if (prevState.currentAddress !== this.state.currentAddress) {
      this.loadTransactions()
    }
  }

  componentDidMount () {
    this.loadTransactions()
  }

  private loadTransactions = () => {
    // load the transaction list
    if (this.state.currentAddress) {
      console.log('Getting transactions for ' + this.state.currentAddress)
      this.props.getTransactions(this.state.currentAddress)
    }
  }

  render () {

    const account = this.props.account
    if (!account || !(this.props.transactions)) {
      console.log('No transaction found.')
      return (null)
    }

    console.log('Rendering transactions: ', this.props.transactions)

    const panes = [
      { menuItem: t('tabAll'), render: () => this.renderWithFilter('') },
      { menuItem: t('tabSent'), render: () => this.renderWithFilter('Sent') },
      { menuItem: t('tabStaked'), render: () => this.renderWithFilter('Staked') },
    ]

    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    )
  }

  renderWithFilter = (type: TransactionType | '') => {

    // get the transactions
    let tranx = this.props.transactions
    if (type !== '') {
      tranx = tranx.filter(item => item.type === type)
    }

    console.log('prepare to render transactions ... ', tranx)

    return (
      <Tab.Pane>
        <List className='tran-list'>
          {tranx.map((tran, index) => this.renderTransaction(tran, index))}
        </List>
      </Tab.Pane>
    )
  }

  renderTransaction = (tran: ITransaction, index: number) => {
    const iconName = tran.type === 'Sent' ? 'arrow right' :
        tran.type === 'Received' ? 'arrow left' : 'pin'
    const iconColor = tran.type === 'Sent' ? 'red' :
        tran.type === 'Received' ? 'green' : 'grey'

    const toAddress = tran.to.substring(0, 8) + '...' + tran.to.substring(tran.to.length - 10)

    const createTime = tran.createTime && tran.createTime > 0 ?
      new Date(tran.createTime).toLocaleString() : 'Time N/A'

    const borderStyle = {
      borderLeftColor: iconColor,
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid'
    }

    const txBaseUrl = networks[this.props.network].txExplorer

    return (
      <List.Item key={index} style={borderStyle}>
        <Grid>
          <Grid.Row>
          <Grid.Column width={4} verticalAlign='middle'>
            <div>
              {(tran.type === 'Sent' ? '-' : '') + tran.amount + tran.unit + ' DOTS'}
            </div>
            <div>
              {createTime}
            </div>
          </Grid.Column>

          <Grid.Column width={2} verticalAlign='middle'>
            <Icon name={iconName} color={iconColor}/>
          </Grid.Column>

          <Grid.Column width={8} verticalAlign='middle'>
            {toAddress}
          </Grid.Column>

          <Grid.Column width={2} verticalAlign='middle'>
            <a href={txBaseUrl + tran.txHash} target='_blank'>
              <Icon name='linkify'/>
            </a>
          </Grid.Column>
          </Grid.Row>
        </Grid>
      </List.Item>
    )
  }

}

const mapStateToProps = (state: IAppState) => {
  return {
    transactions: state.transactions,
    account: state.settings.selectedAccount,
    network: state.settings.network
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionList))
