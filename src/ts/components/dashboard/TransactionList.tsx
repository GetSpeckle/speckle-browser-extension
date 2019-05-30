import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions, TransactionType, ITransaction } from '../../background/store/transaction'
import t from '../../services/i18n'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
  currentAddress: string
}

class TransactionList extends React.Component<ITransactionListProps, ITransactionListState> {

  state = {
    currentAddress: ''
  }

  static getDerivedStateFromProps(nextProps, prevState) {
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

    return (
      <Tab.Pane>
        Content for {type === '' ? 'All' : type}
        <List celled={true}>
          {tranx.map(tran => this.renderTransaction(tran))}
        </List>
      </Tab.Pane>
    )
  }

  renderTransaction = (tran: ITransaction) => {
    return (
      <List.Item>
        {tran.amount}
        {tran.createTime}
        {tran.to}
      </List.Item>
    )
  }

}

const mapStateToProps = (state: IAppState) => {
  return {
    transactions: state.transactions,
    account: state.settings.selectedAccount
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionList))
