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
import { IAccount, setAccounts } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'
import { Link } from 'react-router-dom'
import Identicon from 'polkadot-identicon'
import { saveSettings } from '../../background/store/settings'
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import { colorSchemes } from '../styles/themes';

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {
}

interface IDashboardState {
  options: Array<Option>,
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
      <div className='item' onClick={this.handleSelectChange.bind(this, account.address)}>
        <Identicon account={account.address} size={20} className='identicon image' />
        <div className='account-item'>
          <div className='item-name'>{account.name ? account.name : 'N/A'} </div>
          <div className='item-address'>{this.getAddress(account.address)}</div>
        </div>
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

        const staticItems: Option[] = [
          {
            key: '',
            text: '',
            value: '',
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
          options: [...dynamicItems]
        })
      }
    )
  }

  componentWillMount () {
    this.loadAccounts()
  }

  render () {
    if (this.state.initializing || !this.props.settings.selectedAccount) {
      return (null)
    }

    const selectedAccount = this.props.settings.selectedAccount

    const accountStyle = {
      backgroundColor: 'rgba(0,0,0,0)',
      textAlign: 'center',
      color: 'white'
    }

    const backgroundStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return (
      <ContentContainer>
        <Section>
          <Dropdown
            text={selectedAccount.name ? selectedAccount.name : 'N/A'}
            button={true}
            fluid={true}
            style={accountStyle}
          >
          <Dropdown.Menu style={backgroundStyle}>
            <Dropdown.Menu scrolling={true} style={backgroundStyle}>
              {this.state.options.map(option => (
                <Dropdown.Item key={option.value} {...option} />
              ))}
            </Dropdown.Menu>

            <Dropdown.Divider />
            <Button fluid={true} icon={true} labelPosition='left' style={backgroundStyle}>
              <Icon name='plus' />
                {t('createNewAccount')}
            </Button>

            <Button fluid={true} icon={true} labelPosition='left' style={backgroundStyle}>
              <Icon name='redo' />
                {t('importExistingAccount')}
            </Button>
          </Dropdown.Menu>
          </Dropdown>
        </Section>
        <Section>
          <AccountAddress>
            {this.getAddress(this.props.settings.selectedAccount.address, true)}
          </AccountAddress>
        </Section>
        <Section>
          <Identicon account={this.props.settings.selectedAccount.address} size={80} className='identicon'/>
        </Section>
        <Section>
          <Balance address={this.props.settings.selectedAccount.address}/>
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
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings, setAccounts }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
