import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import { GENERATE_PHRASE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button as StyledButton, ContentContainer, Section } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts, setCurrentAccount } from '../../background/store/wallet'
import t from '../../services/i18n'
import { Dropdown } from 'semantic-ui-react'
import Identicon from 'polkadot-identicon'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface IDashboardState {
  options: Array<Option>,
  currentAccount: IAccount,
  initializing: boolean,
  showFullAddress: boolean
}

interface Option {
  key: string,
  text: string,
  value: string,
  content: object
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  constructor (props) {
    super(props)

    this.state = {
      options: [],
      currentAccount: {
        address: '',
        name: ''
      },
      initializing: true,
      showFullAddress: false
    }
  }

  handleClick = () => {
    const { history } = this.props
    lockWallet().then(result => {
      console.log(result)
      history.push(LOGIN_ROUTE)
    })
  }

  handleCreateAccountClick = () => {
    const { history } = this.props
    history.push(GENERATE_PHRASE_ROUTE)
  }

  showFullAddress = () => {
    this.setState({
      showFullAddress: true
    })
  }

  getAddress = (address) => {
    if (this.state.showFullAddress) return address

    return address.substring(0, 5) + '...' + address.substring(address.length - 10)
  }

  generateDropdownItem (account: IAccount) {
    return (
      <div>
        <Identicon account={account.address} size={32} className='identicon'/>
        <Header content={account.name} subheader={account.address}/>
      </div>
    )
  }

  loadAccounts = () => {
    getAccounts().then(
      result => {
        console.log(`get account ${result}`)
        if (!Array.isArray(result) || !result.length) {
          return
        }
        const accounts: IAccount[] = result.map(
          (keyring: KeyringPair$Json) => {
            return { name: keyring.meta.name, address: keyring.address }
          }
        )
        // set first one to current account, test only
        const currentAccount = accounts[0]
        this.props.setCurrentAccount(currentAccount)
        this.props.setAccounts(accounts)
        this.setState({
          initializing: false,
          options: accounts.map(account => ({
            key: account.name,
            text: account.name,
            value: account.address,
            content: this.generateDropdownItem(account)
          })),
          currentAccount: currentAccount
        })
      }
    )
  }

  componentWillMount () {
    this.loadAccounts()
  }

  render () {
    if (this.state.initializing) {
      return (null)
    }
    return (
      <ContentContainer>
        <Section>
          <Dropdown options={this.state.options} text='My Polkadot Wallet'/>
        </Section>
        <Section>
          <StyledButton onClick={this.handleClick}>
            {t('logout')}
          </StyledButton>
          <StyledButton onClick={this.handleCreateAccountClick}>
            create new account
          </StyledButton>
        </Section>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    currentAccount: state.wallet.currentAccount
  }
}

const mapDispatchToProps = { setCurrentAccount, setAccounts }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
