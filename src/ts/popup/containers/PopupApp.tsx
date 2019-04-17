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
import { setLocked, setCreated } from '../../background/store/account'

interface IPopupApp extends StateProps, DispatchProps {
}

interface IPopupState {
  initializing: boolean
}

class PopupApp extends React.Component<IPopupApp, IPopupState> {

  constructor (props) {
    super(props)

    this.state = {
      initializing: true
    }
  }

  initializeApp = () => {
    const loadAppSetting = this.props.getSettings()
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

    Promise.all([loadAppSetting, checkAppState, checkAccountCreated]).then(
      () => {
        this.setState({
          initializing: false
        })
      }
    )
  }

  componentWillMount () {
    this.initializeApp()
  }

  render () {
    if (this.state.initializing) {
      return (null)
    }
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
}

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    accountStatus: state.account
  }
}

const mapDispatchToProps = { getSettings, setLocked, setCreated }

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
    min-height: 667px;
    background-color: ${p => p.theme.backgroundColor};
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`
