import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IAppState } from '../../../background/store/all'
import { ThemeTypes } from '../../../components/styles/themes'
import Dock from 'react-dock'
import Vote from './Vote'

interface ISpeckleApp {
  theme: ThemeTypes
  dispatch: Dispatch
}

interface SpeckleAppState {
  isVisible: boolean
}

class SpeckleApp extends React.Component<ISpeckleApp, SpeckleAppState> {

  state: SpeckleAppState = {
    isVisible: false
  }

  buttonOnClick = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }
  toggleVisibility = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }

  render () {

    return (
      <div>
        <h1>jhjhjhljhlhjhlk</h1>
        <button onClick={this.buttonOnClick}>
          Open Dock
        </button>
        <Dock
          position={'right'}
          dimMode={'transparent'}
          defaultSize={0.4}
          isVisible={this.state.isVisible}
          onVisibleChange={this.toggleVisibility}
        >
          <Vote/>
        </Dock>
      </div>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    theme: state.settings.theme
  }
}

export default connect(mapStateToProps)(SpeckleApp)
