import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import { GENERATE_PHRASE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button as StyledButton, ContentContainer, Section } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts, setCurrentAccount } from '../../background/store/wallet'
import t from '../../services/i18n'
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import Identicon from 'polkadot-identicon'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {}

interface IDashboardState {
  accounts: IAccount[],
  currentAccount: IAccount,
  initializing: boolean,
  showFullAddress: boolean
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  constructor (props) {
    super(props)

    this.state = {
      accounts: [],
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
          accounts: accounts,
          currentAccount: currentAccount
        })
      }
    )
  }

  renderViewButton () {
    return (
      <Button onClick={this.showFullAddress} icon={true}><Icon name='eye' /></Button>
    )
  }

  componentWillMount () {
    this.loadAccounts()
  }

  render () {
    if (this.state.initializing) {
      return (null)
    }

    const size = 32
    const address = this.state.currentAccount.address || ''
    return (
      <ContentContainer>
        <Section>
          {t('accountName')}: {this.state.currentAccount.name}
        </Section>
        <Section>
          {t('address')}:
          <Identicon account={address} size={size} className='identicon' />
          {this.getAddress(address)}
          {!this.state.showFullAddress ? this.renderViewButton() : null}
        </Section>
        <Section>
          <Balance address={address} />
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
