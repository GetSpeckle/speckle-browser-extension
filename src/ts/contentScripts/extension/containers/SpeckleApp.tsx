import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { IAppState } from '../../../background/store/all'
import App from '../../../containers/App'
import { themes, ThemeTypes } from '../../../components/styles/themes'

interface ISpeckleApp {
  theme: ThemeTypes
  dispatch: Dispatch
}

class SpeckleApp extends React.Component<ISpeckleApp> {

  render () {
    return (
            <ThemeProvider theme={themes[this.props.theme]}>
                <React.Fragment>
                    <SpeckleAppContainer >
                        <App />
                    </SpeckleAppContainer>
                </React.Fragment>
            </ThemeProvider>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    theme: state.settings.theme
  }
}

export default connect(mapStateToProps)(SpeckleApp)

const SpeckleAppContainer = styled('div')`
    position: fixed;
    visibility: hidden;
    z-index: 9;
    bottom: 0;
    right: 0;
    background-color: ${p => p.theme.backgroundColor};
`
