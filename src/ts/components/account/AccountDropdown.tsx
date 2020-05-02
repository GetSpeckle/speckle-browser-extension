import * as React from 'react'
import { getAccounts } from '../../services/keyring-vault-proxy'
import {
  GENERATE_PHRASE_ROUTE,
  IMPORT_OPTIONS_ROUTE
} from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import {
  AccountAddress
} from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setAccounts } from '../../background/store/wallet'
import t from '../../services/i18n'
import { KeyringPair$Json } from '@polkadot/keyring/types'
import Identicon from '@polkadot/react-identicon'
import { saveSettings } from '../../background/store/settings'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'
import { Dropdown, Icon } from 'semantic-ui-react'
import { colorSchemes } from '../styles/themes'
import styled from 'styled-components'
import { getTransactions } from '../../background/store/transaction'
import recodeAddress, { displayAddress } from '../../services/address-transformer'
import { networks } from '../../constants/networks'
import { IdenticonTheme } from '../../constants/identicon-theme'

interface IAccountDropdownProps extends StateProps, RouteComponentProps, DispatchProps {
  qrDestination?: string
}

interface IAccountDropdownState {
  options: Array<Option>,
  addressCopied: boolean,
  copiedTimeout?: any,
  network: string
}

interface Option {
  key: string,
  text: string,
  value: string,
  content: object,
  disabled?: boolean,
  as?: object,
  to?: string
}

const delay = 1500

class AccountDropdown extends React.Component<IAccountDropdownProps, IAccountDropdownState> {

  constructor (props) {
    super(props)

    this.state = {
      addressCopied: false,
      options: [],
      network: props.settings.network
    }
  }

  handleSelectChange = (address: string) => {
    const dropdownOptions: Option[] = this.state.options.filter(o => o.key === address)
    if (dropdownOptions && dropdownOptions[0]) {
      this.props.saveSettings({
        ...this.props.settings, selectedAccount: {
          address: dropdownOptions[0].key,
          name: dropdownOptions[0].text
        }
      })
    }
  }

  generateDropdownItem (account: IAccount, identiconTheme: IdenticonTheme) {
    const { address } = account
    return (
      <div className='item' onClick={this.handleSelectChange.bind(this, account.address)}>
        <Identicon value={address} size={20} theme={identiconTheme}/>
        <div className='account-item'>
          <div className='item-name'>{account.name ? this.shorten(account.name) : 'N/A'} </div>
          <div className='item-address'>{displayAddress(address, false)}</div>
        </div>
      </div>
    )
  }

  copyToClipboard = () => {
    const { selectedAccount } = this.props.settings
    if (!selectedAccount) return
    const el = document.createElement('textarea')
    el.value = selectedAccount.address
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    this.setState({ addressCopied: true })
    const timeout = setTimeout(() => {
      this.setState({ addressCopied: false })
    }, delay)
    this.setState({ copiedTimeout: timeout })
  }

  loadAccounts = () => {
    getAccounts().then(
      result => {
        if (!Array.isArray(result) || !result.length) {
          return
        }
        const network = networks[this.props.settings.network]
        const identiconTheme = network.identiconTheme
        const accounts: IAccount[] = result.map(
          (keyring: KeyringPair$Json) => {
            return {
              name: keyring.meta.name,
              address: recodeAddress(keyring.address, network.ss58Format)
            }
          }
        )
        // set first one to select account if it isn't set
        let { selectedAccount } = this.props.settings
        if (selectedAccount) {
          selectedAccount = {
            ...selectedAccount,
            address: recodeAddress(selectedAccount.address, network.ss58Format)
          }
        } else {
          selectedAccount = accounts[0]
        }
        if (!this.props.settings.selectedAccount) {
          this.props.saveSettings({ ...this.props.settings, selectedAccount })
        }

        this.props.setAccounts(accounts)

        const dynamicItems: Option[] = accounts.map(account => ({
          key: account.address,
          text: account.name,
          value: account.address,
          content: this.generateDropdownItem(account, identiconTheme),
          disabled: false
        }))

        this.setState({
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

  handleClickQR = () => {
    this.props.qrDestination && this.props.history.push(this.props.qrDestination)
  }

  componentWillUnmount () {
    if (this.state.copiedTimeout) {
      clearTimeout(this.state.copiedTimeout)
    }
  }

  componentDidMount () {
    this.loadAccounts()
  }

  componentDidUpdate (_prevProps, prevState) {
    if (this.props.settings.network !== prevState.network) {
      this.loadAccounts()
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.settings.network !== prevState.network) {
      return { network: nextProps.settings.network }
    }
    return {}
  }

  render () {
    if (!this.props.settings.selectedAccount) {
      return null
    }

    const selectedAccount = this.props.settings.selectedAccount

    const backgroundStyle = {
      backgroundColor: colorSchemes[this.props.settings.color].backgroundColor,
      color: 'white'
    }

    return (
      <Float>
        <AccountSection>
          <Dropdown
            text={selectedAccount.name ? this.shorten(selectedAccount.name) : 'N/A'}
            button={true}
            fluid={true}
            className='account-dropdown'
            style={{ fontSize: '19px' }}
          >
            <Dropdown.Menu style={backgroundStyle}>
              <Dropdown.Menu scrolling={true} style={backgroundStyle}>
                {this.state.options.map(option => <Dropdown.Item key={option.key} {...option} />)}
              </Dropdown.Menu>

              <Dropdown.Divider/>

              <Dropdown.Item
                style={backgroundStyle}
                onClick={this.handleClickCreateAccount}
              >
                <Icon name='plus'/>
                {t('createNewAccount')}
              </Dropdown.Item>

              <Dropdown.Item
                style={backgroundStyle}
                onClick={this.handleClickImport}
              >
                <Icon name='redo'/>
                {t('importExistingAccount')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </AccountSection>
        <AccountSection>
          <Tooltip
            title={!this.state.addressCopied ? t('copyToClipboard') : t('copiedExclam')}
            duration={delay}
            animation='fade'
            position='bottom'
            trigger='mouseenter'
            arrow={true}
          >
            <AccountAddress onClick={this.copyToClipboard}>
              {displayAddress(this.props.settings.selectedAccount.address, false)}
            </AccountAddress>
          </Tooltip>
          <Tooltip
            title={t('clickToQRCode')}
            position='bottom'
            trigger='mouseenter'
            arrow={true}
          >
            {this.renderQrIcon()}
          </Tooltip>
        </AccountSection>
      </Float>
    )
  }

  renderQrIcon () {
    if (!this.props.qrDestination) return null
    return (
      <QrIcon
        inverted={true}
        name='qrcode'
        onClick={this.handleClickQR}
      />
    )
  }
}

export const QrIcon = styled(Icon)`
  color: white
  padding: 2px
  text-decoration: none
`

export const AccountSection = styled.div`
  width: 100%
  margin: 8px 0 9px
  text-align: center
`
export const Float = styled.div`
  z-index: 1;
  position: relative;
`

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings
  }
}

const mapDispatchToProps = { saveSettings, setAccounts, getTransactions }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountDropdown))
