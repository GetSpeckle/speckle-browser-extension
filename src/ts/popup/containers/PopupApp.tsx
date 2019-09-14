import * as React from 'react'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { HashRouter as Router } from 'react-router-dom'
import { IAppState } from '../../background/store/all'

import GlobalStyle from '../../components/styles/GlobalStyle'
import { themes } from '../../components/styles/themes'
import { Routes } from '../../routes'
import { getSettings } from '../../background/store/settings'
import { isWalletLocked, walletExists } from '../../services/keyring-vault-proxy'
import { setLocked, setCreated } from '../../background/store/wallet'
import { createApi, destroyApi } from '../../background/store/api-context'
import { networks } from '../../constants/networks'
import { WsProvider } from '@polkadot/rpc-provider'
import Initializing from '../../components/Initializing'
import { AuthorizeRequest, SigningRequest } from '../../background/types'
import { subscribeAuthorize, subscribeSigning } from '../../services/messaging'
import Authorizing from '../../components/page/Authorizing'
import Signing from '../../components/page/Signing'
import { ApiOptions } from '@polkadot/api/types'
import { Edgeware } from '../../constants/chains'
import { IdentityTypes } from 'edgeware-node-types/dist/identity'
import { VotingTypes } from 'edgeware-node-types/dist/voting'
import { SignalingTypes } from 'edgeware-node-types/dist/signaling'

interface IPopupProps extends StateProps, DispatchProps { }

interface IPopupState {
  initializing: boolean
  tries: number
  authRequests: Array<AuthorizeRequest>
  signRequests: Array<SigningRequest>
}

class PopupApp extends React.Component<IPopupProps, IPopupState> {

  state = {
    initializing: true,
    tries: 0,
    authRequests: [],
    signRequests: []
  }

  setAuthRequests = (authRequests: Array<AuthorizeRequest>) => {
    this.setState({ ...this.state, authRequests: authRequests })
  }

  setSignRequests = (signRequests: Array<SigningRequest>) => {
    this.setState({ ...this.state, signRequests: signRequests })
  }

  tryCreateApi = () => {
    const { apiContext, settings } = this.props
    if (!apiContext.apiReady && settings) {
      this.setState({ ...this.state, tries: this.state.tries++ })
      const network = networks[settings.network]
      const provider = new WsProvider(network.rpcServer)
      let apiOptions: ApiOptions = { provider }
      if (network.chain === Edgeware) {
        apiOptions = {
          ...apiOptions,
          types: { ...IdentityTypes, ...VotingTypes, ...SignalingTypes }
        }
      }
      this.props.createApi(apiOptions)
      if (this.state.tries <= 5) {
        // try to connect in 3 seconds
        setTimeout(this.tryCreateApi, 3000)
      }
    }
  }

  initializeApp = () => {
    this.props.getSettings()
    const checkAppState = isWalletLocked().then(
      result => {
        console.log(`isLocked ${result}`)
        this.props.setLocked(result)
      })
    const checkAccountCreated = walletExists().then(
      result => {
        console.log(`isWalletCreated ${result}`)
        this.props.setCreated(result)
      }
    )
    Promise.all([
      checkAppState,
      checkAccountCreated,
      subscribeAuthorize(this.setAuthRequests),
      subscribeSigning(this.setSignRequests)
    ]).then(() => {
      this.tryCreateApi()
      this.setState({
        initializing: false
      })
    })
  }

  componentWillMount () {
    this.initializeApp()
  }

  componentWillUnmount () {
    const provider = this.props.apiContext.provider
    provider && this.props.destroyApi(provider)
  }

  renderExtensionPopup () {
    return (
      <ThemeProvider theme={themes[this.props.settings.theme]}>
        <React.Fragment>
          <GlobalStyle/>
          <PopupAppContainer>
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
    apiContext: state.apiContext
  }
}

const mapDispatchToProps = { getSettings, setLocked, setCreated, createApi, destroyApi }

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
