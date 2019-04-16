import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect, RouteProps } from 'react-router'
import { IRouteProps, RouteWithLayout } from '../withLayout'
import { IAppState } from '../../background/store/all'
import { CREATE_PASSWORD_ROUTE, INITIALIZE_ROUTE, UNLOCK_ROUTE } from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    welcome: state.settings.welcome,
    isLocked: state.account.locked,
    accountCreated: state.account.created
  }
}

export class AuthenticatedRoute extends React.Component<StateProps & IRouteProps & RouteProps> {
  renderRoute (props: StateProps & IRouteProps & RouteProps) {
    switch (true) {
      case !props.isLocked && !props.welcome && props.accountCreated:
        return <RouteWithLayout {...props} />
      case !props.welcome && !props.accountCreated:
        return <Redirect to={{ pathname: CREATE_PASSWORD_ROUTE }} />
      case this.props.welcome:
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
