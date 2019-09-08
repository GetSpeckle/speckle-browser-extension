import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import {
  LOGIN_ROUTE, QR_ROUTE
} from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  Button as StyledButton,
  ContentContainer,
  Section
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Balance from '../account/Balance'
import Identicon from 'polkadot-identicon'
import { saveSettings } from '../../background/store/settings'
import 'react-tippy/dist/tippy.css'
import styled from 'styled-components'
import TransactionList from './TransactionList'
import AccountDropdown from '../account/AccountDropdown'
import recodeAddress, { displayAddress } from '../../services/address-transformer'
import { networks } from '../../constants/networks'

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

  getDisplayAddress = (address, showFullAddress = false) => {
    const { network } = this.props.settings
    const recodedAddress = recodeAddress(address, networks[network].ss58Format)
    return displayAddress(recodedAddress, showFullAddress)
  }

  generateDropdownItem (account: IAccount) {
    return (
      <div className='item' onClick={this.handleSelectChange.bind(this, account.address)}>
        <Identicon account={account.address} size={20} className='identicon image' />
        <div className='account-item'>
          <div className='item-name'>{account.name ? this.shorten(account.name) : 'N/A'} </div>
          <div className='item-address'>{this.getDisplayAddress(account.address)}</div>
        </div>
      </div>
    )
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

    return (
      <ContentContainer>
        <AccountDropdown qrDestination={QR_ROUTE} />
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
        <AccountSection>
          <TransactionList />
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
