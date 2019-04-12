import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect } from 'react-router'
import { RouteWithLayout } from '../withLayout'
import { IAppState } from '../../background/store/all'
import { INITIALIZE_ROUTE, UNLOCK_ROUTE } from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    isUnlocked: false,
    completedOnboarding: true
  }
}

export function Authenticated (props) {
  const { isUnlocked , completedOnboarding } = props

  switch (true) {
    case isUnlocked && completedOnboarding:
      return <RouteWithLayout {...props} />
    case !completedOnboarding:
      return <Redirect to={{ pathname: INITIALIZE_ROUTE }} />
    default:
      return <Redirect to={{ pathname: UNLOCK_ROUTE }} />
  }
}

export default connect(mapStateToProps)(Authenticated)
