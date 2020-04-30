import * as React from 'react'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { HashRouter as Router } from 'react-router-dom'
import { IAppState } from '../../background/store/all'

import GlobalStyle from '../../components/styles/GlobalStyle'
import { themes } from '../../components/styles/themes'
import { Routes } from '../../routes'
import { getSettings } from '../../background/store/settings'
import {
  init,
  getAccountSetupTimeout,
  getMnemonic,
  getTempAccountName,
  getTempPassword,
  isWalletLocked,
  walletExists
} from '../../services/keyring-vault-proxy'
import {
  setLocked,
  setCreated,
  setAccountName,
  setAccountSetupTimeout,
  setNewPassword,
  setNewPhrase
} from '../../background/store/wallet'
import { createApi, destroyApi } from '../../background/store/api-context'
import { networks } from '../../constants/networks'
import { WsProvider } from '@polkadot/rpc-provider'
import Initializing from '../../components/Initializing'
import { AuthorizeRequest, SigningRequest } from '../../background/types'
import { subscribeAuthorize, subscribeSigning } from '../../services/messaging'
import Authorizing from '../../components/page/Authorizing'
import Signing from '../../components/page/Signing'
import { ApiOptions } from '@polkadot/api/types'
import { Dimmer, Loader } from 'semantic-ui-react'

interface IPopupProps extends StateProps, DispatchProps { }

interface IPopupState {
  initializing: boolean
  authRequests: Array<AuthorizeRequest>
  signRequests: Array<SigningRequest>,
  accountSetupTimeoutId: number
  network: string | undefined
}

class PopupApp extends React.Component<IPopupProps, IPopupState> {

  state = {
    initializing: true,
    authRequests: [],
    signRequests: [],
    accountSetupTimeoutId: 0,
    network: undefined
  }

  setAuthRequests = (authRequests: Array<AuthorizeRequest>) => {
    this.setState({ authRequests: authRequests })
  }

  setSignRequests = (signRequests: Array<SigningRequest>) => {
    this.setState({ signRequests: signRequests })
  }

  tryCreateApi = () => {
    const { settings } = this.props
    const network = networks[settings.network]
    const provider = new WsProvider(network.rpcServer)
    let apiOptions: ApiOptions = { provider, types: network.types }
    this.props.createApi(apiOptions)
  }

  initializeApp = () => {
    this.props.getSettings()
    const checkAppState = isWalletLocked().then(
      result => {
        this.props.setLocked(result)
      })
    const checkAccountCreated = walletExists().then(
      result => {
        this.props.setCreated(result)
      }
    )
    const newPassword = getTempPassword().then(
      result => {
        this.props.setNewPassword(result)
      }
    )
    const newPhrase = getMnemonic().then(
      result => {
        this.props.setNewPhrase(result)
      }
    )
    const newAccountName = getTempAccountName().then(
      result => {
        this.props.setAccountName(result)
      }
    )

    // Poll timer from the background service to update on the UI
    const accountSetupTimeoutId = window.setInterval(
      this.updateAccountSetupTimeout.bind(this),
      1000
    )

    Promise.all([
      init(),
      checkAppState,
      checkAccountCreated,
      newPassword,
      newPhrase,
      newAccountName,
      subscribeAuthorize(this.setAuthRequests),
      subscribeSigning(this.setSignRequests)
    ]).then(() => {
      this.tryCreateApi()
      this.setState({
        accountSetupTimeoutId,
        initializing: false
      })
    })
  }

  updateAccountSetupTimeout = () => {
    getAccountSetupTimeout().then(
      result => {
        if (result !== this.props.wallet.accountSetupTimeout) {
          this.props.setAccountSetupTimeout(result as number)
        }
      }
    )
  }

  componentDidMount () {
    this.initializeApp()
  }

  componentDidUpdate (_prevProps, prevState) {
    if (this.props.settings.network !== prevState.network) {
      this.tryCreateApi()
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.settings.network !== prevState.network) {
      return { network: nextProps.settings.network }
    }
    return {}
  }

  componentWillUnmount () {
    const { provider } = this.props.apiContext
    provider && provider.isConnected() && provider.disconnect()
    this.props.destroyApi()
    clearInterval(this.state.accountSetupTimeoutId)
  }

  renderExtensionPopup () {
    const { apiContext, wallet } = this.props
    return (
      <ThemeProvider theme={themes[this.props.settings.theme]}>
        <React.Fragment>
          <GlobalStyle/>
          <PopupAppContainer>
            <Dimmer active={!wallet.locked && !apiContext.apiReady && !apiContext.failed}>
              <Loader indeterminate={true}> Connecting to network, please wait ...</Loader>
            </Dimmer>
            <Router>
              <Routes/>
            </Router>
          </PopupAppContainer>
        </React.Fragment>
      </ThemeProvider>
    )
  }

  renderPagePopup () {
    const { authRequests, signRequests } = this.state
    const { settings } = this.props
    return authRequests.length > 0 && <Authorizing settings={settings} requests={authRequests}/>
      || signRequests.length > 0 && <Signing settings={settings} requests={signRequests}/>
  }

  render () {
    const { initializing, authRequests, signRequests } = this.state
    if (initializing) {
      return <Initializing/>
    }
    if (authRequests.length > 0 || signRequests.length > 0) {
      return this.renderPagePopup()
    }
    return this.renderExtensionPopup()
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    apiContext: state.apiContext,
    wallet: state.wallet
  }
}

const mapDispatchToProps = {
  getSettings,
  setLocked,
  setCreated,
  createApi,
  destroyApi,
  setAccountSetupTimeout,
  setAccountName,
  setNewPassword,
  setNewPhrase
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(PopupApp)

const PopupAppContainer = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    min-width: 375px;
    min-height: 600px;
    background-color: ${p => p.theme.backgroundColor};
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`
