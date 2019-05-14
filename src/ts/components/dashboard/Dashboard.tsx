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
  Section,
  AccountAddress
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'
import Identicon from 'polkadot-identicon'
import { saveSettings } from '../../background/store/settings'
import { Dropdown, Icon, Popup } from 'semantic-ui-react'
import { colorSchemes } from '../styles/themes'
import styled from 'styled-components'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface IDashboardState {
  options: Array<Option>,
  message?: string,
  initializing: boolean,
  msgTimeout?: any
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
      initializing: true
    }
  }

  handleClickLogout = () => {
    const { history } = this.props
    lockWallet().then(() => {
      history.push(LOGIN_ROUTE)
    })
  }

  handleSelectChange = (address: string) => {
    const dropdownOptions: Option[] = this.state.options.filter(o => o.key === address)
    if (dropdownOptions && dropdownOptions[0]) {
      this.props.saveSettings({ ...this.props.settings, selectedAccount: {
        address: dropdownOptions[0].value,
        name: dropdownOptions[0].text
      } })
    }
  }

  getAddress = (address, showFulAddress = false) => {
    if (showFulAddress) return address

    return address.substring(0, 8) + '...' + address.substring(address.length - 10)
  }

  generateDropdownItem (account: IAccount) {
    return (
      <div className='item' onClick={this.handleSelectChange.bind(this, account.address)}>
        <Identicon account={account.address} size={20} className='identicon image' />
        <div className='account-item'>
          <div className='item-name'>{account.name ? this.shorten(account.name) : 'N/A'} </div>
          <div className='item-address'>{this.getAddress(account.address)}</div>
        </div>
      </div>
    )
  }

  copyToClipboard = () => {
    const el = document.createElement('textarea')
    el.value = this.props.settings.selectedAccount!!.address
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)

    this.setState({ message: t('copyAddressMessage') })
    const timeout = setTimeout(() => {
      this.setState({ message: '' })
    }, 2000)
    this.setState({ msgTimeout: timeout })
  }

  loadAccounts = () => {
    getAccounts().then(
      result => {
        if (!Array.isArray(result) || !result.length) {
          return
        }
        const accounts: IAccount[] = result.map(
          (keyring: KeyringPair$Json) => {
            return { name: keyring.meta.name, address: keyring.address }
          }
        )
        // set first one to select account if it isn't set
        if (!this.props.settings.selectedAccount) {
          this.props.saveSettings({ ...this.props.settings, selectedAccount: accounts[0] })
        }

        this.props.setAccounts(accounts)

        const dynamicItems: Option[] = accounts.map(account => ({
          key: account.address,
          text: account.name,
          value: account.address,
          content: this.generateDropdownItem(account),
          disable: false
        }))

        this.setState({
          initializing: false,
          options: [...dynamicItems]
        })
      }
    )
  }

  shorten = (s: string) => {
    if (s && s.length >= 28) {
      return s.substr(0, 12) + '...' + s.substring(s.length - 12)
    }
    return s
  }

  handleClickCreateAccount = () => {
    this.props.history.push(GENERATE_PHRASE_ROUTE)
  }

  handleClickImport = () => {
    this.props.history.push(IMPORT_OPTIONS_ROUTE)
  }

  componentWillMount () {
    this.loadAccounts()
  }

  componentWillUnmount () {
    if (this.state.msgTimeout) {
      clearTimeout(this.state.msgTimeout)
    }
  }

  render () {
    if (this.state.initializing || !this.props.settings.selectedAccount) {
      return (null)
    }

    const selectedAccount = this.props.settings.selectedAccount

    const backgroundStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return (
      <ContentContainer>
        <AccountSection>
          <Dropdown
            text={selectedAccount.name ? this.shorten(selectedAccount.name) : 'N/A'}
            button={true}
            fluid={true}
            className='account-dropdown'
          >
            <Dropdown.Menu style={backgroundStyle}>
              <Dropdown.Menu scrolling={true} style={backgroundStyle}>
                {this.state.options.map(option => (
                  <Dropdown.Item key={option.value} {...option} />
                ))}
              </Dropdown.Menu>

              <Dropdown.Divider />

              <Dropdown.Item
                style={backgroundStyle}
                onClick={this.handleClickCreateAccount}
              >
                <Icon name='plus' />
                  {t('createNewAccount')}
              </Dropdown.Item>

              <Dropdown.Item
                style={backgroundStyle}
                onClick={this.handleClickImport}
              >
                <Icon name='redo' />
                  {t('importExistingAccount')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </AccountSection>
        <AccountSection>
          <AccountAddress onClick={this.copyToClipboard}>
            {this.getAddress(this.props.settings.selectedAccount.address)}
          </AccountAddress>
          <Popup
            open={!!this.state.message}
            content={t('copyAddressMessage')}
            basic={true}
          />
        </AccountSection>
        <AccountSection>
          <Identicon
            account={this.props.settings.selectedAccount.address}
            size={80}
            className='identicon'
          />
        </AccountSection>
        <AccountSection>
          <Balance address={this.props.settings.selectedAccount.address}/>
        </AccountSection>
        <Section>
          <StyledButton onClick={this.handleClickLogout}>
            {t('logout')}
          </StyledButton>
        </Section>
      </ContentContainer>
    )
  }
}

export const AccountSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings, setAccounts }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
