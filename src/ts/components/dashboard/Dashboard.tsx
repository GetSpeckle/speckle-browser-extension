import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import {
  GENERATE_PHRASE_ROUTE,
  IMPORT_OPTIONS_ROUTE,
  LOGIN_ROUTE
} from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  StyledDropdownDivider as Divider,
  DropdownItemContainer,
  DropdownItemContent,
  DropdownItemHeader,
  DropdownItemIconImage,
  DropdownItemIdenticon,
  DropdownItemSubHeader,
  MyAccountDropdown,
  Section, AccountAddress
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts, setCurrentAccount } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'
import { Link } from 'react-router-dom'
import Identicon from 'polkadot-identicon'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface IDashboardState {
  options: Array<Option>,
  currentAccount: IAccount,
  initializing: boolean,
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
      initializing: true
    }
  }

  handleClick = () => {
    const { history } = this.props
    lockWallet().then(result => {
      console.log(result)
      history.push(LOGIN_ROUTE)
    })
  }

  handleSelectChange = (address: string) => {
    const dropdownOptions: Option[] = this.state.options.filter(o => o.key === address)
    if (dropdownOptions && dropdownOptions[0]) {
      this.setState(
        {
          currentAccount: {
            address: dropdownOptions[0].value,
            name: dropdownOptions[0].text
          }
        }
      )
    }
  }

  getAddress = (address, showFulAddress = false) => {
    if (showFulAddress) return address

    return address.substring(0, 8) + '...' + address.substring(address.length - 10)
  }

  generateLink (iconPath: string, title: string) {
    return (
      <DropdownItemContainer>
        <DropdownItemIconImage src={iconPath} centered={true}/>
        <DropdownItemContent>
          <DropdownItemHeader content={title}/>
        </DropdownItemContent>
      </DropdownItemContainer>
    )
  }

  generateDropdownItem (account: IAccount) {
    return (
      <DropdownItemContainer onClick={this.handleSelectChange.bind(this, account.address)}>
        <DropdownItemIdenticon account={account.address} size={16} className='identicon'/>
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
          key: account.address,
          text: account.name,
          value: account.address,
          content: this.generateDropdownItem(account),
          disable: false
        }))

        const staticItems: Option[] = [
          {
            key: 'divider',
            text: 'divider',
            value: 'divider',
            content: <Divider/>,
            disable: true
          },
          {
            key: 'createAccount',
            text: 'Create Account',
            value: 'createAccount',
            content: this.generateLink('/assets/plus.svg', t('createNewAccount')),
            as: Link,
            to: GENERATE_PHRASE_ROUTE,
            disable: false
          },
          {
            key: 'importAccount',
            text: 'Import Existing Account',
            value: 'importAccount',
            content: this.generateLink('/assets/refresh.svg', t('importExistingAccount')),
            as: Link,
            to: IMPORT_OPTIONS_ROUTE,
            disable: false
          }
        ]
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
          <MyAccountDropdown
            options={this.state.options}
            text={this.state.currentAccount.name ? this.state.currentAccount.name : 'N/A'}
          />
        </Section>
        <Section>
          <AccountAddress>
            {this.getAddress(this.state.currentAccount.address, true)}
          </AccountAddress>
        </Section>
        <Section>
          <Identicon account={this.state.currentAccount.address} size={80} className='identicon'/>
        </Section>
        <Section>
          <Balance address={this.state.currentAccount.address}/>
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
