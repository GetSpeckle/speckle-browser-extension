import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect, RouteProps } from 'react-router'
import { IRouteProps, RouteWithLayout } from '../withLayout'
import { IAppState } from '../../background/store/all'
import { INITIALIZE_ROUTE, UNLOCK_ROUTE } from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    settings: state.settings,
    isUnblocked: false
  }
}

export class AuthenticatedRoute extends React.Component<StateProps & IRouteProps & RouteProps> {
  renderRoute (props: StateProps & IRouteProps & RouteProps) {
    switch (true) {
      case props.isUnblocked && !props.settings.welcome:
        return <RouteWithLayout {...props} />
      case this.props.settings.welcome:
        return <Redirect to={{ pathname: INITIALIZE_ROUTE }} />
      default:
        return <Redirect to={{ pathname: UNLOCK_ROUTE }} />
    }
  }
  render () {
    return (
      this.renderRoute(this.props)
    )
  }
}

type StateProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(AuthenticatedRoute)
