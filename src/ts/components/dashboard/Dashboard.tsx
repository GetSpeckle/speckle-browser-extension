import * as React from 'react'
import { getAccounts, lockWallet } from '../../services/keyring-vault-proxy'
import { LOGIN_ROUTE } from '../../constants/routes'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button, ContentContainer, Section } from '../basic-components'
import { IAppState } from '../../background/store/all'
import { connect } from 'react-redux'
import { setCurrentAddressAndName } from '../../background/store/account'
import t from '../../services/i18n'

interface IDashboardProps extends StateProps, RouteComponentProps, DispatchProps {}

interface IDashboardState {
  currentAddress?: string,
  currentName?: string,
  initializing: boolean
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  constructor (props) {
    super(props)

    this.state = {
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

  shortAddress = (address) => {
    return address.substring(0, 5) + '...' + address.substring(address.length - 10)
  }

  loadAccounts = () => {
    getAccounts().then(
      result => {
        console.log(`get account ${result}`)
        if (!Array.isArray(result) || !result.length) {
          return
        }
        this.props.setCurrentAddressAndName(result[0].address, result[0].meta.name)
        this.setState({
          initializing: false,
          currentAddress: result[0].address,
          currentName: result[0].meta.name
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
          {t('accountName')}: {this.state.currentName}
        </Section>
        <Section>
          {t('address')}: {this.shortAddress(this.state.currentAddress)}
        </Section>
        <Section>
          <Button onClick={this.handleClick}>
            {t('logout')}
          </Button>
        </Section>
      </ContentContainer>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    currentAddress: state.account.currentAddress,
    currentName: state.account.currentName
  }
}

const mapDispatchToProps = { setCurrentAddressAndName }
type DispatchProps = typeof mapDispatchToProps

type StateProps = ReturnType<typeof mapStateToProps>

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
