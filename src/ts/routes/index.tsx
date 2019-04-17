import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Term from '../components/account/Term'
import Login from '../components/account/Login'

import {
  HOME_ROUTE,
  TERM_SERVICE_ROUTE,
  CREATE_PASSWORD_ROUTE,
  GENERATE_PHRASE_ROUTE,
  CONFIRM_PHRASE_ROUTE,
  UNLOCK_ROUTE,
  INITIALIZE_ROUTE
} from '../constants/routes'
import { RouteWithLayout } from './withLayout'
import LoginLayout from '../layouts/LoginLayout'
import CreatePassword from '../components/account/CreatePassword'
import ConfirmPhrase from '../components/account/ConfirmPhrase'
import GeneratePhrase from '../components/account/GeneratePhrase'
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
          path={HOME_ROUTE}
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
          path={GENERATE_PHRASE_ROUTE}
          component={GeneratePhrase}
          exact={true}
        />
        <RouteWithLayout
          layout={LoginLayout}
          path={CONFIRM_PHRASE_ROUTE}
          component={ConfirmPhrase}
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
