import { connect } from 'react-redux'
import * as React from 'react'
import { Redirect, RouteProps } from 'react-router'
import { IRouteProps, RouteWithLayout } from '../RouteWithLayout'
import { IAppState } from '../../background/store/all'
import {
  CONFIRM_PHRASE_ROUTE,
  CREATE_PASSWORD_ROUTE,
  INITIALIZE_ROUTE,
  LOGIN_ROUTE
} from '../../constants/routes'

const mapStateToProps = (state: IAppState) => {
  return {
    welcome: state.settings.welcome,
    isLocked: state.wallet.locked,
    accountCreated: state.wallet.created,
    newPassword: state.wallet.newPassword,
    newPhrase: state.wallet.newPhrase
  }
}

export class AuthenticatedRoute extends React.Component<StateProps & IRouteProps & RouteProps> {
  renderRoute (props: StateProps & IRouteProps & RouteProps) {
    const { isLocked, welcome, accountCreated, newPassword, newPhrase } = props
    switch (true) {
      case !isLocked && !welcome && accountCreated && !newPhrase:
        return <RouteWithLayout {...props} />
      case !welcome && !accountCreated && !newPassword && !newPhrase:
        return <Redirect to={{ pathname: CREATE_PASSWORD_ROUTE }} />
      case !!newPhrase:
        return <Redirect to={{ pathname: CONFIRM_PHRASE_ROUTE }} />
      case welcome:
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
