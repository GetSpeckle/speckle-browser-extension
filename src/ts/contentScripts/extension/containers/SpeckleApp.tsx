import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IAppState } from '../../../background/store/all'
import { ThemeTypes } from '../../../components/styles/themes'

interface ISpeckleApp {
  theme: ThemeTypes
  dispatch: Dispatch
}

interface SpeckleAppState {
  isVisible: boolean
}

class SpeckleApp extends React.Component<ISpeckleApp, SpeckleAppState> {

  render () {

    return (
      <div/>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    theme: state.settings.theme
  }
}

export default connect(mapStateToProps)(SpeckleApp)
