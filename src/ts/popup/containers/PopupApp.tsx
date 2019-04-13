import * as React from 'react'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { IAppState } from '../../background/store/all'

import GlobalStyle from '../../components/styles/GlobalStyle'
import { themes } from '../../components/styles/themes'
import { HashRouter as Router } from 'react-router-dom'
import { Routes } from '../../routes'
import { getSettings } from '../../background/store/settings'
import { isWalletLocked } from '../../services/keyring-vault-proxy'
import { setLocked } from '../../background/store/account'

interface IPopupApp extends StateProps, DispatchProps {}
interface IPopupState {
  loading: boolean
}

class PopupApp extends React.Component<IPopupApp, IPopupState> {

  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentWillMount () {
    this.props.getSettings().then(() => {
      this.setState({
        loading: false
      })
    })
    // TODO delete the function call below. It's a test
    isWalletLocked().then(result => console.log(result))
  }

  render () {
    if (this.state.loading) {
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
    accountStatus: state.accountStatus
  }
}

const mapDispatchToProps = { getSettings, setLocked }

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
