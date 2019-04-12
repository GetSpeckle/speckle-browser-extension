import * as React from 'react'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { IAppState } from '../../background/store/all'

import GlobalStyle from '../../components/styles/GlobalStyle'
import { themes } from '../../components/styles/themes'
import { HashRouter as Router } from 'react-router-dom'
import { Routes } from '../../routes'
import { getSettings } from '../../background/store/settings'
import { browser } from 'webextension-polyfill-ts'
import { setLocked } from '../../background/store/account'

interface IPopupApp extends StateProps, DispatchProps {}

class PopupApp extends React.Component<IPopupApp> {

  componentDidMount () {
    this.props.getSettings()

    const port = browser.runtime.connect(undefined, { name: '__SPECKLE__' })
    port.postMessage({ method: 'isLocked' })
    console.log('message posted')
    port.onMessage.addListener((msg) => {
      console.log('Got message ', msg)
      if (msg.method === 'isLocked') {
        this.props.setLocked(msg.result)
      }
    })
  }

  render () {
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
