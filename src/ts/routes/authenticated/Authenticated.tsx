import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect, RouteProps } from 'react-router'
import { IRouteProps, RouteWithLayout } from '../RouteWithLayout'
import { IAppState } from '../../background/store/all'
import { CREATE_PASSWORD_ROUTE, INITIALIZE_ROUTE, LOGIN_ROUTE } from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    welcome: state.settings.welcome,
    isLocked: state.wallet.locked,
    accountCreated: state.wallet.created
  }
}

export class AuthenticatedRoute extends React.Component<StateProps & IRouteProps & RouteProps> {
  renderRoute (props: StateProps & IRouteProps & RouteProps) {
    const { isLocked, welcome, accountCreated } = props
    switch (true) {
      case !isLocked && !welcome && accountCreated:
        return <RouteWithLayout {...props} />
      case !welcome && !accountCreated:
        return <Redirect to={{ pathname: CREATE_PASSWORD_ROUTE }} />
      case this.props.welcome:
        return <Redirect to={{ pathname: INITIALIZE_ROUTE }} />
      default:
        return <Redirect to={{ pathname: LOGIN_ROUTE }} />
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
