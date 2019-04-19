import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IAppState } from '../../background/store/all'
import { ThemeTypes } from '../../components/styles/themes'

interface IOptionsApp {
  theme: ThemeTypes
  dispatch: Dispatch
}

// TODO add options page
class OptionsApp extends React.Component<IOptionsApp> {

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

export default connect(mapStateToProps)(OptionsApp)
