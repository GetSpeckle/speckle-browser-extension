import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../containers/App'
import Term from '../components/account/Term'

import {
  DEFAULT_ROUTE,
  TERM_SERVICE_ROUTE,
  CREATE_PASSWORD_ROUTE
} from '../constants/routes'
import { RouteWithLayout } from './withLayout'
import LoginLayout from '../layouts/LoginLayout'
import CreatePassword from '../components/account/CreatePassword';

export class Routes extends React.Component {
  renderRoutes () {
    return (
      <Switch>
        <Route
          path={DEFAULT_ROUTE}
          component={App}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={TERM_SERVICE_ROUTE}
          component={Term}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={CREATE_PASSWORD_ROUTE}
          component={CreatePassword}
          exact={true}
        />
      </Switch>
    )
  }

  render () {
    return (
      this.renderRoutes()
    )
  }
}
