import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Term from '../components/account/Term'
import CreatePassword from '../components/account/CreatePassword'
import Login from '../components/account/Login'

import {
  DEFAULT_ROUTE,
  TERM_SERVICE_ROUTE,
  CREATE_PASSWORD_ROUTE, UNLOCK_ROUTE, INITIALIZE_ROUTE
} from '../constants/routes'
import { RouteWithLayout } from './withLayout'
import LoginLayout from '../layouts/LoginLayout'
import Authenticated from './authenticated/index'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../components/dashboard/Dashboard'
import Welcome from '../components/Welcome'

export class Routes extends React.Component {
  renderRoutes () {
    return (
      <Switch>
        <Authenticated
          layout={DashboardLayout}
          path={DEFAULT_ROUTE}
          component={Dashboard}
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
        <RouteWithLayout
          layout={LoginLayout}
          path={UNLOCK_ROUTE}
          component={Login}
          exact={true}
        />
        <Route
          path={INITIALIZE_ROUTE}
          component={Welcome}
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
