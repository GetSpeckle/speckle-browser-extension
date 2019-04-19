import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IAppState } from '../../../background/store/all'
import { ThemeTypes } from '../../../components/styles/themes'

interface ISpeckleApp {
  theme: ThemeTypes
  dispatch: Dispatch
}

class SpeckleApp extends React.Component<ISpeckleApp> {

  render () {
    return (
      null
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    theme: state.settings.theme
  }
}

export default connect(mapStateToProps)(SpeckleApp)
