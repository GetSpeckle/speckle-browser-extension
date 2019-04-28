import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import { GENERATE_PHRASE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button as StyledButton, ContentContainer, Section } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { IAccount, setCurrentAddressAndName } from '../../background/store/wallet'
import t from '../../services/i18n'
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import Identicon from 'polkadot-identicon'
import { KeyringPair$Json } from '@polkadot/keyring/types'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {}

interface IDashboardState {
  accounts: IAccount[],
  currentAddress?: string,
  currentName?: string,
  initializing: boolean,
  showFullAddress: boolean
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  constructor (props) {
    super(props)

    this.state = {
      accounts: [],
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
    lockWallet().then(result => {
      console.log(result)
      history.push(GENERATE_PHRASE_ROUTE)
    })
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
        this.props.setCurrentAddressAndName(result[0].address, result[0].meta.name)
        this.setState({
          initializing: false,
          accounts,
          currentAddress: result[0].address,
          currentName: result[0].meta.name
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
    const address = this.state.currentAddress || ''
    return (
      <ContentContainer>
        <Section>
          {t('accountName')}: {this.state.currentName}
        </Section>
        <Section>
          {t('address')}:
          <Identicon account={address} size={size} className='identicon' />
          {this.getAddress(address)}
          {!this.state.showFullAddress ? this.renderViewButton() : null}
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
    currentAddress: state.wallet.currentAddress,
    currentName: state.wallet.currentName
  }
}

const mapDispatchToProps = { setCurrentAddressAndName }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
