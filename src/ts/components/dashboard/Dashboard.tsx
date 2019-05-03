import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import { CREATE_PASSWORD_ROUTE, GENERATE_PHRASE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  DropdownItemContainer,
  DropdownItemContent,
  DropdownItemHeader, DropdownItemIconImage, DropdownItemIdenticon,
  DropdownItemSubHeader,
  MyAccountDropdown,
  Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts, setCurrentAccount } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider'
import { Link } from 'react-router-dom'

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
  content: object,
  disable?: boolean,
  as?: object,
  to?: string
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

  generateCreateAccountLink () {
    return (
      <DropdownItemContainer>
        <DropdownItemIconImage src={'/assets/path.svg'} centered={true}/>
        <DropdownItemContent>
          <DropdownItemHeader content={'Create Account'} />
        </DropdownItemContent>
      </DropdownItemContainer>
    )
  }

  generateDropdownItem (account: IAccount) {
    return (
      <DropdownItemContainer>
        <DropdownItemIdenticon account={account.address} size={32} className='identicon'/>
        <DropdownItemContent>
          <DropdownItemHeader content={account.name} sub={true}/>
          <DropdownItemSubHeader>{this.getAddress(account.address)}</DropdownItemSubHeader>
        </DropdownItemContent>
      </DropdownItemContainer>
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
        const dynamicItems: Option[] = accounts.map(account => ({
          key: account.name,
          text: account.name,
          value: account.address,
          content: this.generateDropdownItem(account),
          disable: false
        }))
        const staticItems: Option[] = [{
          key: 'divider',
          text: 'divider',
          value: 'divider',
          content: <Divider />,
          disable: true
        },{
          key: 'createAccount',
          text: 'Create Account',
          value: 'Create Account',
          content: this.generateCreateAccountLink(),
          as: Link,
          to: CREATE_PASSWORD_ROUTE,
          disable: false
        }]
        this.setState({
          initializing: false,
          options: [...dynamicItems, ...staticItems],
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
            <MyAccountDropdown options={this.state.options} text='My Polkadot Wallet'/>
        </Section>
        <Section>
          <Balance address={this.state.currentAccount.address} />
        </Section>
        <Section>
          <StyledButton onClick={this.handleClick}>
            {t('logout')}
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
