import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions, TransactionType, ITransaction } from '../../background/store/transaction'
import t from '../../services/i18n'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
}

class TransactionList extends React.Component<ITransactionListProps, ITransactionListState> {

  state = {
  }

  componentWillMount () {
    // load the transaction list
    if (this.props.account) {
      console.log('Getting transactions for ' + this.props.account.address)
      this.props.getTransactions(this.props.account.address)
    }

  }

  render () {

    const account = this.props.account
    if (!account || !(account.address in this.props.transactions)) {
      console.log('No transaction found.')
      return (null)
    }

    const panes = [
      { menuItem: t('tabAll'), render: () => this.renderWithFilter(account.address, '') },
      { menuItem: t('tabSent'), render: () => this.renderWithFilter(account.address, 'Sent') },
      { menuItem: t('tabStaked'), render: () => this.renderWithFilter(account.address, 'Staked') },
    ]

    return (
      <div>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    )
  }

  renderWithFilter = (address: string, type: TransactionType | '') => {

    // get the transactions for the address
    let tranx = this.props.transactions[address]
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
