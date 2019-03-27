import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import { IAppState } from '../../../background/store'
import Home from '../../../containers/Home'
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
                        <Home />
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
    z-index: 9;
    bottom: 0;
    right: 0;
    background-color: ${p => p.theme.backgroundColor};
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`
