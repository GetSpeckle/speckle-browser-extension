import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions, TransactionType } from '../../background/store/transaction'
import t from '../../services/i18n'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
}

class TransactionList extends React.Component<ITransactionListProps, ITransactionListState> {

  state = {
  }

  render () {

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
    return (
      <Tab.Pane>
        TODO: This is content for {type === '' ? 'All' : type}
      </Tab.Pane>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    transactions: state.transactions
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionList))
