import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tab, List, Grid, Icon } from 'semantic-ui-react'
import { IAppState } from '../../background/store/all'
import { getTransactions, TransactionType, ITransaction } from '../../background/store/transaction'
import t from '../../services/i18n'
import { networks } from '../../constants/networks'
import { displayAddress } from '../../services/address-transformer'

interface ITransactionListProps extends StateProps, DispatchProps, RouteComponentProps {}

interface ITransactionListState {
  currentAddress: string,
  currentNetwork: string
}

class TransactionList extends React.Component<ITransactionListProps, ITransactionListState> {

  state = {
    currentAddress: '',
    currentNetwork: ''
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.account && nextProps.account.address !== prevState.currentAddress) {
      return { currentAddress: nextProps.account.address }
    } else if (nextProps.network !== prevState.currentNetwork) {
      return { currentNetwork: nextProps.network }
    } else {
      return null
    }
  }

  componentDidUpdate (_prevProps, prevState) {
    if (prevState.currentNetwork !== this.state.currentNetwork
        || prevState.currentAddress !== this.state.currentAddress) {
      this.loadTransactions()
    }
  }

  componentDidMount () {
    this.loadTransactions()
  }

  private loadTransactions = () => {
    if (this.state.currentAddress && this.state.currentNetwork) {
      this.props.getTransactions(this.state.currentAddress, this.state.currentNetwork)
    }
  }

  render () {

    if (!this.props.account || !this.props.transactions) {
      return null
    }

    const panes = [
      { menuItem: t('tabAll'), render: () => this.renderWithFilter('') },
      { menuItem: t('tabSent'), render: () => this.renderWithFilter('Sent') },
      { menuItem: t('tabStaked'), render: () => this.renderWithFilter('Staked') }
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

  renderWithFilter = (type: TransactionType | '') => {

    // get the transactions
    let tranx = this.props.transactions
    if (type !== '') {
      tranx = tranx.filter(item => item.type === type)
    }

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
    // use the theme color
    const iconColor = this.props.color

    const statusIcon = tran.status === 'Pending' ? 'spinner' :
        tran.status === 'Success' ? 'check circle' : 'times circle'
    const statusIconColor = tran.status === 'Pending' ? 'grey' :
        tran.status === 'Success' ? 'green' : 'red'
    const statusBorderColor = tran.status === 'Pending' ? 'grey' :
    tran.status === 'Success' ? '#51d8a7' : '#f3536d'

    const toAddress = displayAddress(tran.to, false)

    const createTimeFull = tran.createTime && tran.createTime > 0 ?
      new Date(tran.createTime).toLocaleString() : 'Time N/A'

    // remove seconds
    const createTime = createTimeFull.replace(/(\d{1,2}):(\d{1,2}):\d{1,2}/, '$1:$2')

    const borderStyle = {
      borderLeftColor: statusBorderColor,
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderRadius: '2px'
    }

    const txBaseUrl = networks[this.props.network].txExplorer
    const symbol = networks[this.props.network].tokenSymbol

    return (
      <List.Item key={index} style={borderStyle}>
        <Grid>
          <Grid.Row>
          <Grid.Column width={5} verticalAlign='middle'>
            <div className='tran-amount' title={'Fee: ' + tran.fee}>
              {(tran.type === 'Sent' ? '-' : '') + tran.amount + tran.unit + ' ' + symbol}
            </div>
            <div className='tran-time' title={createTimeFull}>
              {createTime}
            </div>
          </Grid.Column>

          <Grid.Column width={2} verticalAlign='middle'>
            <Icon name={iconName} color={iconColor}/>
            <Icon name={statusIcon} color={statusIconColor}/>
          </Grid.Column>

          <Grid.Column width={7} verticalAlign='middle' className='tran-address'>
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
    network: state.settings.network,
    color: state.settings.color
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = { getTransactions }

type DispatchProps = typeof mapDispatchToProps

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionList))
